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
    if data == '76':
      self._x += 1
    if data == '72':
      self._x -= 1
    if data == '74':
      socket.send('%s:%s' % (self._y, '&nbsp' * 80))
      self._y += 1
    if data == '75':
      socket.send('%s:%s' % (self._y, '&nbsp' * 80))
      self._y -= 1
    line = '&nbsp;' * self._x + '@'
    socket.send('%s:%s' % (self._y, line))
    socket.send('15:%s' % data)

if __name__ == '__main__':
  WebSocketServer(Service()).run(7002)
