'use strict';

window.danmakuColor= '#fff'

window.onload = function () {

  // 360 小窗播放探测 DEMO 程序
  // let cache = document.getElementsByTagName('div')[0].style.visibility || true;
  // window.addEventListener('resize', () => {
  //   var root = document.getElementsByTagName('div')[0];
  //   console.log('DEMO Test ===>',root.style.visibility)
  //   console.log('DEMO Test ==> :: 原始值', cache)
  //   console.log('DEMO Test ==> :: 新值', root.style.visibility)
  //   if (root.style.visibility == 'hidden' && cache != root.style.visibility) {
  //     console.log('DEMO Test ==> :: 当前小窗播放中')
  //   }
  // })

  var from = getQueryString('from') || ''; // 从其他SDk跳转进入

  var form = layui.form,
    layer = layui.layer,
    slider = layui.slider;
  var isOpenBarrage = false;
  var progressSlider = null;
  var type = '';
  var marqueeOption = {};
  var watermarkOption = {};
  var peer5Option = {
    open: getQueryString('peer5') === 'true',
    customerId: getQueryString('customerId'),
    fallback: true
  };
  var thornOption = {
    enable: getQueryString('switch') === 'true'
  };
  var autoplay = true;

  if (from !== '') {
    $('.mobile').hide();
    $('.pcHref').hide();
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
      type: getQueryString('type'),
      videoNode: 'videoNode',
      // 播放器的容器， div的id
      autoplay:getQueryString('autoplay') !== 'false',
      liveOption: {
        type: 'hls',
        roomId: getQueryString('roomId'),
        defaultDefinition: '480p',
      },
      language: getQueryString('language'),
      pursueOption: {
        enable: true
      },
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
    });
    // layui.form.on('switch(peer5)', function () {
    //   peer5Option.open = this.checked
    // });
    layui.form.on('switch(switch)', function () {
      thornOption.enable = this.checked
    })
    layui.form.on('switch(autoplay)', function () {
      autoplay = this.checked
    })
  })
  layui.form.render('select');

  function changeLiveType(data) {
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
      default:
        break;
    }
  }

  form.on('select(type)', changeLiveType);
  

  function liveTypeCheck(data) {
    if ($('#type-rtc')[0].checked) {
      $('#inavId')[0].style.display = 'block'
      $('#inavId input').attr('lay-verify', 'required')
    } else {
      $('#inavId')[0].style.display = 'none'
      $('#inavId input').attr('lay-verify', '')
    }
  }

  $('#check-liveType')[0].onclick = liveTypeCheck;

  // v2.3.9 表单填充
  var paramObj = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

  form.val("formMain", paramObj);

  if (paramObj['liveType']) {
    $('#type-'.concat(paramObj['liveType'])).attr('checked', true);
    renderForm()
  }

  changeLiveType({value: paramObj.type || 'live'})

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
      autoplay: autoplay,
      // 直播参数
      liveOption:
        data.field.type === 'live'
          ? {
              type: data.field.liveType,
              roomId: data.field.roomId,
              inavId: data.field.inavId,
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
            useSWF: false
          }
          : undefined,
      // 跑马灯参数
      marqueeOption: marqueeOption,
      // 水印参数
      watermarkOption: watermarkOption,
      barrageSetting: {
        positionRange: [0, 0.25], //全屏现实化从上之 [startPostion: number, endPosition: number] 百分比，区域显示
        direction: 'right', // 枚举： ‘right, left’ 默认: right
        speed: 10000,
        style: {
          fontSize: "12px",
          fontFamily: "Microsoft Yahei",
          color: "#ffffff",
          border: "none",
          // textShadow: "1px 1px 0px #fff", // 默认值： 1px 1px 0px #fff 参考：https://www.w3school.com.cn/cssref/pr_text-shadow.asp
          borderWidth: 0, //单位 px
          padding: 0, // 左右内边距
          opacity: 100,
          backgroundColor: "none" // 背景色
        }
      },
      // 追播参数
      pursueOption: {
        enable: true
      },
      // 切线
      thornOption,
      // 字幕参数
      subtitleOption: {
        enable: true, // 字幕插件是否可用
        auto: true // 是否自动开启字幕
      },
      peer5Option: peer5Option
    };

    if (paramObj['interval']) {
      option['reportOption'] = { interval: paramObj['interval'] }
    }

    var loading = layer.load(0, { shade: [0.1, '#fff'] });
    VhallPlayer.createInstance(
      option,
      function (res) {
        console.log('res', res)
        var href = window.document.location.href;
        var url = href.split('//')[0] + '//';
        var urlArr = href
          .split('//')[1]
          .split('/')
          .splice(0, window.location.href.split('//')[1].split('/').length - 1);

        for (var i in urlArr) {
          url += ''.concat(urlArr[i], '/')
        }
        var pcHref = url + 'player_new.html';
        url = url + 'h5_new.html';
        var obj = {
          appId: data.field.appId,
          accountId: data.field.accountId,
          token: data.field.token,
          type: data.field.type,
          poster: data.field.poster,
          liveType: data.field.liveType,
          roomId: data.field.roomId,
          inavId: data.field.inavId,
          recordId: data.field.recordId,
          mEnable: marqueeOption.enable,
          autoplay: autoplay,
          mDisplayType: marqueeOption.displayType,
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
          interval: paramObj['interval'],
          peer5: peer5Option.open,
          customerId: peer5Option.customerId
        };

        for (var key in obj) {
          if (obj[key] === '' || obj[key] === undefined) {
            delete obj[key]
          }
        }

        $('.mobile').attr('href', ''.concat(url, '?').concat(Qs.stringify(obj)));
        $('.pcHref').attr('href', ''.concat(pcHref, '?from=go&').concat(Qs.stringify(obj)));
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
    // if (isOpenBarrage) {
      var content = $('input[name=barrageText]').val();
      vhallplayer.addBarrage(content, {
        color: window.danmakuColor
      }, function(e) {
        console.error(e);
      });
      $('input[name=barrageText]').val('')
    // }
  });

  // 回车发送弹幕
  $('input[name=barrageText]').keydown(function (e) {
    if (e.keyCode === 13) {
      if (isOpenBarrage) {
        var content = $('input[name=barrageText]').val();
        vhallplayer.addBarrage(content, {
          color: window.danmakuColor
        }, function(e) {
          console.error(e);
        });
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
    vhallplayer.on(VhallPlayer.LIVESUBTITLE_OPENED, (e) => {
      // console.log('直播字幕开启');
    });

    vhallplayer.on(VhallPlayer.LIVESUBTITLE_CLOSED, (e) => {
      // console.log('直播字幕关闭');
    });

    vhallplayer.on(VhallPlayer.DEFINITION_CHANGE, (e) => {
      // console.log('DEFINITION_CHANGE, 当前url变了');
    })

    vhallplayer.on(VhallPlayer.AUTOPLAY_FAILED, function (e) {
      // console.log('>>> pc 浏览器禁止自动播放');
    });

    vhallplayer.on(VhallPlayer.ERROR, function (e) {
      // if (vhallplayer.isLive) {
      //   if (e.type === 'NetworkError' && e.details === 'HttpStatusCodeInvalid') {
      //     console.error('拉流失败');
      //   }
      // }
     });

    vhallplayer.on(VhallPlayer.LOADEDMETADATA, function (e) {
      // console.log('>>> LOADEDMETADATA');
    });

    vhallplayer.on(VhallPlayer.LOADED, function (e) { });

    // 监听点击播放
    vhallplayer.on(VhallPlayer.PLAY, function (e) { });

    // 监听视频正在播放
    vhallplayer.on(VhallPlayer.PLAYING, function (e) { });

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

  // 增加 普通弹幕
  $('.vhy-tools-addBarrage').on('click', function() {
    vhallplayer.addBarrage(`哈哈哈是！！${ Math.random() * 100000}`);
  })

  // 增加随机表情弹幕
  $('.vhy-tools-addBarrage__emoji').on('click', function() {
    const index =  Math.floor(Math.random() * 90)
    const emoji = `<img width="24" height="24" style="vertical-align:text-bottom;" src="https://cnstatic01.e.vhall.com/static/img/arclist/Expression_${index}@2x.png" />`;
    vhallplayer.addBarrage(`${emoji} 哈哈 ${emoji} 哈是！！${ Math.random() * 100000}`);
  })

  // 弹幕设置
  $('.danmaku-settting').on('click', function() {
    var danmakuSetting = layer.open({
      type: 1,
      maxWidth: 500,
      btn: ['确定'],
      shadeClose: true,
      title: '弹幕设置',
      content: $('.danmakuOption'),
      yes: function() {
        var displayArea = $('input[name="displayArea"]:checked').val()
        var opacity = $('input[name="opacity"]').val()
        var fontSize = $('input[name="fontSize"]:checked').val()
        var speed = $('input[name="speed"]:checked').val()
        // console.log( displayArea, opacity, fontSize, speed )
        vhallplayer.setBarrageInfo({
          positionRange: eval('('+displayArea +')'),
          style: {
            opacity:  opacity,
            fontSize: fontSize,
            speed: speed,
            color: window.danmakuColor || '#fff'
          }
        }, function(e) {
          console.log(e);
        })

        layer.close(danmakuSetting);
        $('.danmakuOption').hide()
      },
      cancel: function() {
        $('.danmakuOption').hide()
      },
      end: function () {
        $('.danmakuOption').hide()
      }
    })
  })

  //弹幕文字设置
  $('#danmaku-font').colpick({
    layout: 'hex',
    onSubmit: function(hsb,hex,rgb,el) {
      // console.log(hex)
      window.danmakuColor = '#'+ hex;
      $('#danmaku-font').colpickHide();
    }
  });
};
