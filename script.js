window.onload = init;

var $text_area
  , $output
  , tokens = []
  , token_colors = {}
    // Characters that separate tokens
  , rx_splitters = /[\s\+\-=\*\(\)\{\}\[\]\.;\|,\!]/g
  , rx_splitters_string = "([\\s\\+\\-=\\*\\(\\)\\{\\}\\[\\]\\.;\\|,\\!])"
    // Match comments
  , rx_comments = /(\/\/(.*))\r?\n|\r/g
    // Match "strings", 'strings', and /regexes/
  , rx_strings = /("(.*?)")|('(.*?)')|(\/([^\s]+?)[^\\]\/[a-z]*)/g
    // Match #hex colors
  , rx_colors = /(#[0-9a-fA-F]{6})/g
    // Match numbers
  , rx_numbers = /([\s\+\-=\*\(\)\{\}\[\]\.;\|,\!])([0-9]+)([\s\+\-=\*\(\)\{\}\[\]\.;\|,\!])/g
    // Match valid characters: letters, numbers, _underscore, $
    // but don't let first character be a number
  , rx_allowed =  /(^[a-zA-Z_\$][a-zA-Z0-9_\$]*)/
  ;


// ==============================

function init() {

  // Get selectors
  $text_area = document.querySelector("#text");
  $output = document.querySelector("#output");

  init_ui();
  init_theme();
  init_keywords();

  // Load script into textarea
  $.get("script.js", function(data){
    $text_area.value = data;
    update();
  });
}



// ==============================


function update() {
  var text = $text_area.value;
  var processed = process(text);
  $output.innerHTML = processed;
  // var cursor_pos = $text_area.selectionStart;
  // console.log(cursor_pos);
}


// ==============================


function init_theme() {
  var node = document.querySelector(".colortheme");
  var colors = node.innerHTML.trim().split("\n");
  // colors = shuffle(colors);
  
  var css = "";
  for (var i = 0; i < colors.length; i++) {
    css += ".var" + i + "{color:" + colors[i] + ";} ";
  }
  add_style_sheet(css);
}

// ==============================


function init_keywords() {
  var node = document.querySelector(".keywords");
  var kw_list = node.innerHTML.trim().split("\n");
  keywords = make_regex(kw_list,"");
}


// ==============================


// (html) process(string);

function process(string) {
  var html = string;

  assign_colors(string);

  var variable_regex = make_regex(tokens, "g");


  html = htmlify(html);
  html = html.replace(rx_strings, replace_rx_strings);

  // html = html.replace(rx_regexes, replace_rx_regexes);

  // html = html.replace(keywords, replace_keywords);

  html = highlight_variables(html, variable_regex);
  html = html.replace(rx_comments, replace_rx_comments);
  html = html.replace(rx_colors, replace_rx_colors);
  html = html.replace(rx_numbers, replace_rx_numbers);

  return html + "\n";
}

// ==============================


function assign_colors(string) {

  var split = string.split(rx_splitters);

  old_colors = token_colors;
  token_colors = get_uniques(split);
  tokens = Object.keys(token_colors).sort();

  var len = tokens.length;

  for (var i = 0; i < len; i++) {

    var percent = i / len;
    var index = parseInt( (percent * 132) + (Math.random() * 0) );

    if (index < 0) index = 0;
    else if (index > 99) index = 132 - index;
    else if (index > 66) index = index - 66;
    else if (index > 33) index = 66 - index;

    var color = "var" + index;
    token_colors[tokens[i]] = color;

    // var color;
    // if (old_colors[key]) color = old_colors[key];
    // else color = "var" + index;
    // token_colors[key] = color;
    // index = index + 1;
    // if (index > 34) index = 1;
  }
}


// ==============================


// (dictionary) get_unique_dictionary(array)

function get_uniques(arr) {
  var uniques = {};
  for (var i = arr.length - 1; i >= 0; i--) {
    if ( arr[i].length > 0
          && rx_allowed.test(arr[i])
          && !keywords.test((" " + arr[i] + " "))
    ) {
      uniques[ arr[i] ] = true;
    }
  };
  return uniques;
}



// ==============================

// Make a regex that finds any word in the array between splitter characters

function make_regex(arr, flags) {
  var str = "(" + arr.join("|").replace(/\$/g,"\\$") + ")";
  str = rx_splitters_string + str + "(?=" + rx_splitters_string + ")";
  var regex = new RegExp(str, flags);
  return regex;
}


// ==============================



function highlight_variables(str, regex) {
  var replaced = str.replace(regex, replace_vars);
  return replaced;
}


// ==============================




function replace_keywords(match, p1, p2, p3, offset, string) {
  return p1 + "<i class='kw1'>" + p2 + "</i>" + p3;
}

function replace_rx_comments(match, p1, p2, p3, offset, string) {
  return "<i class='cmnt'>" + match + "</i>";
}

function replace_rx_strings(match, p1, p2, p3, offset, string) {
  var cls;
  if (match.charAt(0) == "/") cls = "reg";
  else cls = "str";

  return "<i class='" + cls + "'>" + match + "</i>";
}

function replace_rx_colors(match, p1, p2, p3, offset, string) {
  var clr =  "<i class='clr' style='background: ";
      clr += match + "; box-shadow: 0 0 0 2px " + match + "; ' >";
      clr += match + "</i>";
  return clr;
}

function replace_rx_regexes(match, p1, p2, p3, offset, string) {
  return "<i class='reg'>" + match + "</i>";
}

function replace_rx_numbers(match, p1, p2, p3, offset, string) {
  return p1 + "<i class='num'>" + p2 + "</i>" + p3;
}

function replace_vars(match, p1, p2, p3, offset, string) {
  var colorclass = token_colors[p2];
  return p1 + "<i class='" + colorclass + "'>" + p2 + "</i>";
}

// ==============================

// User Interface

function init_ui() {
  // Update on key up
  $text_area.onkeyup = update;

  // Set up buttons
  var $edit_btn = document.querySelector("#edit_btn");
  var $view_btn = document.querySelector("#view_btn");

  // Add click event
  $edit_btn.onclick = function(){
    $text_area.scrollTop = $output.scrollTop;
    document.body.classList.remove("viewing");
  }
  $view_btn.onclick = function(){
    $output.scrollTop  = $text_area.scrollTop;
    document.body.classList.add("viewing");
  }

  // Synchronize scrolling
  $text_area.onscroll = function(){
    // $output.scrollTop  = $text_area.scrollTop;
  }
  $output.onscroll = function(){
    // $text_area.scrollTop = $output.scrollTop;
  }
}



// ==============================

// DOM Utilities


function add_style_sheet (css) {
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


// ==============================

// Utilities

function contains(str, substr) {
  return str.indexOf(substr) !== -1;
}


function htmlify(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function unquote(str) {
  return String(str).replace(/"/g, '&quot;');
}

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

