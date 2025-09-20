document.addEventListener("DOMContentLoaded", (event) => {
  const scanButton = document.getElementById("scan-button");
  const qrReaderContainer = document.getElementById("qr-reader-container");
  const closeScannerButton = document.getElementById("close-scanner");
  const qrScannerLine = document.querySelector(".qr-scanner-line");

  let html5QrCode = null;

  const startScanner = () => {
    // Tampilkan kontainer pemindai dan sembunyikan tombol scan segera setelah klik
    qrReaderContainer.style.display = "block";
    scanButton.style.display = "none";

    html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText, decodedResult) => {
          console.log(`QR Code berhasil dipindai: ${decodedText}`);
          stopScanner();

          document.body.classList.remove("page-loaded");
          setTimeout(() => {
            window.location.href = "spinwheel.html";
          }, 500);
        },
        (errorMessage) => {
          // Abaikan error saat pemindaian
        }
      )
      .then(() => {
        // Jika pemindai berhasil dimulai, barulah aktifkan animasi garis
        qrReaderContainer.classList.add("active");
        if (qrScannerLine) qrScannerLine.style.opacity = "1";
      })
      .catch((err) => {
        // Jika ada error (misalnya, izin ditolak), segera sembunyikan semuanya
        alert(`Gagal mengakses kamera: ${err}`);
        // Panggil stopScanner untuk membersihkan UI
        stopScanner();
      });
  };

  const stopScanner = () => {
    if (html5QrCode) {
      // Panggil .stop() hanya jika html5QrCode ada
      html5QrCode
        .stop()
        .then(() => {
          console.log("QR Code scanner stopped.");
        })
        .catch((err) => {
          console.log("Failed to stop scanner: ", err);
        });
    }

    // Pastikan semua elemen terkait pemindai disembunyikan
    qrReaderContainer.style.display = "none";
    qrReaderContainer.classList.remove("active");
    if (qrScannerLine) qrScannerLine.style.opacity = "0";
    scanButton.style.display = "block";
  };

  scanButton.addEventListener("click", startScanner);
  closeScannerButton.addEventListener("click", stopScanner);

  document.body.classList.add("page-loaded");
});
