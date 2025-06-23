// apostropheDetect.js - Enhanced GPT Detector with French Typography
let gptElementsHighlighted = false;
let originalNodes = []; // Store original nodes for proper restoration

const highlightGptElements = () => {
	const articleContent = document.querySelector(".article-content");
	if (!articleContent) {
		console.log("Article content not found");
		return;
	}

	// Clear previous stored nodes
	originalNodes = [];

	// Highlight text elements (apostrophes, dashes, spaces, special chars)
	highlightTextElements(articleContent);

	// Highlight data attributes
	highlightDataAttributes(articleContent);

	gptElementsHighlighted = true;
	updateGptDetectorButton();
	console.log("GPT elements highlighted");
};

const highlightTextElements = (container) => {
	const walker = document.createTreeWalker(
		container,
		NodeFilter.SHOW_TEXT,
		null,
		false,
	);

	const nodesToProcess = [];
	while (walker.nextNode()) {
		const text = walker.currentNode.nodeValue;
		// Check if text contains any of our target characters
		if (
			text.includes("\u2019") ||      // Curved apostrophe '
			text.includes("'") ||           // Straight apostrophe
			text.includes("–") ||           // En dash
			text.includes("-") ||           // Hyphen
			text.includes("\u202F") ||      // Narrow no-break space
			text.includes("\u00A0") ||      // Non-breaking space
			text.includes("\u2009") ||      // Thin space
			text.includes("\u2008") ||      // Punctuation space
			text.includes("\u2007") ||      // Figure space
			text.includes("\u2006") ||      // Six-per-em space
			text.includes("\u2E3B") ||      // Two-em dash ⸻
			text.includes("\u2014") ||      // Em dash —
			text.includes("\uFFFC") ||      // Object replacement character ￼
			/[\u1D00-\u1D7F]/.test(text) || // Phonetic extensions (superscripts)
			/[\u2070-\u209F]/.test(text)    // Superscripts and subscripts
		) {
			nodesToProcess.push(walker.currentNode);
		}
	}

	for (const node of nodesToProcess) {
		const parent = node.parentNode;
		const text = node.nodeValue;

		// Store original node info for restoration
		originalNodes.push({
			parent: parent,
			originalText: text,
			placeholder: null,
		});

		// Create spans for each character type with priority order
		const fragments = [];

		// Split text and create appropriate spans
		let currentIndex = 0;
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			const charCode = text.charCodeAt(i);
			let spanClass = null;
			let tooltip = "";

			if (char === "\u2019") {
				// Curved apostrophe '
				spanClass = "gpt-apostrophe-curved";
				tooltip = "Curved apostrophe (U+2019) - GPT indicator";
			} else if (char === "'") {
				spanClass = "gpt-apostrophe-straight";
				tooltip = "Straight apostrophe (U+0027)";
			} else if (char === "–") {
				spanClass = "gpt-en-dash";
				tooltip = "En dash (U+2013) - GPT indicator";
			} else if (char === "-") {
				spanClass = "gpt-hyphen";
				tooltip = "Hyphen (U+002D)";
			} else if (char === "\u202F") {
				// Narrow no-break space - Strong GPT indicator for French
				spanClass = "gpt-narrow-nbsp";
				tooltip = "Narrow no-break space (U+202F) - Strong GPT indicator for French typography";
			} else if (char === "\u00A0") {
				// Non-breaking space
				spanClass = "gpt-nbsp";
				tooltip = "Non-breaking space (U+00A0) - Possible GPT indicator";
			} else if (char === "\u2009") {
				// Thin space
				spanClass = "gpt-thin-space";
				tooltip = "Thin space (U+2009) - GPT typography indicator";
			} else if (char === "\u2008") {
				// Punctuation space
				spanClass = "gpt-punctuation-space";
				tooltip = "Punctuation space (U+2008) - GPT typography indicator";
			} else if (char === "\u2007") {
				// Figure space
				spanClass = "gpt-figure-space";
				tooltip = "Figure space (U+2007) - GPT typography indicator";
			} else if (char === "\u2006") {
				// Six-per-em space
				spanClass = "gpt-six-per-em-space";
				tooltip = "Six-per-em space (U+2006) - GPT typography indicator";
			} else if (char === "\u2E3B") {
				// Two-em dash ⸻
				spanClass = "gpt-two-em-dash";
				tooltip = "Two-em dash (U+2E3B) - Strong GPT indicator for section breaks";
			} else if (char === "\u2014") {
				// Em dash —
				spanClass = "gpt-em-dash";
				tooltip = "Em dash (U+2014) - GPT typography indicator";
			} else if (char === "\uFFFC") {
				// Object replacement character ￼
				spanClass = "gpt-object-replacement";
				tooltip = "Object replacement character (U+FFFC) - Strong GPT indicator (broken references)";
			} else if (charCode >= 0x1D00 && charCode <= 0x1D7F) {
				// Phonetic extensions (includes superscript letters like ᵉ)
				spanClass = "gpt-superscript-letter";
				tooltip = `Superscript letter (U+${charCode.toString(16).toUpperCase()}) - Strong GPT indicator`;
			} else if (charCode >= 0x2070 && charCode <= 0x209F) {
				// Superscripts and subscripts
				spanClass = "gpt-superscript-number";
				tooltip = `Superscript/subscript (U+${charCode.toString(16).toUpperCase()}) - GPT typography indicator`;
			}

			if (spanClass) {
				// Add text before this character
				if (i > currentIndex) {
					fragments.push(
						document.createTextNode(text.substring(currentIndex, i)),
					);
				}

				// Create span for the special character
				const span = document.createElement("span");
				span.className = spanClass;
				span.textContent = char;
				span.title = tooltip;
				fragments.push(span);

				currentIndex = i + 1;
			}
		}

		// Add remaining text
		if (currentIndex < text.length) {
			fragments.push(document.createTextNode(text.substring(currentIndex)));
		}

		// Only replace if we found special characters
		if (fragments.length > 1) {
			// Create a placeholder comment to mark the position
			const placeholder = document.createComment("gpt-detector-placeholder");
			const lastNodeIndex = originalNodes.length - 1;
			originalNodes[lastNodeIndex].placeholder = placeholder;

			parent.replaceChild(placeholder, node);

			// Insert all fragments before the placeholder
			for (const fragment of fragments) {
				parent.insertBefore(fragment, placeholder);
			}
		} else {
			// Remove the entry if no special characters were found
			originalNodes.pop();
		}
	}
};

const highlightDataAttributes = (container) => {
	// Find all elements with data-start or data-end attributes
	const elementsWithDataAttribs = container.querySelectorAll(
		"[data-start], [data-end]",
	);

	for (const element of elementsWithDataAttribs) {
		const hasDataStart = element.hasAttribute("data-start");
		const hasDataEnd = element.hasAttribute("data-end");

		if (hasDataStart || hasDataEnd) {
			// Add highlighting class
			element.classList.add("gpt-data-attribute");

			// Create a visual indicator
			const indicator = document.createElement("span");
			indicator.className = "gpt-data-indicator";
			indicator.innerHTML = "🤖";
			indicator.title = `GPT Data Attributes: ${hasDataStart ? `data-start="${element.getAttribute("data-start")}"` : ""} ${hasDataEnd ? `data-end="${element.getAttribute("data-end")}"` : ""}`;

			// Insert indicator at the beginning of the element
			element.insertBefore(indicator, element.firstChild);
		}
	}
};

const removeGptHighlights = () => {
	const articleContent = document.querySelector(".article-content");
	if (!articleContent) return;

	// Restore original text nodes
	for (const nodeInfo of originalNodes) {
		const { parent, originalText, placeholder } = nodeInfo;

		if (placeholder?.parentNode) {
			// Remove all spans between the placeholder and restore original text
			const nodesToRemove = [];
			let currentNode = placeholder.previousSibling;

			// Collect all nodes that were inserted
			while (currentNode) {
				const prevSibling = currentNode.previousSibling;
				if (
					currentNode.nodeType === Node.ELEMENT_NODE &&
					(currentNode.classList.contains("gpt-apostrophe-curved") ||
						currentNode.classList.contains("gpt-apostrophe-straight") ||
						currentNode.classList.contains("gpt-en-dash") ||
						currentNode.classList.contains("gpt-hyphen") ||
						currentNode.classList.contains("gpt-narrow-nbsp") ||
						currentNode.classList.contains("gpt-nbsp") ||
						currentNode.classList.contains("gpt-thin-space") ||
						currentNode.classList.contains("gpt-punctuation-space") ||
						currentNode.classList.contains("gpt-figure-space") ||
						currentNode.classList.contains("gpt-six-per-em-space") ||
						currentNode.classList.contains("gpt-two-em-dash") ||
						currentNode.classList.contains("gpt-em-dash") ||
						currentNode.classList.contains("gpt-object-replacement") ||
						currentNode.classList.contains("gpt-superscript-letter") ||
						currentNode.classList.contains("gpt-superscript-number"))
				) {
					nodesToRemove.push(currentNode);
				} else if (currentNode.nodeType === Node.TEXT_NODE) {
					// Check if this text node was added by us (by checking if it contains only part of original text)
					nodesToRemove.push(currentNode);
				} else {
					break;
				}
				currentNode = prevSibling;
			}

			// Remove the collected nodes
			for (const node of nodesToRemove) {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}

			// Replace placeholder with original text
			const originalTextNode = document.createTextNode(originalText);
			parent.replaceChild(originalTextNode, placeholder);
		}
	}

	// Remove data attribute highlights
	const elementsWithDataAttribs = articleContent.querySelectorAll(
		".gpt-data-attribute",
	);
	for (const element of elementsWithDataAttribs) {
		element.classList.remove("gpt-data-attribute");

		// Remove indicators
		const indicators = element.querySelectorAll(".gpt-data-indicator");
		for (const indicator of indicators) {
			indicator.remove();
		}
	}

	// Clear stored nodes
	originalNodes = [];
	gptElementsHighlighted = false;
	updateGptDetectorButton();
};

const updateGptDetectorButton = () => {
	const button = document.querySelector(".apostrophe-check-button");
	if (!button) return;

	if (gptElementsHighlighted) {
		button.innerHTML = "Masquer détection GPT";
	} else {
		button.innerHTML = "GPT Detector";
	}
};

const handleApostropheClick = () => {
	if (gptElementsHighlighted) {
		removeGptHighlights();
	} else {
		highlightGptElements();
	}
};