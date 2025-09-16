document.addEventListener("DOMContentLoaded", () => {
  const spinButton = document.getElementById("spin-button");
  const wheel = document.querySelector(".wheel");
  const resultElement = document.getElementById("result");

  // Hadiah yang akan muncul di roda
  const prizes = [
    "Diskon 10%",
    "Zonk",
    "Diskon 50%",
    "1 Poin",
    "Minuman Gratis",
    "Diskon 20%",
    "2 Poin",
    "Diskon 50%",
  ];

  // Warna segmen yang lebih cerah dan kontras dengan teks putih
  const colors = [
    "#E53935", // Merah
    "#1E88E5", // Biru
    "#8E24AA", // Ungu
    "#43A047", // Hijau
    "#FDD835", // Kuning
    "#FB8C00", // Oranye
    "#00ACC1", // Cyan
    "#D81B60", // Pink
  ];

  // Fungsi untuk membuat segmen roda secara dinamis
  function createWheelSegments() {
    wheel.innerHTML = "";
    const numPrizes = prizes.length;
    const sliceAngle = 360 / numPrizes;
    const radius = Math.min(wheel.clientWidth, wheel.clientHeight) / 2;
    const labelOffset = radius * 0.6; // distance from center where labels sit
    const labelFontSize = window.innerWidth <= 480 ? 11 : 14;

    // Use conic-gradient for the wheel background (clean pie slices)
    const gradientStops = [];
    for (let i = 0; i < numPrizes; i++) {
      const start = i * sliceAngle;
      const end = start + sliceAngle;
      gradientStops.push(`${colors[i % colors.length]} ${start}deg ${end}deg`);
    }
    wheel.style.background = `conic-gradient(${gradientStops.join(", ")})`;

    // Create labels (separate elements) and place them along the radius
    // Each label contains an inner span; the inner span will be counter-rotated
    // during the wheel animation so text stays upright.
    const innerSpans = [];
    prizes.forEach((prize, index) => {
      const label = document.createElement("div");
      label.classList.add("wheel-label");
      label.style.fontSize = labelFontSize + "px";

      const inner = document.createElement("span");
      inner.classList.add("wheel-label-inner");
      inner.textContent = prize;
      inner.style.display = "inline-block";
      inner.style.transform = "rotate(0deg)";

      label.appendChild(inner);

      const angle = index * sliceAngle + sliceAngle / 2; // degrees
      const rad = ((angle - 90) * Math.PI) / 180;
      const x = Math.cos(rad) * labelOffset;
      const y = Math.sin(rad) * labelOffset;

      label.style.left = `calc(50% + ${x}px)`;
      label.style.top = `calc(50% + ${y}px)`;
      label.style.transform = "translate(-50%, -50%)";

      wheel.appendChild(label);
      innerSpans.push(inner);
    });

    // Store innerSpans on wheel for access during spin
    wheel._innerSpans = innerSpans;
  }

  // Fungsi untuk memutar roda
  let currentRotation = 0;
  let rafId = null;
  function getCurrentWheelRotation() {
    const st = window.getComputedStyle(wheel);
    const tm = st.transform || st.webkitTransform;
    if (tm && tm !== "none") {
      const values = tm.split("(")[1].split(")")[0].split(",");
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return angle;
    }
    return 0;
  }

  function spinWheel() {
    if (wheel._isSpinning) return;
    wheel._isSpinning = true;
    spinButton.disabled = true;
    resultElement.textContent = "";

    const numPrizes = prizes.length;
    const sliceAngle = 360 / numPrizes;
    const randomIndex = Math.floor(Math.random() * numPrizes);
    const prize = prizes[randomIndex];

    // Hitung sudut agar segmen yang dipilih berada di atas (pin)
    const extraSpins = 5; // Jumlah putaran tambahan
    const targetRotation =
      360 * extraSpins + (360 - randomIndex * sliceAngle - sliceAngle / 2);
    currentRotation = targetRotation;

    // start spin
    wheel.style.transition = "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // start RAF loop to counter-rotate inner labels so they remain upright
    function rafLoop() {
      const angle = getCurrentWheelRotation();
      if (wheel._innerSpans) {
        wheel._innerSpans.forEach((inner) => {
          inner.style.transform = `rotate(${-angle}deg)`;
        });
      }
      rafId = requestAnimationFrame(rafLoop);
    }
    rafLoop();

    function onTransitionEnd() {
      // stop RAF
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      wheel._isSpinning = false;
      resultElement.textContent = `Selamat! Kamu mendapatkan: ${prize}`;
      spinButton.disabled = false;
      wheel.removeEventListener("transitionend", onTransitionEnd);
    }

    wheel.addEventListener("transitionend", onTransitionEnd);
  }

  spinButton.addEventListener("click", spinWheel);
  createWheelSegments();

  // Handle responsive updates
  window.addEventListener("resize", createWheelSegments);
});
