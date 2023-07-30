window.onload = function() {
    let element = document.querySelector('.header-title.ms-2.me-1.bold');
    if (element) {
        // Create a span and add the sparkle emoji to it
        let span = document.createElement('span');
        span.textContent = '✨';
        span.classList.add('sparkle');

        // Append the span to the target element
        element.appendChild(span);

        // Create a new style element
        let style = document.createElement('style');

        // Define CSS as text
        style.textContent = `
        @keyframes flicker {
            0% {opacity: 1;}
            50% {opacity: 0.5;}
            100% {opacity: 1;}
        }
        .sparkle {
            animation: flicker 2s linear infinite;
        }
        `;

        // Append the style to the document head
        document.head.appendChild(style);
    }
}

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
    .catch(err => console.error(err));

// Fetch all the images on the page.
const images = document.getElementsByTagName('img');

// Iterate over each image.
for (let i = 0; i < images.length; i++) {
    // Check if the image src matches the one you want to replace.
    if (images[i].src === 'https://cryptoast.fr/wp-content/uploads/2023/01/Sans-titre-1-300x300.png') {
        // Replace the image src with the new URL.
        images[i].src = 'https://i.imgur.com/X4bya8i.png';
    }
}

// Iterate over all image elements on the page
document.querySelectorAll('img').forEach(function(img) {
    // Check if the image src contains '-300x150'
    if (img.src && img.src.includes('-300x150')) {
        // Replace '-300x150' with an empty string to get the uncompressed image
        img.src = img.src.replace('-300x150', '');
    }
});

// Add a progress bar on the top of the articles
window.onscroll = function() {myFunction()};

function myFunction() {
  var articleElement = document.querySelector('.article-main-ctn');
  if (articleElement) {
    var articleHeight = articleElement.scrollHeight;
    var scrollPosition = window.pageYOffset;
    var windowHeight = window.innerHeight;
    var scrollHeight = articleHeight - windowHeight;
    var progress = (scrollPosition / scrollHeight) * 100;

    document.getElementById('myBar').style.width = progress + '%';
  }
}

var bar = document.createElement('div');
bar.setAttribute('id', 'myBar');
document.body.appendChild(bar);

//Play a music on a certain page
window.onload = function() {
    if(window.location.href === 'https://cryptoast.fr/author/maximilien/') {
        let audio = new Audio('https://cdn.discordapp.com/attachments/1066833707941515326/1135228657418379274/Bring_Me_The_Horizon_-_Can_You_Feel_My_Heart.mp3');

        document.addEventListener('click', function() {
            audio.play();
        });
    }
}

// Create search box
let searchContainer = document.createElement('div');
searchContainer.classList.add('search-container'); // Added class to the searchContainer
let searchBox = document.createElement('input');
searchBox.type = 'text';
searchBox.placeholder = 'Search...';
searchBox.id = 'searchBox';
searchBox.classList.add('search-input-ctn');  // Add the class here
searchContainer.appendChild(searchBox);

// Insert search box to the right of the title
let title = document.querySelector('.news-section-second-title.color-orange-gradient.fw-bold');

// Check if title exists
if (title) {
    title.parentNode.insertBefore(searchContainer, title.nextSibling);

    // Event listener for search box
    searchBox.addEventListener('keyup', function(e){
        let searchString = e.target.value.toLowerCase();

        // Get all the articles
        let articles = document.querySelectorAll('.last-news-card.card-shadow');

        // Loop through the articles
        for(let article of articles) {
            // Get the title of the article
            let title = article.querySelector('.last-news-card-title.ps-1.animated-underline span').textContent.toLowerCase();

            // If the search string is in the title, show the article, otherwise hide it
            if(title.includes(searchString)) {
                article.style.display = '';
            } else {
                article.style.display = 'none';
            }
        }
    });
}
