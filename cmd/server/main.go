package main

import (
	"github.com/pacna/chillax/internal/fs"
	"github.com/pacna/chillax/internal/router"
)

func main() {
	router.New(fs.UIDist).RegisterRouter().Serve()
}