const iceServers = {
    'iceServers': [
        { 'urls': 'stun:stun.l.google.com:19302' },
        { 'urls': 'stun:stun.services.mozila.com' }
    ]
}

const myPeer = new Peer(USER_ID, {
    config: iceServers
});

let localStream, isStreamLoaded = false;

const socket = io();
const videoGrid = document.getElementById('video-grid');
const peers = {};
const constraints = {
    'audio': false,
    'video': true
}

const videoes = [];
const startBtn = document.getElementById('startButton');
startBtn.addEventListener('click', getLocalVideo);
const callBtn = document.getElementById('callButton');
const hangUpBtn = document.getElementById('hangUpButton');

async function getLocalVideo() {
    try {
        if(isStreamLoaded) return;
        callBtn.addEventListener('click', doCall);
        //startBtn.removeEventListener('click', getLocalVideo);
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Got MediaStream', localStream);
        const myVideo = document.createElement('video');
        myVideo.id = 'myVideo';
        addVideoStream(myVideo, localStream);
        isStreamLoaded = true;
    } catch (error) {
        console.log('Error: ', error);
    }
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

function doCall() {
    callBtn.removeEventListener('click', doCall);
    socket.emit('join', ROOM_ID, myPeer.id);
    hangUpBtn.addEventListener('click', hangUp);
}

function hangUp() {
    callBtn.addEventListener('click', doCall);
    hangUpBtn.removeEventListener('click', hangUp);
    socket.emit('hangup', ROOM_ID, myPeer.id);
    isStreamLoaded = false;
    videoes.forEach(element => {
        element.remove();
    });
}

socket.on('user-connected', userID => {
    if(!isStreamLoaded) return;
    const newPeer = myPeer.call(userID, localStream);
    const video = document.createElement('video');
    video.classList.add('remoteVideo');
    newPeer.on('stream', remoteVideoStream => {
        addVideoStream(video, remoteVideoStream);
        videoes[userID] = video;
    });
    newPeer.on('close', () => {
        console.log('disconnected');
        video.remove();
    });
    peers[userID] = newPeer;
});

socket.on('user-disconnected', userID => {
    if (peers[userID]) {
        peers[userID].close();
    }
    if (videoes[userID]) {
        videoes[userID].remove();
    }
});

socket.on('full', () => {
    console.log('full');
})

myPeer.on('call', call => {
    if(!isStreamLoaded) return;
    call.answer(localStream);
    const video = document.createElement('video');
    video.classList.add('remoteVideo');
    call.on('stream', remoteVideoStream => {
        addVideoStream(video, remoteVideoStream);
    });
    videoes[call.peer] = video;
});