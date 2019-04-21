# WebSocket relay: converts raw TCP sockets into WebSockets for the browser
import sys
import socketserver
import random
from multiprocessing import Process
from autobahn.twisted.websocket import WebSocketServerProtocol, WebSocketServerFactory
from twisted.python import log
from twisted.internet import reactor

# just ignore pylint being an idiot again, this runs fine
# pylint: disable=no-member

class RobotWSHandler(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))

    def sendRandomData(self):
        self.sendMessage(str(random.randint(50, 60)).encode("utf-8"))
        reactor.callLater(0.5, self.sendRandomData)

    def onOpen(self):
        print("WebSocket connection open.")
        self.sendRandomData()

    def onMessage(self, payload, isBinary):
        pass

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


class RobotTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        print("Some data received or something")


def create_tcp_server():
    print("Starting TCP server...")
    server = socketserver.TCPServer(("localhost", 24324), RobotTCPHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Terminating TCP server!")
        server.server_close()


# Port 24321 = WebSocket (for JS), Port 24324 = TCP socket (robot to computer comms)
if __name__ == '__main__':
    # start TCP server (in its own process since it blocks)
    p = Process(target=create_tcp_server)
    p.start()
    
    # start WS server
    log.startLogging(sys.stdout)

    factory = WebSocketServerFactory(u"ws://127.0.0.1:24321")
    factory.protocol = RobotWSHandler

    reactor.listenTCP(24321, factory)
    reactor.run()

    # TODO maybe "npm run dev" here as well?