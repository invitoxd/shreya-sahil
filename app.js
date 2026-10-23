
const $ = (id) => document.getElementById(id);

const opening = $("opening");
const invitation = $("invitation");
const waxSeal = $("waxSeal");
const envelope = $("envelope");

if (waxSeal && opening && invitation) {
  waxSeal.addEventListener("click", () => {
    if (opening.classList.contains("is-opening")) return;

    opening.classList.add("is-opening");

    setTimeout(() => {
      opening.style.display = "none";
      invitation.hidden = false;
      document.body.style.overflow = "auto";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  });
}
