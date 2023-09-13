package router

import (
	"log"
	"net/http"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

type socket struct {
	client *client
}

func (socket socket) ServeHTTP(w http.ResponseWriter, r *http.Request)  {
	conn, _, _, err := ws.UpgradeHTTP(r, w)
	if err != nil {
		log.Printf("Unable to upgrade: %s", err)
		return
	}

	go func() {
		socket.client.add(&conn)
		defer socket.client.remove(&conn)

		for {
			msg, op, err := wsutil.ReadClientData(conn)
			if err != nil {
				log.Printf("Unable to read message: %v", err)
				return
			}

			socket.client.broadcast(msg, op)
		}
	}()
}