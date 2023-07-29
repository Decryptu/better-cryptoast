document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var searchQuery = document.getElementById('searchInput').value;
    var url = 'https://cryptoast.fr/?s=' + encodeURIComponent(searchQuery);
  
    // Open the URL in a new tab
    chrome.tabs.create({ url: url });
  });
  