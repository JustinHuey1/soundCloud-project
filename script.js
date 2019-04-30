/* global $ SC */

SC.initialize({
  client_id: '5aa8e389ba4e24b6106af5159ab3e344',
  redirect_uri: 'http://google.com'
});

let songs = [];
let songData = [];
let playList = [];
let currentSong;

let $slider = $('.slider');

$('#searcher').click(function(evt){
    let input = $('#searchBar').val();
    songs = [];
    console.log(input);
    let $output = $('#searchOutPut');
    $('#searchOutPut').empty();
    $("#searchOutPut").css("background","url(imgs/loading.gif) no-repeat center");
    $.ajax({
        url: `https://api.soundcloud.com/tracks?q=${input}&client_id=5aa8e389ba4e24b6106af5159ab3e344`,
        method: "GET",
        success: function(data){
            console.log(data);
            if (data.length === 0){
              return;
            }
            //stream all
            let playerList = [];
            let idList = [];
            data.forEach(function(v, i){
              idList.push(v.id);
            //   promises.push(SC.stream(`/tracks/${v.id}`).then(function(player){
            //     playerList.push(player);
            //     console.log(player);
            //     songs.push(player);
            //     //try to play
            //     player.play().then(function(){
            //       //successful play
            //       console.log('Playback started!');
            //       player.pause();
            //       //push to screen
                  
            //     }).catch(function(e){
            //       console.error('Playback rejected.', e, i);
            //       songs.splice(i, 1);
            //     })
            //   }));
            // });
            // Promise.all(promises).then(function(){
            //   console.log(playerList);
            //   songs = playerList;
            //   flow(playerList);
            });
            //grabs lets go
            async function flow(ids){
              //grabs all id of songs get and send request to get audio files
              for (let i = 0; i < ids.length; i ++){
                await SC.stream(`/tracks/${ids[i]}`).then(function(p){
                  playerList.push(p);
                });
              }
              let audios = playerList;
              //play every audio to see if they dead or not
              for(let i = 0; i < audios.length; i ++) {
                let audio = audios[i];
                await audio.play().then(function(){
                  //success
                  console.log('Playback started!');
                  audio.pause();
                  songs.push(audio);
                }).catch(function(e){
                  //fail and pop
                  console.error('Playback rejected.', e, i);
                  songs.splice(i, 1);
                  data.splice(i, 1);
                });
              }
              songData = data;
              console.log(data);
              console.log(songs);
              //rendering
              for (let i = 0; i < songData.length; i ++){
                let data = songData[i];
                console.log(data);
                let $song = $('<div>').addClass(i).addClass('songDiv');
                $output.append($song);
                //img
                let $img = $('<img>');
                if(data.artwork_url !== null){
                  $img.attr('src', data.artwork_url).addClass("songImg");
                }else{
                  $img.attr('src', "imgs/noImg.png").addClass("songImg");
                }
                $song.append($img);
                //title
                let $name = $('<div>');
                $name.text(data.title).addClass("songName");
                $song.append($name);
                //artist
                let $artist = $("<div>");
                $artist.text(data.user.username).addClass("songArtist");
                $song.append($artist);
                //genre
                let $genre = $('<div>');
                $genre.text(data.genre);
                $song.append($artist);
                //description
                let $desc = $('<div>')
                  $desc.addClass("desc");
            
                $desc.text(data.description).addClass("songDesc");
                $song.append($desc);
                //play button
                let $button = $('<img>').attr('src', 'imgs/someSort_Logo.png').addClass('playButton');
                let buttonContainer = $('<div>');
                  //append pic into ^
                    buttonContainer.append($button);
                  //lol that's it why i comment here lol?
                  
                $button.attr('class', i);
                $button.click(function(){
                  playSong(parseInt(i));
                  playList.push(parseInt(i));
                })
                $song.append(buttonContainer);
              }
              //remove loading gif here
                  $("#searchOutPut").css("background","");
            }
            //run
            flow(idList);
            // console.log(promises);
            // Promise.all(promises).then(function(values) {
            //   //pushing data
            //   console.log('splicing done');
            //   console.log(data);
            // });
        }
    });
});

$(".topButtons").click(function(){
  let id = $(this).attr('id');
  $('.contents').hide();
  if (id === 'searchButton'){
    $('#searchContent').show();
  }else if (id === 'recommandedButton'){
    $('#recommendContent').show();
  }else{
    $('#settingContent').show();
  }
});
//hide everything
$('.contents').hide();

let songTime = 0;
let songLength = Infinity;
let playing = false;

//timer from stackoverflow
var interval = 1000; // ms
var expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    //do stuff if playing
    if (playing){
      //add time
      songTime += interval;
      //check if song end
      if (songTime > songLength){
        nextSong();
      }
      //render according to time
      $slider.val(songTime / 1000);
      //render text
      let second = songTime / 1000;
      let str = String(second % 60);
      if (str.length === 1){
        str = "0" + str;
      }
      $('#cTime').text(`${Math.floor(second / 60)}:${str}`);
    }
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt)); // take into account drift
}

function playSong(id){
  id = parseInt(id);
  $("#playPause").attr("src","imgs/pause.png");
  let song = songs[id];
  songLength = song.getDuration();
  song.play();
  playing = true;
  currentSong = id;
  songTime = 0;
  //set scroll bar
  let second = Math.ceil(song.getDuration() / 1000);
  $slider.attr('min', '0');
  $slider.attr('max', second);
  $slider.val(0);
  let str = String(second % 60);
  if (str.length === 1){
    str = "0" + str;
  }
  $('#sTime').text(`${Math.floor(second / 60)}:${str}`);
}

function moveSong(){
  let value = $slider.val();
  songTime = value * 1000;
  songs[currentSong].seek(songTime);
}

function nextSong(){
  //if next song exist
  if (playList[currentSong + 1]){
    currentSong += 1;
  }else{
    currentSong = 0;
  }
  playSong(currentSong);
}

//songList
let playListShow = false;
let $list = $('#playList');
$list.hide();
$('#songList').click(function(evt){
  if (playListShow){
    $list.hide();
    playListShow = false;
  }else{
    $list.show();
    playListShow = true;
  }
  $("#playListSongs").empty();
  //append songs
  let f = function(v, i) {
    let $song = $('<div>').addClass('playListSong');
    $song.attr('index', i);
    //deletion
    $song.contextmenu(function(e){
      //prevent context menu
      e.preventDefault();
      $("#playListSongs").empty();
      let i = parseInt($(this).attr('index'));
      //if last song on list
      if (playList.length === 1){
        songs[currentSong].pause();
        playing = false;
        playList = [];
        currentSong = undefined;
        return playList.forEach(f);
      }
      //if the end of the list
      if (i === playList.length - 1){
        //play previous song
        playSong(i - 1);
        //remove from list
        playList.pop();
        return playList.forEach(f);
      }
      //other wise
      playList.splice(i, 1);
      playSong(i);
      playList.forEach(f);
    });
    if (parseInt(i) === parseInt(currentSong)){
      $song.addClass('currentSong');
    }
    $("#playListSongs").append($song);
    let data = songData[v];
    let song = songs[v];
    let $name = $("<div>").text(data.title);
    $song.append($name);
    //handler
    $song.click(function(){
      if (i !== currentSong){
        playSong(i);
        $("#playListSongs").empty();
        playList.forEach(f);
      }
    });
  }
  playList.forEach(f);
  //position it
  $list.offset({left: evt.pageX - $list.width() - 10, top: evt.pageY - 10 - $list.height()});
});

// let cover = [];

// $("#bottom").click(function(){
//   $.ajax({
//     ur:`https://api.soundcloud.com/tracks?&client_id=5aa8e389ba4e24b6106af5159ab3e344`,
//     method:"GET",
//     success: function(response){
      
        
      
      
      
//     }
//   });
// });

//pause and play and what not---------------------------------------------------
$("#playPause").click(function() {
  if(playing === true){
    songs[currentSong].pause();
    playing = false;
    $("#playPause").attr("src","imgs/play.png");
  }else if(playing === false && currentSong){
    songs[currentSong].play();
    playing = true;
    $("#playPause").attr("src","imgs/pause.png");
  }else{//else may be useless here, dont know, didn't try
    $("#playPause").attr("src","imgs/loading.gif");
  }
  
});