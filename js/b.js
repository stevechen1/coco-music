var music = new Audio()
music.autoplay = false
function $(el) {
    return document.querySelector(el)
}
function getMusic (callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','./local-server/music.json','true')
    xhr.send()
    xhr.addEventListener('load',function(){
        if(xhr.status >= 200 && xhr.status <= 300 || xhr.status == 304){
            callback(JSON.parse(xhr.responseText).data)
             console.log(JSON.parse(xhr.responseText))
            console.log('sucess')
        } else {
            console.log('数据获取失败')
        }
    })
}
var musicData
getMusic(function(list){
    musicData = list
    loadMusic(list[musicIndex])
    console.log(musicData)
})
// 将数据导入
function loadMusic (songObj){
    $('.songName').innerText = songObj.songName
    $('.author').innerText = songObj.author
    $('#bg').setAttribute('src',songObj.bg)
    music.setAttribute('src',songObj.url)
}
// 下一曲函数
var musicIndex = 0
function loadNextMusic (){
    if(musicIndex < musicData.length-1){
        musicIndex ++
        loadMusic(musicData[musicIndex])
    }else {
        musicIndex = 0
        loadMusic(musicData[musicIndex])
    }

}
// 上一曲函数
function loadPreMusic (){
    if(musicIndex > 0){
        musicIndex--
        loadMusic(musicData[musicIndex])
    }else {
        musicIndex = musicData.length-1
        loadMusic(musicData[musicIndex])
    }
}
// 进度条函数
function musicProgress (){
    // 进度条
    var per = music.currentTime/music.duration
    $('.pro-play').style.width = per*100 + '%'
    // 歌曲时间
    var minutes = parseInt(music.currentTime/60)
    var seconds = parseInt(parseInt(music.currentTime)%60)
    seconds = seconds < 10 ?'0' + seconds :  seconds
    $('.proTime').innerText = minutes + ':' + seconds
}

// 自动播放下一曲
function autoPlayNext (){
    if(music.currentTime == music.duration && music.currentTime !== 0){
        loadNextMusic()
        console.log('ex')
        music.play()
    }
}



// click操作
$('.play').addEventListener('click',function(){
    music.play()
    $('.play').classList.add('hidden')
    $('.pause').classList.remove('hidden')
})
$('.pause').addEventListener('click',function(){
    music.pause()
    $('.play').classList.remove('hidden')
    $('.pause').classList.add('hidden')
})
$('.next').addEventListener('click',function (){
    loadNextMusic()
    music.play()
    $('.play').classList.add('hidden')
    $('.pause').classList.remove('hidden')
})
$('.previous').addEventListener('click',function (){
    loadPreMusic()
    music.play()
    $('.play').classList.add('hidden')
    $('.pause').classList.remove('hidden')
})
$('.progress').addEventListener('click',function (e){
    clickPer = e.offsetX/parseInt(getComputedStyle(this).width)
    $('.pro-play').style.width = clickPer*100 + '%'
    music.play()
    $('.play').classList.add('hidden')
    $('.pause').classList.remove('hidden')
    music.currentTime = music.duration * clickPer
})
//audio 的属性
music.shouldUpdate = true
music.onended = autoPlayNext
// music.ontimeupdate = musicProgress
music.onplaying = function (){
    setInterval(() => {
        musicProgress()
    }, 500);
    console.log('suc')
}
music.onpause = function(){
    clearInterval()
    console.log('st')
}