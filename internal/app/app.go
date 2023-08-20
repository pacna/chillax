package app

import (
	"flag"

	"github.com/pacna/chillax/internal/fs"
	"github.com/pacna/chillax/internal/router"
)

func Run() {
	port := flag.String("port", "5000", "allow user to set custom port")

	flag.Parse()

	router.New(fs.UIDist, *port).RegisterRouter().Serve()
}