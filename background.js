let OPENAI_API_KEY = '';

// Store API key in chrome storage
chrome.storage.local.get(['openaiApiKey'], (result) => {
  OPENAI_API_KEY = result.openaiApiKey || '';
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'setApiKey':
      OPENAI_API_KEY = message.apiKey;
      chrome.storage.local.set({ openaiApiKey: OPENAI_API_KEY });
      sendResponse({ success: true });
      return true;

    case 'getApiKey':
      sendResponse({ apiKey: OPENAI_API_KEY });
      return true;

    case 'checkCookie':
      chrome.cookies.get({
        url: "https://cryptoast.fr",
        name: "wordpress_logged_in_f53c97261c8262956e237a76547fdff1"
      }, (cookie) => {
        sendResponse({ 
          success: !!cookie, 
          cookieValue: cookie ? cookie.value : null 
        });
      });
      return true;

    case 'checkErrors':
      if (!OPENAI_API_KEY) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "apiResponse",
          result: "Cliquez sur le logo de l'extension et ajoutez votre clé API en bas."
        });
        return true;
      }

      checkErrors(sender.tab.id)
        .then(result => {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "apiResponse",
            result
          });
        })
        .catch(error => {
          console.error("Error in checkErrors:", error);
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "apiResponse",
            result: "Une erreur est survenue lors de la vérification."
          });
        });
      return true;
  }
});

// Clean article content using string manipulation
function cleanArticleContent(originalContent) {
  // Start with a copy of the original content
  let cleanedContent = originalContent;
  
  // Remove newsletter sections
  cleanedContent = cleanedContent.replace(/<div[^>]*class="[^"]*hustle-ui[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  cleanedContent = cleanedContent.replace(/<div[^>]*class="[^"]*sc_bloc_light[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove affiliate CTAs and their warnings
  cleanedContent = cleanedContent.replace(/<a[^>]*(?:id="btn_[^"]*"|class="btn[^"]*")[^>]*>[\s\S]*?<\/a>\s*<div[^>]*class="blcatt"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove risk warnings section
  cleanedContent = cleanedContent.replace(/<div[^>]*id="avertissement-crypto-monnaies-risques"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove script tags
  cleanedContent = cleanedContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove empty paragraphs
  cleanedContent = cleanedContent.replace(/<p>\s*<\/p>/gi, '');
  
  // Extract only paragraphs and headers with content
  const contentMatches = cleanedContent.match(/<(?:p|h[1-6])[^>]*>(?:(?!<\/?(?:p|h[1-6])).)*<\/(?:p|h[1-6])>/gi) || [];
  
  return contentMatches
    .filter(match => match.replace(/<[^>]+>/g, '').trim()) // Remove empty or whitespace-only elements
    .join('\n');
}

async function checkErrors(tabId) {
  console.log("Checking errors for tab:", tabId);
  const articleContent = await getArticleContent(tabId);
  const cleanedContent = cleanArticleContent(articleContent);

  const prompt = `Voici le contenu d'un article au format HTML. Je veux que tu vérifies s'il y a des fautes, ne cherche pas à faire des optimisations ou des reformulations si c'est déjà bien, concentre-toi sur les fautes (Par exemple, des fautes d'accord, d'orthographe, de syntaxe, etc.). Ignore les erreurs liées à la structure HTML.

  Si tu trouves des erreurs, crée une liste HTML détaillant chaque erreur, une par une, de manière concise. Pour chaque erreur :
  1. Indique le type d'erreur.
  2. Montre le texte ou passage concerné.
  3. Donne une brève explication de l'erreur.
  
  Retourne uniquement la liste des erreurs en utilisant du code HTML valide, sans inclure les balises de code ou les délimiteurs de bloc comme \`\`\`html\`. Si tu ne trouves aucune faute, tu réponds "Tout semble ok.".
  
  Voici l'article : ${cleanedContent}`;

  const requestBody = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Tu es un correcteur de Français." },
      { role: "user", content: prompt }
    ]
  };

  console.log("Content being sent to API:", cleanedContent);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function getArticleContent(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { action: "getArticleContent" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response.content);
        }
      }
    );
  });
}