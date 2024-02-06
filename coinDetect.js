// Function to fetch coin details
console.log('coinDetect.js script loaded'); // Verify the script is loaded

// Global flag to indicate whether the DOM changes are script-initiated
let isScriptMakingChanges = false;

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
    if (price < 1) {
        return '$' + price.toFixed(9).replace(/\.?0+$/, "");
    } else {
        return '$' + price.toFixed(2);
    }
}

function fetchCoinDetails(ticker) {
    let id = tickerToId[ticker];
    if (!id) {
        console.error(`Could not find ID for ticker: ${ticker}`);
        return;
    }

    console.log(`Fetching details for ${ticker} (${id})`);

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Fetched details for ${ticker}:`, data);

            let priceChange = data[id].usd_24h_change.toFixed(2);
            let price = formatPrice(data[id].usd);
            let color = priceChange < 0 ? 'red' : 'green';

            fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(coinData => {
                    isScriptMakingChanges = true; // Indicate script is making changes

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
                            <span class="price">${price}</span>
                        </div>
                    `;

                    console.log(`Created new div for ${ticker}`);

                    let asideElement = document.querySelector('.article-aside');
                    if (asideElement) {
                        asideElement.prepend(coinDiv);
                        console.log(`Prepended new div for ${ticker} to aside element`);
                    } else {
                        console.error('Aside element not found');
                    }

                    isScriptMakingChanges = false; // Reset flag after changes are done
                })
                .catch(error => {
                    console.error(`Could not load ${ticker} image:`, error);
                    isScriptMakingChanges = false; // Reset flag even if there's an error
                });
        })
        .catch(error => {
            console.error(`Could not load ${ticker} details:`, error);
        });
}

const observer = new MutationObserver((mutationsList, observer) => {
    if (!isScriptMakingChanges) { // Check if the script is not making changes
        console.log('DOM changed by user or other scripts');
        detectCoin();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('MutationObserver set up.');

function detectCoin() {
    if (isScriptMakingChanges) {
        console.log('Skipping detectCoin due to script changes');
        return; // Exit if changes are script-initiated
    }

    console.log('Running detectCoin function');

    let titleElement = document.querySelector('.article-title-ctn .article-title');
    if (titleElement) {
        let title = titleElement.innerText;
        console.log('Article title:', title);

        let detectedCoins = ['btc', 'eth'] // Add more tickers here as needed
            .filter(coin => title.toUpperCase().includes(coin.toUpperCase()));

        console.log('Detected coins:', detectedCoins);

        detectedCoins.forEach(coin => fetchCoinDetails(coin));
    } else {
        console.log('Title element not found');
    }
}

detectCoin(); // Initial call to detectCoin to handle page load scenarios
