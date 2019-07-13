
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('vid_frame', {
        height: '560',
        width: '315',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            'autoplay': 1,
            'controls': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

}

var playerReady = false;
function onPlayerReady(event) {
    playerReady = true;

}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        alert("Video is Playing !!!");
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        alert("Video is Paused !!!");
    }
    else if (event.data == YT.PlayerState.ENDED) {
        alert('done');
    } 
    else if (event.data == YT.PlayerState.BUFFERING) {
        var newPlayerTime = player.getCurrentTime();
        alert("Video is jumped to : " + newPlayerTime);
    }
}

function stopVideo() {
    player.stopVideo();
}

function loadNewVideo(videoId) {
        var videoId = videoId;
        var startSeconds = 0;
        var suggestedQuality = "large";
        player.loadVideoById({
            videoId: videoId,
            startSeconds: startSeconds,
            suggestedQuality: suggestedQuality
        });
}

function playAt(jumpedTime) {
    player.seekTo(jumpedTime);
}

function arrowScrollLeft() {
    var elem = document.getElementsByClassName("vid-list-container")[0];
    elem.scrollLeft -= 336;
}

function arrowScrollRight() {
    var elem = document.getElementsByClassName("vid-list-container")[0];
    elem.scrollLeft += 336;
}

function addVideoItem(videoURL) {
    if (videoURL == "") {
        alert("Please Enter URL");
        return;
    }
    var videoId = getVideoId(videoURL);
    var videoItem = getElement("div",videoId,"vid-item",videoItemOnClick,null,null);
    var thubDiv = getElement("div",null,"thumb",null,null,null);
    var img = getElement("img",null,null,null,getImgSrc(videoId),null);
    thubDiv.appendChild(img);
    var descDiv = getElement("div",null,"desc",null,null,"Desc...")
    var removeDiv = getElement("div",videoId,"remove",removeOnClick,null,"Remove");
    videoItem.appendChild(thubDiv);
    videoItem.appendChild(descDiv);
    videoItem.appendChild(removeDiv);
    document.getElementsByClassName("vid-list")[0].appendChild(videoItem);
}

function getElement(type,id,className,onclick,src,innerHTML){
    var elem = document.createElement(type);
    if(id)
        elem.id = id;
    if(className)
        elem.className = className;
    if(onclick)
        elem.onclick = onclick;
    if(src)
        elem.src = src;
    if(innerHTML)
        elem.innerHTML = innerHTML;
    return elem;
}

function videoItemOnClick() {
    loadNewVideo(this.id);
}

function getImgSrc(videoId) {
    var link = "http://img.youtube.com/vi/" + videoId + "/0.jpg"
    return link;
}

function getVideoTitle() {
    //TO DO
}

function removeOnClick() {
    var parentNode = document.getElementById(this.id).parentNode;
    var removeElem = document.getElementById(this.id);
    parentNode.removeChild(removeElem);
    alert("Removed from Queue");
}

function getVideoId(videoURL) {
    var startPosition = videoURL.indexOf("?v=") + 3;
    var endPosition = startPosition + 11;
    return videoURL.slice(startPosition, endPosition);
}