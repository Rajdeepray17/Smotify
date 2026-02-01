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

// State Variables
let isShuffle = false;
let isRepeat = false;
let hasPlayedOnce = false; // To track if we are in "Static Portrait" mode

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

// Setup Initial Audio (Don't update Big Display yet)
audioElement.src = songs[0].filePath;

function loadSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    
    // Update Bottom Player (Always)
    masterSongName.innerText = songs[songIndex].songName;
    
    // Update Big Player (Only if we have started playing)
    if (hasPlayedOnce) {
        bigSongName.innerText = songs[songIndex].songName;
        bigArtistName.innerText = songs[songIndex].artist;
        currentCoverImg.src = songs[songIndex].coverPath;
    }

    // Reset Icons
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
        // First play interaction: Switch from Static Portrait to Song Cover
        if (!hasPlayedOnce) {
            hasPlayedOnce = true;
            loadSong(songIndex); // Refresh UI to show cover
        }
        
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
        
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

// Next Button Logic (Includes Shuffle)
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
    
    hasPlayedOnce = true; // Ensure UI updates
    loadSong(songIndex);
    audioElement.play();
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
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
});

// Auto Play Next (Handle Repeat & Shuffle)
audioElement.addEventListener('ended', () => {
    if (isRepeat) {
        // Just play again
        audioElement.currentTime = 0;
        audioElement.play();
    } else {
        // Trigger Next Click
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
             return;
        }

        hasPlayedOnce = true; // User clicked a song, switch UI
        loadSong(index);
        audioElement.play();
        gif.style.opacity = 1;
        
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    });
});