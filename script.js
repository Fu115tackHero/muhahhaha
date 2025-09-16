document.addEventListener("DOMContentLoaded", (event) => {
  const scanButton = document.getElementById("scan-button");
  const qrReaderContainer = document.getElementById("qr-reader-container");
  const closeScannerButton = document.getElementById("close-scanner");
  const qrScannerLine = document.querySelector(".qr-scanner-line");

  let html5QrCode = null;

  const startScanner = () => {
    qrReaderContainer.style.display = "block";
    qrReaderContainer.classList.add("active");
    if (qrScannerLine) qrScannerLine.style.opacity = "1";
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

          // Arahkan ke halaman spinwheel.html dengan transisi
          document.body.classList.remove("page-loaded");
          setTimeout(() => {
            window.location.href = "spinwheel.html";
          }, 500); // Sesuaikan dengan durasi transisi CSS
        },
        (errorMessage) => {
          // Jangan lakukan apa-apa, ini untuk mencegah log error
        }
      )
      .catch((err) => {
        alert(`Gagal mengakses kamera: ${err}`);
        stopScanner();
      });
  };

  const stopScanner = () => {
    if (html5QrCode) {
      html5QrCode
        .stop()
        .then(() => {
          console.log("QR Code scanner stopped.");
        })
        .catch((err) => {
          console.log("Failed to stop scanner: ", err);
        });
      qrReaderContainer.style.display = "none";
      qrReaderContainer.classList.remove("active");
      if (qrScannerLine) qrScannerLine.style.opacity = "0";
      scanButton.style.display = "block";
    }
  };

  scanButton.addEventListener("click", startScanner);
  closeScannerButton.addEventListener("click", stopScanner);

  // Efek fade-in saat halaman dimuat
  document.body.classList.add("page-loaded");
});
