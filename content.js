// Create a MutationObserver instance
let observerForHeader = new MutationObserver(function() {
    let element = document.querySelector('.header-title.ms-2.me-1.bold');
    if (element) {
        // Create a span and add the sparkle emoji to it
        let span = document.createElement('span');
        span.textContent = '🥶';
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

        observerForHeader.disconnect(); // Stop observing when the element is found
    }
});

// Configure the observer to look for additions to the body of the document and all of its descendants
observerForHeader.observe(document.body, {childList: true, subtree: true});

//remove NBSP
function removeNBSP() {
    const elements = document.querySelectorAll('.last-news-card-date.ms-1');
    elements.forEach(element => {
        element.innerHTML = element.innerHTML.replace(/&nbsp;/g, ' ');  // replace with a space
    });
}

// Call the function
removeNBSP();
