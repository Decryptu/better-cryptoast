let audioPlayed = false; // flag to ensure the audio only tries to play once

function playSong() {
  if (audioPlayed) return;

  let audio = new Audio('https://cdn.discordapp.com/attachments/1066833707941515326/1135228657418379274/Bring_Me_The_Horizon_-_Can_You_Feel_My_Heart.mp3');
  audio.loop = true;

  // Function to handle user interactions
  function interactionHandler() {
      audio.play().then(() => {
          audioPlayed = true;
          window.removeEventListener('scroll', interactionHandler);
          window.removeEventListener('click', interactionHandler);
      });
  }

  // Try playing immediately
  let playPromise = audio.play();
  if (playPromise) {
      playPromise.catch(error => {
          // If immediate play fails, set up event listeners for user interactions
          window.addEventListener('scroll', interactionHandler, { once: true });
          window.addEventListener('click', interactionHandler, { once: true });
      });
  } else {
      audioPlayed = true;
  }
}

function applyEffect() {
    let styleElement = document.createElement("style");
    styleElement.innerHTML = `
        @keyframes spinEffect {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        body {
            animation: spinEffect 2s linear infinite; // spins the website continuously every 2 seconds without any easing
        }
    `;
    document.head.appendChild(styleElement);
    playSong();  // Play the song when the effect is applied
}

function processCookie(value) {
    const keywords = ["dcrpt", "nico", "alex", "robin", "val", "valentin"];
    for (let keyword of keywords) {
        if (value.toLowerCase().includes(keyword)) {
            applyEffect();
            break;
        }
    }
}

// Ensure the body is present before attempting to modify its styles
if (document.body) {
    chrome.runtime.sendMessage({ action: "checkCookie" }, (response) => {
        if (response.success) {
            processCookie(response.cookieValue);
        }
    });
} else {
    document.addEventListener("DOMContentLoaded", function() {
        chrome.runtime.sendMessage({ action: "checkCookie" }, (response) => {
            if (response.success) {
                processCookie(response.cookieValue);
            }
        });
    });
}
