document.addEventListener("DOMContentLoaded", () => {
  // NAV TOGGLE
  const toggle = document.querySelector(".kbms-nav-toggle");
  const nav = document.querySelector(".kbms-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
  }

  // SLIDER
  const container = document.querySelector(".kbms-slider");
  const track = document.querySelector(".kbms-slider__wrapper");
  if (container && track) {
    const slides = track.querySelectorAll(".kbms-slide");
    if (slides.length) {
      slides.forEach(s => {
        s.style.minWidth = "100%";
        s.style.flex = "0 0 100%";
      });

      let index = 0, dragging = false, startX = 0, deltaX = 0;
      let slideW = container.clientWidth;
      let autoTimer = null;

      const setX = (x, animate = false) => {
        track.style.transition = animate ? "transform 280ms ease-out" : "none";
        track.style.transform = `translate3d(${x}px,0,0)`;
      };
      const goTo = (i, animate = true) => {
        index = (i + slides.length) % slides.length;
        setX(-index * slideW, animate);
      };
      const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => goTo(index + 1, true), 5000);
      };
      const stopAuto = () => {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
      };

      goTo(0, false);
      startAuto();

      container.style.touchAction = "pan-y";
      container.addEventListener("pointerdown", (e) => {
        dragging = true;
        startX = e.clientX;
        deltaX = 0;
        stopAuto();
        setX(-index * slideW, false);
      });
      container.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        deltaX = e.clientX - startX;
        setX(-index * slideW + deltaX, false);
      });
      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        const thresh = Math.max(30, Math.min(80, slideW * 0.08));
        if (Math.abs(deltaX) > thresh) {
          goTo(deltaX < 0 ? index + 1 : index - 1, true);
        } else {
          goTo(index, true);
        }
        deltaX = 0;
        startAuto();
      };
      container.addEventListener("pointerup", endDrag);
      container.addEventListener("pointercancel", endDrag);
      container.addEventListener("pointerleave", endDrag);

      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") goTo(index - 1, true);
        if (e.key === "ArrowRight") goTo(index + 1, true);
      });
      window.addEventListener("resize", () => {
        slideW = container.clientWidth;
        goTo(index, false);
      });
    }
  }

  // SEARCH (gabungan suggestion + redirect)
  const searchInput = document.getElementById("q");
  const suggestionsList = document.getElementById("suggestions");
  const produk = [
    { name: "Tabungan", url: "tabungan.html" },
    { name: "Deposito", url: "produk-deposito.html" },
    { name: "Pembiayaan", url: "produk-pembiayaan.html" },
    { name: "Mobile Banking", url: "#" }
  ];

  if (searchInput && suggestionsList) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      suggestionsList.innerHTML = "";

      if (!query) {
        suggestionsList.style.display = "none";
        return;
      }
      const matches = produk.filter(p => p.name.toLowerCase().includes(query));
      if (!matches.length) {
        suggestionsList.style.display = "none";
        return;
      }
      matches.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.tabIndex = 0;
        li.addEventListener("click", () => {
          window.location.href = item.url;
        });
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter") window.location.href = item.url;
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".kbms-search")) {
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";
      }
    });

    document.querySelector(".kbms-search").addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.toLowerCase();
      const match = produk.find(p => p.name.toLowerCase().includes(query));
      if (match) window.location.href = match.url;
    });
  }
// TOGGLE DETAIL (Selengkapnya)
const toggleBtn = document.getElementById("toggle-selengkapnya");
const detailEl = document.getElementById("selengkapnya-sing-berkah");

if (toggleBtn && detailEl) {
  toggleBtn.addEventListener("click", () => {
    detailEl.open = !detailEl.open; // buka/tutup detail
    toggleBtn.textContent = detailEl.open ? "Tutup" : "Selengkapnya";
  });
}

  // FOOTER YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
