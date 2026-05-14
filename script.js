document.addEventListener("DOMContentLoaded", () => {
    const enterScreen = document.getElementById('enter-screen');
    const content = document.getElementById('content');
    const backgroundMusic = document.getElementById('background-music');
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    const trackTitleEl = document.getElementById('trackTitle');
    const trackArtistEl = document.getElementById('trackArtist');
    const trackCoverEl = document.getElementById('trackCover');

    const currentTrack = {
        title: "hollywood baby",
        artist: "sally",
        cover: "cover.png"
    };

    if (trackTitleEl) trackTitleEl.textContent = currentTrack.title;
    if (trackArtistEl) trackArtistEl.textContent = currentTrack.artist;
    if (trackCoverEl) trackCoverEl.src = currentTrack.cover;

    function updatePlayPauseIcon() {
        if (!playPauseIcon) return;
        if (backgroundMusic && !backgroundMusic.paused) {
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    }

    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('play error:', e));
        } else {
            backgroundMusic.pause();
        }
        updatePlayPauseIcon();
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    if (backgroundMusic) {
        backgroundMusic.addEventListener('play', updatePlayPauseIcon);
        backgroundMusic.addEventListener('pause', updatePlayPauseIcon);
    }

    enterScreen.addEventListener('click', () => {
        enterScreen.classList.add('fade-out');
        setTimeout(() => {
            enterScreen.remove();
            content.classList.remove('hidden');
            backgroundMusic.play().catch(e => console.log('auto-play blocked'));
            updatePlayPauseIcon();
        }, 1000);
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            toggleMusic();
        }
    });

    updatePlayPauseIcon();
});