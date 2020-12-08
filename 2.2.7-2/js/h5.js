'use strict'
var vConsole = new VConsole()
  ; (function (designWidth, maxWidth) {
    var doc = document,
      win = window,
      docEl = doc.documentElement,
      remStyle = document.createElement('style'),
      tid

    function refreshRem() {
      var width = docEl.getBoundingClientRect().width
      maxWidth = maxWidth || 540
      width > maxWidth && (width = maxWidth)
      var rem = (width * 100) / designWidth
      remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
    }

    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(remStyle)
    } else {
      var wrap = doc.createElement('div')
      wrap.appendChild(remStyle)
      doc.write(wrap.innerHTML)
      wrap = null
    } //要等 viewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；

    refreshRem()
    win.addEventListener(
      'resize',
      function () {
        clearTimeout(tid) //防止执行两次

        tid = setTimeout(refreshRem, 300)
      },
      false
    )
    win.addEventListener(
      'pageshow',
      function (e) {
        if (e.persisted) {
          // 浏览器后退的时候重新计算
          clearTimeout(tid)
          tid = setTimeout(refreshRem, 300)
        }
      },
      false
    )

    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = '16px'
    } else {
      doc.addEventListener(
        'DOMContentLoaded',
        function (e) {
          doc.body.style.fontSize = '16px'
        },
        false
      )
    }
  })(750, 750)

window.onload = function () {
  var progressSlider = null
  var isLoop = false
  var isMute = false
  var isPlay = false
  var form = layui.form,
    layer = layui.layer,
    slider = layui.slider
  var type = GetUrlParam('type')
  var option = {
    appId: GetUrlParam('appId'),
    // 应用ID，必填
    accountId: GetUrlParam('accountId'),
    // 第三方用户ID，必填
    token: GetUrlParam('token'),
    // access_token，必填
    type: GetUrlParam('type'),
    videoNode: 'video',
    // 播放器的容器， div的id
    poster: GetUrlParam('poster') || undefined,
    // 封面地址
    liveOption: {
      type: GetUrlParam('liveType'),
      roomId: GetUrlParam('roomId'),
      defaultDefinition: GetUrlParam('defaultDef'),
      // 强制使用 MSE
      // forceMSE: true
    },
    vodOption: {
      recordId: GetUrlParam('recordId'),
      // 强制使用 MSE
      // forceMSE: true
    },
    marqueeOption:
      GetUrlParam('mEnable') !== 'undefined'
        ? {
          enable: GetUrlParam('mEnable'),
          text: GetUrlParam('mText'),
          // 跑马灯的文字
          alpha: GetUrlParam('mAlpha'),
          // 透明度  100 完全显示   0 隐藏
          size: GetUrlParam('mSize'),
          // 文字大小
          color: GetUrlParam('mColor'),
          //  文字颜色
          interval: GetUrlParam('mInterval'),
          // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
          speed: GetUrlParam('mSpeed'),
          // 跑马灯移动速度  3000快     6000中   10000慢
          position: GetUrlParam('mPosition') // 跑马灯位置 ， 1 随机 2上  3中 4下
        }
        : {
          enable: false
        },
    watermarkOption:
      GetUrlParam('wEnable') !== 'undefined'
        ? {
          enable: GetUrlParam('wEnable'),
          url: GetUrlParam('wUrl'),
          align: GetUrlParam('wAlign'),
          position: ['20px', '20px'],
          size: ['80px', '35px'],
          alpha: GetUrlParam('wAlpha')
        }
        : {
          enable: false
        },
    pursueOption: {
      enable: true
    },
    subtitleOption: {
      enable: true, // 字幕插件是否可用
      auto: true // 是否自动开启字幕
    }
  }

  if (GetUrlParam('interval')) {
    option['reportOption'] = { interval: GetUrlParam('interval') }
  }

  var loading = layer.load(0, {
    shade: [0.1, '#fff']
  })
  VhallPlayer.createInstance(
    option,
    function (res) {
      window.vhallplayer = res.vhallplayer
      type === 'live'
        ? $('.live-control').css({
          display: 'flex'
        })
        : $('.vod-control').css({
          display: 'flex'
        })
      layer.close(loading) // 视频加载完成

      vhallplayer.on(VhallPlayer.LOADED, function (res) {
        $('.qualityBtn').text(vhallplayer.getCurrentQuality().def)
        layer.close(loading)
        $('.all-time').text(formatSeconds(vhallplayer.getDuration())) //默认滑块

        progressSlider = slider.render({
          elem: '#slideTest1',
          tips: false,
          theme: '#1E9FFF',
          //主题色
          change: function change(value) {
            var progressValue = (vhallplayer.getCurrentTime() / vhallplayer.getDuration()) * 100

            if (value != Math.round(progressValue)) {
              $('.vod-controller').css({
                bottom: '0px'
              })
              vhallplayer.setCurrentTime((value / 100) * vhallplayer.getDuration())
            }
          }
        })
      }) // 当前播放时间改变

      vhallplayer.on(VhallPlayer.CURRENTTIME_CHANGE, function (res) { }) // 循环状态改变

      vhallplayer.on(VhallPlayer.LOOP_CHANGE, function (res) {
        isLoop = !isLoop
        isLoop
          ? $('.loopBtn')
            .removeClass('icon-101')
            .addClass('icon-spin')
          : $('.loopBtn')
            .removeClass('icon-spin')
            .addClass('icon-101')
        layer.msg('\u8BBE\u7F6E\u5FAA\u73AF\u72B6\u6001\u4E3A:'.concat(res.newValue))
      })
      vhallplayer.on(VhallPlayer.DEFINITION_CHANGE, function (res) {
        $('.qualityBtn').text(res.newValue.def) // layer.msg(`设置当前清晰度为:${res.newValue.def}`);
      }) // 静音状态改变

      vhallplayer.on(VhallPlayer.MUTE_CHANGE, function (res) {
        isMute = !isMute
        isMute
          ? $('.muteBtn')
            .removeClass('icon-volumemedium')
            .addClass('icon-volumemute2')
          : $('.muteBtn')
            .removeClass('icon-volumemute2')
            .addClass('icon-volumemedium')
        layer.msg('\u8BBE\u7F6E\u9759\u97F3\u72B6\u6001\u4E3A:'.concat(res.newValue))
      }) // 暂停状态

      vhallplayer.on(VhallPlayer.PAUSE, function (res) {
        isPlay = false
        $('.playBtn')
          .removeClass('icon-pause')
          .addClass('icon-play2')
      }) // 播放状态

      vhallplayer.on(VhallPlayer.PLAY, function (res) {
        isPlay = true
        $('.playBtn')
          .removeClass('icon-play2')
          .addClass('icon-pause')
      }) // 开启弹幕

      vhallplayer.on(VhallPlayer.OPEN_BARRAGE, function (res) {
        isOpenBarrage = true
        $('.BarrageBtn')
          .removeClass('icon-bofangqi-danmuguan')
          .addClass('icon-bofangqi-danmukai')
        layer.msg('\u8BBE\u7F6E\u5F39\u5E55\u72B6\u6001\u4E3A:true')
      }) // 关闭弹幕

      vhallplayer.on(VhallPlayer.CLOSE_BARRAGE, function (res) {
        isOpenBarrage = false
        $('.BarrageBtn')
          .removeClass('icon-bofangqi-danmukai')
          .addClass('icon-bofangqi-danmuguan')
        layer.msg('\u8BBE\u7F6E\u5F39\u5E55\u72B6\u6001\u4E3A:false')
      }) // 关闭弹幕

      vhallplayer.on(VhallPlayer.CLEAR_BARRAGE, function (res) { })
      vhallplayer.on(VhallPlayer.TIMEUPDATE, function (res) {
        $('.current-time').text(formatSeconds(vhallplayer.getCurrentTime()))
        var progressValue = (vhallplayer.getCurrentTime() / vhallplayer.getDuration()) * 100
        progressSlider && progressSlider.setValue(progressValue)
      })
      vhallplayer.on(VhallPlayer.FULLSCREEN_CHANGE, function (res) {
        switch (res) {
          case 'fullscreen':
            $('#vod-fullscreen')
              .removeClass('icon-fullscreen')
              .addClass('icon-fullscreenexit')
            break

          case 'normal':
            $('#vod-fullscreen')
              .removeClass('icon-fullscreenexit')
              .addClass('icon-fullscreen')
            break
        }
      })
      vhallplayer.on(VhallPlayer.RATE_CHANGE, function (res) {
        layer.msg('\u8BBE\u7F6E\u500D\u901F\u4E3A\uFF1A'.concat(res))
      }) // 播放暂停

      $('.playBtn').click(function () {
        if (isPlay) {
          vhallplayer.pause(function (err) {
            layer.msg('暂停失败')
          })
        } else {
          vhallplayer.play(function (err) {
            layer.msg('播放失败')
          })
        }
      }) // 点击全屏

      $('#fullScreen').click(function () {
        if (vhallplayer.isFullscreen()) {
          vhallplayer.exitFullScreen()
        } else {
          vhallplayer.enterFullScreen()
        }
      }) // 设置循环播放

      $('.loopBtn').click(function () {
        vhallplayer.setLoop(!isLoop, function (err) {
          layer.msg(err.message)
        })
      }) // 静音

      $('.muteBtn').click(function () {
        vhallplayer.setMute(!isMute, function (err) {
          layer.msg(err.message)
        })
      }) // 销毁实例

      $('#destroy').click(function () {
        vhallplayer.destroy()
      }) // 点击倍速

      $('.speedBtn').click(function () {
        $('.speed-box span').remove()
        $('.speed-box').show()
        var speedList = vhallplayer.getUsableSpeed()

        for (var i in speedList) {
          $('.speed-box').append(
            '<span onclick="vhallplayer.setPlaySpeed('.concat(speedList[i], ')" >').concat(speedList[i], '</span>')
          )
        }
      }) // 点击倍速遮罩层

      $('.speed-box').click(function () {
        $(this).hide()
      }) // 点击清晰度

      $('.qualityBtn').click(function () {
        $('.quality-box span').remove()
        $('.quality-box').show()
        var qualityList = vhallplayer.getQualitys()

        for (var i in qualityList) {
          $('.quality-box').append('<span>'.concat(qualityList[i].def, '</span>'))
        }
      }) // 设置清晰度

      $(document).on('click', '.quality-box span', function () {
        var qualityList = vhallplayer.getQualitys()

        for (var i in qualityList) {
          if (qualityList[i].def === $(this).text()) {
            vhallplayer.setQuality(qualityList[i])
          }
        }
      })
      $('.quality-box').click(function () {
        $(this).hide()
      })
      var isOpenControl = false
      $('#openControl').click(function () {
        vhallplayer.openControls(!isOpenControl)
        isOpenControl = !isOpenControl

        if (!isOpenControl) {
          type === 'vod' ? $('.vod-control').show() : $('.live-control').show()
          $('.qualityBtn').show()
        } else {
          type === 'vod' ? $('.vod-control').hide() : $('.live-control').hide()
          $('.qualityBtn').hide()
        }
      })
      var isOpenBarrage = false // 打开/关闭弹幕

      $('.BarrageBtn').click(function () {
        if (isOpenBarrage) {
          vhallplayer.closeBarrage()
          $('.Barrage').css({
            display: 'none'
          })
        } else {
          vhallplayer.openBarrage()
          $('.Barrage').css({
            display: 'flex'
          })
        }
      })
      $('.addBarrageBtn').click(function () {
        var content = $("input[name='barrage']").val()
        vhallplayer.addBarrage(content)
        $("input[name='barrage']").val('')
      })
      $('.fullscreen').click(function () {
        if (vhallplayer.isFullscreen()) {
          vhallplayer.exitFullScreen()
        } else {
          vhallplayer.enterFullScreen()
        }
      })
    },
    function (err) {
      layer.msg(err.message)
      layer.close(loading)
    }
  )
}

function formatSeconds(value) {
  var secondTime = parseInt(value) // 秒

  var minuteTime = 0 // 分

  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60) //获取秒数，秒数取佘，得到整数秒数

    secondTime = parseInt(secondTime % 60) //如果分钟大于60，将分钟转换成小时
  }

  return (
    (minuteTime < 10 ? '0' + Math.round(minuteTime) : Math.round(minuteTime)) +
    ':' +
    (secondTime < 10 ? '0' + Math.round(secondTime) : Math.round(secondTime))
  )
}

function GetUrlParam(paraName) {
  var url = document.location.toString()
  var arrObj = url.split('?')

  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split('&')
    var arr

    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')

      if (arr != null && arr[0] == paraName) {
        return decodeURIComponent(decodeURI(arr[1]))
      }
    }

    return ''
  } else {
    return ''
  }
}
