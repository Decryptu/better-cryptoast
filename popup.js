document.getElementById("searchForm").addEventListener("submit", (event) => {
	event.preventDefault();

	const searchQuery = document.getElementById("searchInput").value;
	const url = `https://www.google.com/search?q=site:cryptoast.fr+${encodeURIComponent(searchQuery)}`;

	// Open the URL in a new tab
	chrome.tabs.create({ url: url });
});

const countdownContainer = document.querySelector("#countdown");

const TARGET_BLOCK_HEIGHT = 1050000;
const AVERAGE_BLOCK_TIME = 600; // In seconds (10 minutes)

// This will be the time in seconds till the halving event.
let timeTillHalving = 0;

function fetchCurrentBlockHeight() {
	return fetch("https://blockchain.info/q/getblockcount")
		.then((response) => response.text())
		.then((currentBlockHeight) => {
			const blocksLeft = TARGET_BLOCK_HEIGHT - currentBlockHeight;
			timeTillHalving = blocksLeft * AVERAGE_BLOCK_TIME;
		});
}

function updateCountdown() {
	timeTillHalving = Math.max(timeTillHalving - 1, 0);

	const days = Math.floor(timeTillHalving / 60 / 60 / 24);
	const hours = Math.floor((timeTillHalving / 60 / 60) % 24);
	const minutes = Math.floor((timeTillHalving / 60) % 60);
	const seconds = Math.floor(timeTillHalving % 60);

	countdownContainer.innerHTML = `
        <div class="time-segment">
          <span class="number">${days.toString().padStart(2, "0")}</span>
          <span class="time-unit">jour${days !== 1 ? "s" : ""}</span>
        </div>
        :
        <div class="time-segment">
          <span class="number">${hours.toString().padStart(2, "0")}</span>
          <span class="time-unit">heure${hours !== 1 ? "s" : ""}</span>
        </div>
        :
        <div class="time-segment">
          <span class="number">${minutes.toString().padStart(2, "0")}</span>
          <span class="time-unit">minute${minutes !== 1 ? "s" : ""}</span>
        </div>
        :
        <div class="time-segment">
          <span class="number">${seconds.toString().padStart(2, "0")}</span>
          <span class="time-unit">seconde${seconds !== 1 ? "s" : ""}</span>
        </div>
      `;
}

const etaContainer = document.querySelector("#eta-time");

function updateETA() {
	const etaDate = new Date(Date.now() + timeTillHalving * 1000); // Convert seconds to milliseconds

	const etaDay = etaDate.getUTCDate().toString().padStart(2, "0");
	const months = [
		"janvier",
		"février",
		"mars",
		"avril",
		"mai",
		"juin",
		"juillet",
		"août",
		"septembre",
		"octobre",
		"novembre",
		"décembre",
	];
	const etaMonth = months[etaDate.getUTCMonth()];
	const etaYear = etaDate.getUTCFullYear();
	const etaHours = etaDate.getUTCHours().toString().padStart(2, "0");
	const etaMinutes = etaDate.getUTCMinutes().toString().padStart(2, "0");

	etaContainer.textContent = `${etaDay} ${etaMonth} ${etaYear}, ${etaHours}:${etaMinutes} UTC`;
}

function updateCountdownAndETA() {
	updateCountdown();
	updateETA();
}

fetchCurrentBlockHeight().then(() => {
	updateCountdownAndETA(); // Initial update
	setInterval(updateCountdownAndETA, 1000);
});

// Price converter
let btcToUsdRate = 0;

document.getElementById("btcInput").addEventListener("input", updateUSDValue);
document.getElementById("usdInput").addEventListener("input", updateBTCValue);

// Get the current Bitcoin price from CoinGecko
function fetchBTCPrice() {
	fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
	)
		.then((response) => response.json())
		.then((data) => {
			btcToUsdRate = data.bitcoin.usd;
		})
		.catch((error) => {
			console.error("There was an error fetching the BTC price:", error);
		});
}

// Update the USD input based on the BTC input
function updateUSDValue() {
	const btcValue = Number.parseFloat(document.getElementById("btcInput").value);
	if (!Number.isNaN(btcValue)) {
		const usdValue = btcToUsdRate * btcValue;
		document.getElementById("usdInput").value = usdValue.toFixed(2);
	}
}

// Update the BTC input based on the USD input
function updateBTCValue() {
	const usdValue = Number.parseFloat(document.getElementById("usdInput").value);
	if (!Number.isNaN(usdValue)) {
		const btcValue = usdValue / btcToUsdRate;
		document.getElementById("btcInput").value = btcValue.toFixed(8); // BTC can have up to 8 decimals
	}
}

// Function to filter input
function filterInput(event) {
	// Allow only digits and dots
	event.target.value = event.target.value
		.replace(/[^0-9.]/g, "")
		.replace(/(\..*)\./g, "$1");
	// The second replace() ensures there's only one dot
}

document.getElementById("btcInput").addEventListener("input", filterInput);
document.getElementById("usdInput").addEventListener("input", filterInput);

// Fetch the BTC price on popup open
fetchBTCPrice();

// Add this to the end of popup.js

document.getElementById("saveApiKey").addEventListener("click", () => {
	const apiKey = document.getElementById("apiKeyInput").value;
	chrome.runtime.sendMessage({ action: "setApiKey", apiKey }, (response) => {
		if (response.success) {
			alert("API key saved successfully!");
		} else {
			alert("Failed to save API key. Please try again.");
		}
	});
});

// Load saved API key when popup opens
chrome.runtime.sendMessage({ action: "getApiKey" }, (response) => {
	if (response.apiKey) {
		document.getElementById("apiKeyInput").value = response.apiKey;
	}
});
