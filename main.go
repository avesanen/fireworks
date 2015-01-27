package main

import (
	//"encoding/base64"
	"encoding/json"
	"github.com/googollee/go-socket.io"
	"github.com/zenazn/goji"
	"log"
	"net/http"
)

type eventMouseDown struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type eventDrawCanvas struct {
	X int    `json:"x"`
	Y int    `json:"y"`
	R uint32 `json:"r"`
	G uint32 `json:"g"`
	B uint32 `json:"b"`
	A uint32 `json:"a"`
}

type eventBlitPng struct {
	X      int    `json:"x"`
	Y      int    `json:"y"`
	Width  int    `json:"w"`
	Height int    `json:"h"`
	Data   []byte `json:"data"`
}

func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("connection", func(so socketio.Socket) {
		log.Println("New Connection!")
		so.Join("chat")
		so.On("mousedown", func(msg string) {
			var e eventMouseDown
			err := json.Unmarshal([]byte(msg), &e)
			if err != nil {
				log.Println("Can't unmarshal:", err.Error())
				return
			}

			bytes, err := json.Marshal(e)
			if err != nil {
				log.Println("Can't marshal:", err.Error())
				return
			}
			so.Emit("firework", string(bytes))
			so.BroadcastTo("chat", "firework", string(bytes))
		})
	})

	goji.Get("/socket.io/", server)
	goji.Get("/*", http.FileServer(http.Dir("./web")))
	goji.Serve()
}
