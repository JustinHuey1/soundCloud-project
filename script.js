/* global $ SC */

SC.initialize({
  client_id: '5aa8e389ba4e24b6106af5159ab3e344',
  redirect_uri: 'http://google.com'
});

let songs = [];
let songData = [];
let playList = [];

$('#searcher').click(function(evt){
    let input = $('#searchBar').val();
    songs = [];
    console.log(input);
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
              for (let i = 0; i < songData; i ++){
                let data = songData[i];
                
              }
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


// let cover = [];

// $("#bottom").click(function(){
//   $.ajax({
//     ur:`https://api.soundcloud.com/tracks?&client_id=5aa8e389ba4e24b6106af5159ab3e344`,
//     method:"GET",
//     success: function(response){
      
        
      
      
      
//     }
//   });
  
  
  
  
  
  
  
// });