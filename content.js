// content.js
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
        element.innerHTML = element.innerHTML.replace(/ /g, ' ');  // replace with a space
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

// coinDetect.js
console.log(
    "Enhanced article info extractor and edit button script is starting"
);

const processedKeywords = new Set();
let lastProcessedSchema = "";

function extractArticleInfo() {
    const schemaScript = document.querySelector(
        'script[type="application/ld+json"].yoast-schema-graph'
    );
    if (schemaScript) {
        const currentSchema = schemaScript.textContent;
        if (currentSchema === lastProcessedSchema) {
            console.log(
                "Schema has not changed since last check. Skipping reprocessing."
            );
            return null;
        }
        lastProcessedSchema = currentSchema;

        try {
            const schemaData = JSON.parse(currentSchema);
            const article = schemaData["@graph"].find(
                (item) => item["@type"] === "NewsArticle"
            );
            if (article) {
                return {
                    keywords: article.keywords || [],
                    wordCount: article.wordCount || 0,
                };
            }
        } catch (error) {
            console.error("Error parsing schema data:", error);
        }
    }
    return null;
}

function injectArticleInfo(articleInfo) {
    if (!articleInfo) return;

    const articleAsideElement = document.querySelector(".article-aside");
    if (!articleAsideElement) {
        console.error("Article aside element not found.");
        return;
    }

    let infoDiv = document.querySelector(".article-info");
    if (!infoDiv) {
        infoDiv = document.createElement("div");
        infoDiv.className = "coin-info article-info";
        const buttonsContainer = document.querySelector(".buttons-container");
        if (buttonsContainer) {
            articleAsideElement.insertBefore(infoDiv, buttonsContainer.nextSibling);
        } else {
            articleAsideElement.prepend(infoDiv);
        }
    }

    const newKeywords = articleInfo.keywords.filter(
        (keyword) => !processedKeywords.has(keyword)
    );
    for (const keyword of newKeywords) {
        processedKeywords.add(keyword);
    }

    const keywordsContent = articleInfo.keywords
        .map((keyword) => `<span class="keyword-tag">${keyword}</span>`)
        .join("");

    infoDiv.innerHTML = `
        <div class="info-details">
            <div class="keywords-section">
                <span class="keyword-title">Nombre de mots</span>
                <div class="keyword-list">
                    <span class="keyword-tag word-count">${articleInfo.wordCount}</span>
                </div>
            </div>
            <div class="keywords-section">
                <span class="keyword-title">Tags de l'article</span>
                <div class="keyword-list">${keywordsContent}</div>
            </div>
        </div>
    `;

    console.log("Article info injected into the sidebar:", articleInfo);
}

function getPostIdFromLinks() {
    const links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
        const href = links[i].getAttribute("href");
        if (href?.includes("/wp-json/wp/v2/posts/")) {
            return href.split("/wp-json/wp/v2/posts/")[1];
        }
        if (href?.includes("shortlink")) {
            return href.split("p=")[1];
        }
    }
    return null;
}

function injectButtons() {
    const articleAsideElement = document.querySelector(".article-aside");
    if (!articleAsideElement) {
        console.error("Article aside element not found.");
        return;
    }

    if (document.querySelector(".buttons-container")) {
        console.log("Buttons already exist.");
        return;
    }

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "coin-info buttons-container";
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexDirection = "column";
    buttonsDiv.style.gap = "8px";

    const editButton = createButton(
        "Modifier cet article",
        "edit-article-button",
        handleEditClick
    );
    const checkButton = createButton(
        "Vérifier erreurs",
        "check-errors-button",
        handleCheckClick
    );
    const apostropheButton = createButton(
        "Détecter apostrophes",
        "apostrophe-check-button",
        handleApostropheClick
    );

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(checkButton);
    buttonsDiv.appendChild(apostropheButton);
    articleAsideElement.prepend(buttonsDiv);
    console.log("Edit, Check, and Apostrophe buttons injected into the sidebar.");
}

function createButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.className = className;
    button.style.width = "100%";
    button.style.fontSize = "12px"; // Reduced text size
    button.style.padding = "8px";
    button.style.lineHeight = "1.2";
    button.addEventListener("click", clickHandler);
    return button;
}

function handleEditClick() {
    const postId = getPostIdFromLinks();
    if (postId) {
        const editUrl = `${window.location.origin}/wp-admin/post.php?post=${postId}&action=edit`;
        window.location.href = editUrl;
    } else {
        console.log("No post ID found.");
    }
}

function handleCheckClick() {
    console.log("Check errors button clicked");
    showLoadingPopup();
    chrome.runtime.sendMessage({ action: "checkErrors" });
}

function showLoadingPopup() {
    const popup = createPopup("Analyse en cours...", true);
    document.body.appendChild(popup);
}

function createPopup(content) {
    const popup = document.createElement("div");
    popup.className = "error-check-popup";
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
    `;

    const closeIcon = document.createElement("div");
    closeIcon.innerHTML = "&#10005;"; // HTML entity for "X"
    closeIcon.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 20px;
        color: #333;
    `;
    closeIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        document.body.removeChild(popup);
    });

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = content;

    popup.appendChild(closeIcon);
    popup.appendChild(contentDiv);

    return popup;
}

function handleApiResponse(result) {
    console.log("Received API response:", result);

    // Remove any existing popup
    const existingPopup = document.querySelector(".error-check-popup");
    if (existingPopup) {
        document.body.removeChild(existingPopup);
    }

    const safeContent = `
        <div class="api-response-wrapper">
            ${result}
        </div>
    `;

    const popup = createPopup(safeContent);
    document.body.appendChild(popup);

    // Use a timeout to ensure the popup is fully rendered before adding event listeners
    setTimeout(() => {
        const closePopup = (e) => {
            if (
                !popup.contains(e.target) &&
                !e.target.closest(".error-check-popup")
            ) {
                document.body.removeChild(popup);
                document.removeEventListener("click", closePopup);
                document.removeEventListener("keydown", closePopupOnEscape);
            }
        };

        const closePopupOnEscape = (e) => {
            if (e.key === "Escape") {
                document.body.removeChild(popup);
                document.removeEventListener("click", closePopup);
                document.removeEventListener("keydown", closePopupOnEscape);
            }
        };

        document.addEventListener("click", closePopup);
        document.addEventListener("keydown", closePopupOnEscape);
    }, 100);
}

function handleArticleInfo() {
    console.log("Checking for article info...");
    const articleInfo = extractArticleInfo();
    if (articleInfo) {
        console.log("Article info found:", articleInfo);
        injectArticleInfo(articleInfo);
    } else {
        console.log("No new article info found or unable to parse schema data.");
    }
}

function setupArticleContentObserver() {
    const articleContentNode = document.querySelector(".article-content");
    if (!articleContentNode) {
        console.log("Article content node not found. Observer not set up.");
        return;
    }

    console.log("Setting up article content observer for article info...");

    const observerConfig = { childList: true, subtree: true };
    const articleMutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                console.log(
                    "Detected a change in the article content. Checking for article info..."
                );
                handleArticleInfo();
            }
        }
    });

    articleMutationObserver.observe(articleContentNode, observerConfig);
    console.log("Article content observer for article info set up successfully.");
}

function initializeExtension() {
    console.log("Initializing enhanced article info extractor and buttons...");
    injectButtons();
    handleArticleInfo();
    setupArticleContentObserver();
}

if (document.readyState === "complete") {
    initializeExtension();
} else {
    window.addEventListener("load", initializeExtension);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getArticleContent") {
        const articleSection = document.querySelector("section.article-section");
        if (articleSection) {
            const clonedSection = articleSection.cloneNode(true);
            removeUnwantedElements(clonedSection);
            sendResponse({ content: clonedSection.innerHTML });
        } else {
            sendResponse({ content: "" });
        }
    } else if (request.action === "apiResponse") {
        handleApiResponse(request.result);
    }
    return true;
});

function removeUnwantedElements(element) {
    const scripts = element.querySelectorAll("script");
    for (const script of scripts) {
        script.remove();
    }

    const styles = element.querySelectorAll("style");
    for (const style of styles) {
        style.remove();
    }

    const authorModule = element.querySelector(".article-author-module");
    if (authorModule) {
        authorModule.remove();
    }

    return element;
}