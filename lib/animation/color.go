package animation

import (
	"errors"
	"fmt"
	"image/color"
	"strconv"
)

type Color struct {
	color.Color
}

func (c *Color) UnmarshalJSON(b []byte) (err error) {
	colorString := string(b[1:8])

	if colorString[0] != '#' {
		return errors.New(fmt.Sprintf("Invalid start character: %c", colorString[0]))
	}
	if len(colorString) != 7 {
		return errors.New(fmt.Sprintf("Invalid color length: %v", len(colorString)))
	}

	redHex := colorString[1:3]
	greenHex := colorString[3:5]
	blueHex := colorString[5:7]

	red, err := strconv.ParseUint(redHex, 16, 8)
	if err != nil {
		return errors.New(fmt.Sprintf("Unable to parse red channel: %v", err))
	}
	green, err := strconv.ParseUint(greenHex, 16, 8)
	if err != nil {
		return errors.New(fmt.Sprintf("Unable to parse green channel: %v", err))
	}
	blue, err := strconv.ParseUint(blueHex, 16, 8)
	if err != nil {
		return errors.New(fmt.Sprintf("Unable to parse blue channel: %v", err))
	}

	c.Color = color.RGBA{R: uint8(red), G: uint8(green), B: uint8(blue), A: 1}

	return
}

func (c Color) MarshalJSON() (b []byte, err error) {
	red, green, blue, _ := c.Color.RGBA()
	red8Bit := uint8(red >> 8)
	green8Bit := uint8(green >> 8)
	blue8Bit := uint8(blue >> 8)

	return []byte(fmt.Sprintf(`"#%02x%02x%02x"`, red8Bit, green8Bit, blue8Bit)), nil
}
