//
// Semantic highlighting experiment, now with more CodeMirror
//
// Author: Evan Brooks
// Updated: June 11, 2014
//

var editor;
var textarea = document.getElementById("code");

// Fancy comments demo...  1 — this whole line looks like text
// var bar = "foo"; 2 — this whole line looks like code
var foo = "bar"; // 3 — This is an annotation

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



// Add stylesheet
//
// Another demo function, uncommented
//

function addStyleSheet(css) {
  var head, styleElement;
  head = document.getElementsByTagName('head')[0];
  styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    styleElement.appendChild(document.createTextNode(css));
  }
  head.appendChild(styleElement);
  return styleElement;
}



// Initiate this demo
//
// Load this script into the textarea, then launch codemirror
//

$.get("script/main.js", function(data){

  // Put data in text area
  textarea.value = data;

  // Initiate codemirror from that text area
  editor = CodeMirror.fromTextArea(textarea, {
    mode: "javascript",
    tabSize: 2,
    lineNumbers: false,
    lineWrapping: true,
    keyMap: "sublime",
    theme: "loop-dark",
  });
}, "text");



// Toggle dark theme
//

var isDark = true;

var btn = document.querySelector("#themebtn");
btn.addEventListener("click", function(e){
  if (isDark) {
    editor.setOption("theme", "loop-light");
    document.body.classList.remove("dark-theme");
    isDark = false;
  }
  else {
    editor.setOption("theme", "loop-dark");
    document.body.classList.add("dark-theme");
    isDark = true;
  }
}, false);


// Toggle fancy comments
//

var isFancy = true;

var fancy = document.querySelector("#commentsbtn");
fancy.addEventListener("click", function(e){
  if (isFancy) {
    document.body.classList.remove("fancy-comments");
    isFancy = false;
  }
  else {
    document.body.classList.add("fancy-comments");
    isFancy = true;
  }
}, false);

