// Function to fetch coin details
const tickerToFullName = {
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
    'xrp': 'ripple',
    'crv': 'curve-dao-token',
    'aave': 'aave',
    'op': 'optimism',
    'arb': 'arbitrum',
    'atom': 'cosmos',
    'xmr': 'monero',
    'link': 'chainlink',
    'pepe': 'pepe',
    'wld': 'worldcoin-wld'
};

// Format the price with appropriate precision
function formatCryptoPrice(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

// Fetch and display details about the cryptocurrency
function fetchAndDisplayCryptoDetails(ticker) {
    const id = tickerToFullName[ticker];
    if (!id) {
        console.error(`Crypto ID for ticker '${ticker}' not found.`);
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(data => {
            console.log(`Fetched crypto details for ${ticker}`, data);
            const priceChange = data[id].usd_24h_change.toFixed(2);
            const price = formatCryptoPrice(data[id].usd);
            const color = priceChange < 0 ? 'red' : 'green';

            fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(response => response.json())
                .then(coinData => {
                    const cryptoInfoDiv = document.createElement('div');
                    cryptoInfoDiv.className = 'crypto-info';
                    cryptoInfoDiv.innerHTML = `
                        <div>
                            <img src="${coinData.image.small}" alt="${ticker.toUpperCase()} logo">
                            <span class="ticker">${ticker.toUpperCase()}</span>
                        </div>
                        <div class="details">
                            <span class="price-change" style="color: ${color};">${priceChange}%</span>
                            <span class="price">${price}</span>
                        </div>
                    `;
                    console.log('Crypto info div created:', cryptoInfoDiv);

                    const asideElement = document.querySelector('.article-aside');
                    if (asideElement) {
                        asideElement.prepend(cryptoInfoDiv);
                        console.log('Crypto info div added to the aside element.');
                    } else {
                        console.error('Aside element for appending crypto info not found.');
                    }
                })
                .catch(error => console.error(`Error fetching image for ${ticker}:`, error));
        })
        .catch(error => console.error(`Error fetching details for ${ticker}:`, error));
}

// MutationObserver callback to handle mutations
function handleTitleMutation(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            console.log('Detected changes in the article title.');
            initiateCryptoDetection();
        }
    }
}

// Set up and start the MutationObserver
function setUpArticleTitleObserver() {
    const titleElement = document.querySelector('.article-title');
    if (!titleElement) {
        console.error('Article title element not found for observing.');
        return;
    }

    const observerOptions = {
        childList: true, // to observe direct children
        subtree: true, // to observe all descendants
        characterData: true // to observe text changes
    };

    const articleTitleObserver = new MutationObserver(handleTitleMutation);
    articleTitleObserver.observe(titleElement, observerOptions);
    console.log('Article title observer set up successfully.');
}

// Detect and process cryptocurrency references in the title
function initiateCryptoDetection() {
    const titleElement = document.querySelector('.article-title');
    if (titleElement) {
        const titleText = titleElement.innerText.toLowerCase();
        console.log(`Current article title: ${titleText}`);

        const detectedCryptos = Object.keys(tickerToFullName).filter(ticker => titleText.includes(ticker));
        detectedCryptos.forEach(ticker => {
            console.log(`Detected "${ticker.toUpperCase()}" in the title.`);
            fetchAndDisplayCryptoDetails(ticker);
        });
    } else {
        console.error('Article title element not detected.');
    }
}

// Initialize the observer and detection on page load
window.onload = function() {
    console.log('Page loaded. Setting up the article title observer.');
    setUpArticleTitleObserver();
    initiateCryptoDetection(); // Initial check in case the title is already present at load time
};
