if (window.location.href.startsWith('https://cryptoast.fr/cours-')) {
    console.log('Script loaded');

    let checkInterval = setInterval(function() {
        let buttons = document.querySelectorAll('.buy-crypto-section-grid-item a.buy-crypto-btn, .buy-crypto-section-grid-item div.buy-crypto-btn');
        
        if (buttons.length > 0) {
            console.log('Found buttons:', buttons.length);
            
            buttons.forEach(function(button, index) {
                console.log('Adding click listener to button', index);

                button.addEventListener('click', function(event) {
                    console.log('Button', index, 'clicked');

                    event.preventDefault(); // Prevent any default behavior
                    event.stopPropagation(); // Stop event propagation to ensure no other event handlers get executed after this one

                    console.log('Default action prevented, navigating to Binance...');
                    window.location.href = 'https://www.binance.com/fr/trade/BTC_USDT?layout=pro&ref=UGYAPIQS';
                }, true); // The `true` here means we're adding this in the capturing phase
            });

            clearInterval(checkInterval); // Clear the interval once we've attached our listeners
        } else {
            console.log('Buttons not yet found, checking again...');
        }
    }, 1000);
} else {
    console.log('Script not loaded as URL pattern does not match.');
}
