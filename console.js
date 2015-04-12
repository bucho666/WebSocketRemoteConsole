// console screen class
function ConsoleScreen(height) {
  (function () {
    for (var i = 0; i < height; i++) {
      var div = document.createElement('div');
      div.innerHTML = '<br>';
      document.body.appendChild(div);
    }
  })();

  this.write = function(line, message) {
    lines = document.body.getElementsByTagName('div')
    lines[line].innerHTML = message
  };
}

// test
var cs = new ConsoleScreen(21);
document.bgColor = 'black';
document.fgColor = 'silver';
document.body.style.fontFamily = 'Courier New';
document.onkeydown = function (e) {
  message = 'code: ' + e.keyCode;
  if (e.shiftKey) message += ' + shift';
  cs.write(0,  '<font color="olive">'  + message + '</font>');
  cs.write(1,  '<font color="green">'  + message + '</font>');
  cs.write(3,  '<font color="aqua">'   + message + '</font>');
  cs.write(9,  '<font color="yellow">' + message + '</font>');
  cs.write(20, '<font color="red">'    + message + '</font>');
};
