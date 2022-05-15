package cmd

import (
	"fmt"
	"log"
	"time"

	"image/color"

	"github.com/spf13/cobra"
	"github.com/strangedev/ledstrip/lib/animation"
)

func init() {
	rootCmd.AddCommand(testCommand)
}

func MustNotFail(err error) {
	if err != nil {
		log.Fatalf("Unexpected error: %v", err)
	}
}

var testCommand = &cobra.Command{
	Use:   "test",
	Short: "runs a test of the led strip",
	Run: func(cmd *cobra.Command, args []string) {
		strip, err := animation.NewLedStrip(pin, ledCount)
		if err != nil {
			log.Fatalf("Cannot initialize the LED strip: %v", err)
		}

		fmt.Println("Red")
		MustNotFail(strip.Monochrome(color.RGBA{R: 255, G: 0, B: 0, A: 1}))
		MustNotFail(strip.Render())

		time.Sleep(time.Second * 5)

		fmt.Println("Green")
		MustNotFail(strip.Monochrome(color.RGBA{R: 0, G: 255, B: 0, A: 1}))
		MustNotFail(strip.Render())

		time.Sleep(time.Second * 5)

		fmt.Println("Blue")
		MustNotFail(strip.Monochrome(color.RGBA{R: 0, G: 0, B: 255, A: 1}))
		MustNotFail(strip.Render())

		time.Sleep(time.Second * 5)

		fmt.Println("Clear")
		MustNotFail(strip.Clear())
		MustNotFail(strip.Render())

		if err := strip.Close(); err != nil {
			log.Fatalf("Cannot close the LED strip: %v", err)
		}
	},
}
