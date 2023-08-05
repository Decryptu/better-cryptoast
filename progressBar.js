// Add a progress bar on the top of the articles
window.onscroll = function() {myFunction()};

function myFunction() {
  var articleElement = document.querySelector('.article-main-ctn');
  if (articleElement) {
    var articleHeight = articleElement.scrollHeight;
    var scrollPosition = window.pageYOffset;
    var windowHeight = window.innerHeight;
    var scrollHeight = articleHeight - windowHeight;
    var progress = (scrollPosition / scrollHeight) * 100;

    document.getElementById('myBar').style.width = progress + '%';
  }
}

var bar = document.createElement('div');
bar.setAttribute('id', 'myBar');
document.body.appendChild(bar);