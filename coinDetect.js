console.log('Keyword extractor and edit button script is starting');

// Set to keep track of processed keywords to prevent duplicates
const processedKeywords = new Set();

// Variable to store the last processed schema to avoid reprocessing
let lastProcessedSchema = '';

// Function to extract keywords from the Yoast schema
function extractKeywords() {
    const schemaScript = document.querySelector('script[type="application/ld+json"].yoast-schema-graph');
    if (schemaScript) {
        const currentSchema = schemaScript.textContent;
        // Check if the schema has changed since the last processing
        if (currentSchema === lastProcessedSchema) {
            console.log('Schema has not changed since last check. Skipping reprocessing.');
            return null;
        }
        lastProcessedSchema = currentSchema;

        try {
            const schemaData = JSON.parse(currentSchema);
            const article = schemaData['@graph'].find(item => item['@type'] === 'NewsArticle');
            if (article && article.keywords) {
                return article.keywords;
            }
        } catch (error) {
            console.error('Error parsing schema data:', error);
        }
    }
    return null;
}

// Function to create and inject the keywords element
function injectKeywords(keywords) {
    if (!keywords || keywords.length === 0) return;

    const articleAsideElement = document.querySelector('.article-aside');
    if (!articleAsideElement) {
        console.error('Article aside element not found.');
        return;
    }

    // Filter out already processed keywords
    const newKeywords = keywords.filter(keyword => !processedKeywords.has(keyword));
    if (newKeywords.length === 0) {
        console.log('No new keywords to inject.');
        return;
    }

    let keywordsDiv = document.querySelector('.keyword-info');
    if (!keywordsDiv) {
        keywordsDiv = document.createElement('div');
        keywordsDiv.className = 'coin-info keyword-info';
        const editButtonContainer = document.querySelector('.edit-button-container');
        if (editButtonContainer) {
            articleAsideElement.insertBefore(keywordsDiv, editButtonContainer.nextSibling);
        } else {
            articleAsideElement.prepend(keywordsDiv);
        }
    }

    const keywordsContent = newKeywords.map(keyword => {
        processedKeywords.add(keyword);
        return `<span class="keyword-tag">${keyword}</span>`;
    }).join('');

    keywordsDiv.innerHTML = `
        <div>
            <span class="keyword-title">Keywords</span>
        </div>
        <div class="keyword-details">
            ${keywordsContent}
        </div>
    `;

    console.log('New keywords injected into the sidebar:', newKeywords);
}

// Function to get post ID from links
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

// Function to create and inject the edit button
function injectEditButton() {
    const articleAsideElement = document.querySelector('.article-aside');
    if (!articleAsideElement) {
        console.error('Article aside element not found.');
        return;
    }

    if (document.querySelector('.edit-button-container')) {
        console.log('Edit button already exists.');
        return;
    }

    const editButtonDiv = document.createElement('div');
    editButtonDiv.className = 'coin-info edit-button-container';

    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier cet article';
    editButton.className = 'edit-article-button';
    editButton.addEventListener('click', () => {
        const postId = getPostIdFromLinks();
        if (postId) {
            const editUrl = `${window.location.origin}/wp-admin/post.php?post=${postId}&action=edit`;
            window.location.href = editUrl;
        } else {
            console.log("No post ID found.");
        }
    });

    editButtonDiv.appendChild(editButton);
    articleAsideElement.prepend(editButtonDiv);
    console.log('Edit button injected into the sidebar.');
}

// Function to handle keyword extraction and injection
function handleKeywords() {
    console.log('Checking for keywords...');
    const keywords = extractKeywords();
    if (keywords) {
        console.log('Keywords found:', keywords);
        injectKeywords(keywords);
    } else {
        console.log('No new keywords found or unable to parse schema data.');
    }
}

// Function to set up a MutationObserver to monitor changes in the article content area
function setupArticleContentObserver() {
    const articleContentNode = document.querySelector('.article-content');
    if (!articleContentNode) {
        console.log('Article content node not found. Observer not set up.');
        return;
    }

    console.log('Setting up article content observer for keywords...');

    const observerConfig = { childList: true, subtree: true };
    const articleMutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('Detected a change in the article content. Checking for keywords...');
                handleKeywords();
            }
        }
    });

    articleMutationObserver.observe(articleContentNode, observerConfig);
    console.log('Article content observer for keywords set up successfully.');
}

// Initialization function to set up observers and initial checks
function initializeExtension() {
    console.log('Initializing keyword extractor and edit button...');
    injectEditButton(); // Inject the edit button
    handleKeywords(); // Initial check for keywords
    setupArticleContentObserver(); // Set up observer for dynamic content changes
}

// Start the script once the page has loaded
if (document.readyState === 'complete') {
    initializeExtension();
} else {
    window.addEventListener('load', initializeExtension);
}