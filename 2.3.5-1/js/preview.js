var config = {
  develop: {
    appId: 'd317f559', // 应用ID，必填
    accountId: '405', // 第三方用户ID，必填
    token: 'vhall', // access_token，必填
    type: 'vod', // 观看类型
    videoNode: 'videoNode', // 播放器的容器， div的id
    vodOption: { recordId: 'd0a604ab' },
    autoplay: true,
    marqueeOption: {
      enable: true, // 默认 false
      displayType: 0, // 展示类型: 0滚动 1闪动
      text: "版权所有，盗版必究", // 跑马灯的文字
      alpha: 100, // 透明度  100 完全显示   0 隐藏
      size: 18, // 文字大小
      color: "#ff8d41", // 文字颜色
      interval: 20, // 时间间隔 单位秒
      spee: 6000, // 移动速度 3000快 6000中 10000慢
      position: 1 // 跑马灯位置，1 随机 2上 3中 4下
    }
  },
  prod: {
    appId: 'd317f559', // 应用ID，必填
    accountId: '10000127', // 第三方用户ID，必填
    token: 'vhall', // access_token，必填
    type: 'vod', // 观看类型
    videoNode: 'videoNode', // 播放器的容器， div的id
    vodOption: { recordId: '922013fa' },
    autoplay: true,
    marqueeOption: {
      enable: true, // 默认 false
      displayType: 0, // 展示类型: 0滚动 1闪动
      text: "版权所有，盗版必究", // 跑马灯的文字
      alpha: 100, // 透明度  100 完全显示   0 隐藏
      size: 18, // 文字大小
      color: "#ff8d41", // 文字颜色
      interval: 20, // 时间间隔 单位秒
      spee: 6000, // 移动速度 3000快 6000中 10000慢
      position: 1 // 跑马灯位置，1 随机 2上 3中 4下
    }
  }
}

window.onload = function () {
  var layer = layui.layer;
  var form = layui.form;
  var colorpicker = layui.colorpicker;
  var marqueeopts;
  var isProd = $('input[name=player-env]').val();
  var opts;
  if (isProd === 'true') {
    opts = config.prod;
  } else {
    opts = config.develop;
  }

  var enable = $('input[name=enable]').val() === 'true' ? true : false;
  var displayType = $('input[name=displayType]').val();
  if (parseInt(displayType) === 0) {
    $('.speed').show();
  } else {
    $('.speed').hide();
  }
  var text = $('input[name=text]').val();
  var size = $('input[name=size]').val();
  var speed = $('input[name=speed]').val();
  var position = $('input[name=position]').val();
  var interval = $('input[name=interval]').val();
  marqueeopts = {
    enable: enable,
    displayType: parseInt(displayType),
    text: text,
    size: size,
    color: '#ff8d41',
    alpha: 100,
    speed: speed,
    position: position,
    interval: interval
  };

  VhallPlayer.createInstance(opts, function (res) {
    window.vhallplayer = res.vhallplayer;

    vhallplayer.on(VhallPlayer.AUTOPLAY_FAILED, function (e) {
      // console.log('>>> 监听到VhallPlayer.AUTOPLAY_FAILED');
    });

    colorpicker.render({
      elem: '#color',
      color: '#ff8d41',
      change: function (color) { },
      done: function (color) {
        marqueeopts.color = color;
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    $('.marquee-alpha').on('change', function (e) {
      marqueeopts.alpha = e.target.value;
      vhallplayer.editMarquee(marqueeopts, function () { });
    });

    $('.marquee-alpha').on('input', function (e) {
      $('.alphaValue').text(e.target.value + '%');
    });

    form.on('switch(enable)', function (data) {
      var status = data.elem.checked;
      if (status) {
        // $('.switch-marquee').attr('checked');
        marqueeopts.enable = true;
        $('.config-items').show();
      } else {
        // $('.switch-marquee').removeAttr('checked');
        marqueeopts.enable = false;
        $('.config-items').hide();
      }
      vhallplayer.editMarquee(marqueeopts, function () { });
    });

    form.on('radio(displayType)', function (data) {
      if (parseInt(marqueeopts.displayType) !== parseInt(data.value)) {
        if (parseInt(data.value) === 0) {
          $('.speed').show();
        } else {
          $('.speed').hide();
        }
        marqueeopts.displayType = data.value;
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    $('.marquee-text').on('input', function (e) {
      marqueeopts.text = e.target.value;
      vhallplayer.editMarquee(marqueeopts, function () { });
    });

    $('.marquee-text').on('change', function (e) {
      if (!e.target.value) {
        layer.msg('跑马灯文本不能为空', { icon: 7, time: 3000, shade: [0.6, '#000', true] });
      }
    });

    $('.marquee-size').on('input', function (e) {
      var sizeIn = e.originalEvent.data;
      if (sizeIn && !(/^[0-9]$/.test(sizeIn))) {
        $('.marquee-size').val(marqueeopts.size);
      } else {
        marqueeopts.size = e.target.value;
        if (parseInt(e.target.value) < 1) {
          $('.marquee-size').val(1);
          marqueeopts.size = 1;
        }
        if (parseInt(e.target.value) > 200) {
          $('.marquee-size').val(200);
          marqueeopts.size = 200;
        }
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    $('.marquee-size').on('change', function (e) {
      if (!e.target.value) {
        $('.marquee-size').val(18);
        marqueeopts.size = 18;
      }
    });

    form.on('radio(speed)', function (data) {
      if (parseInt(marqueeopts.speed) !== parseInt(data.value)) {
        marqueeopts.speed = data.value;
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    form.on('radio(position)', function (data) {
      if (parseInt(marqueeopts.position) !== parseInt(data.value)) {
        marqueeopts.position = data.value;
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    $('.marquee-interval').on('input', function (e) {
      var intervalIn = e.originalEvent.data;
      if (intervalIn && !(/^[0-9]$/.test(intervalIn))) {
        $('.marquee-interval').val(marqueeopts.interval);
      } else {
        marqueeopts.interval = e.target.value;
        if (parseInt(e.target.value) < 0) {
          $('.marquee-interval').val(0);
          marqueeopts.interval = 0;
        }
        if (parseInt(e.target.value) > 300) {
          $('.marquee-interval').val(300);
          marqueeopts.interval = 300;
        }
        vhallplayer.editMarquee(marqueeopts, function () { });
      }
    });

    $('.marquee-interval').on('change', function (e) {
      if (e.target.value === '') {
        $('.marquee-interval').val(20);
        marqueeopts.interval = 20;
      }
    });
  }, function (err) {});

  form.render();
}
