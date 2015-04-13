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

cscreen = new ConsoleScreen(21);

document.bgColor = 'black';
document.fgColor = 'silver';
document.body.style.fontFamily = 'Courier New';
try {
  var host = "ws://localhost:7002/";
  var s = new WebSocket(host);
  // 接続開始処理
  s.onopen = function (e) {
    cscreen.write(20, 'connected');
  };
  // 切断処理
  s.onclose = function (e) {
    cscreen.write(20, 'disconnect');
  };
  // メッセージ受信処理
  s.onmessage = function (e) {
    var match, line, message;
    match = e.data.match(/^(\d+):(.*)/);
    line = match[1];
    message = match[2];
    cscreen.write(line, message);
  };
  // 接続エラー処理
  s.onerror = function (e) {
    cscreen.write(20, 'error');
  };
  // 入力処理
  document.onkeydown = function (e) {
    message = 'code: ' + e.keyCode;
    if (e.shiftKey) message += ' + shift';
    s.send('<font color="olive">'  + message + '</font>');
  };
} catch (ex) {
  // 例外処理
  cscreen.write(20, 'exception');
}


