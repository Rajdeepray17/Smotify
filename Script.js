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
let timeDisplay = document.getElementById('timeDisplay');
let shuffleBtn = document.getElementById('shuffleBtn');
let repeatBtn = document.getElementById('repeatBtn');
let searchInput = document.getElementById('searchInput');
let equalizer = document.getElementById('equalizer');
let lyricsBtn = document.getElementById('lyricsBtn');
let lyricsModal = document.getElementById('lyricsModal');
let closeLyricsBtn = document.getElementById('closeLyricsBtn');
let lyricsBody = document.getElementById('lyricsBody');
let lyricsTitle = document.getElementById('lyricsTitle');
let lyricsArtist = document.getElementById('lyricsArtist');

// Animation Element Target
let desktopMiddleLogo = document.getElementById('desktopMiddleLogo');

// State Variables
let isShuffle = false;
let isRepeat = false;
let hasPlayedOnce = false;
let isMuted = false;
let previousVolume = 100;
let isTTCoverSwitched = false;
const TT_SWITCH_TIME = 3 * 60 + 56;

// Toast Notification Function
function showToast(message, icon = '') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `${icon ? `<i class="${icon}"></i>` : ''} ${message}`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
} 

const songListRaw = [
    "Nanchaku", "Nalla Freestyle", "Asal G", "11K", "Naksha", "Namastute", 
    "Raat ki Rani", "Joint in the booth", "Lunch Break", "101", "Pankh", 
    "Shaktiman", "Kranti", "Champions", "Naam kaam sheher", "Natkhat", 
    "Khush nahi", "Gourmet Shit", "Seedhe Maut Anthem", "Red", 
    "Shakti aur Kshama", "Maar kaat", "Pickup", "Madira", "Pancake", 
    "Batti", "Maina", "Taakat", "Meri Baggi", "Hola Amigo", "Khatta Flow", 
    "Shutdown", "TT", "Luka Chippi", "MMM", "Hausla", "Nayaab", 
    "Class-sikh Maut Vol 2", "Teen Dost", "Sike", "Capital Rap", "Kohra", 
    "Uss din", "Toh kya", "Gandi Aulad", "Swah", "Sensitive", "Rahat", 
    "Do guna", "Chidiya Udd", "Anaadi", "Choti Soch", "Kodak", "Bure Din", 
    "Kya challa", "Fanne khan", "First place", "Akatsuki", "Kaanch ke ghar", 
    "Bhundfaad"
];

let songs = songListRaw.map((name) => {
    return {
        songName: name,
        artist: "Seedhe Maut",
        filePath: `Songs/${name}.mp3`, 
        coverPath: `Covers/${name}.jpg`
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
        <span class="songlistplay">
            <i id="${i}" class="far fa-play-circle fa-2x"></i>
            <img class="lyrics-icon-btn" src="Logo/Lyrics4.png" data-index="${i}" title="Lyrics" alt="Lyrics">
        </span>
    `;
    songItemContainer.appendChild(div);
});

audioElement.src = songs[0].filePath;

// --- Helper: Handle Animation Classes ---
function toggleAnimations(isPlaying) {
    if (isPlaying) {
        currentCoverImg.classList.add('beating');
        if(desktopMiddleLogo) desktopMiddleLogo.classList.add('logo-beating');
        if(equalizer) equalizer.classList.add('active');
    } else {
        currentCoverImg.classList.remove('beating');
        if(desktopMiddleLogo) desktopMiddleLogo.classList.remove('logo-beating');
        if(equalizer) equalizer.classList.remove('active');
    }
}

function loadSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    isTTCoverSwitched = false;
    
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

function getEffectiveCoverPath() {
    if (songs[songIndex].songName === 'TT' && isTTCoverSwitched) {
        return 'Covers/Shutdown.jpg';
    }

    return songs[songIndex].coverPath;
}

function getAbsoluteUrl(path) {
    try {
        return new URL(path, window.location.href).href;
    } catch (error) {
        return path;
    }
}

function setMediaActionHandler(action, handler) {
    try {
        navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
        // Action not supported in this browser
    }
}

// Update Media Session (for browser notifications)
function updateMediaSession() {
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        const artworkUrl = getAbsoluteUrl(getEffectiveCoverPath());
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songs[songIndex].songName,
            artist: songs[songIndex].artist,
            album: 'TBSM',
            artwork: [
                {
                    src: artworkUrl,
                    sizes: '256x256',
                    type: 'image/jpeg'
                },
                {
                    src: artworkUrl,
                    sizes: '512x512',
                    type: 'image/jpeg'
                }
            ]
        });

        // Set up media session action handlers
        setMediaActionHandler('play', () => {
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        });

        setMediaActionHandler('pause', () => {
            audioElement.pause();
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
        });

        setMediaActionHandler('nexttrack', () => {
            document.getElementById('next').click();
        });

        setMediaActionHandler('previoustrack', () => {
            document.getElementById('previous').click();
        });

        setMediaActionHandler('seekto', (details) => {
            if (details && typeof details.seekTime === 'number') {
                audioElement.currentTime = details.seekTime;
            }
        });
    }
}

audioElement.addEventListener('play', () => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
        updateMediaSession();
    }
});

audioElement.addEventListener('pause', () => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
    }
});

audioElement.addEventListener('loadedmetadata', () => {
    updateMediaSession();

    if ('mediaSession' in navigator && !isNaN(audioElement.duration)) {
        navigator.mediaSession.setPositionState({
            duration: audioElement.duration,
            playbackRate: audioElement.playbackRate,
            position: audioElement.currentTime
        });
    }
});

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
        showToast('Playing', 'fas fa-play');
        updateMediaSession(); // Update notification with song info
        
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
        showToast('Paused', 'fas fa-pause');
    }
})

// Shuffle Toggle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    showToast(isShuffle ? 'Shuffle ON' : 'Shuffle OFF', 'fas fa-random');
});

// Repeat Toggle
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
    showToast(isRepeat ? 'Repeat ON' : 'Repeat OFF', 'fas fa-redo');
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
    updateMediaSession(); // Update notification with next song info
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
    updateMediaSession(); // Update notification with previous song info
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

    let currentMins = Math.floor(audioElement.currentTime / 60);
    let currentSecs = Math.floor(audioElement.currentTime % 60);
    let totalMins = Math.floor(audioElement.duration / 60);
    let totalSecs = Math.floor(audioElement.duration % 60);
    
    if (currentSecs < 10) currentSecs = "0" + currentSecs;
    if (totalSecs < 10) totalSecs = "0" + totalSecs;
    if (isNaN(currentMins)) currentMins = "0";
    if (isNaN(currentSecs)) currentSecs = "00";
    if (isNaN(totalMins)) totalMins = "0";
    if (isNaN(totalSecs)) totalSecs = "00";
    
    timeDisplay.innerText = `${currentMins}:${currentSecs} / ${totalMins}:${totalSecs}`;

    if (songs[songIndex].songName === 'TT') {
        if (!isTTCoverSwitched && audioElement.currentTime >= TT_SWITCH_TIME) {
            isTTCoverSwitched = true;
            currentCoverImg.src = 'covers/Shutdown.jpg';
            updateMediaSession();
        } else if (isTTCoverSwitched && audioElement.currentTime < TT_SWITCH_TIME) {
            isTTCoverSwitched = false;
            currentCoverImg.src = songs[songIndex].coverPath;
            updateMediaSession();
        }
    }
    
    // Sync progress bar with Media Session API (notification)
    if ('mediaSession' in navigator && !isNaN(audioElement.duration)) {
        navigator.mediaSession.setPositionState({
            duration: audioElement.duration,
            playbackRate: audioElement.playbackRate,
            position: audioElement.currentTime
        });
    }
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
    
    // Immediately update Media Session position when user scrubs
    if ('mediaSession' in navigator && !isNaN(audioElement.duration)) {
        navigator.mediaSession.setPositionState({
            duration: audioElement.duration,
            playbackRate: audioElement.playbackRate,
            position: audioElement.currentTime
        });
    }
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
        updateMediaSession(); // Update notification with selected song info
        toggleAnimations(true); // START ANIMATION
        
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    });
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    // Spacebar for Play/Pause
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        masterPlay.click();
    }
    
    // Right Arrow for Forward 5 seconds
    if (e.code === 'ArrowRight') {
        e.preventDefault();
        audioElement.currentTime = Math.min(audioElement.currentTime + 5, audioElement.duration);
        showToast('Forward 5s', 'fas fa-forward');
    }
    
    // Left Arrow for Backward 5 seconds
    if (e.code === 'ArrowLeft') {
        e.preventDefault();
        audioElement.currentTime = Math.max(audioElement.currentTime - 5, 0);
        showToast('Backward 5s', 'fas fa-backward');
    }
    
    // Arrow Up for Volume Up
    if (e.code === 'ArrowUp') {
        e.preventDefault();
        let newVolume = Math.min(parseInt(volumeControl.value) + 10, 100);
        volumeControl.value = newVolume;
        audioElement.volume = newVolume / 100;
        showToast(`Volume: ${newVolume}%`, 'fas fa-volume-up');
    }
    
    // Arrow Down for Volume Down
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        let newVolume = Math.max(parseInt(volumeControl.value) - 10, 0);
        volumeControl.value = newVolume;
        audioElement.volume = newVolume / 100;
        showToast(`Volume: ${newVolume}%`, 'fas fa-volume-down');
    }
    
    // M for Mute/Unmute
    if (e.code === 'KeyM') {
        e.preventDefault();
        if (!isMuted) {
            previousVolume = volumeControl.value;
            volumeControl.value = 0;
            audioElement.volume = 0;
            isMuted = true;
            showToast('Muted', 'fas fa-volume-mute');
        } else {
            volumeControl.value = previousVolume;
            audioElement.volume = previousVolume / 100;
            isMuted = false;
            showToast('Unmuted', 'fas fa-volume-up');
        }
    }
    
    // N for Next
    if (e.code === 'KeyN') {
        e.preventDefault();
        document.getElementById('next').click();
        showToast('Next Song', 'fas fa-step-forward');
    }
    
    // P for Previous
    if (e.code === 'KeyP') {
        e.preventDefault();
        document.getElementById('previous').click();
        showToast('Previous Song', 'fas fa-step-backward');
    }
    
    // S for Shuffle
    if (e.code === 'KeyS') {
        e.preventDefault();
        shuffleBtn.click();
    }
    
    // R for Repeat
    if (e.code === 'KeyR') {
        e.preventDefault();
        repeatBtn.click();
    }
});

// Lyrics Functionality
function ensureLyricsElements() {
    if (!lyricsModal) lyricsModal = document.getElementById('lyricsModal');
    if (!lyricsBody) lyricsBody = document.getElementById('lyricsBody');
    if (!lyricsTitle) lyricsTitle = document.getElementById('lyricsTitle');
    if (!lyricsArtist) lyricsArtist = document.getElementById('lyricsArtist');
    if (!closeLyricsBtn) closeLyricsBtn = document.getElementById('closeLyricsBtn');

    if (lyricsModal && lyricsBody && lyricsTitle && lyricsArtist) {
        return true;
    }

    const modalMarkup = `
        <div id="lyricsModal" class="lyrics-modal">
            <div class="lyrics-content">
                <div class="lyrics-header">
                    <div class="lyrics-info">
                        <h2 id="lyricsTitle">Song Title</h2>
                        <p id="lyricsArtist">Artist Name</p>
                    </div>
                    <button id="closeLyricsBtn" class="close-lyrics-btn">&times;</button>
                </div>
                <div class="lyrics-body" id="lyricsBody">
                    <p style="text-align: center; color: #999;">Loading lyrics...</p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);
    lyricsModal = document.getElementById('lyricsModal');
    lyricsBody = document.getElementById('lyricsBody');
    lyricsTitle = document.getElementById('lyricsTitle');
    lyricsArtist = document.getElementById('lyricsArtist');
    closeLyricsBtn = document.getElementById('closeLyricsBtn');

    return !!(lyricsModal && lyricsBody && lyricsTitle && lyricsArtist);
}

function loadLyrics(index = songIndex) {
    if (!ensureLyricsElements()) {
        showToast('Lyrics UI not found', 'fas fa-exclamation');
        return;
    }

    if (songs[index].songName === 'Select a song to play') {
        showToast('Select a song first', 'fas fa-exclamation');
        return;
    }

    const lyricsPath = `Lyrics/${songs[index].songName}.txt`;
    
    fetch(lyricsPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lyrics not found');
            }
            return response.text();
        })
        .then(lyrics => {
            lyricsTitle.innerText = songs[index].songName;
            lyricsArtist.innerText = songs[index].artist;
            
            // Format lyrics with line breaks
            const formattedLyrics = lyrics
                .split('\n')
                .map(line => `<p>${line.trim()}</p>`)
                .join('');
            
            lyricsBody.innerHTML = formattedLyrics || '<p style="text-align: center; color: #999;">No lyrics available</p>';
            openLyricsModal();
            showToast('Lyrics loaded', 'fas fa-book');
        })
        .catch(error => {
            lyricsBody.innerHTML = '<p style="text-align: center; color: #ff6b6b;">Lyrics not found for this song</p>';
            lyricsTitle.innerText = songs[index].songName;
            lyricsArtist.innerText = songs[index].artist;
            openLyricsModal();
            showToast('Lyrics not available', 'fas fa-exclamation');
        });
}

function openLyricsModal() {
    if (!ensureLyricsElements()) return;
    lyricsModal.classList.add('active');
    lyricsModal.style.display = 'flex';
}

function closeLyricsModal() {
    if (!ensureLyricsElements()) return;
    lyricsModal.classList.remove('active');
    lyricsModal.style.display = '';
}

// Main lyrics button in controls
document.addEventListener('click', (e) => {
    const lyricsControl = e.target.closest('#lyricsBtn');
    if (lyricsControl) {
        loadLyrics();
        return;
    }

    const listLyrics = e.target.closest('.lyrics-icon-btn');
    if (listLyrics) {
        const index = parseInt(listLyrics.getAttribute('data-index'));
        loadLyrics(index);
        return;
    }

    if (e.target.closest('#closeLyricsBtn')) {
        closeLyricsModal();
        return;
    }

    if (e.target.id === 'lyricsModal') {
        closeLyricsModal();
    }
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const songItems = document.querySelectorAll('.songItem');
    
    songItems.forEach(item => {
        const songName = item.querySelector('.SongName').textContent.toLowerCase();
        if (songName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});