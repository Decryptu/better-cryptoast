let OPENAI_API_KEY = '';

chrome.storage.local.get(['openaiApiKey'], (result) => {
  OPENAI_API_KEY = result.openaiApiKey || '';
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setApiKey') {
    OPENAI_API_KEY = message.apiKey;
    chrome.storage.local.set({ openaiApiKey: OPENAI_API_KEY });
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'getApiKey') {
    sendResponse({ apiKey: OPENAI_API_KEY });
    return true;
  }

  if (message.action === "checkCookie") {
    chrome.cookies.get(
      {
        url: "https://cryptoast.fr",
        name: "wordpress_logged_in_f53c97261c8262956e237a76547fdff1",
      },
      (cookie) => {
        if (cookie) {
          sendResponse({ success: true, cookieValue: cookie.value });
        } else {
          sendResponse({ success: false });
        }
      }
    );
    return true;
  }

  if (message.action === "checkErrors") {
    if (!OPENAI_API_KEY) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "apiResponse",
        result: "Cliquez sur le logo de l'extension et ajoutez votre clé API en bas.",
      });
      return true;
    }

    checkErrors(sender.tab.id)
      .then((result) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "apiResponse",
          result,
        });
      })
      .catch((error) => {
        console.error("Error in checkErrors:", error);
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "apiResponse",
          result: "Une erreur est survenue lors de la vérification.",
        });
      });
    return true;
  }
});

async function checkErrors(tabId) {
  console.log("Checking errors for tab:", tabId);
  const articleContent = await getArticleContent(tabId);
  const prompt = `Voici le contenu d'un article au format HTML. Je veux que tu vérifies uniquement s'il y a des fautes d'orthographe, de grammaire, de syntaxe, ou des erreurs évidentes dans le texte visible. Ignore complètement les balises HTML et les erreurs liées à la structure HTML, ainsi que toute suggestion de reformulation ou d'amélioration du style. Ne signale que les erreurs qui constituent des fautes ou des problèmes évidents. Si tu ne trouves aucune erreur, répond simplement "Tout semble ok.".

  Si tu trouves des erreurs, crée une liste HTML détaillant chaque erreur, une par une, de manière concise. Pour chaque erreur :
  1. Indique le type d'erreur (orthographe, grammaire, syntaxe, mise en forme).
  2. Montre le texte ou passage concerné.
  3. Donne une brève explication de l'erreur.
  
  Ne réécris pas tout l'article corrigé. Retourne uniquement la liste des erreurs en utilisant du code HTML valide, sans inclure les balises de code ou les délimiteurs de bloc comme \`\`\`html\`. Ta réponse doit être prête à être affichée directement dans une div HTML sans modification. Sois intransigeant, aucune erreur ne doit t'échapper, mais reste focalisé uniquement sur les erreurs réelles et significatives. Voici l'article : ${articleContent}`;

  const requestBody = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Tu es un correcteur de Français." },
      { role: "user", content: prompt },
    ],
  };

  console.log("API request body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

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