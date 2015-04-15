# -*- coding: utf-8 -*-
from server import WebSocketServer

class Service(object):
  def __init__(self):
    self._x, self._y = (0, 0)

  def enter(self, socket):
    pass

  def leave(self, socket):
    pass

  def receve(self, socket, data):
    key = chr(int(data))
    if key == 'l':
      self._x += 1
    if key == 'h':
      self._x -= 1
    if key == 'j':
      socket.send('%s:%s' % (self._y, '&nbsp' * 80))
      self._y += 1
    if key == 'k':
      socket.send('%s:%s' % (self._y, '&nbsp' * 80))
      self._y -= 1
    line = '&nbsp;' * self._x + '@'
    socket.send('%s:%s' % (self._y, line))
    socket.send('15:%s' % key)

if __name__ == '__main__':
  WebSocketServer(Service()).run(7002)
