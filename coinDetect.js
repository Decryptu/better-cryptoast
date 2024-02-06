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
    const id = tickerToId[ticker.toLowerCase()]; // Ensure ticker is in lowercase for matching
    if (!id) {
        console.error(`Could not find ID for ticker: ${ticker}`);
        return;
    }

    // Fetch coin price and details
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

                    const asideElement = document.querySelector('.article-aside');
                    if (asideElement) {
                        asideElement.prepend(coinDiv);
                    } else {
                        console.error('Aside element not found');
                    }
                })
                .catch(error => console.error(`Could not load ${ticker} image:`, error));
        })
        .catch(error => console.error(`Could not load ${ticker} details:`, error));
}

// MutationObserver to monitor for changes in the article title
const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const titleElement = document.querySelector('.article-title');
            if (titleElement && titleElement.textContent) {
                const titleText = titleElement.textContent.toLowerCase();
                const detectedCoins = Object.keys(tickerToId).filter(ticker => titleText.includes(ticker));

                detectedCoins.forEach(fetchCoinDetails);
            }
        }
    }
});

// Function to start observing changes
function startObserving() {
    const targetNode = document.querySelector('.article-title');
    if (targetNode) {
        observer.observe(targetNode, {
            characterData: true,
            childList: true,
            subtree: true,
        });
    } else {
        console.log('Article title element not found, waiting for it to appear...');
        // If the target node isn't available on initial load, observe the body or specific container for its appearance
        const bodyObserver = new MutationObserver((mutations, obs) => {
            const targetNode = document.querySelector('.article-title');
            if (targetNode) {
                obs.disconnect(); // Stop observing the body once the target is available
                startObserving(); // Start observing the target node
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }
}

// Start observing when the page has loaded
document.addEventListener('DOMContentLoaded', startObserving);
