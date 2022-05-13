package lib

/*
#cgo LDFLAGS: -lm -L../extern/rpi_ws281x -l:libws2811.a

#include <string.h>
#include <stdint.h>
#include "../extern/rpi_ws281x/ws2811.h"

void ws2811_set_led(ws2811_t *ws2811, int ch, int index, uint32_t value) {
	ws2811->channel[ch].leds[index] = value;
}
*/
import "C"
import (
	"errors"
	"fmt"
	"image/color"
	"unsafe"
)

const (
	ByteOrderGRB = 0x00_08_10_00
	DMAChannel   = 10
	Frequency    = 800_000
)

type Driver struct {
	Pin      int
	LedCount int
	leds     *C.ws2811_t
}

func NewDriver(pin int, ledCount int) (*Driver, error) {
	driver := &Driver{
		Pin:      pin,
		LedCount: ledCount,
		leds:     (*C.ws2811_t)(C.malloc(C.sizeof_ws2811_t)),
	}

	if driver.leds == nil {
		return nil, errors.New("Bad alloc")
	}

	C.memset(unsafe.Pointer(driver.leds), 0, C.sizeof_ws2811_t)

	return driver, nil
}

func (driver *Driver) Init() error {
	driver.leds.channel[0].count = C.int(driver.LedCount)
	driver.leds.channel[0].gpionum = C.int(driver.Pin)
	driver.leds.channel[0].brightness = C.uint8_t(255)
	driver.leds.channel[0].invert = C.int(0)
	driver.leds.channel[0].strip_type = C.int(int(ByteOrderGRB))

	driver.leds.channel[1].count = C.int(0)
	driver.leds.channel[1].gpionum = C.int(0)
	driver.leds.channel[1].brightness = C.uint8_t(0)
	driver.leds.channel[1].invert = C.int(0)
	driver.leds.channel[1].strip_type = C.int(0)

	driver.leds.freq = C.uint32_t(Frequency)
	driver.leds.dmanum = C.int(DMAChannel)

	if errno := int(C.ws2811_init(driver.leds)); errno != 0 {
		return fmt.Errorf("ws2811_init failed with code: %d", errno)
	}

	return nil
}

func (driver *Driver) Render() error {
	if errno := int(C.ws2811_render(driver.leds)); errno != 0 {
		return fmt.Errorf("ws2811_render failed with code: %d", errno)
	}

	return nil
}

func (driver *Driver) Set(ledIndex int, color color.Color) error {
	red, green, blue, alpha := color.RGBA()
	colorInt := (alpha>>8)<<24 | (red>>8)<<16 | (green>>8)<<8 | blue>>8

	C.ws2811_set_led(driver.leds, C.int(0), C.int(ledIndex), C.uint32_t(colorInt))

	return nil
}

func (driver *Driver) Close() error {
	C.ws2811_fini(driver.leds)

	return nil
}
