# -*- coding: utf-8 -*-
from server import WebSocketServer

class Service(object):
  def __init__(self):
    pass

  def enter(self, socket):
    pass

  def leave(self, socket):
    pass

  def receve(self, socket, data):
    socket.send('10:%s' % data)

if __name__ == '__main__':
  WebSocketServer(Service()).run(7002)
