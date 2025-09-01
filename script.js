document.addEventListener("DOMContentLoaded", () => {
  // ========================
  // NAV TOGGLE
  // ========================
  const toggle = document.querySelector(".kbms-nav-toggle");
  const nav = document.querySelector(".kbms-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  }

  // ========================
  // SLIDER
  // ========================
  const wrapper = document.querySelector(".kbms-slider__wrapper");
  if (!wrapper) {
    console.warn("Slider: .kbms-slider__wrapper tidak ditemukan — cek HTML/class name.");
  } else {
    const slides = wrapper.querySelectorAll(".kbms-slide");
    if (!slides || slides.length === 0) {
      console.warn("Slider: tidak ada .kbms-slide di dalam wrapper.");
    } else {
      let index = 0;
      let autoSlideTimer = null;
      let isDragging = false;
      let startX = 0;
      let deltaX = 0;
      const threshold = 50; // minimal jarak swipe

      function showSlide(i) {
        index = (i + slides.length) % slides.length;
        wrapper.style.transition = "transform 0.4s ease-in-out";
        wrapper.style.transform = `translateX(-${index * 100}%)`;
      }

      // inisialisasi
      wrapper.style.willChange = "transform";
      showSlide(0);

      // auto slide
      function startAuto() {
        stopAuto();
        autoSlideTimer = setInterval(() => showSlide(index + 1), 5000);
      }
      function stopAuto() {
        if (autoSlideTimer) {
          clearInterval(autoSlideTimer);
          autoSlideTimer = null;
        }
      }
      startAuto();

      // disable drag gambar
      wrapper.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));

      // pointer events (support mouse & touch)
      wrapper.addEventListener("pointerdown", (e) => {
        isDragging = true;
        startX = e.clientX;
        deltaX = 0;
        wrapper.style.transition = "none"; // matikan animasi saat tarik
        stopAuto();
        wrapper.setPointerCapture && wrapper.setPointerCapture(e.pointerId);
      });

      wrapper.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        deltaX = e.clientX - startX;
        wrapper.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`;
      });

      function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.transition = "transform 0.4s ease-in-out";

        if (Math.abs(deltaX) > threshold) {
          if (deltaX < 0) showSlide(index + 1);
          else showSlide(index - 1);
        } else {
          showSlide(index);
        }
        deltaX = 0;
        startAuto();
        try { wrapper.releasePointerCapture && wrapper.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      wrapper.addEventListener("pointerup", endDrag);
      wrapper.addEventListener("pointercancel", endDrag);
      wrapper.addEventListener("pointerleave", (e) => { if (isDragging) endDrag(e); });

      // keyboard (opsional)
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { showSlide(index - 1); stopAuto(); startAuto(); }
        if (e.key === "ArrowRight") { showSlide(index + 1); stopAuto(); startAuto(); }
      });

      // re-init saat resize
      window.addEventListener("resize", () => showSlide(index));
    }
  }

  // ========================
  // FOOTER YEAR
  // ========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
