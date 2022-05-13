package animation

import "image/color"

func (strip LedStrip) Monochrome(color color.Color) error {
	for i := 0; i < strip.LedCount; i++ {
		if err := strip.Set(i, color); err != nil {
			return err
		}
	}

	return nil
}
