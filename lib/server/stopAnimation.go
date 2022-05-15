package server

import (
	"net/http"
)

type StopAnimationHandler struct {
	State *State
}

func (handler *StopAnimationHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := handler.State.StopAnimation(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.WriteHeader(204)
}
