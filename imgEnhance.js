// Iterate over all image elements on the page
document.querySelectorAll('img').forEach(function(img) {
    // Check if the image src contains '-300x150'
    if (img.src && img.src.includes('-300x150')) {
        // Replace '-300x150' with an empty string to get the uncompressed image
        img.src = img.src.replace('-300x150', '');
    }
});
