package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const port = "3001"

func main() {
	if err := run(context.Background()); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context) error {
	rtr := setup()

	log.Printf("Server listening on port http://localhost:%s/", port)
	if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%s", port), rtr); err != nil {
		return err
	}

	return nil
}

func setup() *gin.Engine {
	router := gin.Default()

	router.GET("/api/me", meHandler())

	return router
}

func meHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get AccessToken from header
		authHeader := c.Request.Header.Get("Authorization")
		log.Printf("authHeader: %s", authHeader)

		accessToken := strings.Replace(authHeader, "Bearer ", "", 1)
		log.Printf("accessToken: %s", accessToken)

		// Verify AccessToken

		// Get User info

		// Return
		c.JSON(http.StatusOK, gin.H{
			"email":   "hoge@example.com",
			"name":    "hoge",
			"picture": "https://avatars.githubusercontent.com/u/15796172?v=4",
		})
	}
}
