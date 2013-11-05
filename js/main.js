var player = $('#video'); // video element
var overlay = $('#video-overlay'); // video overlay
var currentVideo; // current video
var isLastVideo = false; // if it's the last video in the chain

var CHILD_VIDEO_ATTRIBUTE = 'data-video-url'; // data attribute to store video url
var CHILD_VIDEO_CLASS = 'video-child'; // video child element class name
var BASE_VIDEO_FOLDER = 'videos/'; // video location
var BASE_IMAGE_FOLDER = 'img/'; // poster location

var sequence = [{
    "parent": BASE_VIDEO_FOLDER + "video1.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video2-1.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video2-1"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video2-2.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video2-2"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video2-1.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video3-1.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video3-1"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video3-2.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video3-2"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video2-2.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video3-3.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video3-3"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video3-4.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video3-4"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video3-1.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-1.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-1"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-2.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-2"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video3-2.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-3.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-3"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-4.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-4"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video3-3.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-5.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-5"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-6.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-6"
    }]
},{
    "parent": BASE_VIDEO_FOLDER + "video3-4.mp4",
    "children": [{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-7.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-7"
    },{
        "videoUrl": BASE_VIDEO_FOLDER + "video4-8.mp4",
        "poster": BASE_IMAGE_FOLDER + "blank.png",
        "title": "video4-8"
    }]
}];

$(document).ready(init);

function init(){
    // setup events
    player.bind('ended', onVideoEnded);
    player.bind('playing', onVideoPlaying);
    player.bind('seeking', onVideoPlaying);
    player.bind('seeked', onVideoPlaying);

    // play the 1st video
    playNewVideo(sequence[0].parent);
}

// show overlay when a video stops
function onVideoEnded(event){
    if(!isLastVideo){
        // force player to exit fullscreen
        player[0].webkitExitFullScreen();
        refreshOverlayElements();
        // hide player so overlay item can capture click actions
        player.hide();
        overlay.show();
    }
}

// hide overlay whenever a video plays
function onVideoPlaying(event){
    overlay.hide();
    player.show();
}

// when a branch is clicked
function onChildrenVideoClicked(event){
    var clickedVideo = $(event.target).parent('.'+CHILD_VIDEO_CLASS);
    playNewVideo(clickedVideo.attr(CHILD_VIDEO_ATTRIBUTE));
    player.show();
}

// construct overlay items
function refreshOverlayElements(){
    // empty overlay
    overlay.empty();

    // get all children video data
    var videoChildren = findChildrenVideo(currentVideo);

    for(var i = 0; i < videoChildren.length; i++){
        // construct html
        overlay.append(getChildVideoTemplate(videoChildren[i].videoUrl, videoChildren[i].title, videoChildren[i].poster));
    }

    // bind click event
    $('.' + CHILD_VIDEO_CLASS).bind('click', onChildrenVideoClicked);
}

// child video html
function getChildVideoTemplate(videoUrl, videoTitle, videoPoster){
    return '<div ' + CHILD_VIDEO_ATTRIBUTE + '="' + videoUrl + '" class="' + CHILD_VIDEO_CLASS + '"><span class="title">' + videoTitle + '</span><img src="' + videoPoster + '"></img></div>';
}

// play a new video
function playNewVideo(newVideo){
    currentVideo = newVideo;

    // check if it's the last video
    isLastVideo = findChildrenVideo(currentVideo)? false : true;

    console.log(currentVideo);
    player.attr('src', currentVideo);
}

// find the next set of video
function findChildrenVideo(parentVideo){
    var childrenVideos;
    for(var i = 0; i < sequence.length; i++){
        if(sequence[i].parent === parentVideo){
            childrenVideos = sequence[i].children;
            break;
        }
    }
    return childrenVideos;
}