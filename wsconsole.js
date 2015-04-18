// console screen class
var backBuffer;
function ConsoleScreen(height) {
  (function () {
    var screen = document.createElement('div');
    screen.id = 'screen'
    document.body.appendChild(screen);
    for (var i = 0; i < height; i++) {
      var line = document.createElement('div');
      line.innerHTML = '<br>';
      screen.appendChild(line);
    }
    backBuffer = screen.cloneNode(true);
  })();

  this.write = function(line, message) {
    lines = backBuffer.getElementsByTagName('div');
    lines[line].innerHTML = message;
  };

  this.flip = function() {
    var front = document.getElementById('screen');
    document.body.replaceChild(backBuffer, front);
    backBuffer = backBuffer.cloneNode(true);
  };
}

cscreen = new ConsoleScreen(21);

document.bgColor = 'black';
document.fgColor = 'silver';
document.body.style.fontFamily = 'Courier New';
try {
  var host = "ws://localhost:7002/";
  var s = new WebSocket(host);
  // 接続開始処理
  s.onopen = function (e) {
    cscreen.write(20, '<font color="green">connected</font>');
  };
  // 切断処理
  s.onclose = function (e) {
    cscreen.write(20, '<font color="red">disconnect</font>');
  };
  // メッセージ受信処理
  s.onmessage = function (e) {
    var match, line, message, i, length, data;
    commands = e.data.split('\x00');
    length = commands.length;
    console.log(commands);
    for (i=0;i < length; i++) {
      data = commands[i];
      if (data == 'flip') {
          cscreen.flip();
          return;
      }
      match = data.match(/^(\d+):(.*)/);
      line = match[1];
      message = match[2];
      cscreen.write(line, message);
    }
  };
  // 接続エラー処理
  s.onerror = function (e) {
    cscreen.write(20, 'error');
  };
  // 入力処理
  document.onkeypress= function (e) {
    s.send(e.charCode)
  };
} catch (ex) {
  // 例外処理
  cscreen.write(20, 'exception');
}


