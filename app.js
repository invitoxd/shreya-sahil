
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const envelope = $("#envelope");
const openButton = $("#openInvite");
const tapNote = $("#tapNote");

function openInvitation() {
  envelope.classList.add("open");
  tapNote.textContent = "YOUR STORY BY THE SEA AWAITS";
  openButton.setAttribute("aria-label", "Invitation opened");
  setTimeout(() => {
    $("#hero").scrollIntoView({ behavior: "smooth" });
  }, 1500);
}

openButton.addEventListener("click", openInvitation);
$("#skipIntro").addEventListener("click", () => {
  $("#hero").scrollIntoView({ behavior: "smooth" });
});

// Reveal content as it enters the screen.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

$$(".reveal").forEach(element => observer.observe(element));

// Event information: only use confirmed details.
const events = {
  haldi: {
    date: "SATURDAY · 30 JANUARY",
    title: "Haldi",
    time: "1 PM onwards",
    location: "Coconut Grove · Caravela Beach Resort",
    dress: "DRESS CODE · BEACHSIDE FESTIVE CHIC"
  },
  cocktail: {
    date: "SATURDAY · 30 JANUARY",
    title: "Cocktail",
    time: "6:30 PM onwards",
    location: "Varca Ballroom · Caravela Beach Resort",
    dress: "DRESS CODE · BLACK TIE GLAMOUR"
  },
  chooda: {
    date: "SUNDAY · 31 JANUARY",
    title: "Chooda Ceremony",
    time: "10 AM onwards",
    location: "Lawns · Caravela Beach Resort",
    dress: "A MORNING WITH FAMILY"
  },
  sehra: {
    date: "SUNDAY · 31 JANUARY",
    title: "Sehrabandi",
    time: "11 AM",
    location: "Lawns · Caravela Beach Resort",
    dress: "A MOMENT BEFORE THE CELEBRATIONS"
  },
  baraat: {
    date: "SUNDAY · 31 JANUARY",
    title: "Baraat",
    time: "12 PM",
    location: "Venue to be confirmed",
    dress: "LET THE CELEBRATION BEGIN"
  },
  wedding: {
    date: "SUNDAY · 31 JANUARY",
    title: "The Wedding",
    time: "2 PM onwards",
    location: "Beach venue · exact location to be confirmed",
    dress: "DRESS CODE · IVORY & GOLD"
  },
  after: {
    date: "SUNDAY · 31 JANUARY",
    title: "Afterparty",
    time: "7 PM onwards",
    location: "Varca Ballroom · Caravela Beach Resort",
    dress: "DRESS CODE · BOLLYWOOD AFTER-DARK GLAM"
  }
};

function showEvent(key) {
  const event = events[key];
  if (!event) return;

  $("#eventDate").textContent = event.date;
  $("#eventTitle").textContent = event.title;
  $("#eventTime").textContent = event.time;
  $("#eventLocation").textContent = event.location;
  $("#eventDress").textContent = event.dress;

  const overlay = $("#eventOverlay");
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  $("#closeEvent").focus();
  document.body.style.overflow = "hidden";
}

function closeEvent() {
  const overlay = $("#eventOverlay");
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$(".event-point").forEach(button => {
  button.addEventListener("click", () => showEvent(button.dataset.event));
});
$("#closeEvent").addEventListener("click", closeEvent);
$("#eventOverlay").addEventListener("click", event => {
  if (event.target.id === "eventOverlay") closeEvent();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeEvent();
});

// Dress-code visual selector.
const dressDetails = {
  haldi: {
    label: "BEACHSIDE FESTIVE CHIC",
    background: "linear-gradient(145deg, #f7e6a7, #e9b88e 55%, #a8cdd7)",
    flower: "#d49b42"
  },
  cocktail: {
    label: "BLACK TIE GLAMOUR",
    background: "linear-gradient(145deg, #253b4b, #56697b 55%, #c8a879)",
    flower: "#e6c58b"
  },
  wedding: {
    label: "IVORY & GOLD",
    background: "linear-gradient(145deg, #f7f0df, #dfd2b8 55%, #c9aa79)",
    flower: "#c7a15c"
  },
  after: {
    label: "BOLLYWOOD AFTER-DARK GLAM",
    background: "linear-gradient(145deg, #332943, #7b496c 55%, #d08c82)",
    flower: "#e7b6b9"
  }
};

$$(".dress-option").forEach(button => {
  button.addEventListener("click", () => {
    $$(".dress-option").forEach(option => option.classList.remove("active"));
    button.classList.add("active");

    const details = dressDetails[button.dataset.dress];
    $("#fabricLabel").textContent = details.label;
    $("#fabricArt").style.background = details.background;
    $(".fabric-flower").style.color = details.flower;
  });
});

// Countdown to the first day of celebrations.
function updateCountdown() {
  const target = new Date("2027-01-30T13:00:00+05:30").getTime();
  const remaining = Math.max(0, target - Date.now());
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  $("#days").textContent = String(Math.floor(remaining / day)).padStart(3, "0");
  $("#hours").textContent = String(Math.floor((remaining % day) / hour)).padStart(2, "0");
  $("#minutes").textContent = String(Math.floor((remaining % hour) / minute)).padStart(2, "0");
  $("#seconds").textContent = String(Math.floor((remaining % minute) / second)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// WhatsApp RSVP with a prefilled message.
const phone = "919217799674";
const message = encodeURIComponent(
  "Hello Shreya and Sahil! I’m reaching out regarding your wedding celebrations in Goa on 30–31 January 2027. Please count me in for the celebrations!"
);
$("#rsvpLink").href = `https://wa.me/${phone}?text=${message}`;

// Scroll progress indicator.
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  $("#progress").style.width = `${progress}%`;
}, { passive: true });

// Optional music: add your licensed audio file as assets/music.mp3.
const music = $("#music");
music.src = "assets/music.mp3";
const musicButton = $("#musicToggle");

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicButton.innerHTML = "♫ <span>Music on</span>";
    } catch {
      musicButton.innerHTML = "♫ <span>Add music file</span>";
    }
  } else {
    music.pause();
    musicButton.innerHTML = "♫ <span>Music off</span>";
  }
});
