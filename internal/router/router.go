package router

import (
	"fmt"
	"io/fs"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Router struct {
	*http.Server
	fs.ReadFileFS
	muxRouter *mux.Router
}

func New(fs fs.ReadFileFS) *Router {
	router := &Router{
		Server: &http.Server{
			Addr:         "0.0.0.0:5000",
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		},
		ReadFileFS:   fs,
		muxRouter:  mux.NewRouter(),
	}

	return router
}

func (router *Router) RegisterRouter() *Router {
	router.muxRouter.PathPrefix("/").Handler(spa{ReadFileFS: router.ReadFileFS})
	http.Handle("/", router.muxRouter)

	return router
}

func (router *Router) Serve() {
	fmt.Println("Server is listening on", router.Addr)
	router.Server.ListenAndServe()
}