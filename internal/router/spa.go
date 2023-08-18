package router

import (
	"io/fs"
	"net/http"
)

type spa struct {
	fs.ReadFileFS
}

func (spa spa) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	dist, _ := fs.Sub(spa.ReadFileFS, "dist")
	http.FileServer(http.FS(dist)).ServeHTTP(w, r)
}
