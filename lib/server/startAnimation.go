package server

import (
	"encoding/json"
	"net/http"

	"github.com/strangedev/ledstrip/lib/animation"
)

type StartAnimationHandler struct {
	State *State
}

func (handler *StartAnimationHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var anim animation.Animation
	if err := json.NewDecoder(r.Body).Decode(&anim); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if err := handler.State.StartAnimation(anim); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.WriteHeader(201)
}
