'use strict';

window.onload = function () {
  VhallPlayer.probe({}, function (res) {
    // console.log('>>> 成功res', res);
  }, function (res) {
    // console.log('>>> 失败res', res);
  });
  var from = getQueryString('from') || ''; // 从其他SDk跳转进入

  var form = layui.form,
    layer = layui.layer,
    slider = layui.slider;
  var isOpenBarrage = false;
  var progressSlider = null;
  var type = '';
  var marqueeOption = {};
  var watermarkOption = {};

  if (from !== '') {
    $('.mobile').hide();
    $('.login').hide();
    $('#openControl').hide();
    $('.main').css({
      display: 'flex',
      visibility: 'visible'
    });
    var loading = layer.load(0, { shade: [0.1, '#fff'] });
    var option = {
      appId: getQueryString('appId'),
      // 应用ID，必填
      accountId: getQueryString('accountId'),
      // 第三方用户ID，必填
      token: getQueryString('token'),
      // access_token，必填
      type: 'live',
      videoNode: 'videoNode',
      // 播放器的容器， div的id
      liveOption: {
        type: 'hls',
        roomId: getQueryString('roomId'),
        defaultDefinition: '480p',
      },
      language: getQueryString('language'),
      pursueOption: {
        enable: true
      }
    };
    VhallPlayer.createInstance(option, function (res) {
      layer.close(loading);
      window.vhallplayer = res.vhallplayer;
      listen();
    });
  }

  layui.use('form', function () {
    // 监听提交
    layui.form.on('switch(marquee)', function (data) {
      if (this.checked) {
        form.on("radio(displayType)", function (data) {
          var displayType = data.value;
          // 闪动
          if (displayType === '1') {
            $(".marqueeSpeed").hide();
          } else {
            // 滚动
            $(".marqueeSpeed").show();
          }
        });

        var setAlert = layer.open({
          type: 1,
          title: '跑马灯配置',
          closeBtn: false,
          shift: 2,
          area: ['400px', '500px'],
          btn: ['确定'],
          shadeClose: true,
          content: $('.marqueeOption'),
          yes: function yes() {
            var displayType = $('input[name=displayType]:checked').val(); // 0滚动 1闪动
            var text = $('input[name=text]').val();
            var alpha = $('select[name=alpha]').val();
            var fontsize = $('select[name=fontsize]').val();
            var interval = $('input[name=interval]').val();
            // var interval = $('select[name=interval]').val();
            var position = $('select[name=position]').val();
            var speed = $('select[name=speed]').val();
            marqueeOption = {
              enable: true,
              // 展示方式
              displayType: displayType,
              // 跑马灯的文字
              text: text,
              // 透明度  100 完全显示   0 隐藏
              alpha: alpha,
              // 文字大小
              size: fontsize,
              // 文字颜色
              color: '#ff8d41',
              // 下次跑马灯开始与本次开始的时间间隔 ， 秒为单位
              interval: interval,
              // 跑马灯位置 ， 1 随机 2上  3中 4下
              position: position
            };
            // 滚动
            if (displayType === '0' || displayType === 0) {
              // 跑马灯移动速度: 3000快 6000中 10000慢
              marqueeOption["speed"] = speed;
            }
            layer.close(setAlert);
            $('.marqueeOption').hide()
          },
          end: function end() {
            $('.marqueeOption').hide()
          }
        })
      }
    });
    layui.form.on('switch(watermark)', function (data) {
      if (this.checked) {
        var setAlert = layer.open({
          type: 1,
          title: '水印配置',
          closeBtn: false,
          shift: 2,
          area: ['400px', '450px'],
          btn: ['确定'],
          shadeClose: true,
          content: $('.watermarkOption'),
          yes: function yes() {
            var url = $('input[name=url]').val();
            var align = $('select[name=align]').val();
            var watermark_position = $('select[name=watermark_position]').val();
            var sizeWidth = $('input[name=sizeWidth]').val();
            var sizeHeight = $('input[name=sizeHeight]').val();
            //水印透明度
            var alpha = $('input[name=alpha]').val();
            if (!alpha || alpha < 0 || alpha > 100 || !alpha.match(/^(?:0|[1-9][0-9]?|100)$/)) {
              layer.msg('请输入0-100的整数！', { icon: 7, time: 3000, shade: [0.6, '#000', true] });
              $('input[name=alpha]').val('');
              return;
            }
            watermarkOption = {
              enable: true,
              url: url,
              align: align,
              position: [watermark_position + 'px', watermark_position + 'px'],
              size: [sizeWidth + 'px', sizeHeight + 'px'],
              alpha: alpha
            };
            layer.close(setAlert);
            $('.watermarkOption').hide()
          },
          end: function end() {
            $('.watermarkOption').hide()
          }
        })
      }
    })
  })
  $("select[name='type']").val(getQueryString('type'));
  layui.form.render('select');

  switch (getQueryString('type')) {
    case 'live':
      $('.liveType').show();
      $('.roomId').show();
      $('.recordId').hide();
      break;

    case 'vod':
      $('.liveType').hide();
      $('.roomId').hide();
      $('.recordId').show();
      break
  }

  var paramObj = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

  if (paramObj['appId']) {
    $('input[name=appId]').val(paramObj['appId'])
  }

  if (paramObj['roomId']) {
    $('input[name=roomId]').val(paramObj['roomId'])
  }

  if (paramObj['accountId']) {
    $('input[name=accountId]').val(paramObj['accountId'])
  }

  if (paramObj['token']) {
    $('input[name=token]').val(paramObj['token'])
  }

  if (paramObj['recordId']) {
    $('input[name=recordId]').val(paramObj['recordId'])
  }

  if (paramObj['defaultDefinition']) {
    $("select[name='defaultDefinition']").val(paramObj['defaultDefinition'])
  }

  if (paramObj['liveType']) {
    $('#type-'.concat(paramObj['liveType'])).attr('checked', true);
    renderForm()
  } // if(getQueryString('type'))
  // console.error(getQueryString('type'));

  form.on('select(type)', function (data) {
    switch (data.value) {
      case 'live':
        $('.liveType').show();
        $('.roomId').show();
        $('.recordId').hide();
        break;
      case 'vod':
        $('.liveType').hide();
        $('.roomId').hide();
        $('.recordId').show();
        break
    }
  });
  form.on('submit(formDemo)', function (data) {
    type = data.field.type;
    var option = {
      // 应用ID，必填
      appId: data.field.appId,
      // 第三方用户ID，必填
      accountId: data.field.accountId,
      // access_token，必填
      token: data.field.token,
      // 直播还是点播
      type: data.field.type,
      // 播放器的容器， div的id
      videoNode: 'videoNode',
      // 封面地址
      poster: data.field.poster,
      // 语言
      language: data.field.language,
      // 设置是否自动播放
      autoplay: true,
      // 直播参数
      liveOption:
        data.field.type === 'live'
          ? {
            type: data.field.liveType,
            roomId: data.field.roomId,
            defaultDefinition: data.field.defaultDefinition,
            // forceMSE: true
            // useSWF: true
          }
          : undefined,
      // 点播参数
      vodOption:
        data.field.type === 'vod'
          ? {
            recordId: data.field.recordId,
            defaultDefinition: data.field.defaultDefinition,
            // forceMSE: true
            // useSWF: true
          }
          : undefined,
      // 跑马灯参数
      marqueeOption: marqueeOption,
      // 水印参数
      watermarkOption: watermarkOption,
      // schedulerOption: { // 调度配置
      //   quality: ['same', '720p', '480p', '360p', 'a'] // 强制清晰度列表，慎用
      // },
      // 追播参数
      pursueOption: {
        enable: true
      },
      // 字幕参数
      subtitleOption: {
        // 字幕插件是否可用
        enable: true,
        // 是否自动开启字幕
        auto: true
      }
    };

    if (paramObj['interval']) {
      option['reportOption'] = { interval: paramObj['interval'] }
    }

    var loading = layer.load(0, { shade: [0.1, '#fff'] });
    VhallPlayer.createInstance(
      option,
      function (res) {
        var href = window.document.location.href;
        var url = href.split('//')[0] + '//';
        var urlArr = href
          .split('//')[1]
          .split('/')
          .splice(0, window.location.href.split('//')[1].split('/').length - 1);

        for (var i in urlArr) {
          url += ''.concat(urlArr[i], '/')
        }

        url = url + 'h5_new.html';
        var obj = {
          appId: data.field.appId,
          accountId: data.field.accountId,
          token: data.field.token,
          type: data.field.type,
          poster: data.field.poster,
          liveType: data.field.liveType,
          roomId: data.field.roomId,
          recordId: data.field.recordId,
          mEnable: marqueeOption.enable,
          mText: marqueeOption.text,
          mAlpha: marqueeOption.alpha,
          mSize: marqueeOption.size,
          mColor: marqueeOption.color,
          mInterval: marqueeOption.interval,
          mSpeed: marqueeOption.speed,
          mPosition: marqueeOption.position,
          wEnable: watermarkOption.enable,
          wAlign: watermarkOption.align,
          wUrl: watermarkOption.url,
          wAlpha: watermarkOption.alpha,
          defaultDef: data.field.defaultDefinition,
          interval: paramObj['interval']
        };

        for (var key in obj) {
          if (obj[key] === '' || obj[key] === undefined) {
            delete obj[key]
          }
        }

        $('.mobile').attr('href', ''.concat(url, '?').concat(Qs.stringify(obj)));
        window.vhallplayer = res.vhallplayer;

        layer.close(loading);
        $('.login').hide();
        $('.main').css({ display: 'flex', visibility: 'visible' });
        $('.'.concat(data.field.type, '-controller')).show(); // 视频数据源加载完成

        listen();
      },
      function (err) {
        layer.close(loading);
        layer.msg(err.message)
      }
    )
  });

  // 发送弹幕
  $('.sendBarrage').click(function () {
    if (isOpenBarrage) {
      var content = $('input[name=barrageText]').val();
      vhallplayer.addBarrage(content);
      $('input[name=barrageText]').val('')
    }
  });

  // 回车发送弹幕
  $('input[name=barrageText]').keydown(function (e) {
    if (e.keyCode === 13) {
      if (isOpenBarrage) {
        var content = $('input[name=barrageText]').val();
        vhallplayer.addBarrage(content);
        $('input[name=barrageText]').val('')
      }
    }
  });

  $('#switchBtn').click(function (e) {
    document.querySelector('#switchBtn input').checked = !document.querySelector('#switchBtn input').checked;
    var isChecked = document.querySelector('#switchBtn input').checked;
    isChecked ? vhallplayer.openBarrage() : vhallplayer.closeBarrage();
    e.preventDefault()
  });

  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null
  }

  function renderForm() {
    layui.use('form', function () {
      var form = layui.form;
      form.render()
    })
  }

  function listen() {
    vhallplayer.on(VhallPlayer.AUTOPLAY_FAILED, function (e) {
      // console.log('>>> pc 浏览器禁止自动播放');
    });

    vhallplayer.on(VhallPlayer.ERROR, function (e) { });

    vhallplayer.on(VhallPlayer.LOADEDMETADATA, function (e) {
      // console.log('>>> LOADEDMETADATA');
    });

    vhallplayer.on(VhallPlayer.LOADED, function (e) { });

    // 监听播放
    vhallplayer.on(VhallPlayer.PLAY, function (e) { });

    // 监听暂停
    vhallplayer.on(VhallPlayer.PAUSE, function (e) { });

    // 监听循环状态改变
    vhallplayer.on(VhallPlayer.LOOP_CHANGE, function (e) { });

    // 全屏状态改变
    vhallplayer.on(VhallPlayer.FULLSCREEN_CHANGE, function (e) { });

    // 监听时间改变
    vhallplayer.on(VhallPlayer.TIMEUPDATE, function (e) { });

    // 监听播放结束
    vhallplayer.on(VhallPlayer.ENDED, function (e) { });

    // 音量状态被改变
    vhallplayer.on(VhallPlayer.VOLUME_CHANGE, function (e) { });

    // 开启弹幕
    vhallplayer.on(VhallPlayer.OPEN_BARRAGE, function (e) {
      isOpenBarrage = true;
      layer.msg('弹幕已开启')
    });

    // 关闭弹幕
    vhallplayer.on(VhallPlayer.CLOSE_BARRAGE, function (e) {
      isOpenBarrage = false;
      layer.msg('弹幕已关闭')
    });

    // 清晰度改变
    vhallplayer.on(VhallPlayer.DEFINITION_CHANGE, function (e) { });

    // 开启字幕
    vhallplayer.on(VhallPlayer.OPEN_SUBTITLE, function (e) { });

    // 关闭字幕
    vhallplayer.on(VhallPlayer.CLOSE_SUBTITLE, function () { });

    // 字幕文件切换
    vhallplayer.on(VhallPlayer.SUBTITLE_CHANGED, function (e) { });
  }
};
