/* global $ SC */

SC.initialize({
  client_id: '5aa8e389ba4e24b6106af5159ab3e344',
  redirect_uri: 'http://google.com'
});

let songs = [];
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
            let promises = [];
            data.forEach(function(v, i){
              SC.stream(`/tracks/${v.id}`).then(function(player){
                console.log(player);
                songs.push(player);
                //try to play
                promises.push(
                  player.play().then(function(){
                    console.log('Playback started!');
                    player.pause();
                  }).catch(function(e){
                    console.error('Playback rejected.', e, i);
                    songs.splice(i, 1);
                    //also splice from data
                    data.splice(i, 1);
                  })
                );
              });
            });
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