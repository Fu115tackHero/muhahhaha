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

  // Warna segmen yang lebih cerah dan kontras
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

  function createWheelSegments() {
    wheel.innerHTML = "";
    const numPrizes = prizes.length;
    const sliceAngle = 360 / numPrizes;

    prizes.forEach((prize, index) => {
      const segment = document.createElement("div");
      segment.classList.add("segment");

      // Set warna background dan rotasi segment
      segment.style.background = colors[index % colors.length];
      segment.style.transform = `rotate(${index * sliceAngle}deg)`;

      // Buat dan atur teks hadiah
      const prizeText = document.createElement("span");
      prizeText.textContent = prize;

      // Atur rotasi teks agar tetap terbaca
      const textRotation = -index * sliceAngle - sliceAngle / 2;
      prizeText.style.transform = `rotate(${textRotation}deg)`;

      // Sesuaikan ukuran teks
      const isMobile = window.innerWidth <= 480;
      const baseSize = isMobile ? 11 : 13;
      const fontSize = prize.length > 8 ? `${baseSize - 1}px` : `${baseSize}px`;
      prizeText.style.fontSize = fontSize;

      segment.appendChild(prizeText);
      wheel.appendChild(segment);
    });
  }

  // Fungsi untuk memutar roda
  let isSpinning = false;
  function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultElement.textContent = "";

    const numPrizes = prizes.length;
    const sliceAngle = 360 / numPrizes;
    const randomIndex = Math.floor(Math.random() * numPrizes);
    const prize = prizes[randomIndex];

    // Tambahkan putaran ekstra dan hitung sudut akhir
    const extraSpins = 5;
    const targetRotation =
      360 * extraSpins + (360 - randomIndex * sliceAngle - sliceAngle / 2);

    // Animasi putaran
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    // Tampilkan hasil setelah animasi selesai
    setTimeout(() => {
      resultElement.textContent = `Selamat! Kamu mendapatkan: ${prize}`;
      spinButton.disabled = false;
      isSpinning = false;
    }, 5000);
  }

  // Event listeners
  spinButton.addEventListener("click", spinWheel);
  window.addEventListener("resize", createWheelSegments);

  // Inisialisasi roda
  createWheelSegments();
});
