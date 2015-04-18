# -*- coding: utf-8 -*-
from server import WebSocketServer

class ScreenBuffer(object):
  def __init__(self, size):
    self._size = size
    (w, h) = self._size
    self._grid = [[None for x in range(w)] for y in range(h)]
    self._updated = set()
    self.fill('&nbsp')

  def fill(self, g):
    (w, h) = self._size
    for y in range(h):
      for x in range(w):
        if self._grid[y][x] == g: continue
        self._grid[y][x] = g
        self._updated.add(y)

  def flush(self, socket):
    for y in self._updated:
      socket.send('%d:%s' % (y, "".join(self._grid[y])))
    socket.send('flip')
    self._updated.clear()

  def put(self, g, (x, y)):
    if self._grid[y][x] == g: return
    self._grid[y][x] = g
    self._updated.add(y)

class Service(object):
  def __init__(self):
    self._x, self._y = (0, 0)
    self._screen = ScreenBuffer((80, 21))

  def enter(self, socket):
    pass

  def leave(self, socket):
    pass

  def receve(self, socket, data):
    self._screen.fill('.')
    key = chr(int(data))
    if key == 'l': self._x += 1
    if key == 'h': self._x -= 1
    if key == 'j': self._y += 1
    if key == 'k': self._y -= 1
    self._screen.put('@', (self._x, self._y))
    self._screen.flush(socket)
    socket.send('15:%s' % key)

if __name__ == '__main__':
  WebSocketServer(Service()).run(7002)
