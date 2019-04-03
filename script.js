/* global $ */

$('#search').click(function(evt){
    let input = $('searchBar').val();
    $.ajax({
        url: `https://api.soundcloud.com/tracks?q=${input}&client_id=5aa8e389ba4e24b6106af5159ab3e344`,
        method: "GET",
        success: function(data){
            console.log(data);
        }
    });
});

function play(url){
    let audio = new Audio();
    audio.url = url;
    audio.play();
}