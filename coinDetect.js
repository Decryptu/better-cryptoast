// Function to fetch coin details
const tickerDictionary = {
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

// Function to format cryptocurrency prices with appropriate precision
function formatPriceWithPrecision(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

// Function to fetch and display details about a specific cryptocurrency
function fetchAndInjectCryptoInfo(tickerSymbol) {
    const cryptoFullName = tickerDictionary[tickerSymbol.toLowerCase()];
    if (!cryptoFullName) {
        console.error(`Ticker symbol '${tickerSymbol}' not recognized.`);
        return;
    }

    const priceApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoFullName.toLowerCase()}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
    fetch(priceApiUrl)
        .then(response => response.json())
        .then(data => {
            const cryptoData = data[cryptoFullName.toLowerCase()];
            const priceChange = Number(cryptoData.usd_24h_change).toFixed(2);
            const price = formatPriceWithPrecision(cryptoData.usd);
            const color = priceChange < 0 ? 'red' : 'green';

            const cryptoDetailsApiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoFullName.toLowerCase()}`;
            fetch(cryptoDetailsApiUrl)
                .then(response => response.json())
                .then(detailsData => {
                    const cryptoInfoDiv = document.createElement('div');
                    cryptoInfoDiv.className = 'crypto-info-container';
                    cryptoInfoDiv.innerHTML = `
                        <div>
                            <img src="${detailsData.image.small}" alt="${tickerSymbol.toUpperCase()} logo">
                            <span class="ticker-symbol">${tickerSymbol.toUpperCase()}</span>
                        </div>
                        <div class="crypto-details">
                            <span class="price-change" style="color: ${color};">${priceChange}%</span>
                            <span class="current-price">${price}</span>
                        </div>
                    `;
                    console.log(`Crypto information div for ${tickerSymbol.toUpperCase()} created and ready to be injected.`);

                    const articleSidePanel = document.querySelector('.article-aside');
                    if (articleSidePanel) {
                        articleSidePanel.prepend(cryptoInfoDiv);
                        console.log(`Crypto information for ${tickerSymbol.toUpperCase()} added to the side panel.`);
                    } else {
                        console.error('Unable to find the article side panel for injecting crypto information.');
                    }
                })
                .catch(error => console.error(`Failed to fetch cryptocurrency details for ${tickerSymbol.toUpperCase()}:`, error));
        })
        .catch(error => console.error(`Failed to fetch cryptocurrency price for ${tickerSymbol.toUpperCase()}:`, error));
}

// MutationObserver callback to handle title updates
function articleTitleChangeHandler(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            console.log('Change detected in the article title by the cryptoDetectorObserver.');
            detectAndProcessCryptoReferences();
        }
    });
}

// Setup the MutationObserver to monitor article title changes
function initializeTitleObserver() {
    const articleTitleElement = document.querySelector('.article-title');
    if (!articleTitleElement) {
        console.error('Failed to locate the article title element for monitoring.');
        return;
    }

    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true,
    };

    const cryptoDetectorObserver = new MutationObserver(articleTitleChangeHandler);
    cryptoDetectorObserver.observe(articleTitleElement, observerConfig);
    console.log('CryptoDetectorObserver has been successfully initialized.');
}

// Function to detect and process cryptocurrency references in the title
function detectAndProcessCryptoReferences() {
    const articleTitleElement = document.querySelector('.article-title');
    if (articleTitleElement) {
        const articleTitleText = articleTitleElement.innerText.toLowerCase();
        console.log(`Evaluating article title for cryptocurrency references: ${articleTitleText}`);

        Object.keys(tickerDictionary).forEach(ticker => {
            if (articleTitleText.includes(ticker)) {
                console.log(`Cryptocurrency ticker detected in title: ${ticker.toUpperCase()}.`);
                fetchAndInjectCryptoInfo(ticker);
            }
        });
    } else {
        console.error('Could not find the article title element for cryptocurrency detection.');
    }
}

// Initialize the MutationObserver and check the title on page load
window.onload = () => {
    console.log('Document loaded. Initializing crypto detection mechanisms.');
    initializeTitleObserver();
    detectAndProcessCryptoReferences(); // Initial check in case the title does not change after page load
};
