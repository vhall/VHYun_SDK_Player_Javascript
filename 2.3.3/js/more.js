// import VhallPlayer from "../../src";

window.onload = () => {
  var option = {
    appId: 'dab27ad1', // 应用ID，必填
    accountId: '10000126', // 第三方用户ID，必填
    token: 'vhall', // access_token，必填
    type: 'vod',
    videoNode: 'video1', // 播放器的容器， div的id
    poster: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1199227190,1300329588&fm=26&gp=0.jpg', // 封面地址
    roomId: 'lss_8057799d', // 房间ID
    vodOption: { recordId: 'ec824672' }
  }
  VhallPlayer.createInstance(option, res => {
    window.vhallplayer1 = res.vhallplayer

    vhallplayer1.on(VhallPlayer.LOADED, res => {
      console.error('vhallplayer1 , LOADED', res)
    })

    vhallplayer1.on(VhallPlayer.CURRENTTIME_CHANGE, res => {
      console.error('vhallplayer1 , CURRENTTIME_CHANGE', res)
    })

    vhallplayer1.on(VhallPlayer.LOOP_CHANGE, res => {
      console.error('vhallplayer1 , LOOP_CHANGE', res)
    })
    vhallplayer1.on(VhallPlayer.DEFINITION_CHANGE, res => {
      console.error('vhallplayer1 , DEFINITION_CHANGE', res)
    })
    vhallplayer1.on(VhallPlayer.MUTE_CHANGE, res => {
      console.error('vhallplayer1 , MUTE_CHANGE', res)
    })
    vhallplayer1.on(VhallPlayer.PAUSE, res => {
      console.error('vhallplayer1 , PAUSE', res)
    })
    vhallplayer1.on(VhallPlayer.PLAY, res => {
      console.error('vhallplayer1 , PALY', res)
    })
    vhallplayer1.on(VhallPlayer.VOLUME_CHANGE, res => {
      console.error('vhallplayer1 , VOLUME_CHANGE', res)
    })

    vhallplayer1.on(VhallPlayer.OPEN_BARRAGE, res => {
      console.error('vhallplayer1 , OPEN_BARRAGE', res)
    })
    vhallplayer1.on(VhallPlayer.CLOSE_BARRAGE, res => {
      console.error('vhallplayer1 , CLOSE_BARRAGE', res)
    })
    vhallplayer1.on(VhallPlayer.CLEAR_BARRAGE, res => {
      console.error('vhallplayer1 , CLEAR_BARRAGE', res)
    })
  })

  var option2 = {
    appId: 'dab27ad1', // 应用ID，必填
    accountId: '10000126', // 第三方用户ID，必填
    token: 'vhall', // access_token，必填
    type: 'vod',
    videoNode: 'video2', // 播放器的容器， div的id
    poster: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1199227190,1300329588&fm=26&gp=0.jpg', // 封面地址
    roomId: 'lss_8057799d', // 房间ID
    vodOption: { recordId: 'be3ecc9a' }
  }
  VhallPlayer.createInstance(option2, res => {
    window.vhallplayer2 = res.vhallplayer
    vhallplayer2.on(VhallPlayer.LOADED, res => {
      console.error('vhallplayer2 , LOADED', res)
    })

    vhallplayer2.on(VhallPlayer.CURRENTTIME_CHANGE, res => {
      console.error('vhallplayer2 , CURRENTTIME_CHANGE', res)
    })

    vhallplayer2.on(VhallPlayer.LOOP_CHANGE, res => {
      console.error('vhallplayer2 , LOOP_CHANGE', res)
    })
    vhallplayer2.on(VhallPlayer.DEFINITION_CHANGE, res => {
      console.error('vhallplayer2 , DEFINITION_CHANGE', res)
    })
    vhallplayer2.on(VhallPlayer.MUTE_CHANGE, res => {
      console.error('vhallplayer2 , MUTE_CHANGE', res)
    })
    vhallplayer2.on(VhallPlayer.PAUSE, res => {
      console.error('vhallplayer2 , PAUSE', res)
    })
    vhallplayer2.on(VhallPlayer.PLAY, res => {
      console.error('vhallplayer2 , PALY', res)
    })
    vhallplayer2.on(VhallPlayer.VOLUME_CHANGE, res => {
      console.error('vhallplayer2 , VOLUME_CHANGE', res)
    })

    vhallplayer2.on(VhallPlayer.OPEN_BARRAGE, res => {
      console.error('vhallplayer2 , OPEN_BARRAGE', res)
    })
    vhallplayer2.on(VhallPlayer.CLOSE_BARRAGE, res => {
      console.error('vhallplayer2 , CLOSE_BARRAGE', res)
    })
    vhallplayer2.on(VhallPlayer.CLEAR_BARRAGE, res => {
      console.error('vhallplayer2 , CLEAR_BARRAGE', res)
    })
  })

  function play(vhallplayer) {
    vhallplayer.play(err => {
      console.error(err)
    })
  }

  function pause(vhallplayer) {
    vhallplayer.pause(err => {
      console.error(err)
    })
  }

  function setLoop(vhallplayer) {
    vhallplayer.setLoop(true, err => {
      console.error(err)
    })
  }

  function enterFullScreen(vhallplayer) {
    vhallplayer.enterFullScreen(err => {
      console.error(err)
    })
  }

  function exitFullScreen(vhallplayer) {
    vhallplayer.exitFullScreen(err => {
      console.error(err)
    })
  }

  function setMute(vhallplayer) {
    vhallplayer.setMute(true, err => {
      console.error(err)
    })
  }

  function setVolume(vhallplayer) {
    vhallplayer.setVolume(10)
  }

  function videoScreenshot(vhallplayer) {
    $('.img-box').append(`
    <img src="${vhallplayer.videoScreenshot()}" />
  `)
  }
}
