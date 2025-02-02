// Create a MutationObserver instance
const observerForHeader = new MutationObserver(() => {
    const element = document.querySelector('.header-title.ms-2.me-1.bold');
    if (element) {
        // Create a span and add the sparkle emoji to it
        const span = document.createElement('span');
        span.textContent = ' ඞ';
        span.classList.add('sparkle');

        // Append the span to the target element
        element.appendChild(span);

        // Create a new style element
        const style = document.createElement('style');

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
    for (const element of elements) {
        element.innerHTML = element.innerHTML.replace(/ /g, ' ');  // replace with a space
    }
}

// Call the function
removeNBSP();

// fix broken emote
function replaceQuestionMarks() {
    const paragraphs = document.querySelectorAll('.article-section p');
    for (const p of paragraphs) {
        // Replace in paragraph itself
        if (p.childNodes.length > 0 && p.childNodes[0].nodeValue && p.childNodes[0].nodeValue.startsWith("? ")) {
            p.childNodes[0].nodeValue = p.childNodes[0].nodeValue.replace('? ', '👉🏻 ');
        }

        // Replace in <a> tags within the paragraph
        const anchorTags = p.querySelectorAll('a');
        for (const a of anchorTags) {
            if (a.childNodes.length > 0 && a.childNodes[0].nodeValue && a.childNodes[0].nodeValue.startsWith("? ")) {
                a.childNodes[0].nodeValue = a.childNodes[0].nodeValue.replace('? ', '👉🏻 ');
            }
        }
    }
}
// Run the replacement function immediately on page load
replaceQuestionMarks();

const observerForEmote = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            replaceQuestionMarks();
        }
    }
});
const config = {
    childList: true,
    subtree: true
};

const targetNode = document.querySelector('.article-section');
if (targetNode) {
    observerForEmote.observe(targetNode, config);
}

//remove prices-grid from page outils
function isTargetPage(url) {
    return url === "https://cryptoast.fr/outils-liste.php";
  }
  
  function removeAllPricesGridInstances() {
    const pricesGridElements = document.querySelectorAll("#body #prices-grid");
    let elementsRemoved = 0;
  
    for (const element of pricesGridElements) {
      element.remove();
      elementsRemoved++;
    }
  
    return elementsRemoved;  // Return the number of removed elements
  }
  
  if (isTargetPage(window.location.href)) {
    const observerConfig = {
      childList: true,
      subtree: true,
    };
  
    const bodyElement = document.querySelector("body");
  
    const domObserver = new MutationObserver(() => {
      const removedCount = removeAllPricesGridInstances();
      if (removedCount > 0) {
        console.log(`Removed ${removedCount} instances of #prices-grid.`);
      }
    });
  
    domObserver.observe(bodyElement, observerConfig);
  }  
