// Write your package code here!
if (Meteor.isClient) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/g/foundation@6.0.5(foundation.min.js+js/foundation.responsiveMenu.js+js/foundation.responsiveToggle.js),foundation@6.1.1(js/foundation.responsiveMenu.js+js/foundation.responsiveToggle.js)';
    script.type = 'text/javascript';
    head.appendChild(script);

    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = 'https://cdn.jsdelivr.net/foundation/6.0.5/foundation.min.css';
    head.appendChild(style);
}