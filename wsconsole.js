// console screen class
function ConsoleScreen(height) {
  var screen = document.createElement('div');
  screen.id = 'screen'
  document.body.appendChild(screen);
  for (var i = 0; i < height; i++) {
    var line = document.createElement('div');
    line.innerHTML = '<br>';
    screen.appendChild(line);
  }
  this.backBuffer = screen.cloneNode(true);

  this.write = function(line, message) {
    lines = this.backBuffer.getElementsByTagName('div');
    lines[line].innerHTML = message;
  };

  this.flip = function() {
    var front = document.getElementById('screen');
    document.body.replaceChild(this.backBuffer, front);
    this.backBuffer = this.backBuffer.cloneNode(true);
  };

  this.receve = function(data) {
    var commands, i, length;
    commands = data.split('\x00');
    length = commands.length;
    for (i=0;i < length; i++) {
      this._accept(commands[i]);
    }
  }

  this._accept = function(command) {
    if (command === 'flip') {
      this.flip();
    } else {
      this._update_line(command);
    }
  }

  this._update_line = function(command) {
    var match, line, message;
    match = command.match(/^(\d+):(.*)/);
    line = match[1];
    message = match[2];
    this.write(line, message);
  }
}

cscreen = new ConsoleScreen(22);

document.bgColor = 'black';
document.fgColor = 'silver';
document.body.style.fontFamily = 'Courier New';
try {
  var host = "ws://localhost:7002/";
  var s = new WebSocket(host);
  // 接続開始処理
  s.onopen = function (e) {
    cscreen.write(21, '<font color="green">connected</font>');
  };
  // 切断処理
  s.onclose = function (e) {
    cscreen.write(21, '<font color="red">disconnect</font>');
  };
  // メッセージ受信処理
  s.onmessage = function (e) {
    cscreen.receve(e.data);
  };
  // 接続エラー処理
  s.onerror = function (e) {
    cscreen.write(21, 'error');
  };
  // 入力処理
  document.onkeypress= function (e) {
    s.send(e.charCode)
  };
} catch (ex) {
  // 例外処理
  cscreen.write(21, 'exception');
}


