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
  buttonsDiv.style.justifyContent = "space-between";

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

  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(checkButton);
  articleAsideElement.prepend(buttonsDiv);
  console.log("Edit and Check buttons injected into the sidebar.");
}

function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.style.width = "48%";
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
  scripts.forEach((script) => script.remove());

  const styles = element.querySelectorAll("style");
  styles.forEach((style) => style.remove());

  const authorModule = element.querySelector(".article-author-module");
  if (authorModule) {
    authorModule.remove();
  }

  return element;
}
