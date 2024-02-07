// Function to fetch coin details

console.log(`Crypto info script is starting`);

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
    'xrp': 'ripple',
    'crv': 'curve-dao-token',
    'aave': 'aave',
    'op': 'optimism',
    'arb': 'arbitrum',
    'atom': 'cosmos',
    'xmr': 'monero',
    'link': 'chainlink',
    'pepe': 'pepe',
    'wld': 'worldcoin-wld',
    'jup': 'jupiter-exchange-solana',
    'tia': 'celestia',
    'zeta': 'zetachain',
    'tao': 'bittensor',
    'dym': 'dymension'
};

// Set to keep track of already processed tickers to prevent duplicates
const processedTickers = new Set();

// Variable to store the last processed title to avoid reprocessing the same title
let lastProcessedTitle = '';

// Function to format the cryptocurrency price for display
function formatCryptoPrice(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

// Function to fetch and display cryptocurrency details
function fetchAndDisplayCryptoDetails(ticker) {
    if (processedTickers.has(ticker)) {
        console.log(`Crypto details for ${ticker.toUpperCase()} already added to the page.`);
        return; // Prevent processing a ticker more than once
    }

    const cryptoId = tickerToId[ticker.toLowerCase()];
    if (!cryptoId) {
        console.error(`Crypto ID not found for ticker: ${ticker}`);
        return;
    }

    console.log(`Fetching details for: ${ticker.toUpperCase()}`);

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(data => {
            const priceChange = data[cryptoId].usd_24h_change.toFixed(2);
            const price = formatCryptoPrice(data[cryptoId].usd);
            const color = priceChange < 0 ? 'red' : 'green';

            fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}`)
                .then(response => response.json())
                .then(coinData => {
                    const cryptoInfoDiv = document.createElement('div');
                    cryptoInfoDiv.className = 'coin-info';
                    let imgSrc = coinData.image.small;
                    cryptoInfoDiv.innerHTML = `
                        <div>
                            <img src="${imgSrc}" alt="${ticker.toUpperCase()} logo">
                            <span class="ticker">${ticker.toUpperCase()}</span>
                        </div>
                        <div class="details">
                            <span class="price-change" style="color: ${color};">${priceChange}%</span>
                            <span class="price">${price}</span>
                        </div>
                    `;

                    const articleAsideElement = document.querySelector('.article-aside');
                    if (articleAsideElement) {
                        articleAsideElement.prepend(cryptoInfoDiv);
                        console.log(`Crypto details for ${ticker.toUpperCase()} added to the page.`);
                        processedTickers.add(ticker); // Mark this ticker as processed
                    } else {
                        console.error('Article aside element not found.');
                    }
                })
                .catch(error => console.error(`Error fetching crypto image for ${ticker.toUpperCase()}:`, error));
        })
        .catch(error => console.error(`Error fetching crypto details for ${ticker.toUpperCase()}:`, error));
}

// Enhanced function to detect cryptocurrencies in the title and handle word boundaries for tickers
function detectAndProcessCryptoInTitle() {
    const articleTitleElement = document.querySelector('.article-title');
    if (articleTitleElement) {
        let articleTitle = articleTitleElement.innerText.toLowerCase();
        // Check if the title has changed since the last processing
        if (articleTitle === lastProcessedTitle) {
            console.log('Article title has not changed since last check. Skipping reprocessing.');
            return;
        }
        console.log('Article title detected:', articleTitle);
        lastProcessedTitle = articleTitle; // Update the last processed title

        Object.keys(tickerToId).forEach(ticker => {
            // Use regex to match whole words only, preventing false positives
            let regex = new RegExp(`\\b${ticker}\\b`, 'i');
            if (regex.test(articleTitle)) {
                console.log(`Crypto ticker found in title: ${ticker.toUpperCase()}`);
                fetchAndDisplayCryptoDetails(ticker);
            }
        });
    } else {
        console.log('Article title element not found.');
    }
}

// Function to set up a MutationObserver to monitor changes in the article content area
function setupArticleContentObserver() {
    const articleContentNode = document.querySelector('.article-content');
    if (!articleContentNode) {
        console.log('Article content node not found. Observer not set up.');
        return;
    }

    console.log('Setting up article content observer...');

    const observerConfig = { childList: true, subtree: true };
    const articleMutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('Detected a change in the article content.');
                detectAndProcessCryptoInTitle(); // Re-check if the title has been updated/added
            }
        }
    });

    articleMutationObserver.observe(articleContentNode, observerConfig);
    console.log('Article content observer set up successfully.');
}

// Initialization function to set up observers and initial checks
function initializeCryptoInfoExtension() {
    console.log('Initializing crypto info extension...');
    detectAndProcessCryptoInTitle(); // Initial check for the title
    setupArticleContentObserver(); // Set up observer for dynamic content changes
}

// Start the script once the page has loaded
if (document.readyState === 'complete') {
    initializeCryptoInfoExtension();
} else {
    window.addEventListener('load', initializeCryptoInfoExtension);
}
