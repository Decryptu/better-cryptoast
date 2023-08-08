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
