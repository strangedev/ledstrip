package animation

import "image/color"

func (strip LedStrip) Clear() error {
	return strip.Monochrome(color.Black)
}
