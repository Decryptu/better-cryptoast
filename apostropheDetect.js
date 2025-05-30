// apostropheDetect.js - Enhanced GPT Detector
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

	// Highlight text elements (apostrophes, dashes)
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
			text.includes("\u2019") ||
			text.includes("'") ||
			text.includes("–") ||
			text.includes("-")
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
			let spanClass = null;

			if (char === "\u2019") {
				// Curved apostrophe '
				spanClass = "gpt-apostrophe-curved";
			} else if (char === "'") {
				spanClass = "gpt-apostrophe-straight";
			} else if (char === "–") {
				spanClass = "gpt-en-dash";
			} else if (char === "-") {
				spanClass = "gpt-hyphen";
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
						currentNode.classList.contains("gpt-hyphen"))
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
