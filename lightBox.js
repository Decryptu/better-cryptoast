window.onload = function() {
    initializeLightbox();
};

function initializeLightbox() {
    const targetNode = document.querySelector('.article-section');

    if (targetNode) {
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(callback);

        observer.observe(targetNode, config);

        addLightboxToImages(document.querySelectorAll('p img.aligncenter'));
    }

    function callback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll('p img.aligncenter');
                        addLightboxToImages(images);
                    }
                });
            }
        }
    }

    function addLightboxToImages(images) {
        images.forEach(img => {
            if (!img.classList.contains('lightbox-initialized')) {
                img.classList.add('lightbox-initialized');
                img.style.cursor = 'pointer';
                img.addEventListener('click', function() {
                    openLightbox(this.src);
                });
            }
        });
    }

    function openLightbox(src) {
        const overlay = document.createElement('div');
        configureOverlay(overlay);
        createLightboxImage(overlay, src);

        document.body.appendChild(overlay);
        document.addEventListener('keydown', function(event) {
            onEscapeClose(event, overlay);
        });

        overlay.addEventListener('click', function() {
            closeLightbox(overlay);
        });
    }

    function configureOverlay(overlay) {
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
    }

    function createLightboxImage(overlay, src) {
        const lightboxImg = new Image();
        lightboxImg.src = src;
        lightboxImg.style.maxWidth = '90%';
        lightboxImg.style.maxHeight = '90%';
        lightboxImg.style.margin = 'auto';
        lightboxImg.style.border = '3px solid white';
        lightboxImg.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
        overlay.appendChild(lightboxImg);
    }

    function onEscapeClose(e, overlay) {
        if (e.key === "Escape") {
            closeLightbox(overlay);
        }
    }

    function closeLightbox(overlay) {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', onEscapeClose);
    }
}
