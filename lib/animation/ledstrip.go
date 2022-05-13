package animation

import "github.com/strangedev/ledstrip/lib"

type LedStrip struct {
	*lib.Driver
}

func NewLedStrip(pin int, ledCount int) (LedStrip, error) {
	driver, err := lib.NewDriver(pin, ledCount)
	if err != nil {
		return LedStrip{}, err
	}

	if err := driver.Init(); err != nil {
		return LedStrip{}, err
	}

	return LedStrip{Driver: driver}, nil
}
