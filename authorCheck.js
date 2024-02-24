// Check the author
let authorElement = document.querySelector('.ms-2.author-name > a');
if (authorElement && authorElement.href === 'https://cryptoast.fr/author/robin/') {
    // Add CSS for the animation
    let style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% {background: red;}
            14% {background: orange;}
            28% {background: yellow;}
            42% {background: lime;}
            57% {background: cyan;}
            71% {background: blue;}
            85% {background: magenta;}
            100% {background: red;}
        }
        .rainbow {
            animation: rainbow 3s linear infinite !important;
            background-size: 200% 200% !important;
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Create a new div
    let rainbowDiv = document.createElement('div');
    rainbowDiv.classList.add('rainbow');

    // Add the div to the body
    document.body.appendChild(rainbowDiv);
}

//Play a music on a certain page
window.addEventListener('load', function() {
    if(window.location.href === 'https://cryptoast.fr/author/maximilien/') {
        let audio = new Audio('https://cdn.discordapp.com/attachments/1066833707941515326/1135228657418379274/Bring_Me_The_Horizon_-_Can_You_Feel_My_Heart.mp3?ex=65e49393&is=65d21e93&hm=8d25d517f57683ba87909cfdc720fbf02d2086f4ec6876905bc601cb00d3df06&');

        document.addEventListener('click', function() {
            let promise = audio.play();

            if (promise !== undefined) {
                promise.catch(error => {
                    // Auto-play was prevented.
                    console.log("Auto-play prevented:", error);
                }).then(() => {
                    // Auto-play started successfully.
                    console.log("Auto-play started successfully");
                });
            }
        });
    }
});

//Chad
const observer = new MutationObserver(function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                if (images[i].src === 'https://cryptoast.fr/wp-content/uploads/2023/01/Sans-titre-1-300x300.png') {
                    images[i].src = 'https://i.imgur.com/X4bya8i.png';
                }
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });