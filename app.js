
/* =========================================
   SHREYA & SAHIL — WEDDING WEBSITE
   Interactive functionality
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  /* =======================================
     1. ENVELOPE OPENING
     ======================================= */

  const openingScreen = $("#openingScreen");
  const envelopeScene = $("#envelope");
  const openButton = $("#openInvitation");
  const mainContent = $("#mainContent");

  function createPetals() {
    if (!openingScreen) return;

    // Avoid creating duplicate petals.
    if ($$(".petal", openingScreen).length) return;

    const petalCount = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? 0 : (window.innerWidth < 600 ? 9 : 17);

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.setAttribute("aria-hidden", "true");

      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty(
        "--petal-size",
        `${7 + Math.random() * 9}px`
      );
      petal.style.setProperty(
        "--petal-duration",
        `${10 + Math.random() * 10}s`
      );
      petal.style.setProperty(
        "--petal-delay",
        `${-Math.random() * 18}s`
      );

      openingScreen.appendChild(petal);
    }
  }

  createPetals();

  function openInvitation() {
    if (!openingScreen || !mainContent) return;

    if (openButton) {
      openButton.disabled = true;
      openButton.textContent = "Opening your invitation…";
    }

    if (envelopeScene) {
      envelopeScene.classList.add("opening");
    }

    // Let the flap open and card move out before revealing the site.
    window.setTimeout(() => {
      if (envelopeScene) {
        envelopeScene.classList.add("opened");
      }

      mainContent.classList.add("is-visible");

      window.setTimeout(() => {
        openingScreen.classList.add("is-closing");
        document.body.classList.remove("no-scroll");

        window.setTimeout(() => {
          openingScreen.style.display = "none";
          mainContent.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 1100);
      }, 450);
    }, 950);
  }

  if (openButton) {
    openButton.addEventListener("click", openInvitation);
  }

  /* =======================================
     2. COUNTDOWN
     Wedding begins 30 January 2027
     ======================================= */

  const countdownElements = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  const weddingDate = new Date("2027-01-30T13:00:00+05:30").getTime();

  function updateCountdown() {
    const remaining = weddingDate - Date.now();

    if (remaining <= 0) {
      if (countdownElements.days) {
        countdownElements.days.textContent = "00";
        countdownElements.hours.textContent = "00";
        countdownElements.minutes.textContent = "00";
        countdownElements.seconds.textContent = "00";
      }
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (countdownElements.days) {
      countdownElements.days.textContent = String(days).padStart(2, "0");
      countdownElements.hours.textContent = String(hours).padStart(2, "0");
      countdownElements.minutes.textContent = String(minutes).padStart(2, "0");
      countdownElements.seconds.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* =======================================
     3. SCRATCH-TO-REVEAL DATE
     ======================================= */

  const scratchCanvases = $$(".scratch-canvas");
  const scratchContext = new WeakMap();

  function setupScratchCanvas(canvas) {
    const panel = canvas.parentElement;
    if (!panel) return;

    const answer = $(".scratch-answer", panel);
    if (!answer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = panel.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Soft powder-blue scratch surface.
    ctx.fillStyle = "#dce6ee";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // A subtle layered paper-like texture.
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.lineWidth = 1;

    for (let y = 7; y < rect.height; y += 13) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = "#607a91";
    ctx.font = "500 10px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "SCRATCH TO REVEAL",
      rect.width / 2,
      rect.height / 2
    );

    ctx.globalCompositeOperation = "destination-out";

    scratchContext.set(canvas, {
      ctx,
      width: rect.width,
      height: rect.height,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      revealed: false,
      dpr
    });
  }

  function revealCanvas(canvas) {
    const state = scratchContext.get(canvas);
    if (!state || state.revealed) return;

    state.revealed = true;
    canvas.classList.add("is-revealed");
    canvas.setAttribute("aria-label", "Date revealed");
  }

  function scratchAt(canvas, x, y) {
    const state = scratchContext.get(canvas);
    if (!state || state.revealed) return;

    const { ctx } = state;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 30;

    ctx.beginPath();
    ctx.moveTo(state.lastX, state.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    state.lastX = x;
    state.lastY = y;
  }

  function getScratchPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  scratchCanvases.forEach((canvas) => {
    setupScratchCanvas(canvas);

    canvas.addEventListener("pointerdown", (event) => {
      const state = scratchContext.get(canvas);
      if (!state || state.revealed) return;

      state.isDrawing = true;

      const position = getScratchPosition(canvas, event);
      state.lastX = position.x;
      state.lastY = position.y;

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (_) {
        // Pointer capture may be unavailable in some browsers.
      }

      scratchAt(canvas, position.x, position.y);
    });

    canvas.addEventListener("pointermove", (event) => {
      const state = scratchContext.get(canvas);
      if (!state || !state.isDrawing || state.revealed) return;

      const position = getScratchPosition(canvas, event);
      scratchAt(canvas, position.x, position.y);
    });

    function stopScratching() {
      const state = scratchContext.get(canvas);
      if (state) state.isDrawing = false;
    }

    canvas.addEventListener("pointerup", stopScratching);
    canvas.addEventListener("pointercancel", stopScratching);
    canvas.addEventListener("lostpointercapture", stopScratching);

    canvas.addEventListener("pointerup", () => {
      const state = scratchContext.get(canvas);
      if (!state || state.revealed) return;

      // Reveal automatically after enough of the surface is scratched.
      try {
        const pixels = state.ctx.getImageData(
          0, 0,
          canvas.width,
          canvas.height
        ).data;

        let transparent = 0;
        const total = pixels.length / 4;
        const sampleStep = 32;

        for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
          if (pixels[i] < 100) transparent++;
        }

        const sampled = Math.ceil(total / sampleStep);

        if (transparent / sampled > 0.34) {
          revealCanvas(canvas);
        }
      } catch (_) {
        // The guest can still use the Reveal everything button.
      }
    });
  });

  const revealAllButton = $("#revealAll");

  if (revealAllButton) {
    revealAllButton.addEventListener("click", () => {
      scratchCanvases.forEach(revealCanvas);
    });
  }

  // Rebuild scratch canvases if their layout changes.
  let resizeTimer;

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      scratchCanvases.forEach((canvas) => {
        if (!canvas.classList.contains("is-revealed")) {
          setupScratchCanvas(canvas);
        }
      });
    }, 180);
  });

  /* =======================================
     4. WARDROBE PLANNER
     ======================================= */

  const wardrobeEvents = {
    haldi: {
      day: "DAY ONE · 30 JANUARY",
      title: "Haldi",
      time: "1:00 PM onwards",
      venue: "Coconut Grove",
      dress: "Beachside Festive Chic",
      description:
        "Think breezy silhouettes, festive details and effortless coastal elegance.",
      swatches: [
        ["#E7C86E", "Sunshine"],
        ["#F6E7C9", "Ivory"],
        ["#A8C4C7", "Sea Glass"],
        ["#D99A83", "Terracotta"]
      ]
    },

    cocktail: {
      day: "DAY ONE · 30 JANUARY",
      title: "Cocktail",
      time: "6:30 PM onwards",
      venue: "Varca Ballroom",
      dress: "Black Tie Glamour",
      description:
        "Elegant eveningwear, refined tailoring and statement accessories for a glamorous night.",
      swatches: [
        ["#202832", "Midnight"],
        ["#66788A", "Blue Grey"],
        ["#D6D1D0", "Silver"],
        ["#F2E8D9", "Champagne"]
      ]
    },

    chooda: {
      day: "DAY TWO · 31 JANUARY",
      title: "Chooda Ceremony",
      time: "10:00 AM onwards",
      venue: "Lawns",
      dress: "Festive Daywear",
      description:
        "Choose graceful traditional or contemporary Indian wear in soft, celebratory colours.",
      swatches: [
        ["#D9B7C5", "Rose"],
        ["#E8DCC9", "Sand"],
        ["#9EAF9B", "Sage"],
        ["#D5B8A4", "Blush"]
      ]
    },

    sehrabandi: {
      day: "DAY TWO · 31 JANUARY",
      title: "Sehrabandi",
      time: "11:00 AM",
      venue: "Lawns",
      dress: "Traditional Festive Wear",
      description:
        "A polished traditional look with comfortable footwear for the day's celebrations.",
      swatches: [
        ["#E8DFCF", "Ivory"],
        ["#8C9FB0", "Slate Blue"],
        ["#B8A1B8", "Mauve"],
        ["#C7AD81", "Gold"]
      ]
    },

    baraat: {
      day: "DAY TWO · 31 JANUARY",
      title: "Baraat",
      time: "12:00 PM",
      venue: "Venue details to be confirmed",
      dress: "Festive Indian Wear",
      description:
        "Opt for a festive, comfortable outfit that works well for an outdoor celebration.",
      swatches: [
        ["#C7AD81", "Gold"],
        ["#E7E0D6", "Ivory"],
        ["#9DADBA", "Blue Grey"],
        ["#C8A7A1", "Dusty Rose"]
      ]
    },

    wedding: {
      day: "DAY TWO · 31 JANUARY",
      title: "Wedding & Pheras",
      time: "2:00 PM onwards",
      venue: "Beach venue",
      dress: "Ivory & Gold",
      description:
        "An elegant coastal wedding palette. Think flowing silhouettes, ivory tones and subtle gold accents.",
      swatches: [
        ["#F3EEE3", "Ivory"],
        ["#D8C7A0", "Soft Gold"],
        ["#C5D4DB", "Sea Mist"],
        ["#D7DCE0", "Pearl Grey"]
      ]
    },

    afterparty: {
      day: "DAY TWO · 31 JANUARY",
      title: "Afterparty",
      time: "7:00 PM onwards",
      venue: "Varca Ballroom",
      dress: "Bollywood After-Dark Glam",
      description:
        "Bring the drama with party-ready silhouettes, sparkle and confident evening styling.",
      swatches: [
        ["#252A35", "Midnight"],
        ["#6D526E", "Plum"],
        ["#BFA36A", "Gold"],
        ["#9A7181", "Berry"]
      ]
    }
  };

  const wardrobeFields = {
    day: $("#wardrobeDay"),
    title: $("#wardrobeTitle"),
    time: $("#wardrobeTime"),
    venue: $("#wardrobeVenue"),
    dress: $("#wardrobeDress"),
    description: $("#wardrobeDescription"),
    swatches: $("#wardrobeSwatches"),
    notes: $("#outfitNotes"),
    status: $("#notesStatus")
  };

  let currentWardrobeEvent = "haldi";

  function notesStorageKey(eventKey) {
    return `shreyaSahilOutfitNotes_${eventKey}`;
  }

  function loadOutfitNotes(eventKey) {
    if (!wardrobeFields.notes) return;

    try {
      wardrobeFields.notes.value =
        localStorage.getItem(notesStorageKey(eventKey)) || "";
    } catch (_) {
      wardrobeFields.notes.value = "";
    }
  }

  function renderSwatches(swatches) {
    if (!wardrobeFields.swatches) return;

    wardrobeFields.swatches.replaceChildren();

    swatches.forEach(([color, name]) => {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      swatch.style.setProperty("--swatch", color);

      const label = document.createElement("span");
      label.textContent = name;

      swatch.appendChild(label);
      wardrobeFields.swatches.appendChild(swatch);
    });
  }

  function selectWardrobeEvent(eventKey) {
    const event = wardrobeEvents[eventKey];
    if (!event) return;

    currentWardrobeEvent = eventKey;

    if (wardrobeFields.day) wardrobeFields.day.textContent = event.day;
    if (wardrobeFields.title) wardrobeFields.title.textContent = event.title;
    if (wardrobeFields.time) wardrobeFields.time.textContent = event.time;
    if (wardrobeFields.venue) wardrobeFields.venue.textContent = event.venue;
    if (wardrobeFields.dress) wardrobeFields.dress.textContent = event.dress;

    if (wardrobeFields.description) {
      wardrobeFields.description.textContent = event.description;
    }

    renderSwatches(event.swatches);
    loadOutfitNotes(eventKey);

    if (wardrobeFields.status) {
      wardrobeFields.status.textContent =
        "Your notes are saved on this device.";
    }

    $$(".wardrobe-tab").forEach((tab) => {
      const active = tab.dataset.event === eventKey;

      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  }

  $$(".wardrobe-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectWardrobeEvent(tab.dataset.event);
    });
  });

  // Allow guests to move between tabs with the arrow keys.
  $$(".wardrobe-tab").forEach((tab, index, tabs) => {
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else return;

      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
  });

  if (wardrobeFields.notes) {
    wardrobeFields.notes.addEventListener("input", () => {
      try {
        localStorage.setItem(
          notesStorageKey(currentWardrobeEvent),
          wardrobeFields.notes.value
        );

        if (wardrobeFields.status) {
          wardrobeFields.status.textContent = "Notes saved ✓";
        }
      } catch (_) {
        if (wardrobeFields.status) {
          wardrobeFields.status.textContent =
            "Notes cannot be saved in this browser session.";
        }
      }
    });
  }

  selectWardrobeEvent("haldi");

  /* =======================================
     5. PACKING CHECKLIST
     ======================================= */

  const packingList = $("#packingList");
  const packingProgress = $("#packingProgress");
  const packingProgressBar = $("#packingProgressBar");
  const resetPackingButton = $("#resetPacking");

  const packingStorageKey = "shreyaSahilPackingChecklist";

  function loadPackingState() {
    try {
      return JSON.parse(localStorage.getItem(packingStorageKey) || "{}");
    } catch (_) {
      return {};
    }
  }

  function savePackingState() {
    if (!packingList) return;

    const state = {};

    $$('input[type="checkbox"]', packingList).forEach((checkbox) => {
      state[checkbox.value] = checkbox.checked;
    });

    try {
      localStorage.setItem(packingStorageKey, JSON.stringify(state));
    } catch (_) {
      // Checklist remains usable even when storage is unavailable.
    }

    updatePackingProgress();
  }

  function updatePackingProgress() {
    if (!packingList) return;

    const boxes = $$('input[type="checkbox"]', packingList);
    const checked = boxes.filter((box) => box.checked).length;
    const total = boxes.length;

    if (packingProgress) {
      packingProgress.textContent = `${checked} / ${total}`;
    }

    if (packingProgressBar) {
      packingProgressBar.style.width =
        `${total ? (checked / total) * 100 : 0}%`;
    }
  }

  if (packingList) {
    const savedState = loadPackingState();

    $$('input[type="checkbox"]', packingList).forEach((checkbox) => {
      checkbox.checked = Boolean(savedState[checkbox.value]);

      checkbox.addEventListener("change", savePackingState);
    });

    updatePackingProgress();
  }

  if (resetPackingButton && packingList) {
    resetPackingButton.addEventListener("click", () => {
      $$('input[type="checkbox"]', packingList).forEach((checkbox) => {
        checkbox.checked = false;
      });

      savePackingState();
    });
  }

  /* =======================================
     6. BACKGROUND MUSIC
     ======================================= */

  const music = $("#weddingMusic");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");

  function updateMusicButton(isPlaying) {
    if (!musicToggle) return;

    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause background music" : "Play background music"
    );

    if (musicLabel) {
      musicLabel.textContent = isPlaying ? "Pause music" : "Play music";
    }
  }

  if (music && musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          updateMusicButton(true);
        } catch (_) {
          updateMusicButton(false);

          if (musicLabel) {
            musicLabel.textContent = "Add music file";
          }
        }
      } else {
        music.pause();
        updateMusicButton(false);
      }
    });

    music.addEventListener("play", () => updateMusicButton(true));
    music.addEventListener("pause", () => updateMusicButton(false));
    music.addEventListener("ended", () => updateMusicButton(false));
  }

  /* =======================================
     7. RSVP WHATSAPP BUTTON
     ======================================= */

  const rsvpButton = $("#rsvpButton");

  if (rsvpButton) {
    const phoneNumber = "919217799674";
    const message = encodeURIComponent(
      "Hello! I would like to confirm my presence for Shreya & Sahil's wedding on 30–31 January 2027 in Goa."
    );

    rsvpButton.href =
      `https://wa.me/${phoneNumber}?text=${message}`;

    rsvpButton.target = "_blank";
    rsvpButton.rel = "noopener noreferrer";
  }
});
