// Semantic highlighting experiment with codemirror
// Evan Brooks
// June 2014
//



var textarea = document.getElementById("code");
var cm;

// Init
// Get this script and put it in the textarea
// before initiating codemirror
//

console.log("top");


var gotten = false;
$.get("script/main.js", function(data){

  console.log("got!");

  if (gotten) return;
  gotten = true;

  textarea.innerText = data;

  // cm = CodeMirror.fromTextArea(textarea, {
  //   mode: self.mode,
  //   tabSize: 2,
  //   lineNumbers: false,
  //   lineWrapping: true,
  //   keyMap: "sublime",
  //   theme: "loop-light",
  // });

});

// Handy demo function
// This shuffles an array the right way and has been included
// to demonstrate syntax highlighting
//
