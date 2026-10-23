
const $ = (id) => document.getElementById(id);

const opening = $("opening");
const invitation = $("invitation");
const scratchWrap = $("scratchWrap");
const canvas = $("scratchCanvas");
const openButton = $("openInvitation");
const scratchHint = $("scratchHint");
const scratchInstruction = $("scratchInstruction");

let isScratching = false;
let hasRevealed = false;
let lastPoint = null;
let ctx = null;

function setupScratchCard() {
  if (!canvas || !scratchWrap) return;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = scratchWrap.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;


  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvas.style.display = "block";
canvas.style.opacity = "1";
  ctx.globalCompositeOperation = "source-over";

  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#d9c49b");
  gradient.addColorStop(0.45, "#f1e4c9");
  gradient.addColorStop(1, "#b99a62");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  // Subtle metallic-looking pattern
  for (let i = 0; i < 140; i++) {
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;

    ctx.fillStyle = i % 2 ? "#ffffff35" : "#8e713c25";
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // A gentle hint printed on the scratch surface
  ctx.globalCompositeOperation = "source-over";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#685437";
  ctx.font = "12px Arial";
  ctx.fillText(
    "✧  SCRATCH TO REVEAL  ✧",
    rect.width / 2,
    rect.height / 2
  );
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function scratchAt(point) {
  if (!ctx || hasRevealed) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 34;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  if (lastPoint) {
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
  } else {
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + 0.1, point.y + 0.1);
  }

  ctx.stroke();
  lastPoint = point;

  checkScratchProgress();
}

function checkScratchProgress() {
  if (!ctx || hasRevealed) return;

  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;
  const totalPixels = pixels.length / 4;

  let transparentPixels = 0;

  // Sample pixels for a quick estimate of how much has been scratched
  const step = 16;

  for (let i = 3; i < pixels.length; i += 4 * step) {
    if (pixels[i] < 80) transparentPixels++;
  }

  const sampledPixels = Math.ceil(totalPixels / step);
  const progress = transparentPixels / sampledPixels;

  if (progress > 0.32) {
    revealScratchCard();
  }
}

function revealScratchCard() {
  if (hasRevealed) return;

  hasRevealed = true;

  if (canvas) {
    canvas.style.transition = "opacity 0.7s ease";
    canvas.style.opacity = "0";

    setTimeout(() => {
      canvas.style.display = "none";
    }, 750);
  }

  if (scratchHint) {
    scratchHint.textContent = "✧ Your invitation awaits ✧";
  }

  if (scratchInstruction) {
    scratchInstruction.textContent = "A beautiful celebration begins";
  }

  if (openButton) {
    openButton.disabled = false;
    openButton.classList.add("ready");
    openButton.innerHTML = 'OPEN YOUR INVITATION <span>↗</span>';
  }
}

if (canvas && scratchWrap) {
  canvas.addEventListener("pointerdown", (event) => {
    if (hasRevealed) return;

    isScratching = true;
    lastPoint = getPoint(event);

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture is optional.
    }

    scratchAt(lastPoint);
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isScratching || hasRevealed) return;

    scratchAt(getPoint(event));
    event.preventDefault();
  });

  function stopScratching() {
    isScratching = false;
    lastPoint = null;
  }

  canvas.addEventListener("pointerup", stopScratching);
  canvas.addEventListener("pointercancel", stopScratching);
  canvas.addEventListener("lostpointercapture", stopScratching);

  setupScratchCard();

  window.addEventListener("resize", () => {
    if (!hasRevealed) setupScratchCard();
  });
}

// Open the full wedding invitation after scratching
if (openButton && opening && invitation) {
  openButton.addEventListener("click", () => {
    if (!hasRevealed) return;

    invitation.hidden = false;
    opening.classList.add("hide");
    document.body.style.overflow = "auto";

    setTimeout(() => {
      opening.style.display = "none";
    }, 950);

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
