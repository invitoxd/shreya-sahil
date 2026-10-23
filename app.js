// Floating Petals Animation
function createPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 10 + 8;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.top = `-10%`;
        petal.style.animationDuration = `${Math.random() * 6 + 6}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(petal);
    }
}

// Background Audio Controls
const bgMusic = document.getElementById('bg-music');
const audioToggle = document.getElementById('audio-toggle');
const iconPlay = document.getElementById('audio-icon-play');
const iconPause = document.getElementById('audio-icon-pause');
let isPlaying = false;

function toggleAudio() {
    if (isPlaying) {
        if (bgMusic) bgMusic.pause();
        if (iconPlay) iconPlay.classList.remove('hidden');
        if (iconPause) iconPause.classList.add('hidden');
        isPlaying = false;
    } else {
        if (bgMusic) {
            bgMusic.play().then(() => {
                if (iconPlay) iconPlay.classList.add('hidden');
                if (iconPause) iconPause.classList.remove('hidden');
                isPlaying = true;
            }).catch(e => console.log("Audio play blocked:", e));
        }
    }
}

// Open Envelope Interactive Animation
function openEnvelope() {
    const envelopeScreen = document.getElementById('envelope-screen');
    const envelopeBox = document.getElementById('envelope-box');
    const mainInvitation = document.getElementById('main-invitation');

    if (!isPlaying && bgMusic) {
        bgMusic.play().then(() => {
            if (iconPlay) iconPlay.classList.add('hidden');
            if (iconPause) iconPause.classList.remove('hidden');
            isPlaying = true;
        }).catch(e => console.log("Audio play blocked:", e));
    }

    if (envelopeBox) envelopeBox.classList.add('envelope-open');

    setTimeout(() => {
        if (envelopeScreen) envelopeScreen.style.opacity = '0';
        setTimeout(() => {
            if (envelopeScreen) envelopeScreen.style.display = 'none';
            if (mainInvitation) mainInvitation.classList.remove('opacity-0', 'pointer-events-none');
            initScratchCard();
        }, 800);
    }, 900);
}

// Day Switcher Tabs
function switchDay(day) {
    const tab1 = document.getElementById('tab-day1');
    const tab2 = document.getElementById('tab-day2');
    const content1 = document.getElementById('content-day1');
    const content2 = document.getElementById('content-day2');

    if (day === 1) {
        if (tab1) tab1.className = "px-6 py-2.5 font-serif text-xs tracking-[0.2em] uppercase rounded-full bg-navy text-white shadow-sm transition-all duration-300";
        if (tab2) tab2.className = "px-6 py-2.5 font-serif text-xs tracking-[0.2em] uppercase rounded-full bg-powder-light text-navy-muted hover:text-navy transition-all duration-300";
        if (content1) content1.classList.remove('hidden');
        if (content2) content2.classList.add('hidden');
    } else {
        if (tab2) tab2.className = "px-6 py-2.5 font-serif text-xs tracking-[0.2em] uppercase rounded-full bg-navy text-white shadow-sm transition-all duration-300";
        if (tab1) tab1.className = "px-6 py-2.5 font-serif text-xs tracking-[0.2em] uppercase rounded-full bg-powder-light text-navy-muted hover:text-navy transition-all duration-300";
        if (content2) content2.classList.remove('hidden');
        if (content1) content1.classList.add('hidden');
    }
}

// Canvas Scratch Card Implementation
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#c4d7ec';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f1e2e';
    ctx.font = '13px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here or drag to reveal', canvas.width / 2, canvas.height / 2 + 5);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2, false);
        ctx.fill();

        checkScratchPercentage();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => isDrawing = false);

    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchmove', scratch);
    window.addEventListener('touchend', () => isDrawing = false);
}

function checkScratchPercentage() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) cleared++;
    }
    if (cleared > (imageData.data.length / 4) * 0.4) {
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.style.display = 'none', 600);
    }
}

function revealDateDirectly() {
    const canvas = document.getElementById('scratch-canvas');
    if (canvas) {
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        setTimeout(() => canvas.style.display = 'none', 600);
    }
}

// Real-Time IST Countdown Timer (Target: 31 January 2027 00:00:00 IST)
const weddingDate = new Date('2027-01-31T00:00:00+05:30').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysElem = document.getElementById('days');
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');

    if (distance < 0) {
        if (daysElem) daysElem.innerText = '00';
        if (hoursElem) hoursElem.innerText = '00';
        if (minutesElem) minutesElem.innerText = '00';
        if (secondsElem) secondsElem.innerText = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysElem) daysElem.innerText = String(days).padStart(2, '0');
    if (hoursElem) hoursElem.innerText = String(hours).padStart(2, '0');
    if (minutesElem) minutesElem.innerText = String(minutes).padStart(2, '0');
    if (secondsElem) secondsElem.innerText = String(seconds).padStart(2, '0');
}

// Direct WhatsApp RSVP Handler
function sendWhatsAppRSVP() {
    const phoneNumber = '919217799674';
    const message = encodeURIComponent("Hello! I would like to RSVP for Shreya & Sahil's wedding celebrations on 30–31 January 2027 in Goa.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
