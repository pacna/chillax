package router

import (
	"fmt"
	"net/http"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

type socket struct {}

func (socket socket) ServeHTTP(w http.ResponseWriter, r *http.Request)  {
	conn, _, _, err := ws.UpgradeHTTP(r, w)
	fmt.Println("hi")
	if err != nil {
		// handle error
	}
	go func() {
		defer conn.Close()

		for {
			msg, op, err := wsutil.ReadClientData(conn)
			if err != nil {
				// handle error
			}
			err = wsutil.WriteServerMessage(conn, op, msg)
			if err != nil {
				// handle error
			}
		}
	}()
}