console.log('Enhanced article info extractor and edit button script is starting');

// Set to keep track of processed keywords to prevent duplicates
const processedKeywords = new Set();

// Variable to store the last processed schema to avoid reprocessing
let lastProcessedSchema = '';

// Function to extract article information from the Yoast schema
function extractArticleInfo() {
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
            if (article) {
                return {
                    keywords: article.keywords || [],
                    wordCount: article.wordCount || 0
                };
            }
        } catch (error) {
            console.error('Error parsing schema data:', error);
        }
    }
    return null;
}

// Function to create and inject the article info element
function injectArticleInfo(articleInfo) {
    if (!articleInfo) return;

    const articleAsideElement = document.querySelector('.article-aside');
    if (!articleAsideElement) {
        console.error('Article aside element not found.');
        return;
    }

    let infoDiv = document.querySelector('.article-info');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.className = 'coin-info article-info';
        const editButtonContainer = document.querySelector('.edit-button-container');
        if (editButtonContainer) {
            articleAsideElement.insertBefore(infoDiv, editButtonContainer.nextSibling);
        } else {
            articleAsideElement.prepend(infoDiv);
        }
    }

    // Filter out already processed keywords
    const newKeywords = articleInfo.keywords.filter(keyword => !processedKeywords.has(keyword));
    for (const keyword of newKeywords) {
        processedKeywords.add(keyword);
    }

    const keywordsContent = articleInfo.keywords.map(keyword => 
        `<span class="keyword-tag">${keyword}</span>`
    ).join('');

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

    console.log('Article info injected into the sidebar:', articleInfo);
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

// Function to handle article info extraction and injection
function handleArticleInfo() {
    console.log('Checking for article info...');
    const articleInfo = extractArticleInfo();
    if (articleInfo) {
        console.log('Article info found:', articleInfo);
        injectArticleInfo(articleInfo);
    } else {
        console.log('No new article info found or unable to parse schema data.');
    }
}

// Function to set up a MutationObserver to monitor changes in the article content area
function setupArticleContentObserver() {
    const articleContentNode = document.querySelector('.article-content');
    if (!articleContentNode) {
        console.log('Article content node not found. Observer not set up.');
        return;
    }

    console.log('Setting up article content observer for article info...');

    const observerConfig = { childList: true, subtree: true };
    const articleMutationObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('Detected a change in the article content. Checking for article info...');
                handleArticleInfo();
            }
        }
    });

    articleMutationObserver.observe(articleContentNode, observerConfig);
    console.log('Article content observer for article info set up successfully.');
}

// Initialization function to set up observers and initial checks
function initializeExtension() {
    console.log('Initializing enhanced article info extractor and edit button...');
    injectEditButton(); // Inject the edit button
    handleArticleInfo(); // Initial check for article info
    setupArticleContentObserver(); // Set up observer for dynamic content changes
}

// Start the script once the page has loaded
if (document.readyState === 'complete') {
    initializeExtension();
} else {
    window.addEventListener('load', initializeExtension);
}