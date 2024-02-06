// Function to fetch coin details
console.log('coinDetect.js script loaded'); // Verify the script is loaded

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

let hasAppended = {}; // Object to keep track of which tickers' details have been appended

function formatPrice(price) {
    return price < 1 ? `$${price.toFixed(9).replace(/\.?0+$/, "")}` : `$${price.toFixed(2)}`;
}

function fetchCoinDetails(ticker) {
    const id = tickerToId[ticker];
    if (!id) {
        console.error(`Could not find ID for ticker: ${ticker}`);
        return;
    }

    console.log(`Fetching details for ${ticker} (${id})`);

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(data => {
            const priceChange = data[id].usd_24h_change.toFixed(2);
            const price = formatPrice(data[id].usd);
            const color = priceChange < 0 ? 'red' : 'green';

            // Ensure details for this ticker are appended only once
            if (!hasAppended[ticker]) {
                const coinDiv = document.createElement('div');
                coinDiv.setAttribute('class', 'coin-info');
                coinDiv.setAttribute('data-ticker', ticker); // Mark the div with the ticker
                coinDiv.innerHTML = `
                    <div>
                        <span class="ticker">${ticker.toUpperCase()}: </span>
                        <span class="price-change" style="color: ${color};">${priceChange}%</span>
                        <span class="price">${price}</span>
                    </div>
                `;

                const asideElement = document.querySelector('.article-aside');
                if (asideElement) {
                    asideElement.prepend(coinDiv);
                    console.log(`Prepended new div for ${ticker} to aside element`);
                    hasAppended[ticker] = true; // Mark as appended
                } else {
                    console.error('Aside element not found');
                }
            }
        })
        .catch(error => console.error(`Error fetching details for ${ticker}:`, error));
}

function detectAndDisplayCoins() {
    const titleElement = document.querySelector('.article-title-ctn .article-title');
    if (!titleElement) {
        console.error('Title element not found');
        return;
    }

    const titleText = titleElement.innerText.toUpperCase();
    console.log(`Article title: ${titleText}`);

    Object.keys(tickerToId).forEach(ticker => {
        if (titleText.includes(ticker.toUpperCase()) && !hasAppended[ticker]) {
            fetchCoinDetails(ticker);
        }
    });
}

// Use MutationObserver to detect when it's safe to run our detection logic
const observer = new MutationObserver((mutations, observer) => {
    detectAndDisplayCoins();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial execution in case the page is already loaded
detectAndDisplayCoins();
