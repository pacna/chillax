package router

import (
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"sync"
	"time"
)

type Router struct {
	*http.Server
	fs.ReadFileFS
}

func New(fs fs.ReadFileFS, port string) *Router {
	router := &Router{
		Server: &http.Server{
			Addr:         fmt.Sprintf("0.0.0.0:%s", port),
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		},
		ReadFileFS:   fs,
	}

	return router
}

func (router *Router) RegisterSPA() *Router {
	http.Handle("/", spa{ReadFileFS: router.ReadFileFS})

	return router
}

func (router *Router) RegisterSocket() *Router {
	http.Handle("/ws", socket{
		client:  &client{
			conns: make(map[*net.Conn]struct{}),
			mux: sync.Mutex{},
		},
	})

	return router;
}


func (router *Router) Serve() {
	fmt.Println("Server is listening on", router.Addr)
	router.Server.ListenAndServe()
}