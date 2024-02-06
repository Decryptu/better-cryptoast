// Function to fetch coin details

console.log(`1st line`);

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
    'wld': 'worldcoin-wld'
};

// Formats the cryptocurrency price for display
function formatCryptoPrice(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

// Fetches and displays cryptocurrency details
function fetchAndDisplayCryptoDetails(ticker) {
    const cryptoId = cryptoTickerToIdMap[ticker];
    if (!cryptoId) {
        console.error(`Crypto ID not found for ticker: ${ticker}`);
        return;
    }

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
                    cryptoInfoDiv.className = 'crypto-info';
                    cryptoInfoDiv.innerHTML = `
                        <div>
                            <img src="${coinData.image.small}" alt="${ticker} logo">
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
                        console.log(`Crypto details for ${ticker} added to the page.`);
                    } else {
                        console.error('Article aside element not found.');
                    }
                })
                .catch(error => console.error(`Error fetching crypto image for ${ticker}:`, error));
        })
        .catch(error => console.error(`Error fetching crypto details for ${ticker}:`, error));
}

// Detects cryptocurrencies mentioned in the article title and initiates detail fetching
function detectAndProcessCryptoInTitle() {
    const articleTitleElement = document.querySelector('.article-title');
    if (articleTitleElement) {
        const articleTitle = articleTitleElement.innerText.toLowerCase();
        console.log('Article title detected:', articleTitle);

        Object.keys(cryptoTickerToIdMap).forEach(ticker => {
            if (articleTitle.includes(ticker)) {
                console.log(`Crypto ticker found in title: ${ticker.toUpperCase()}`);
                fetchAndDisplayCryptoDetails(ticker);
            }
        });
    } else {
        console.log('Article title element not found.');
    }
}

// Sets up a MutationObserver to monitor changes in the article content area
function setupArticleContentObserver() {
    const articleContentNode = document.querySelector('.article-content');
    if (!articleContentNode) {
        console.log('Article content node not found. Observer not set up.');
        return;
    }

    const observerConfig = {
        childList: true,
        subtree: true,
    };

    const articleMutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('Detected a change in the article content.');
                detectAndProcessCryptoInTitle(); // Check if the title has been updated/added
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
    setupArticleContentObserver(); // Set up observer for dynamic content
}

// Start the script once the page has loaded
window.onload = initializeCryptoInfoExtension;
console.log(`last line`);