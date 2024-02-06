// Function to fetch coin details

console.log('CoinDetect is starting...');

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

function formatPrice(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

function fetchCoinDetails(ticker) {
    console.log(`Fetching details for ${ticker.toUpperCase()}...`);
    const id = tickerToId[ticker.toLowerCase()]; // Ensure ticker is in lowercase for matching
    if (!id) {
        console.error(`Could not find ID for ticker: ${ticker}`);
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(data => {
            const priceChange = data[id].usd_24h_change.toFixed(2);
            const price = formatPrice(data[id].usd);
            const color = priceChange < 0 ? 'red' : 'green';

            fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(response => response.json())
                .then(coinData => {
                    const coinDiv = document.createElement('div');
                    coinDiv.className = 'coin-info';
                    coinDiv.innerHTML = `
                        <div>
                            <img src="${coinData.image.small}" alt="${ticker.toUpperCase()} logo">
                            <span class="ticker">${ticker.toUpperCase()}</span>
                        </div>
                        <div class="details">
                            <span class="price-change" style="color: ${color};">${priceChange}%</span>
                            <span class="price">${price}</span>
                        </div>
                    `;
                    console.log(`Coin details fetched and element created for ${ticker.toUpperCase()}`);

                    const asideElement = document.querySelector('.article-aside');
                    if (asideElement) {
                        asideElement.prepend(coinDiv);
                        console.log(`Coin information added to the sidebar for ${ticker.toUpperCase()}`);
                    } else {
                        console.error('Aside element not found, cannot add coin information');
                    }
                })
                .catch(error => console.error(`Could not load ${ticker} image:`, error));
        })
        .catch(error => console.error(`Could not load ${ticker} details:`, error));
}

// MutationObserver for coin detection with a unique name to avoid conflicts
const coinDetectionObserver = new MutationObserver((mutationsList, observer) => {
    console.log('Mutation observed, checking for title changes...');
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            detectCoinInTitle();
        }
    }
});

function detectCoinInTitle() {
    const titleElement = document.querySelector('.article-title');
    if (titleElement && titleElement.textContent) {
        const titleText = titleElement.textContent.toLowerCase();
        console.log(`Article title found: "${titleElement.textContent}"`);
        const detectedCoins = Object.keys(tickerToId).filter(ticker => titleText.includes(ticker));

        if (detectedCoins.length > 0) {
            console.log(`Detected coins in title: ${detectedCoins.join(', ').toUpperCase()}`);
            detectedCoins.forEach(fetchCoinDetails);
        } else {
            console.log('No coin keywords detected in title.');
        }
    }
}

function startObserving() {
    const targetNode = document.querySelector('.article-title');
    if (targetNode) {
        coinDetectionObserver.observe(targetNode, {
            characterData: true,
            childList: true,
            subtree: true,
        });
        console.log('Started observing the article title for changes.');
    } else {
        console.log('Article title element not found, setting up observer for body to detect its appearance...');
        const bodyObserver = new MutationObserver((mutations, obs) => {
            if (document.querySelector('.article-title')) {
                obs.disconnect(); // Stop observing the body once the target is available
                startObserving(); // Start observing the target node
                console.log('Article title element appeared, started observing for changes.');
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed, initializing coin detection...');
    startObserving();
});
