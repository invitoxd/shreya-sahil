
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ENVELOPE OPENING
  // ==========================================

  const envelopeScreen = document.getElementById("envelopeScreen");
  const opening = document.querySelector(".opening");
  const openInvitation = document.getElementById("openInvitation");
  const waxSeal = document.getElementById("waxSeal");

  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened || !opening) return;

    envelopeOpened = true;
    opening.classList.add("is-opening");

    // Reveal the invitation card after the envelope opens.
    window.setTimeout(() => {
      opening.classList.add("show-reveal");
    }, 900);
  }

  if (envelopeScreen) {
    envelopeScreen.addEventListener("click", openEnvelope);
    envelopeScreen.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openEnvelope();
      }
    });
  }

  if (waxSeal) {
    waxSeal.addEventListener("click", (event) => {
      event.stopPropagation();
      openEnvelope();
    });
  }

  if (openInvitation) {
    openInvitation.addEventListener("click", () => {
      if (!opening) return;

      opening.classList.add("is-finished");
      document.body.classList.remove("is-locked");

      window.setTimeout(() => {
        const home = document.getElementById("home");
        if (home) {
          home.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    });
  }

  // ==========================================
  // 2. WEDDING COUNTDOWN
  // ==========================================

  const weddingDate = new Date("2027-01-30T00:00:00+05:30");

  const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  function updateCountdown() {
    const now = Date.now();
    const difference = weddingDate.getTime() - now;

    if (difference <= 0) {
      Object.values(countdownElements).forEach((element) => {
        if (element) element.textContent = "00";
      });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );
    const seconds = Math.floor((difference / 1000) % 60);

    if (countdownElements.days) {
      countdownElements.days.textContent = String(days).padStart(2, "0");
    }

    if (countdownElements.hours) {
      countdownElements.hours.textContent = String(hours).padStart(2, "0");
    }

    if (countdownElements.minutes) {
      countdownElements.minutes.textContent = String(minutes).padStart(2, "0");
    }

    if (countdownElements.seconds) {
      countdownElements.seconds.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // ==========================================
  // 3. SCRATCH-TO-REVEAL DATE CARDS
  // ==========================================

  document.querySelectorAll(".scratch-card").forEach((card) => {
    const canvas = card.querySelector(".scratch-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let isScratching = false;
    let scratchedAway = false;

    function setupCanvas() {
      const rect = card.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));

      if (!width || !height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.globalCompositeOperation = "source-over";

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#a8bbc9");
      gradient.addColorStop(0.5, "#718da4");
      gradient.addColorStop(1, "#d3dce2");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      // A subtle decorative texture.
      context.fillStyle = "rgba(255,255,255,0.13)";

      for (let i = 0; i < 70; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        context.beginPath();
        context.arc(x, y, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "destination-out";
      scratchedAway = false;
      card.classList.remove("is-revealed");
    }

    function getPosition(event) {
      const rect = canvas.getBoundingClientRect();

      let clientX;
      let clientY;

      if (event.touches && event.touches.length) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    function scratch(event) {
      if (!isScratching || scratchedAway) return;

      const position = getPosition(event);

      context.beginPath();
      context.arc(position.x, position.y, 23, 0, Math.PI * 2);
      context.fill();

      // Reveal the card once enough of the surface has been scratched.
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      let transparentPixels = 0;
      let totalPixels = 0;
      const sampleStep = 32;

      for (let i = 3; i < pixels.length; i += sampleStep * 4) {
        totalPixels++;
        if (pixels[i] < 80) transparentPixels++;
      }

      if (totalPixels && transparentPixels / totalPixels > 0.42) {
        revealScratchCard();
      }
    }

    function revealScratchCard() {
      scratchedAway = true;
      isScratching = false;
      card.classList.add("is-revealed");
      canvas.style.transition = "opacity 450ms ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    }

    canvas.addEventListener("pointerdown", (event) => {
      if (scratchedAway) return;
      isScratching = true;
      canvas.setPointerCapture?.(event.pointerId);
      scratch(event);
    });

    canvas.addEventListener("pointermove", scratch);

    canvas.addEventListener("pointerup", () => {
      isScratching = false;
    });

    canvas.addEventListener("pointercancel", () => {
      isScratching = false;
    });

    setupCanvas();
  });

  // ==========================================
  // 4. WARDROBE STUDIO EVENT TABS
  // ==========================================

  const eventTabs = document.querySelectorAll("[data-event]");
  const outfitNote = document.getElementById("outfitNote");
  const saveLook = document.getElementById("saveLook");

  let activeEvent = "haldi";

  const outfitSuggestions = {
    haldi: {
      title: "Haldi — Beachside Festive Chic",
      ideas: [
        "A breezy co-ord set or a flowing festive outfit",
        "Comfortable sandals suitable for the lawn",
        "Lightweight jewellery and sunglasses",
        "An outfit that feels easy in Goa's warm weather",
      ],
    },
    cocktail: {
      title: "Cocktail — Black Tie Glamour",
      ideas: [
        "A formal gown, elegant dress, or tailored evening outfit",
        "Dress shoes or comfortable formal heels",
        "Statement earrings or understated evening jewellery",
        "A light wrap for the journey back to your room",
      ],
    },
    chooda: {
      title: "Chooda Ceremony",
      ideas: [
        "A graceful Indian festive outfit",
        "Comfortable footwear for the morning ceremony",
        "Light jewellery and a small essentials pouch",
      ],
    },
    wedding: {
      title: "Wedding — Ivory & Gold",
      ideas: [
        "An elegant ivory, gold, or wedding-appropriate festive outfit",
        "Dressy footwear suitable for the beach venue",
        "Jewellery that works comfortably throughout the ceremony",
        "Consider the beach setting when choosing your footwear",
      ],
    },
    afterparty: {
      title: "Afterparty — Bollywood After-Dark Glam",
      ideas: [
        "A glamorous party outfit you can dance in",
        "Comfortable party shoes",
        "A small bag for your phone and essentials",
        "Optional statement accessories for the evening",
      ],
    },
  };

  function showOutfit(eventName) {
    activeEvent = eventName;

    eventTabs.forEach((tab) => {
      const selected = tab.dataset.event === eventName;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });

    const suggestion = outfitSuggestions[eventName];

    const outfitTitle = document.getElementById("outfitTitle");
    const outfitIdeas = document.getElementById("outfitIdeas");

    if (suggestion && outfitTitle) {
      outfitTitle.textContent = suggestion.title;
    }

    if (suggestion && outfitIdeas) {
      outfitIdeas.replaceChildren();

      suggestion.ideas.forEach((idea) => {
        const item = document.createElement("li");
        item.textContent = idea;
        outfitIdeas.appendChild(item);
      });
    }

    if (outfitNote) {
      try {
        outfitNote.value =
          localStorage.getItem(`shreyaSahilNote_${eventName}`) || "";
      } catch (error) {
        outfitNote.value = "";
      }
    }

    if (saveLook) {
      saveLook.textContent = "Save my notes";
    }
  }

  eventTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showOutfit(tab.dataset.event);
    });
  });

  if (saveLook && outfitNote) {
    saveLook.addEventListener("click", () => {
      try {
        localStorage.setItem(
          `shreyaSahilNote_${activeEvent}`,
          outfitNote.value
        );
        saveLook.textContent = "Notes saved ✓";
      } catch (error) {
        saveLook.textContent = "Unable to save on this device";
      }
    });
  }

  if (eventTabs.length) {
    const initiallyActive =
      document.querySelector("[data-event].active") || eventTabs[0];
    showOutfit(initiallyActive.dataset.event);
  }

  // ==========================================
  // 5. PACKING CHECKLIST
  // ==========================================

  const packingItems = document.querySelectorAll("[data-pack]");
  const packingPercent = document.getElementById("packingPercent");
  const packingProgress = document.getElementById("packingProgress");
  const resetChecklist = document.getElementById("resetChecklist");

  const packingStorageKey = "shreyaSahilPackingChecklist";

  function readPackingState() {
    try {
      return JSON.parse(localStorage.getItem(packingStorageKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function updatePackingProgress() {
    const checkedCount = [...packingItems].filter(
      (item) => item.checked
    ).length;

    const percentage = packingItems.length
      ? Math.round((checkedCount / packingItems.length) * 100)
      : 0;

    if (packingPercent) {
      packingPercent.textContent = `${percentage}%`;
    }

    if (packingProgress) {
      packingProgress.style.width = `${percentage}%`;
      packingProgress.setAttribute("aria-valuenow", String(percentage));
    }
  }

  function savePackingState() {
    const state = {};

    packingItems.forEach((item, index) => {
      state[item.value || item.dataset.pack || String(index)] = item.checked;
    });

    try {
      localStorage.setItem(packingStorageKey, JSON.stringify(state));
    } catch (error) {
      // The checklist will still work until the page is refreshed.
    }

    updatePackingProgress();
  }

  const savedPackingState = readPackingState();

  packingItems.forEach((item, index) => {
    const key = item.value || item.dataset.pack || String(index);

    if (Object.prototype.hasOwnProperty.call(savedPackingState, key)) {
      item.checked = Boolean(savedPackingState[key]);
    }

    item.addEventListener("change", savePackingState);
  });

  updatePackingProgress();

  if (resetChecklist) {
    resetChecklist.addEventListener("click", () => {
      packingItems.forEach((item) => {
        item.checked = false;
      });

      savePackingState();
    });
  }

  // ==========================================
  // 6. OPTIONAL BACKGROUND MUSIC
  // ==========================================

  const music = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");

  if (music && musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          musicToggle.textContent = "Pause music";
          musicToggle.setAttribute("aria-pressed", "true");
        } catch (error) {
          musicToggle.textContent = "Tap to play music";
        }
      } else {
        music.pause();
        musicToggle.textContent = "Play music";
        musicToggle.setAttribute("aria-pressed", "false");
      }
    });

    music.addEventListener("ended", () => {
      musicToggle.textContent = "Play music";
      musicToggle.setAttribute("aria-pressed", "false");
    });
  }

  // ==========================================
  // 7. CURRENT YEAR (IF USED IN FOOTER)
  // ==========================================

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
