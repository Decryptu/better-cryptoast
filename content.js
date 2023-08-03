window.onload = function() {
    let element = document.querySelector('.header-title.ms-2.me-1.bold');
    if (element) {
        // Create a span and add the sparkle emoji to it
        let span = document.createElement('span');
        span.textContent = '✨';
        span.classList.add('sparkle');

        // Append the span to the target element
        element.appendChild(span);

        // Create a new style element
        let style = document.createElement('style');

        // Define CSS as text
        style.textContent = `
        @keyframes flicker {
            0% {opacity: 1;}
            50% {opacity: 0.5;}
            100% {opacity: 1;}
        }
        .sparkle {
            animation: flicker 2s linear infinite;
        }
        `;

        // Append the style to the document head
        document.head.appendChild(style);
    }
}

// Fetch BTC price and display in the header
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const bitcoinPrice = Math.round(data.bitcoin.usd);
        const formattedBitcoinPrice = bitcoinPrice.toLocaleString('fr-FR');
        const anchorElement = document.querySelector('.buy-crypto.d-flex.flex-row.align-items-center.cursor-pointer');
        if(anchorElement && anchorElement.querySelector){
            const spanElement = anchorElement.querySelector('.text-nowrap.fw-bold');
            if (spanElement) {
                spanElement.textContent = `${formattedBitcoinPrice}$`;
            }
        }
    })
    .catch(err => console.error(err));

    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const images = document.getElementsByTagName('img');
                for (let i = 0; i < images.length; i++) {
                    if (images[i].src === 'https://cryptoast.fr/wp-content/uploads/2023/01/Sans-titre-1-300x300.png') {
                        images[i].src = 'https://i.imgur.com/X4bya8i.png';
                    }
                }
            }
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    

// Iterate over all image elements on the page
document.querySelectorAll('img').forEach(function(img) {
    // Check if the image src contains '-300x150'
    if (img.src && img.src.includes('-300x150')) {
        // Replace '-300x150' with an empty string to get the uncompressed image
        img.src = img.src.replace('-300x150', '');
    }
});

// Add a progress bar on the top of the articles
window.onscroll = function() {myFunction()};

function myFunction() {
  var articleElement = document.querySelector('.article-main-ctn');
  if (articleElement) {
    var articleHeight = articleElement.scrollHeight;
    var scrollPosition = window.pageYOffset;
    var windowHeight = window.innerHeight;
    var scrollHeight = articleHeight - windowHeight;
    var progress = (scrollPosition / scrollHeight) * 100;

    document.getElementById('myBar').style.width = progress + '%';
  }
}

var bar = document.createElement('div');
bar.setAttribute('id', 'myBar');
document.body.appendChild(bar);

//Play a music on a certain page
window.addEventListener('load', function() {
    if(window.location.href === 'https://cryptoast.fr/author/maximilien/') {
        let audio = new Audio('https://cdn.discordapp.com/attachments/1066833707941515326/1135228657418379274/Bring_Me_The_Horizon_-_Can_You_Feel_My_Heart.mp3');

        document.addEventListener('click', function() {
            let promise = audio.play();

            if (promise !== undefined) {
                promise.catch(error => {
                    // Auto-play was prevented.
                    console.log("Auto-play prevented:", error);
                }).then(() => {
                    // Auto-play started successfully.
                    console.log("Auto-play started successfully");
                });
            }
        });
    }
});

// Create search box
let searchContainer = document.createElement('div');
searchContainer.classList.add('search-container'); // Added class to the searchContainer
let searchBox = document.createElement('input');
searchBox.type = 'text';
searchBox.placeholder = 'Search...';
searchBox.id = 'searchBox';
searchBox.classList.add('search-input-ctn');  // Add the class here
searchContainer.appendChild(searchBox);

// Insert search box to the right of the title
let title = document.querySelector('.news-section-second-title.color-orange-gradient.fw-bold');

// Check if title exists
if (title) {
    title.parentNode.insertBefore(searchContainer, title.nextSibling);

    // Event listener for search box
    searchBox.addEventListener('keyup', function(e){
        let searchString = e.target.value.toLowerCase();

        // Get all the articles
        let articles = document.querySelectorAll('.last-news-card.card-shadow');

        // Loop through the articles
        for(let article of articles) {
            // Get the title of the article
            let title = article.querySelector('.last-news-card-title.ps-1.animated-underline span').textContent.toLowerCase();

            // If the search string is in the title, show the article, otherwise hide it
            if(title.includes(searchString)) {
                article.style.display = '';
            } else {
                article.style.display = 'none';
            }
        }
    });
}

// Check the author
let authorElement = document.querySelector('.ms-2.author-name > a');
if (authorElement && authorElement.href === 'https://cryptoast.fr/author/robin/') {
    // Add CSS for the animation
    let style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% {background: red;}
            14% {background: orange;}
            28% {background: yellow;}
            42% {background: lime;}
            57% {background: cyan;}
            71% {background: blue;}
            85% {background: magenta;}
            100% {background: red;}
        }
        .rainbow {
            animation: rainbow 3s linear infinite !important;
            background-size: 200% 200% !important;
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Create a new div
    let rainbowDiv = document.createElement('div');
    rainbowDiv.classList.add('rainbow');

    // Add the div to the body
    document.body.appendChild(rainbowDiv);
}

// Function to fetch coin details
const tickerToId = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'ada': 'cardano',
    'bch': 'bitcoin-cash',
    'dot': 'polkadot',
    'ltc': 'litecoin',
    'shib': 'shiba-inu',
    'steth': 'staked-ether',
    'trx': 'tron',
    'usdc': 'usd-coin',
    'wbtc': 'wrapped-bitcoin',
    'avax': 'avalanche-2',
    'bnb': 'binancecoin',
    'doge': 'dogecoin',
    'matic': 'matic-network',
    'sol': 'solana',
    'ton': 'the-open-network',
    'uni': 'uniswap',
    'usdt': 'tether',
    'xrp': 'ripple'
};
function fetchCoinDetails(ticker) {
    let id = tickerToId[ticker];  // convert the ticker to id
    if (!id) {
        console.error(`Could not find ID for ticker: ${ticker}`);
        return;
    }

    // Fetch the coin price
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched details for', ticker, data); // Debug

            let priceChange = data[id].usd_24h_change.toFixed(2);
            let price = data[id].usd.toFixed(2);
            let color = priceChange < 0 ? 'red' : 'green';

            // Fetch the coin image
            fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(response => response.json())
                .then(coinData => {
                    // Adding the new div
                    let coinDiv = document.createElement('div');
                    coinDiv.className = 'coin-info';
                    let imgSrc = coinData.image.small;
                    coinDiv.innerHTML = `
    <div>
        <img src="${imgSrc}" alt="${ticker} logo">
        <span class="ticker">${ticker.toUpperCase()}</span>
    </div>
    <div class="details">
        <span class="price-change" style="color: ${color};">${priceChange}%</span>
        <span class="price">$${price}</span>
    </div>
`;
                    console.log('Created new div:', coinDiv); // Debug

                    let asideElement = document.querySelector('.article-aside');
                    console.log('Found aside element:', asideElement); // Debug

                    if (asideElement) {
                        asideElement.prepend(coinDiv);
                        console.log('Prepended new div to aside element'); // Debug
                    } else {
                        console.error('Aside element not found'); // Debug
                    }
                })
                .catch(error => {
                    console.error(`Could not load ${ticker} image:`, error);
                });
        })
        .catch(error => {
            console.error(`Could not load ${ticker} details:`, error);
        });
}

window.onload = function() {
    detectCoin();
};

function detectCoin() {
    let titleElement = document.querySelector('.article-title');
    if(titleElement){
        let title = titleElement.innerText;
        console.log('Title: ', title); // Debug: log the title

        let detectedCoins = ['btc', 'eth', 'ada', 'bch', 'dot', 'ltc', 'shib', 'steth', 'trx', 'usdc', 'wbtc', 'avax', 'bnb', 'doge', 'matic', 'sol', 'ton', 'uni', 'usdt', 'xrp']
        .filter(coin => title.includes(coin.toUpperCase())); // Changed to look for uppercase
        
        if (detectedCoins.includes('btc')) {
            console.log('BTC detected in title'); // Debug: log when 'btc' is detected
        }

        detectedCoins.forEach(coin => fetchCoinDetails(coin));
    } else {
        console.log('Title element not found'); // Debug: log when the title element can't be found
    }
}
