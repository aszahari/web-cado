// =======================
// ELEMENT REFERENCES
// =======================
const countdown  = document.getElementById("countdown");
const welcome    = document.getElementById("welcome");
const sticker    = document.getElementById("sticker");
const album      = document.getElementById("album");
const motivation = document.getElementById("motivation");

const text1     = document.getElementById("text1");
const motivText = document.getElementById("motivText");

const cover     = document.getElementById("cover");
const pageRight = document.getElementById("pageRight");
const pageLeft  = document.getElementById("pageLeft");
const hintText  = document.getElementById("hintText");

const loveCanvas  = document.getElementById("loveCanvas");
const spaceCanvas = document.getElementById("spaceCanvas");

// =======================
// UTILITY: TYPE EFFECT
// =======================
function typeText(el, text, speed = 50, callback = null) {
  let i = 0;
  el.innerHTML = "";
  function type() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i++);
      setTimeout(type, speed);
    } else if (callback) callback();
  }
  type();
}

// =======================
// CANVAS: LOVE MATRIX
// =======================
const lctx = loveCanvas.getContext("2d");
loveCanvas.width  = window.innerWidth;
loveCanvas.height = window.innerHeight;

const fontSize = 14;
let columns = Math.floor(loveCanvas.width / fontSize);
let drops   = Array.from({ length: columns }, () => Math.random() * loveCanvas.height);

function drawLove() {
  lctx.fillStyle = "rgba(0,0,0,0.08)";
  lctx.fillRect(0, 0, loveCanvas.width, loveCanvas.height);
  lctx.fillStyle = "#ff69b4";
  lctx.font = fontSize + "px Arial";
  for (let i = 0; i < drops.length; i++) {
    lctx.fillText("❤", i * fontSize, drops[i]);
    drops[i] += Math.random() * 10 + 5;
    if (drops[i] > loveCanvas.height) drops[i] = Math.random() * -100;
  }
}
setInterval(drawLove, 70);

// =======================
// CANVAS: SPACE
// =======================
const sctx = spaceCanvas.getContext("2d");
spaceCanvas.width  = window.innerWidth;
spaceCanvas.height = window.innerHeight;

const stars  = Array.from({ length: 100 }, () => ({
  x: Math.random() * spaceCanvas.width,
  y: Math.random() * spaceCanvas.height,
  size: Math.random() * 2
}));
const hearts = Array.from({ length: 15  }, () => ({
  x: Math.random() * spaceCanvas.width,
  y: Math.random() * spaceCanvas.height,
  speed: Math.random() + 0.3
}));

function drawSpace() {
  sctx.fillStyle = "black";
  sctx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
  sctx.fillStyle = "white";
  stars.forEach(s => sctx.fillRect(s.x, s.y, s.size, s.size));
  sctx.fillStyle = "#ff69b4";
  sctx.font = "14px Arial";
  hearts.forEach(h => {
    sctx.fillText("❤", h.x, h.y);
    h.y -= h.speed;
    if (h.y < 0) h.y = spaceCanvas.height;
  });
}
setInterval(drawSpace, 50);

// =======================
// BUKU: STATE
// =======================
let coverOpened  = false;
let pageFlipped  = false;

// -- Buka cover --
function openCover() {
  if (coverOpened) return;
  coverOpened = true;

  cover.classList.add("open");

  // Setelah animasi cover selesai, hilangkan & tampilkan hint flip
  setTimeout(() => {
    cover.style.display = "none";
    hintText.innerText  = "tap sisi kanan untuk buka halaman berikutnya 📖";
  }, 1400);
}

cover.addEventListener("click", openCover);

// -- Navigasi halaman --
//
// Saat BELUM flip:  klik pageRight → maju (flip ke halaman 2)
// Saat SUDAH flip:  pageRight secara fisik ada di KIRI buku
//                   → klik pageRight = mundur ke halaman 1
//                   → klik baseRight (foto4, sisi kanan) = lanjut ke motivasi

const baseRight = document.getElementById("baseRight");

pageRight.addEventListener("click", () => {
  if (!coverOpened) return;

  if (!pageFlipped) {
    // Maju: flip foto2 ke kiri, tampilkan foto3 (balik) + foto4 (kanan)
    pageRight.classList.add("flip");
    pageFlipped = true;
    hintText.innerText = "◀ kiri = kembali  |  kanan = lanjut ▶";
  } else {
    // pageRight kini ada di SISI KIRI (ter-flip) → klik = mundur
    pageRight.classList.remove("flip");
    pageFlipped = false;
    hintText.innerText = "tap sisi kanan untuk buka halaman berikutnya 📖";
  }
});

baseRight.addEventListener("click", () => {
  // Sisi kanan bawah (foto4) hanya aktif saat halaman sudah dibalik → lanjut motivasi
  if (!coverOpened || !pageFlipped) return;
  goToMotivation();
});

function goToMotivation() {
  album.style.display   = "none";
  motivation.classList.remove("hidden");
  loveCanvas.style.display  = "none";
  spaceCanvas.style.display = "block";
  setTimeout(() => {
    typeText(motivText, "Keep shining and have a beautiful day 💖", 60);
  }, 800);
}

// =======================
// ALUR UTAMA (TIMELINE)
// =======================
spaceCanvas.style.display = "none";

let count = 3;
const timer = setInterval(() => {
  count--;
  countdown.innerText = count;

  if (count === 0) {
    clearInterval(timer);
    countdown.style.display = "none";

    // -- STEP 1: SELAMAT PAGI --
    welcome.classList.remove("hidden");
    typeText(text1, "Selamat pagi sayanggg 💖", 70);

    // -- STEP 2: STIKER --
    setTimeout(() => {
      welcome.style.display = "none";
      sticker.classList.remove("hidden");
    }, 6000);

    // -- STEP 3: ALBUM – tampilkan cover dulu --
    setTimeout(() => {
      sticker.style.display = "none";
      album.classList.remove("hidden");
      hintText.innerText = "tap cover untuk membuka 💌";

      // Auto-buka cover setelah 3 detik jika tak ditekan
      setTimeout(() => {
        if (!coverOpened) openCover();
      }, 4000);

    }, 12000);

    // -- STEP 4: MOTIVASI dipicu manual (tap halaman terakhir) atau auto setelah 40 detik --
    setTimeout(() => {
      if (album.style.display !== "none") goToMotivation();
    }, 40000);
  }
}, 1000);

// -- RESPONSIF --
window.addEventListener("resize", () => {
  loveCanvas.width  = spaceCanvas.width  = window.innerWidth;
  loveCanvas.height = spaceCanvas.height = window.innerHeight;
});