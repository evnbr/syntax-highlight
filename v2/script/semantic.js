// ========================

// C O L O R S   ( H U S L p )

(function(){

  var css = "";
  var variations = 60;

  for (var i = 0; i < variations; i++) {

    if (i % 3 === 0) dark = 65;
    else if (i % 3 === 1) dark = 60;
    else dark = 55;

    var col = $.husl.p.toHex( ((i / variations) * 360), 100, dark);
    //var col = $.husl.p.toHex( ((i / variations) * 360), 100, dark);
    var className = ".cm-s-loop-light .cm-semantic-" + i;
    css += className + " { color: " + col + ";}\n"; 
  }

  for (var i = 0; i < variations; i++) {

    var dark = 62;
    if (i % 2 == 0) dark = 72;

    var col = $.husl.p.toHex(((i / variations) * 360), 60, dark);
    // var bcol = $.husl.p.toHex(((i / variations) * 360), 10, 23);
    // var bordcol = $.husl.p.toHex(((i / variations) * 360), 50, 30);
    var className = ".cm-s-loop-dark .cm-semantic-" + i;
    css += className + " { color: " + col + ";}\n"; 
  }
  // for (var i = 0; i < variations; i++) {
  //   var col = $.husl.p.toHex(((i / variations) * 360), 50, 50);
  //   var className = ".cm-s-loop-dark .cm-semantic-" + i;
  //   css += className + " { color: " + col + "}\n"; 
  // }
  add_style_sheet(css);


  // ==============================

  // D O M  U T I L I T I E S


  function add_style_sheet(css) {
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

})();