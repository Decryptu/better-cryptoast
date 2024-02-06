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

function detectCoinInTitle() {
    const titleElement = document.querySelector('.article-title');
    if (titleElement) {
        console.log(`Article title element found: "${titleElement.textContent}"`);
        const titleText = titleElement.textContent.toLowerCase();
        const detectedCoins = Object.keys(tickerToId).filter(ticker => titleText.includes(ticker));

        if (detectedCoins.length > 0) {
            console.log(`Detected coins in title: ${detectedCoins.join(', ').toUpperCase()}`);
            detectedCoins.forEach(fetchCoinDetails);
        } else {
            console.log('No coin keywords detected in title.');
        }
    } else {
        console.log('Article title element not found during detection attempt.');
    }
}

function setupInitialObservation() {
    // Instead of directly observing the .article-title, we observe the entire document at start
    // This allows us to catch when the .article-title becomes available if it's not there initially
    const bodyObserver = new MutationObserver((mutations, observer) => {
        if (document.querySelector('.article-title')) {
            console.log('Article title element has appeared, starting detailed observation.');
            observer.disconnect(); // Stop observing the entire document to avoid performance issues
            detectCoinInTitle(); // Perform an initial check in case the title is already correct
            startObservingTitleChanges(); // Now observe specifically for changes in the title
        }
    });

    console.log('Setting up initial observation on the document body...');
    bodyObserver.observe(document.body, { childList: true, subtree: true });
}

function startObservingTitleChanges() {
    const titleElement = document.querySelector('.article-title');
    if (titleElement) {
        // If we have confirmed the title element is indeed present, observe it for changes
        const coinDetectionObserver = new MutationObserver((mutationsList, observer) => {
            console.log('Mutation observed in the article title, checking for changes...');
            detectCoinInTitle();
        });

        coinDetectionObserver.observe(titleElement, {
            characterData: true,
            childList: true,
            subtree: true,
        });

        console.log('Started observing the article title for changes.');
    } else {
        console.log('Failed to start observing title changes: Article title element still not found.');
    }
}

// Replace direct call to startObserving with setupInitialObservation to handle dynamic content more effectively
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed, initializing coin detection setup...');
    setupInitialObservation();
});
