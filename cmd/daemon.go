package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(daemonCommand)
}

var daemonCommand = &cobra.Command{
	Use:   "daemon",
	Short: "starts the ledstrip daemon",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("daemon")
	},
}
