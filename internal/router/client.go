package router

import (
	"log"
	"net"
	"sync"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

type client struct {
	conns map[*net.Conn]struct{}
	mux   sync.Mutex
}

func (client *client) add(conn *net.Conn) {
	client.mux.Lock()
	defer client.mux.Unlock()
	client.conns[conn] = struct{}{}
}

func (client *client) remove(conn *net.Conn) {
	client.mux.Lock()
	defer client.mux.Unlock()
	delete(client.conns, conn)
}

func (client *client) broadcast(msg []byte, op ws.OpCode) {
	client.mux.Lock()
	defer client.mux.Unlock()
	for conn := range client.conns {

		err := wsutil.WriteServerMessage(*conn, op, msg)
		if err != nil {
			log.Printf("Error broadcasting to client: %v", err)
			client.remove(conn)
			return
		}
	}
}