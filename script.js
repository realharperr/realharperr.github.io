document.addEventListener("DOMContentLoaded", () => {
    const enterScreen = document.getElementById('enter-screen');
    const content = document.getElementById('content');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicButton = document.getElementById('toggle-music');
    const typewriterText = document.getElementById('typewriter-text');
    const screamerImage = document.getElementById('screamer-image');
    const screamerSound = document.getElementById('screamer-sound');
    
    // НОВЫЙ ПЛЕЕР
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
    const trackTitleEl = document.getElementById('trackTitle');
    const trackArtistEl = document.getElementById('trackArtist');
    const trackCoverEl = document.getElementById('trackCover');

    let textIndex = 0;
    let musicClickCount = 0;
    let spaceClickCount = 0;
    const maxClicks = 50;
    const timeWindow = 2000;  // 2 seconds

    let lastClickTime = 0;

    // Данные о текущем треке
    const currentTrack = {
        title: "mist",
        artist: "sally",
        cover: "cover.png"
    };

    // Заполняем информацию о треке
    if (trackTitleEl) trackTitleEl.textContent = currentTrack.title;
    if (trackArtistEl) trackArtistEl.textContent = currentTrack.artist;
    if (trackCoverEl) trackCoverEl.src = currentTrack.cover;

    // Функция обновления иконки play/pause в новом плеере
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

    // Функция обновления старой кнопки (если нужна)
    function updateOldMusicButton() {
        if (!toggleMusicButton) return;
        if (backgroundMusic && !backgroundMusic.paused) {
            toggleMusicButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            toggleMusicButton.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    }

    function typeWriter(text, i, callback) {
        if (i < text.length) {
            typewriterText.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(() => typeWriter(text, i + 1, callback), 100);
        } else {
            setTimeout(() => {
                deleteWriter(text, i, callback);
            }, 2000);
        }
    }

    function deleteWriter(text, i, callback) {
        if (i > 0) {
            typewriterText.innerHTML = text.substring(0, i - 1) + '<span aria-hidden="true"></span>';
            setTimeout(() => deleteWriter(text, i - 1, callback), 100);
        } else {
            callback();
        }
    }

    function startTypeWriterAnimation() {
        typeWriter(texts[textIndex], 0, () => {
            textIndex = (textIndex + 1) % texts.length;
            startTypeWriterAnimation();
        });
    }

    function triggerScreamer() {
        if (!screamerSound || !screamerImage) return;
        screamerSound.volume = 1.0;
        screamerSound.play();
        screamerImage.style.display = 'flex';
        setTimeout(() => {
            screamerImage.style.display = 'none';
            screamerSound.pause();
            screamerSound.currentTime = 0;
        }, 5000);
    }

    // ОБЩАЯ ФУНКЦИЯ ДЛЯ ВКЛ/ВЫКЛ МУЗЫКИ (работает и для старой, и для новой кнопки)
    function toggleMusic() {
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        if (timeSinceLastClick > timeWindow) {
            musicClickCount = 0;
        }

        lastClickTime = now;

        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('play error:', e));
            musicClickCount++;
        } else {
            backgroundMusic.pause();
            musicClickCount++;
        }

        // Обновляем обе кнопки
        updateOldMusicButton();
        updatePlayPauseIcon();

        if (musicClickCount >= maxClicks) {
            triggerScreamer();
            musicClickCount = 0;
        }
    }

    // Обработчик для старой кнопки (если существует)
    if (toggleMusicButton) {
        toggleMusicButton.addEventListener('click', toggleMusic);
    }

    // Обработчик для НОВОЙ кнопки плеера
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Обновляем иконки при событиях аудио
    if (backgroundMusic) {
        backgroundMusic.addEventListener('play', () => {
            updateOldMusicButton();
            updatePlayPauseIcon();
        });
        backgroundMusic.addEventListener('pause', () => {
            updateOldMusicButton();
            updatePlayPauseIcon();
        });
    }

    // Вход по клику на экран приветствия
    enterScreen.addEventListener('click', () => {
        enterScreen.classList.add('fade-out');
        setTimeout(() => {
            enterScreen.remove();
            content.classList.remove('hidden');
            backgroundMusic.play().catch(e => console.log('auto-play blocked'));
            if (toggleMusicButton) toggleMusicButton.classList.remove('hidden');
            startTypeWriterAnimation();
        }, 1000);
    });

    // Пробел тоже управляет музыкой
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            toggleMusic();
            spaceClickCount++;
            if (spaceClickCount >= maxClicks) {
                triggerScreamer();
                spaceClickCount = 0;
            }
        }
    });

    // Инициализация иконок при загрузке
    updateOldMusicButton();
    updatePlayPauseIcon();
});

// ===== ТЕКСТЫ ДЛЯ ПЕЧАТКИ =====
const texts = [
    "꒰ঌ harperr ໒꒱",
    "ᡣ𐭩ᡣ𐭩ᡣ𐭩",
    "𖦹°｡⋆",
    "✶𓂅 ˚₳Ɽ₮ ฿Ɏ Ⱨ₳Ɽ₱ɆⱤⱤ ✶𓂅 ˚",
    "harperrzz",
    "mwah.",
    "i'm a mess, but i'm lovin' it",
    "...",
    "h. <3",
    "she's a dreamer",
    "nightdrive radio",
    "⋆˚࿔ 𝐧𝐢𝐠𝐡𝐭𝐜𝐨𝐫𝐞 𝜗𝜚˚⋆",
    "harperr archive",
    "✧ stay weird ✧",
    "just a ghost in the server",
    "soft girl era ✮",
    "⭑.ᐟ 2005 ⭑.ᐟ",
    "stream 'eternal sunshine'",
    "brat summer loading...",
    "iykyk",
    "chaos coordinator",
    "professional yapper",
    "energy: tired but wired",
    "glitter in my veins",
    "˗ˋˏ ♡ ˎˊ˗",
    "she/her/hers",
    "this is my roman empire",
    "vibes & villains",
    "coffee or death",
    "certified lover girl",
    "crying in the club (metaphorically)",
    "main character syndrome",
    "plot twist: i'm the problem",
    "soft launch to insanity",
    "fairy grunge princess",
    "lost but vibing",
    "sending you a song",
    "touch grass? never heard of her",
    "rat girl summer",
    "let them eat cake",
    "making chaos pretty",
    "revenge dress energy",
    "2025 girl",
    "&. she glitched.",
    "system: offline",
    "user is away",
    "loading pretty privilege...",
    "404: chill not found",
    "brat but make it pink",
    "knife theory enthusiast",
    "❝ stop being poor ❞ — me to myself",
    "100 gecs told me to",
    "who let me have wifi?",
    "censored for your safety",
    "ghosted by my own brain",
    "screenager",
    "your fave's fave",
    "annoying but in a cute way",
    "let me be your hyperfixation",
    "stalk me? ok but follow first.",
    "warning: may trauma dump",
    "sagittarius things",
    "soft and sour",
    "indie sleaze revival",
    "not a robot (prove me wrong)",
    "emoji addict 🎀✨🦇",
    "too weird to live, too rare to die",
    "harperr but make it gothic",
    "princess of the damned",
    "i put the 'fun' in dysfunctional",
    "certified yapper",
    "we listen and we don't judge",
    "pink cocaine (the vibe not the drug)",
    "hot girl bummer",
    "built different (neurospicy)",
    "rat bastard but make it fashion",
    "anti-hero but sexy",
    "sorry i'm late, i was dreaming",
    "she's a 10 but she's a meme lord",
    "will cry over fiction",
    "emotional support human",
    "don't perceive me",
    "yearning hours: 24/7",
    "cringe but free",
    "let's get weird",
    "unlovable? debatable.",
    "soft launch: insane arc",
    "revenge of the nerds (me)",
    "just a girl (iykyk)",
    "glitterbomb",
    "owned by cats",
    "rent free in your head",
    "send help (and money)",
    "aesthetic but make it chaotic",
    "typing…",
    "mood: 2000s emo",
    "pretending to be an adult",
    "certified freak (7 days a week)",
    "girl dinner",
    "eternally online",
    "don't test me i'll cry"
];

// ===== ИСКРЫ (СВЕТЯЩИЕСЯ ТОЧКИ ЗА МЫШКОЙ) =====
var colour = "#C71C4B";
var sparkles = 120;

var x = ox = 400;
var y = oy = 300;
var swide = 800;
var shigh = 600;
var sleft = sdown = 0;
var tiny = new Array();
var star = new Array();
var starv = new Array();
var starx = new Array();
var stary = new Array();
var tinyx = new Array();
var tinyy = new Array();
var tinyv = new Array();

window.onload = function() {
    if (document.getElementById) {
        var i, rats, rlef, rdow;
        for (var i = 0; i < sparkles; i++) {
            var rats = createDiv(3, 3);
            rats.style.visibility = "hidden";
            document.body.appendChild(tiny[i] = rats);
            starv[i] = 0;
            tinyv[i] = 0;
            var rats = createDiv(5, 5);
            rats.style.backgroundColor = "transparent";
            rats.style.visibility = "hidden";
            var rlef = createDiv(1, 5);
            var rdow = createDiv(5, 1);
            rats.appendChild(rlef);
            rats.appendChild(rdow);
            rlef.style.top = "2px";
            rlef.style.left = "0px";
            rdow.style.top = "0px";
            rdow.style.left = "2px";
            document.body.appendChild(star[i] = rats);
        }
        set_width();
        sparkle();
    }
};

function sparkle() {
    var c;
    if (x != ox || y != oy) {
        ox = x;
        oy = y;
        for (c = 0; c < sparkles; c++) {
            if (!starv[c]) {
                star[c].style.left = (starx[c] = x) + "px";
                star[c].style.top = (stary[c] = y) + "px";
                star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
                star[c].style.visibility = "visible";
                starv[c] = 50;
                break;
            }
        }
    }
    for (c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
    }
    setTimeout("sparkle()", 25);
}

function update_star(i) {
    if (--starv[i] == 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
    if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;
        if (stary[i] < shigh + sdown) {
            star[i].style.top = stary[i] + "px";
            starx[i] += (i % 15 - 0) / 5;
            star[i].style.left = starx[i] + "px";
        }
        else {
            star[i].style.visibility = "hidden";
            starv[i] = 0;
            return;
        }
    }
    else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
        tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
        tiny[i].style.width = "2px";
        tiny[i].style.height = "2px";
        star[i].style.visibility = "hidden";
        tiny[i].style.visibility = "visible";
    }
}

function update_tiny(i) {
    if (--tinyv[i] == 25) {
        tiny[i].style.width = "1px";
        tiny[i].style.height = "1px";
    }
    if (tinyv[i]) {
        tinyy[i] += 1 + Math.random() * 3;
        if (tinyy[i] < shigh + sdown) {
            tiny[i].style.top = tinyy[i] + "px";
            tinyx[i] += (i % 5 - 2) / 5;
            tiny[i].style.left = tinyx[i] + "px";
        }
        else {
            tiny[i].style.visibility = "hidden";
            tinyv[i] = 0;
            return;
        }
    }
    else tiny[i].style.visibility = "hidden";
}

document.onmousemove = mouse;

function mouse(e) {
    set_scroll();
    y = (e) ? e.pageY : event.y + sdown;
    x = (e) ? e.pageX : event.x + sleft;
}

function set_scroll() {
    if (typeof (self.pageYOffset) == "number") {
        sdown = self.pageYOffset;
        sleft = self.pageXOffset;
    }
    else if (document.body.scrollTop || document.body.scrollLeft) {
        sdown = document.body.scrollTop;
        sleft = document.body.scrollLeft;
    }
    else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        sleft = document.documentElement.scrollLeft;
        sdown = document.documentElement.scrollTop;
    }
    else {
        sdown = 0;
        sleft = 0;
    }
}

window.onresize = set_width;

function set_width() {
    if (typeof (self.innerWidth) == "number") {
        swide = self.innerWidth;
        shigh = self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientWidth) {
        swide = document.documentElement.clientWidth;
        shigh = document.documentElement.clientHeight;
    }
    else if (document.body.clientWidth) {
        swide = document.body.clientWidth;
        shigh = document.body.clientHeight;
    }
}

function createDiv(height, width) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.height = height + "px";
    div.style.width = width + "px";
    div.style.overflow = "hidden";
    div.style.backgroundColor = colour;
    return div;
}