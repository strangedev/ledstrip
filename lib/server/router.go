package server

import (
	"github.com/gorilla/mux"
	"github.com/strangedev/ledstrip/lib/animation"
)

func NewRouter(strip *animation.LedStrip) *mux.Router {
	state := NewState(strip)

	router := mux.NewRouter()

	router.Handle("/animation/start", &StartAnimationHandler{State: &state})
	router.Handle("/animation/stop", &StopAnimationHandler{State: &state})

	return router
}
