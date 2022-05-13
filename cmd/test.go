package cmd

import (
	"log"
	"time"

	"image/color"

	"github.com/spf13/cobra"
	"github.com/strangedev/ledstrip/lib/animation"
)

var (
	pin      int
	ledCount int
)

func init() {
	testCommand.Flags().IntVar(&pin, "pin", 12, "Pin number of the data pin")
	testCommand.Flags().IntVar(&ledCount, "led", 1, "Number of LEDs")

	rootCmd.AddCommand(testCommand)
}

var testCommand = &cobra.Command{
	Use:   "test",
	Short: "runs a test of the led strip",
	Run: func(cmd *cobra.Command, args []string) {
		strip, err := animation.NewLedStrip(pin, ledCount)
		if err != nil {
			log.Fatalf("Cannot initialize the LED strip: %v", err)
		}

		strip.Clear()
		time.Sleep(time.Second * 5)
		strip.Monochrome(color.RGBA{R: 255, G: 0, B: 0, A: 1})
		time.Sleep(time.Second * 5)
		strip.Monochrome(color.RGBA{R: 0, G: 255, B: 0, A: 1})
		time.Sleep(time.Second * 5)
		strip.Monochrome(color.RGBA{R: 0, G: 0, B: 255, A: 1})
		time.Sleep(time.Second * 5)

		if err := strip.Close(); err != nil {
			log.Fatalf("Cannot close the LED strip: %v", err)
		}
	},
}
