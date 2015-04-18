# -*- coding: utf-8 -*-
from server import WebSocketServer

class ScreenBuffer(object):
  def __init__(self, size):
    self._size = size
    (w, h) = self._size
    self._grid = [[None for x in range(w)] for y in range(h)]
    self._updated = set()
    self.fill('&nbsp')

  def fill(self, g, color='silver'):
    (w, h) = self._size
    for y in range(h):
      for x in range(w):
        self.put(g, (x, y), color)

  def flush(self, socket):
    data = []
    current_color = None
    for y in self._updated:
      line = '%d:<font color="silver">' % y
      for ch, color in self._grid[y]:
        if color == current_color:
          line += ch
        else:
          line += '</font><font color=%s>%s' % (color, ch)
          current_color = color
      line += '</font>'
      data.append(line)
    data.append('flip')
    socket.send('\x00'.join(data))
    self._updated.clear()

  def put(self, g, (x, y), color='silver'):
    g = g.encode('utf-8')
    if self._grid[y][x] == (g, color): return
    self._grid[y][x] = (g, color)
    self._updated.add(y)

  def write(self, string, (x, y), color):
    for i, ch in enumerate(string):
      self.put(ch, (x+i, y), color);

class Service(object):
  def __init__(self):
    self._x, self._y = (0, 0)
    self._screen = ScreenBuffer((80, 21))

  def enter(self, socket):
    self._screen = ScreenBuffer((80, 21))
    self._screen.flush(socket)

  def leave(self, socket):
    pass

  def receve(self, socket, data):
    self._screen.fill('.')
    key = chr(int(data))
    if key == 'l': self._x += 1
    if key == 'h': self._x -= 1
    if key == 'j': self._y += 1
    if key == 'k': self._y -= 1
    self._screen.put('@', (self._x, self._y), 'olive')
    self._screen.write(u'入力キー:%s' % key, (4, 20), 'lime')
    self._screen.flush(socket)

if __name__ == '__main__':
  WebSocketServer(Service()).run(7002)
