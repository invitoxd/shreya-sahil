
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const opening = $("#openingScreen");
  const main = $("#mainContent");
  const scene = $("#envelopeScene");
  const openButton = $("#openInvitation");

  // Floating white petals on the opening screen.
  const petalLayer = $("#petalLayer");

  for (let i = 0; i < 17; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--size", `${7 + Math.random() * 9}px`);
    petal.style.setProperty("--duration", `${10 + Math.random() * 12}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 20}s`);
    petalLayer.appendChild(petal);
  }

  // Open the envelope, then reveal the website.
  openButton.addEventListener("click", () => {
    if (openButton.disabled) return;

    openButton.disabled = true;
    scene.classList.add("opening");
    openButton.textContent = "WITH LOVE, SHREYA & SAHIL";

    window.setTimeout(() => {
      scene.classList.add("opened");
    }, 850);

    window.setTimeout(() => {
      opening.classList.add("is-closing");
      main.classList.add("is-visible");
      main.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");

      window.setTimeout(() => {
        opening.hidden = true;
      }, 1200);
    }, 2100);
  });

  // Scratch-to-reveal date cards.
  function setupScratch(canvas) {
    const card = canvas.parentElement;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let scratching = false;
    let revealed = false;

    function paintCover() {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#dce6ee");
      gradient.addColorStop(0.5, "#c5d4e0");
      gradient.addColorStop(1, "#e5edf3");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,.75)";
      ctx.font = "10px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 + 4);

      ctx.globalCompositeOperation = "destination-out";
      revealed = false;
      canvas.classList.remove("revealed");
    }

    function reveal() {
      revealed = true;
      canvas.classList.add("revealed");
    }

    function scratch(event) {
      if (!scratching || revealed) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fill();

      try {
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let clear = 0;
        const total = Math.max(1, Math.floor(pixels.length / 4 / 100));

        for (let i = 3; i < pixels.length; i += 400) {
          if (pixels[i] < 30) clear++;
        }

        if (clear / total > 0.48) reveal();
      } catch (_) {
        // Scratching still works if pixel inspection is unavailable.
      }
    }

    canvas.addEventListener("pointerdown", event => {
      scratching = true;
      canvas.setPointerCapture?.(event.pointerId);
      scratch(event);
    });

    canvas.addEventListener("pointermove", scratch);

    ["pointerup", "pointercancel", "pointerleave"].forEach(name => {
      canvas.addEventListener(name, () => scratching = false);
    });

    const resizeObserver = new ResizeObserver(() => {
      if (!revealed) paintCover();
    });

    resizeObserver.observe(card);
    paintCover();

    return { reveal, reset: paintCover };
  }

  const scratchers = $$(".scratch-canvas").map(setupScratch);

  $("#revealDate").addEventListener("click", () => {
    scratchers.forEach(item => item.reveal());
  });

  // Countdown to 30 January 2027, using India Standard Time.
  const weddingDate = new Date("2027-01-30T00:00:00+05:30").getTime();

  function updateCountdown() {
    let remaining = Math.max(0, weddingDate - Date.now());

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    remaining %= 60000;

    const seconds = Math.floor(remaining / 1000);

    $("#days").textContent = String(days).padStart(2, "0");
    $("#hours").textContent = String(hours).padStart(2, "0");
    $("#minutes").textContent = String(minutes).padStart(2, "0");
    $("#seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Wardrobe event tabs.
  const wardrobe = {
    haldi: {
      day: "SATURDAY · 30 JANUARY",
      title: "Haldi",
      meta: "1:00 PM onwards · Coconut Grove",
      style: "Beachside festive chic",
      description: "Think breezy fabrics, relaxed silhouettes and a little sunshine. Choose something comfortable for an outdoor celebration.",
      colors: [
        ["#e8d5a5", "Soft gold"],
        ["#f5ead9", "Ivory"],
        ["#c4d5df", "Sea mist"],
        ["#c8b4a4", "Sand"]
      ]
    },
    cocktail: {
      day: "SATURDAY · 30 JANUARY",
      title: "Cocktail",
      meta: "6:30 PM onwards · Varca Ballroom",
      style: "Black tie glamour",
      description: "Polished eveningwear, elegant tailoring and refined accessories. A little shimmer is welcome.",
      colors: [
        ["#20242b", "Midnight"],
        ["#7b8795", "Slate"],
        ["#c8b7a1", "Champagne"],
        ["#d9dce1", "Silver"]
      ]
    },
    chooda: {
      day: "SUNDAY · 31 JANUARY",
      title: "Chooda Ceremony",
      meta: "10:00 AM onwards · Lawns",
      style: "Traditional festive",
      description: "Celebrate the morning in traditional festive attire, light layers and comfortable footwear for the lawns.",
      colors: [
        ["#d9a3ad", "Rose"],
        ["#f0dfc4", "Cream"],
        ["#b9c8b6", "Sage"],
        ["#d6b45e", "Gold"]
      ]
    },
    wedding: {
      day: "SUNDAY · 31 JANUARY",
      title: "Wedding & Pheras",
      meta: "2:00 PM onwards · Beach venue",
      style: "Ivory & gold",
      description: "Soft ivory, warm gold and graceful silhouettes for a beautiful seaside ceremony. Consider the beach setting when choosing footwear.",
      colors: [
        ["#f2eadb", "Ivory"],
        ["#d6bd82", "Gold"],
        ["#d8dfe4", "Pearl"],
        ["#aebfcb", "Blue-grey"]
      ]
    },
    afterparty: {
      day: "SUNDAY · 31 JANUARY",
      title: "Afterparty",
      meta: "7:00 PM onwards · Varca Ballroom",
      style: "Bollywood after-dark glam",
      description: "Go bold with party-ready silhouettes, statement details and comfortable dancing shoes.",
      colors: [
        ["#24232d", "Midnight"],
        ["#8a657b", "Berry"],
        ["#bda3bf", "Mauve"],
        ["#c8b06c", "Antique gold"]
      ]
    }
  };

  const notes = $("#outfitNotes");
  const noteKey = "shreyaSahilOutfitNotes";
  let activeWardrobe = "haldi";

  function loadNotes(key) {
    try {
      return JSON.parse(localStorage.getItem(noteKey) || "{}")[key] || "";
    } catch (_) {
      return "";
    }
  }

  function saveNotes(key, value) {
    try {
      const all = JSON.parse(localStorage.getItem(noteKey) || "{}");
      all[key] = value;
      localStorage.setItem(noteKey, JSON.stringify(all));
      $("#saveStatus").textContent = "Saved on this device.";
    } catch (_) {
      $("#saveStatus").textContent = "Notes will stay here while this page is open.";
    }
  }

  function showWardrobe(key) {
    activeWardrobe = key;
    const item = wardrobe[key];

    $("#wardrobeDay").textContent = item.day;
    $("#wardrobeTitle").textContent = item.title;
    $("#wardrobeMeta").textContent = item.meta;
    $("#wardrobeStyle").textContent = item.style;
    $("#wardrobeDescription").textContent = item.description;

    $("#wardrobeSwatches").replaceChildren(
      ...item.colors.map(([color, label]) => {
        const swatch = document.createElement("span");
        swatch.style.setProperty("--swatch", color);
        swatch.textContent = label;
        return swatch;
      })
    );

    notes.value = loadNotes(key);

    $$(".wardrobe-tab").forEach(tab => {
      const selected = tab.dataset.event === key;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
  }

  $$(".wardrobe-tab").forEach(tab => {
    tab.addEventListener("click", () => showWardrobe(tab.dataset.event));
  });

  notes.addEventListener("input", () => {
    saveNotes(activeWardrobe, notes.value);
  });

  showWardrobe("haldi");

  // Packing checklist with locally saved progress.
  const packingKey = "shreyaSahilPacking";
  let savedPacking = {};

  try {
    savedPacking = JSON.parse(localStorage.getItem(packingKey) || "{}");
  } catch (_) {}

  const checks = $$('#packingList input[type="checkbox"]');

  function updatePacking(save = true) {
    const done = checks.filter(check => check.checked).length;

    $("#packingCount").textContent = `${done} of ${checks.length}`;
    $("#packingBar").style.width = `${done / checks.length * 100}%`;

    if (save) {
      try {
        localStorage.setItem(
          packingKey,
          JSON.stringify(
            Object.fromEntries(checks.map(check => [check.value, check.checked]))
          )
        );
      } catch (_) {}
    }
  }

  checks.forEach(check => {
    check.checked = Boolean(savedPacking[check.value]);
    check.addEventListener("change", () => updatePacking());
  });

  updatePacking(false);

  $("#resetPacking").addEventListener("click", () => {
    checks.forEach(check => check.checked = false);
    updatePacking();
  });
})();
