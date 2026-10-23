
document.addEventListener("DOMContentLoaded", () => {
  const openingScreen = document.getElementById("openingScreen");
  const openButton = document.getElementById("openInvitation");
  const mainContent = document.getElementById("mainContent");

  // Open the wedding invitation
  if (openButton && openingScreen && mainContent) {
    openButton.addEventListener("click", () => {
      mainContent.classList.remove("hidden");
      document.body.classList.remove("no-scroll");

      openingScreen.classList.add("is-opening");

      window.setTimeout(() => {
        openingScreen.style.display = "none";
        document.getElementById("home")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 850);
    });
  }

  // Wedding countdown: 30 January 2027
  const weddingDate = new Date("2027-01-30T13:00:00+05:30").getTime();

  const countdownFields = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function updateCountdown() {
    const now = Date.now();
    let remaining = weddingDate - now;

    if (remaining <= 0) {
      Object.values(countdownFields).forEach((field) => {
        if (field) field.textContent = "00";
      });
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    remaining %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    remaining %= 1000 * 60 * 60;

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (countdownFields.days) {
      countdownFields.days.textContent = String(days).padStart(2, "0");
    }

    if (countdownFields.hours) {
      countdownFields.hours.textContent = String(hours).padStart(2, "0");
    }

    if (countdownFields.minutes) {
      countdownFields.minutes.textContent = String(minutes).padStart(2, "0");
    }

    if (countdownFields.seconds) {
      countdownFields.seconds.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Wardrobe Studio content
  const outfitData = {
    haldi: {
      eyebrow: "DAY ONE · AFTERNOON",
      title: "Beachside Festive Chic",
      description:
        "Think breezy silhouettes, playful colours and comfortable festive outfits made for a sunny Goan afternoon.",
      day: "DAY ONE",
      symbol: "✿",
      background: "#e7d7bf",
      colors: ["#e7b95d", "#f6e6b9", "#d5a07d", "#8b9d77"]
    },

    cocktail: {
      eyebrow: "DAY ONE · EVENING",
      title: "Black Tie Glamour",
      description:
        "Elegant gowns, tailored suits, statement accessories and sophisticated evening looks. Think polished, timeless and party-ready.",
      day: "DAY ONE",
      symbol: "✧",
      background: "#d6c7c2",
      colors: ["#202027", "#6b454b", "#b99a70", "#e8dfd0"]
    },

    traditional: {
      eyebrow: "DAY TWO · MORNING",
      title: "Traditional Festive",
      description:
        "Celebrate the rituals in beautiful Indian wear. Choose graceful silhouettes, festive colours and accessories that complete your look.",
      day: "DAY TWO",
      symbol: "❋",
      background: "#e8c9c1",
      colors: ["#9b3947", "#d6a45f", "#e9d9b8", "#b77c7b"]
    },

    wedding: {
      eyebrow: "DAY TWO · WEDDING",
      title: "Ivory & Gold",
      description:
        "Soft ivory, champagne, delicate gold details and flowing silhouettes create an elegant look for a beautiful wedding by the sea.",
      day: "DAY TWO",
      symbol: "♡",
      background: "#e7dfce",
      colors: ["#f1e9d7", "#d8bd86", "#c5a67c", "#b8a995"]
    },

    afterparty: {
      eyebrow: "DAY TWO · NIGHT",
      title: "Bollywood After-Dark Glam",
      description:
        "Bring the drama. Sequins, metallics, bold accessories and glamorous party outfits are perfect for dancing the night away.",
      day: "DAY TWO",
      symbol: "✦",
      background: "#d4c1cf",
      colors: ["#482d4e", "#b58ba8", "#d5b66b", "#202027"]
    }
  };

  const outfitTabs = document.querySelectorAll(".wardrobe-tab");
  const outfitEyebrow = document.getElementById("outfitEyebrow");
  const outfitTitle = document.getElementById("outfitTitle");
  const outfitDescription = document.getElementById("outfitDescription");
  const artDay = document.getElementById("artDay");
  const artSymbol = document.getElementById("artSymbol");
  const wardrobeArt = document.getElementById("wardrobeArt");
  const outfitPalette = document.getElementById("outfitPalette");
  const outfitNotes = document.getElementById("outfitNotes");
  const savedMessage = document.getElementById("savedMessage");

  let currentOutfit = "haldi";

  function loadOutfit(outfitKey) {
    const outfit = outfitData[outfitKey];
    if (!outfit) return;

    currentOutfit = outfitKey;

    if (outfitEyebrow) outfitEyebrow.textContent = outfit.eyebrow;
    if (outfitTitle) outfitTitle.textContent = outfit.title;
    if (outfitDescription) {
      outfitDescription.textContent = outfit.description;
    }
    if (artDay) artDay.textContent = outfit.day;
    if (artSymbol) artSymbol.textContent = outfit.symbol;

    if (wardrobeArt) {
      wardrobeArt.style.backgroundColor = outfit.background;
    }

    if (outfitPalette) {
      outfitPalette.replaceChildren();

      outfit.colors.forEach((color) => {
        const swatch = document.createElement("span");
        swatch.style.backgroundColor = color;
        swatch.setAttribute("aria-label", color);
        outfitPalette.appendChild(swatch);
      });
    }

    outfitTabs.forEach((tab) => {
      const isActive = tab.dataset.outfit === outfitKey;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    if (outfitNotes) {
      try {
        outfitNotes.value =
          localStorage.getItem(`ss-outfit-notes-${outfitKey}`) || "";
      } catch {
        outfitNotes.value = "";
      }
    }

    if (savedMessage) {
      savedMessage.textContent = "Your notes are saved on this device.";
    }
  }

  outfitTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      loadOutfit(tab.dataset.outfit);
    });
  });

  if (outfitNotes) {
    outfitNotes.addEventListener("input", () => {
      try {
        localStorage.setItem(
          `ss-outfit-notes-${currentOutfit}`,
          outfitNotes.value
        );

        if (savedMessage) {
          savedMessage.textContent = "Notes saved ✓";
        }
      } catch {
        if (savedMessage) {
          savedMessage.textContent =
            "Notes could not be saved in this browser.";
        }
      }
    });
  }

  loadOutfit("haldi");

  // Packing checklist with saved progress
  const packingItems = document.querySelectorAll(".packing-item");
  const packingCount = document.getElementById("packingCount");
  const packingProgress = document.getElementById("packingProgress");

  function updatePackingProgress() {
    let checkedCount = 0;

    packingItems.forEach((item, index) => {
      item.checked = item.checked;
      if (item.checked) checkedCount++;
    });

    const total = packingItems.length;
    const percentage = total ? (checkedCount / total) * 100 : 0;

    if (packingCount) {
      packingCount.textContent = `${checkedCount} of ${total} packed`;
    }

    if (packingProgress) {
      packingProgress.style.width = `${percentage}%`;
    }

    try {
      localStorage.setItem(
        "ss-packing-checklist",
        JSON.stringify(
          Array.from(packingItems, (item) => item.checked)
        )
      );
    } catch {
      // The checklist will still work until the page is refreshed.
    }
  }

  try {
    const savedPacking = JSON.parse(
      localStorage.getItem("ss-packing-checklist") || "[]"
    );

    packingItems.forEach((item, index) => {
      item.checked = Boolean(savedPacking[index]);
    });
  } catch {
    // Start with an unchecked checklist if saved data is unavailable.
  }

  packingItems.forEach((item) => {
    item.addEventListener("change", updatePackingProgress);
  });

  updatePackingProgress();
});
