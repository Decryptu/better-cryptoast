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

        let detectedCoins = ['btc', 'eth', 'ada', 'bch', 'dot', 'ltc', 'shib', 'steth', 'trx', 'usdc', 'wbtc', 'avax', 'bnb', 'doge', 'matic', 'sol', 'ton', 'uni', 'usdt', 'xrp', 'crv', 'aave', 'op', 'arb', 'atom', 'xmr', 'link', 'pepe', 'wld']
        .filter(coin => title.includes(coin.toUpperCase())); // Changed to look for uppercase
        
        if (detectedCoins.includes('btc')) {
            console.log('BTC detected in title'); // Debug: log when 'btc' is detected
        }

        detectedCoins.forEach(coin => fetchCoinDetails(coin));
    } else {
        console.log('Title element not found'); // Debug: log when the title element can't be found
    }
}
