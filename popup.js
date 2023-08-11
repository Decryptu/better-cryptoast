document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var searchQuery = document.getElementById('searchInput').value;
    var url = 'https://cryptoast.fr/?s=' + encodeURIComponent(searchQuery);
  
    // Open the URL in a new tab
    chrome.tabs.create({ url: url });
  });
  
  const countdownContainer = document.querySelector("#countdown");
  const halvingDate = new Date("27 April 2024 01:55:00 UTC");
  
  // Initialize the countdown to "00" for every unit
  countdownContainer.innerHTML = `
    <div class="time-segment">
      <span class="number">00</span>
      <span class="time-unit">Days</span>
    </div>
    :
    <div class="time-segment">
      <span class="number">00</span>
      <span class="time-unit">Hours</span>
    </div>
    :
    <div class="time-segment">
      <span class="number">00</span>
      <span class="time-unit">Minutes</span>
    </div>
    :
    <div class="time-segment">
      <span class="number">00</span>
      <span class="time-unit">Seconds</span>
    </div>
  `;
  
  function updateCountdown() {
    const now = new Date();
    const diffInSeconds = Math.max((halvingDate - now) / 1000, 0);
  
    const days = Math.floor(diffInSeconds / 60 / 60 / 24);
    const hours = Math.floor(diffInSeconds / 60 / 60 % 24);
    const minutes = Math.floor(diffInSeconds / 60 % 60);
    const seconds = Math.floor(diffInSeconds % 60);
  
    countdownContainer.innerHTML = `
      <div class="time-segment">
        <span class="number">${days.toString().padStart(2, '0')}</span>
        <span class="time-unit">Day${days !== 1 ? 's' : ''}</span>
      </div>
      :
      <div class="time-segment">
        <span class="number">${hours.toString().padStart(2, '0')}</span>
        <span class="time-unit">Hour${hours !== 1 ? 's' : ''}</span>
      </div>
      :
      <div class="time-segment">
        <span class="number">${minutes.toString().padStart(2, '0')}</span>
        <span class="time-unit">Minute${minutes !== 1 ? 's' : ''}</span>
      </div>
      :
      <div class="time-segment">
        <span class="number">${seconds.toString().padStart(2, '0')}</span>
        <span class="time-unit">Second${seconds !== 1 ? 's' : ''}</span>
      </div>
    `;
  }
  
  setInterval(updateCountdown, 1000);

// Price converter
let btcToUsdRate = 0;

document.getElementById('btcInput').addEventListener('input', updateUSDValue);
document.getElementById('usdInput').addEventListener('input', updateBTCValue);

// Get the current Bitcoin price from CoinGecko
function fetchBTCPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            btcToUsdRate = data.bitcoin.usd;
            console.log("Fetched BTC Price: ", btcToUsdRate); // Add console log
        })
        .catch(error => {
            console.error("There was an error fetching the BTC price:", error);
        });
}

// Update the USD input based on the BTC input
function updateUSDValue() {
    console.log("BTC Input Changed");  // Add console log
    const btcValue = parseFloat(document.getElementById('btcInput').value);
    if (!isNaN(btcValue)) {
        const usdValue = btcToUsdRate * btcValue;
        document.getElementById('usdInput').value = usdValue.toFixed(2);
    }
}

// Update the BTC input based on the USD input
function updateBTCValue() {
    console.log("USD Input Changed");  // Add console log
    const usdValue = parseFloat(document.getElementById('usdInput').value);
    if (!isNaN(usdValue)) {
        const btcValue = usdValue / btcToUsdRate;
        document.getElementById('btcInput').value = btcValue.toFixed(8);  // BTC can have up to 8 decimals
    }
}

// Fetch the BTC price on popup open
fetchBTCPrice();
