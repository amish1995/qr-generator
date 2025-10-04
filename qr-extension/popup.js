let qr;

// Normalize links
function normalizeURL(url) {
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

// Load saved colors on popup open
window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["colorDark", "colorLight"], (data) => {
    if (data.colorDark) {
      document.getElementById("colorDark").value = data.colorDark;
    }
    if (data.colorLight) {
      document.getElementById("colorLight").value = data.colorLight;
    }
  });
});

document.getElementById("generate").addEventListener("click", () => {
  const input = document.getElementById("link").value;
  const colorDark = document.getElementById("colorDark").value;
  const colorLight = document.getElementById("colorLight").value;

  if (!input) {
    alert("Enter something!");
    return;
  }

  // Save chosen colors
  chrome.storage.local.set({ colorDark, colorLight });

  const url = normalizeURL(input);

  // Clear old QR
  document.getElementById("qrcode").innerHTML = "";

  // Generate QR with saved colors
  qr = new QRCode(document.getElementById("qrcode"), {
    text: url,
    width: 300,
    height: 300,
    colorDark: colorDark,
    colorLight: colorLight,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Beautify container
  const qrContainer = document.getElementById("qrcode");
  qrContainer.style.padding = "10px";
  qrContainer.style.background = "#fff";
  qrContainer.style.borderRadius = "20px";
  qrContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";

  // Add logo overlay
  setTimeout(() => {
    const canvas = qrContainer.querySelector("canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");

      const logo = new Image();
      logo.src = "logo.png";  // fallback logo
      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.fillStyle = "white";
        ctx.fillRect(x - 5, y - 5, size + 10, size + 10);
        ctx.drawImage(logo, x, y, size, size);
      };
    }
  }, 300);
});

document.getElementById("download").addEventListener("click", () => {
  if (!qr) {
    alert("Generate a QR first!");
    return;
  }

  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) {
    alert("QR not ready yet, try again!");
    return;
  }

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "qr-code.png";
  a.click();
});
