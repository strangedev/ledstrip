package server

import (
	"errors"
	"log"
	"sync"

	"github.com/strangedev/ledstrip/lib/animation"
)

type State struct {
	lock              sync.RWMutex
	strip             *animation.LedStrip
	runningAnimation  *animation.Animation
	animationStopChan chan bool
}

func NewState(strip *animation.LedStrip) State {
	return State{
		strip: strip,
	}
}

func (s *State) RunningAnimation() (anim *animation.Animation, ok bool) {
	s.lock.RLock()
	defer s.lock.RUnlock()

	return s.runningAnimation, s.runningAnimation != nil
}

func (s *State) IsAnimationRunning() bool {
	s.lock.RLock()
	defer s.lock.RUnlock()

	return s.runningAnimation != nil
}

func (s *State) StopAnimation() error {
	if !s.IsAnimationRunning() {
		return errors.New("Animation is not running.")
	}

	s.lock.Lock()
	defer s.lock.Unlock()

	log.Println("Stopping animation.")

	s.animationStopChan <- true
	s.runningAnimation = nil

	return nil
}

func (s *State) StartAnimation(anim animation.Animation) error {
	if s.IsAnimationRunning() {
		return errors.New("Another animation is already running.")
	}

	s.lock.Lock()
	defer s.lock.Unlock()

	s.runningAnimation = &anim
	s.animationStopChan = make(chan bool, 1)

	go func() {
		log.Println("Starting animation.")

		defer s.StopAnimation()

		if err := anim.RenderContinuously(s.strip, s.animationStopChan); err != nil {
			log.Printf("Error during animation rendering: %v\n", err)
		}
	}()

	return nil
}
