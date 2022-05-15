package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	pin      int
	ledCount int
)

func init() {
	rootCmd.PersistentFlags().IntVar(&pin, "pin", 18, "Pin number of the data pin")
	rootCmd.PersistentFlags().IntVar(&ledCount, "led", 1, "Number of LEDs")
}

var rootCmd = &cobra.Command{
	Use:   "ledstrip",
	Short: "ledstrip runs animations on a WS2812 LED strip",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
