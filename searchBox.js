// Create search box
const searchContainer = document.createElement("div");
searchContainer.classList.add("search-container");
const searchBox = document.createElement("input");
searchBox.type = "text";
searchBox.placeholder = "Search...";
searchBox.id = "searchBox";
searchBox.classList.add("search-input-ctn");
searchContainer.appendChild(searchBox);

// Insert search box to the right of the title
const title = document.querySelector(
	".news-section-second-title.color-orange-gradient.fw-bold",
);

if (title) {
	title.parentNode.insertBefore(searchContainer, title.nextSibling);

	searchBox.addEventListener("keyup", (e) => {
		const searchString = e.target.value
			.toLowerCase()
			.replace(/\s+/g, " ")
			.trim();
		const searchWords = searchString.split(" ");

		const articles = document.querySelectorAll(".last-news-card.card-shadow");

		if (searchString === "") {
			// Show all articles if the search field is empty
			for (const article of articles) {
				article.style.display = "";
			}
		} else {
			// Apply search filtering when there's a search term
			for (const article of articles) {
				const title = article
					.querySelector(".last-news-card-title.ps-1.animated-underline span")
					.textContent.toLowerCase();
				const titleWords = title.split(" ");

				const articleShouldBeShown = searchWords.some((searchWord) =>
					titleWords.some((titleWord) => isSimilar(searchWord, titleWord)),
				);

				article.style.display = articleShouldBeShown ? "" : "none";
			}
		}
	});
}

function isSimilar(word1, word2) {
	// Apply fault tolerance only for words of a certain length to reduce false positives
	if (word1.length < 4 || word2.length < 4) {
		return word1 === word2; // No fault tolerance for short words
	}

	// Check direct inclusion for longer words
	if (word1.includes(word2) || word2.includes(word1)) return true;

	// Apply Levenshtein distance for closer inspection with stricter rules for longer words
	const distance = levenshteinDistance(word1, word2);
	if (word1.length >= 5 && word2.length >= 5) {
		// Allow a smaller ratio of errors for longer words
		return distance <= Math.floor(Math.max(word1.length, word2.length) / 5);
	}
	return distance <= 1; // One character difference for words shorter than 5 characters
}

// Function to calculate the Levenshtein distance between two strings
function levenshteinDistance(a, b) {
	const an = a.length;
	const bn = b.length;
	const matrix = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));
	for (let i = 0; i <= an; i++) matrix[i][0] = i;
	for (let j = 0; j <= bn; j++) matrix[0][j] = j;

	for (let i = 1; i <= an; i++) {
		for (let j = 1; j <= bn; j++) {
			const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + substitutionCost, // substitution
			);
		}
	}

	return matrix[an][bn];
}
