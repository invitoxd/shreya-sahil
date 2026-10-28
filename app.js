// Initialize Lucide Icons
lucide.createIcons();

// DOM Elements
const envelopeScreen = document.getElementById('envelope-screen');
const mainInvitation = document.getElementById('main-invitation');
const openBtn = document.getElementById('open-btn');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const rsvpForm = document.getElementById('rsvp-form');

let isPlaying = false;

// Open Invitation Logic
openBtn.addEventListener('click', () => {
    envelopeScreen.classList.add('hidden');
    mainInvitation.classList.remove('hidden');
    
    // Optional: Start music on open (Browsers require user interaction first)
    // bgMusic.play();
    // isPlaying = true;
    // musicIcon.classList.remove('opacity-50');
});

// Music Toggle Logic
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.add('opacity-50');
    } else {
        bgMusic.play();
        musicIcon.classList.remove('opacity-50');
    }
    isPlaying = !isPlaying;
});

// RSVP WhatsApp Logic
rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const guests = document.getElementById('guest-count').value;
    
    const message = `Hi! I'm ${name}. I am RSVPing for the wedding with ${guests} guest(s).`;
    
    // Replace 910000000000 with your actual WhatsApp number including country code
    const whatsappUrl = `https://wa.me/910000000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});
