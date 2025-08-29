document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".kbms-nav-toggle");
  const nav = document.querySelector(".kbms-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }
});

const wrapper = document.querySelector(".kbms-slider__wrapper");
const slides = document.querySelectorAll(".kbms-slide");
let index = 0;

let touchStartX = 0;
let touchEndX = 0;

// Fungsi untuk menampilkan slide
function showSlide(i) {
  if (i < 0) {
    index = slides.length - 1;
  } else if (i >= slides.length) {
    index = 0;
  }
  wrapper.style.transform = `translateX(${-index * 100}%)`;
}

// Fungsi untuk menangani gestur geser
function handleGesture() {
  const minSwipeDistance = 50;

  if (touchEndX < touchStartX - minSwipeDistance) {
    index++;
  }
  if (touchEndX > touchStartX + minSwipeDistance) {
    index--;
  }
  showSlide(index);
}

// Event listener sentuhan (mobile)
wrapper.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

wrapper.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

// Event listener mouse (desktop)
wrapper.addEventListener("mousedown", (e) => {
  touchStartX = e.clientX;
  document.addEventListener("mouseup", mouseUpHandler);
});

function mouseUpHandler(e) {
  touchEndX = e.clientX;
  handleGesture();
  document.removeEventListener("mouseup", mouseUpHandler);
}

// =========================================================
// AUTO SLIDE SETIAP 5 DETIK
// =========================================================
showSlide(index); // tampilkan slide awal
setInterval(() => {
  index++;
  showSlide(index);
}, 5000);
document.querySelectorAll(".kbms-slider img").forEach((img) => {
  img.setAttribute("draggable", "false");
});

// =========================================================
// SCRIPT UNTUK FITUR LAINNYA
// =========================================================
document.getElementById("year").textContent = new Date().getFullYear();
