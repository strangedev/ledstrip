package cmd

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/spf13/cobra"
	"github.com/strangedev/ledstrip/lib/animation"
	"github.com/strangedev/ledstrip/lib/server"
)

var (
	address string
)

func init() {
	serverCommand.Flags().StringVar(&address, "addr", "0.0.0.0:1337", "The bind address of the server")
	rootCmd.AddCommand(serverCommand)
}

var serverCommand = &cobra.Command{
	Use:   "server",
	Short: "starts the ledstrip server",
	Run: func(cmd *cobra.Command, args []string) {
		strip, err := animation.NewLedStrip(pin, ledCount)
		if err != nil {
			log.Fatalf("Failed to initialize the led strip: %v\n", err)
		}

		router := server.NewRouter(&strip)
		server := &http.Server{
			Addr:         address,
			WriteTimeout: time.Second * 15,
			ReadTimeout:  time.Second * 15,
			IdleTimeout:  time.Second * 30,
			Handler:      router,
		}

		go func() {
			log.Println("Starting server.")

			if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				log.Fatalf("Could not start the server: %v", err)
			}

			log.Println("Server closed.")
		}()

		stop := make(chan os.Signal, 1)
		signal.Notify(stop, os.Interrupt, os.Kill)
		<-stop
		log.Println("Graceful shutdown")

		ctx, cancel := context.WithTimeout(context.Background(), time.Second*30)
		defer cancel()
		server.Shutdown(ctx)
		log.Println("Exiting")

		os.Exit(0)
	},
}
