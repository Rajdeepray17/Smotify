console.log("Welcome to SMotify - Seedhe Maut Edition");

// Initialize Variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let bigSongName = document.getElementById('bigSongName');
let bigArtistName = document.getElementById('bigArtistName');
let currentCoverImg = document.getElementById('currentCoverImg');
let songItemContainer = document.querySelector('.songItemContainer');
let volumeControl = document.getElementById('volumeControl');
let currentTimeDisplay = document.getElementById('currentTime');
let shuffleBtn = document.getElementById('shuffleBtn');
let repeatBtn = document.getElementById('repeatBtn');

// Animation Element Target
let desktopMiddleLogo = document.getElementById('desktopMiddleLogo');

// State Variables
let isShuffle = false;
let isRepeat = false;
let hasPlayedOnce = false; 

const songListRaw = [
    "Nanchaku", "Nalla Freestyle", "Asal G", "11K", "Naksha", "Namastute", 
    "Raat ki Rani", "Joint in the booth", "Lunch Break", "101", "Pankh", 
    "Shaktiman", "Kranti", "Champions", "Naam kaam sheher", "Natkhat", 
    "Khush nahi", "Gourmet Shit", "Seedhe Maut Anthem", "Red", 
    "Shakti aur Kshama", "Maar kaat", "Pickup", "Madira", "Pancake", 
    "Batti", "Maina", "Takat", "Meri Baggi", "Hola Amigo", "Khata Flow", 
    "Shutdown", "TT", "Luka Chippi", "MMM", "Hausla", "Nayab", 
    "Class-sikh Maut Vol 2", "Teen Dost", "Sike", "Capital Rap", "Kohra", 
    "Uss din", "Toh kya", "Gandi Aulad", "Swah", "Sensitive", "Rahat", 
    "Do guna", "Chidiya Udd", "Anadi", "Choti Soch", "Kodak", "Bure Din", 
    "Kya challa", "Fanne khan", "First place", "Akatsuki", "Kaanch ke ghar", 
    "Bhundfaad"
];

let songs = songListRaw.map((name) => {
    return {
        songName: name,
        artist: "Seedhe Maut",
        filePath: `songs/${name}.mp3`, 
        coverPath: `covers/${name}.jpg`
    }
});

// Generate HTML
songs.forEach((song, i) => {
    let div = document.createElement('div');
    div.classList.add('songItem');
    div.innerHTML = `
        <div class="content">
            <img src="${song.coverPath}" alt="${song.songName}">
            <div>
                <span class="SongName" style="font-weight:bold; display:block;">${song.songName}</span>
                <span style="font-size: 0.8rem; color: #ccc;">${song.artist}</span>
            </div>
        </div>
        <span class="songlistplay"><i id="${i}" class="far fa-play-circle fa-2x"></i></span>
    `;
    songItemContainer.appendChild(div);
});

audioElement.src = songs[0].filePath;

// --- Helper: Handle Animation Classes ---
function toggleAnimations(isPlaying) {
    if (isPlaying) {
        currentCoverImg.classList.add('beating');
        if(desktopMiddleLogo) desktopMiddleLogo.classList.add('logo-beating');
    } else {
        currentCoverImg.classList.remove('beating');
        if(desktopMiddleLogo) desktopMiddleLogo.classList.remove('logo-beating');
    }
}

function loadSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    
    masterSongName.innerText = songs[songIndex].songName;
    
    if (hasPlayedOnce) {
        bigSongName.innerText = songs[songIndex].songName;
        bigArtistName.innerText = songs[songIndex].artist;
        currentCoverImg.src = songs[songIndex].coverPath;
    }

    makeAllPlays();
    let playingIcon = document.getElementById(index);
    if(playingIcon) {
        playingIcon.classList.remove('fa-play-circle');
        playingIcon.classList.add('fa-pause-circle');
    }
}

// Play/Pause Click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime <= 0){
        if (!hasPlayedOnce) {
            hasPlayedOnce = true;
            loadSong(songIndex); 
        }
        
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        toggleAnimations(true); // START ANIMATION
        
        let playingIcon = document.getElementById(songIndex);
        if(playingIcon) {
            playingIcon.classList.remove('fa-play-circle');
            playingIcon.classList.add('fa-pause-circle');
        }
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
        makeAllPlays(); 
        toggleAnimations(false); // STOP ANIMATION
    }
})

// Shuffle Toggle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
});

// Repeat Toggle
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
});

// Next Button
document.getElementById('next').addEventListener('click', () => {
    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        if(songIndex >= songs.length - 1){
            songIndex = 0;
        } else {
            songIndex += 1;
        }
    }
    
    hasPlayedOnce = true; 
    loadSong(songIndex);
    audioElement.play();
    toggleAnimations(true); // Ensure animation starts
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
});

// Previous Button
document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex <= 0){
        songIndex = 0;
    }
    else{
        songIndex -= 1;
    }
    hasPlayedOnce = true;
    loadSong(songIndex);
    audioElement.play();
    toggleAnimations(true);
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
});

// Auto Play Next
audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play();
        toggleAnimations(true);
    } else {
        document.getElementById('next').click();
    }
});

// Time Update
audioElement.addEventListener('timeupdate', ()=>{ 
    let progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    myProgressBar.value = progress;

    let mins = Math.floor(audioElement.currentTime / 60);
    let secs = Math.floor(audioElement.currentTime % 60);
    if (secs < 10) secs = "0" + secs;
    if (isNaN(mins)) mins = "0";
    if (isNaN(secs)) secs = "00";
    currentTimeDisplay.innerText = `${mins}:${secs}`;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
});

volumeControl.addEventListener('change', (e) => {
    audioElement.volume = e.target.value / 100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songlistplay')).forEach((element)=>{
        let icon = element.querySelector('i');
        icon.classList.remove('fa-pause-circle');
        icon.classList.add('fa-play-circle');
    });
}

// List Item Click
Array.from(document.getElementsByClassName('songlistplay')).forEach((element)=>{
    element.querySelector('i').addEventListener('click', (e)=>{
        makeAllPlays();
        let index = parseInt(e.target.id);
        
        if(songIndex === index && !audioElement.paused) {
             audioElement.pause();
             e.target.classList.remove('fa-pause-circle');
             e.target.classList.add('fa-play-circle');
             masterPlay.classList.remove('fa-pause-circle');
             masterPlay.classList.add('fa-play-circle');
             gif.style.opacity = 0;
             toggleAnimations(false); // PAUSE ANIMATION
             return;
        }

        hasPlayedOnce = true;
        loadSong(index);
        audioElement.play();
        gif.style.opacity = 1;
        toggleAnimations(true); // START ANIMATION
        
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    });
});