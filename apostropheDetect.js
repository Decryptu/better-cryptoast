// apostropheDetect.js
let apostropheHighlighted = false;
let apostropheCount = { curved: 0, straight: 0 };

const highlightApostrophes = () => {
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) {
    console.log('Article content not found');
    return;
  }

  // Reset counters
  apostropheCount = { curved: 0, straight: 0 };

  const walker = document.createTreeWalker(
    articleContent, 
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  for (const node of nodes) {
    const parent = node.parentNode;
    // Check for both straight (') and curved (’ U+2019) apostrophes
    if (!node.nodeValue.includes("'") && !node.nodeValue.includes("’")) continue;

    // Count apostrophes
    const curvedCount = (node.nodeValue.match(/’/g) || []).length;
    const straightCount = (node.nodeValue.match(/'/g) || []).length;
    apostropheCount.curved += curvedCount;
    apostropheCount.straight += straightCount;

    // Highlight apostrophes
    const html = node.nodeValue
      .replace(/’/g, '<span class="apostrophe-curved">’</span>')
      .replace(/'/g, '<span class="apostrophe-straight">\'</span>');

    const span = document.createElement('span');
    span.innerHTML = html;
    parent.replaceChild(span, node);
  }

  apostropheHighlighted = true;
  updateApostropheButton();
  console.log('Apostrophes highlighted:', apostropheCount);
};

const removeApostropheHighlights = () => {
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;

  const highlightedSpans = articleContent.querySelectorAll('.apostrophe-curved, .apostrophe-straight');
  for (const span of highlightedSpans) {
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize();
  }

  apostropheHighlighted = false;
  apostropheCount = { curved: 0, straight: 0 };
  updateApostropheButton();
};

const updateApostropheButton = () => {
  const button = document.querySelector('.apostrophe-check-button');
  if (!button) return;

  if (apostropheHighlighted) {
    const total = apostropheCount.curved + apostropheCount.straight;
    button.innerHTML = `Masquer apostrophes<br><small>(${apostropheCount.curved} courbes, ${apostropheCount.straight} droites)</small>`;
  } else {
    button.innerHTML = 'Détecter apostrophes';
  }
};

const handleApostropheClick = () => {
  if (apostropheHighlighted) {
    removeApostropheHighlights();
  } else {
    highlightApostrophes();
  }
};