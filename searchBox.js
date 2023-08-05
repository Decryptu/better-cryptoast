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
