
document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const openEnvelopeButton = document.getElementById("openEnvelope");
  const enterInvitationButton = document.getElementById("enterInvitation");
  const mainContent = document.getElementById("mainContent");

  // ENVELOPE OPENING
  function openEnvelope() {
    if (opening.classList.contains("is-opening")) return;

    opening.classList.add("is-opening");

    window.setTimeout(() => {
      opening.classList.add("show-reveal");
    }, 700);
  }

  function enterInvitation() {
    opening.classList.add("is-finished");
    document.body.classList.remove("locked");
    mainContent.classList.add("is-visible");

    window.setTimeout(() => {
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  openEnvelopeButton.addEventListener("click", openEnvelope);
  enterInvitationButton.addEventListener("click", enterInvitation);

  // COUNTDOWN TO THE WEDDING: 31 JANUARY 2027, 2 PM IST
  const weddingDate = new Date("2027-01-31T14:00:00+05:30").getTime();

  function updateCountdown() {
    const remaining = weddingDate - Date.now();

    if (remaining <= 0) {
      document.getElementById("days").textContent = "000";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(3, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // SCRATCH-TO-REVEAL DATE
  const scratchCanvas = document.getElementById("scratchCanvas");
  const scratchCard = document.getElementById("scratchCard");
  const scratchHint = document.getElementById("scratchHint");
  const ctx = scratchCanvas.getContext("2d");

  let isScratching = false;
  let hasRevealed = false;
  let scratchCheckCounter = 0;

  function setupScratchCard() {
    const rect = scratchCard.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    scratchCanvas.width = Math.round(rect.width * dpr);
    scratchCanvas.height = Math.round(rect.height * dpr);
    scratchCanvas.style.width = `${rect.width}px`;
    scratchCanvas.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#dfeaf5");
    gradient.addColorStop(0.5, "#f7fbff");
    gradient.addColorStop(1, "#c8d9ea");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = "rgba(91, 117, 145, .25)";
    ctx.lineWidth = 1;

    for (let y = 12; y < rect.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#526e8b";
    ctx.textAlign = "center";
    ctx.font = "600 10px sans-serif";
    ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 8);

    ctx.font = "20px Georgia";
    ctx.fillText("✧  ✧  ✧", rect.width / 2, rect.height / 2 + 25);

    ctx.globalCompositeOperation = "destination-out";
  }

  function getScratchPosition(event) {
    const rect = scratchCanvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function scratch(event) {
    if (!isScratching || hasRevealed) return;

    const pos = getScratchPosition(event);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 21, 0, Math.PI * 2);
    ctx.fill();

    scratchCheckCounter++;

    if (scratchCheckCounter % 12 === 0) {
      checkScratchProgress();
    }
  }

  function checkScratchProgress() {
    if (hasRevealed) return;

    const pixels = ctx.getImageData(
      0, 0, scratchCanvas.width, scratchCanvas.height
    ).data;

    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++;
    }

    if (transparentPixels / totalPixels > 0.42) {
      revealScratchCard();
    }
  }

  function revealScratchCard() {
    if (hasRevealed) return;

    hasRevealed = true;
    scratchCanvas.style.transition = "opacity .5s ease";
    scratchCanvas.style.opacity = "0";
    scratchHint.textContent = "31 January 2027 — save the date!";
    scratchCanvas.style.pointerEvents = "none";
  }

  scratchCanvas.addEventListener("pointerdown", event => {
    if (hasRevealed) return;

    isScratching = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratch(event);
  });

  scratchCanvas.addEventListener("pointermove", scratch);

  scratchCanvas.addEventListener("pointerup", () => {
    isScratching = false;
    checkScratchProgress();
  });

  scratchCanvas.addEventListener("pointercancel", () => {
    isScratching = false;
  });

  setupScratchCard();

  window.addEventListener("resize", () => {
    if (!hasRevealed) setupScratchCard();
  });

  // WARDROBE PLANNER
  const wardrobeEvents = {
    haldi: {
      title: "Haldi",
      label: "DAY 1 · 30 JANUARY",
      time: "1 PM onwards · Coconut Grove"
    },
    cocktail: {
      title: "Cocktail",
      label: "DAY 1 · 30 JANUARY",
      time: "6:30 PM onwards · Varca Ballroom"
    },
    chooda: {
      title: "Chooda Ceremony",
      label: "DAY 2 · 31 JANUARY",
      time: "10 AM onwards · Lawns"
    },
    sehrabandi: {
      title: "Sehrabandi",
      label: "DAY 2 · 31 JANUARY",
      time: "11 AM · Lawns"
    },
    baraat: {
      title: "Baraat",
      label: "DAY 2 · 31 JANUARY",
      time: "12 PM"
    },
    wedding: {
      title: "Wedding & Pheras",
      label: "DAY 2 · 31 JANUARY",
      time: "2 PM onwards · Beach Venue"
    },
    afterparty: {
      title: "Afterparty",
      label: "DAY 2 · 31 JANUARY",
      time: "7 PM onwards · Varca Ballroom"
    }
  };

  const outfitNotes = document.getElementById("outfitNotes");
  const saveOutfitButton = document.getElementById("saveOutfit");
  const saveOutfitStatus = document.getElementById("saveOutfitStatus");

  let currentWardrobeEvent = "haldi";

  function readSavedData(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeSavedData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function loadOutfit(eventKey) {
    currentWardrobeEvent = eventKey;
    const event = wardrobeEvents[eventKey];

    document.getElementById("wardrobeEventLabel").textContent = event.label;
    document.getElementById("wardrobeEventTitle").textContent = event.title;
    document.getElementById("wardrobeEventTime").textContent = event.time;

    const savedNotes = readSavedData("ss-wedding-outfits", {});
    outfitNotes.value = savedNotes[eventKey] || "";
    saveOutfitStatus.textContent = "";

    document.querySelectorAll(".wardrobe-tab").forEach(tab => {
      const selected = tab.dataset.event === eventKey;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
  }

  document.querySelectorAll(".wardrobe-tab").forEach(tab => {
    tab.addEventListener("click", () => loadOutfit(tab.dataset.event));
  });

  saveOutfitButton.addEventListener("click", () => {
    const savedNotes = readSavedData("ss-wedding-outfits", {});
    savedNotes[currentWardrobeEvent] = outfitNotes.value;

    if (writeSavedData("ss-wedding-outfits", savedNotes)) {
      saveOutfitStatus.textContent = "Your outfit notes have been saved on this device.";
    } else {
      saveOutfitStatus.textContent = "Unable to save. Please check your browser settings.";
    }
  });

  loadOutfit("haldi");

  // PACKING CHECKLIST
  const defaultPackingItems = [
    { id: "clothes", text: "Outfits for all events", done: false },
    { id: "footwear", text: "Comfortable footwear", done: false },
    { id: "accessories", text: "Jewellery and accessories", done: false },
    { id: "toiletries", text: "Toiletries and skincare", done: false },
    { id: "chargers", text: "Phone charger and essentials", done: false },
    { id: "documents", text: "Travel documents and ID", done: false },
    { id: "medicines", text: "Personal medicines, if needed", done: false },
    { id: "sunglasses", text: "Sunglasses and sun protection", done: false }
  ];

  const packingList = document.getElementById("packingList");
  const packingInput = document.getElementById("packingInput");
  const addPackingItemButton = document.getElementById("addPackingItem");
  const clearPackingButton = document.getElementById("clearPacking");

  let packingItems = readSavedData("ss-wedding-packing", null);

  if (!Array.isArray(packingItems)) {
    packingItems = defaultPackingItems.map(item => ({ ...item }));
  }

  function savePacking() {
    const success = writeSavedData("ss-wedding-packing", packingItems);

    if (!success) {
      alert("The checklist could not be saved. Please check your browser settings.");
    }
  }

  function renderPackingList() {
    packingList.replaceChildren();

    packingItems.forEach(item => {
      const label = document.createElement("label");
      label.className = "packing-item" + (item.done ? " done" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(item.done);
      checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;
        savePacking();
        renderPackingList();
      });

      const text = document.createElement("span");
      text.textContent = item.text;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-packing";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${item.text}`);

      remove.addEventListener("click", () => {
        packingItems = packingItems.filter(entry => entry.id !== item.id);
        savePacking();
        renderPackingList();
      });

      label.append(checkbox, text, remove);
      packingList.appendChild(label);
    });
  }

  function addPackingItem() {
    const value = packingInput.value.trim();

    if (!value) {
      packingInput.focus();
      return;
    }

    packingItems.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: value,
      done: false
    });

    savePacking();
    renderPackingList();
    packingInput.value = "";
    packingInput.focus();
  }

  addPackingItemButton.addEventListener("click", addPackingItem);

  packingInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      addPackingItem();
    }
  });

  clearPackingButton.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Reset your packing checklist to the original items? Your custom items will be removed."
    );

    if (!confirmed) return;

    packingItems = defaultPackingItems.map(item => ({ ...item }));
    savePacking();
    renderPackingList();
  });

  renderPackingList();
});
