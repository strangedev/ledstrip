package animation

import (
	"errors"
	"fmt"
	"log"
	"time"
)

type Step struct {
	Colors []Color
}

type Animation struct {
	StepTime Duration
	Steps    []Step
}

func (anim Animation) RenderContinuously(strip *LedStrip, stop chan bool) error {
	if err := strip.Clear(); err != nil {
		return err
	}

RenderLoop:
	for {
		for iStep, step := range anim.Steps {
			select {
			case <-stop:
				break RenderLoop
			default:
				break
			}

			if len(step.Colors) != strip.LedCount {
				return errors.New(fmt.Sprintf("LED count mismatch at step %v, strip has %v colors, but step provided %v.", iStep, strip.LedCount, len(step.Colors)))
			}

			for iLed := 0; iLed < strip.LedCount; iLed++ {
				if err := strip.Set(iLed, step.Colors[iLed]); err != nil {
					return err
				}
			}

			if err := strip.Render(); err != nil {
				return err
			}

			time.Sleep(anim.StepTime.Duration)
		}
	}

	if err := strip.Clear(); err != nil {
		return err
	}

	log.Println("Done rendering animation.")

	return nil
}
