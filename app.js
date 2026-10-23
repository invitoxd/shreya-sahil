
const $ = (id) => document.getElementById(id);

// Open the wedding invitation
const openButton = $("openInvitation");
const opening = $("opening");
const invitation = $("invitation");

if (openButton && opening && invitation) {
  openButton.addEventListener("click", () => {
    invitation.hidden = false;
    opening.classList.add("hide");
    document.body.style.overflow = "auto";

    setTimeout(() => {
      opening.style.display = "none";
    }, 950);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Gentle background music using browser-generated notes
let audioContext;
let musicTimer;
let musicOn = false;
let activeNotes = [];

const melody = [
  261.63, 329.63, 392.00, 329.63,
  293.66, 349.23, 440.00, 392.00,
  261.63, 329.63, 392.00, 523.25,
  440.00, 392.00, 329.63, 293.66
];

let noteIndex = 0;

function playNote() {
  if (!audioContext || !musicOn) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = melody[noteIndex % melody.length];
  noteIndex++;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 1.9);

  activeNotes.push(oscillator);

  oscillator.onended = () => {
    activeNotes = activeNotes.filter((note) => note !== oscillator);
  };
}

async function toggleMusic() {
  const musicButton = $("music");
  if (!musicButton) return;

  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }

    await audioContext.resume();
    musicOn = !musicOn;

    if (musicOn) {
      playNote();
      musicTimer = setInterval(playNote, 850);
      musicButton.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Pause music");
      musicButton.setAttribute("aria-pressed", "true");
    } else {
      clearInterval(musicTimer);
      activeNotes.forEach((note) => {
        try {
          note.stop();
        } catch (error) {
          // Note has already stopped.
        }
      });

      activeNotes = [];
      musicButton.textContent = "♫";
      musicButton.setAttribute("aria-label", "Play music");
      musicButton.setAttribute("aria-pressed", "false");
    }
  } catch (error) {
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Music unavailable");
  }
}

const musicButton = $("music");

if (musicButton) {
  musicButton.addEventListener("click", toggleMusic);
}
