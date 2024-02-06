// Fetch BTC price and display in the header
fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const bitcoinPrice = Math.round(data.bitcoin.usd);
        const formattedBitcoinPrice = bitcoinPrice.toLocaleString('fr-FR');
        const anchorElement = document.querySelector('.buy-crypto.d-flex.flex-row.align-items-center.cursor-pointer');
        if(anchorElement && anchorElement.querySelector){
            const spanElement = anchorElement.querySelector('.text-nowrap.fw-bold');
            if (spanElement) {
                spanElement.textContent = `${formattedBitcoinPrice}$`;
            }
        }
    })
    .catch(err => console.error(`Error fetching data: ${err.message}`));