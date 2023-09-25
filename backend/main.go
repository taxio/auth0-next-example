package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
)

const port = "3001"

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	router := http.NewServeMux()

	fAuth0Middleware := auth0Middleware()
	router.Handle("/api/me", fAuth0Middleware(userInjectionMiddleware(http.HandlerFunc(meHandler))))
	router.Handle("/api/settings", fAuth0Middleware(userInjectionMiddleware(http.HandlerFunc(postSettingsHandler))))

	log.Printf("Server listening on port http://localhost:%s/", port)
	if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%s", port), router); err != nil {
		return err
	}

	return nil
}

// CustomClaims contains custom data we want from the token.
type CustomClaims struct {
	Scope string `json:"scope"`
}

// Validate does nothing for this example, but we need
// it to satisfy validator.CustomClaims interface.
func (c CustomClaims) Validate(ctx context.Context) error {
	return nil
}

func auth0Middleware() func(next http.Handler) http.Handler {
	issuerURL, err := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/")
	if err != nil {
		log.Fatal(err)
	}

	provider := jwks.NewCachingProvider(issuerURL, 5*time.Minute)

	jwtValidator, err := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{os.Getenv("AUTH0_AUDIENCE")},
		validator.WithCustomClaims(
			func() validator.CustomClaims {
				return &CustomClaims{}
			},
		),
		validator.WithAllowedClockSkew(time.Minute),
	)
	if err != nil {
		log.Fatalf("Failed to set up the jwt validator: %v", err)
	}

	errorHandler := func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("Encountered error while validating JWT: %v", err)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"message":"Failed to validate JWT."}`))
	}

	middleware := jwtmiddleware.New(
		jwtValidator.ValidateToken,
		jwtmiddleware.WithErrorHandler(errorHandler),
	)

	return func(next http.Handler) http.Handler {
		return middleware.CheckJWT(next)
	}
}

type userInfoKey struct{}

type auth0Payload struct {
	Sub string `json:"sub"`
}

func userInjectionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		accessToken := strings.Replace(authHeader, "Bearer ", "", 1)
		encodedPayload := strings.Split(accessToken, ".")[1]
		decodedPayload, err := base64.RawURLEncoding.DecodeString(encodedPayload)
		if err != nil {
			log.Printf("Failed to decode payload: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			_, _ = w.Write([]byte(`{"message":"internal server error"}`))
			return
		}

		var payload auth0Payload
		if err := json.Unmarshal(decodedPayload, &payload); err != nil {
			log.Printf("Failed to unmarshal payload: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			_, _ = w.Write([]byte(`{"message":"internal server error"}`))
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, userInfoKey{}, payload.Sub)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type meResponse struct {
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_, _ = w.Write([]byte(`{"message":"method not allowed"}`))
		return
	}

	// Get User info
	authHeader := r.Header.Get("Authorization")
	accessToken := strings.Replace(authHeader, "Bearer ", "", 1)

	userInfo, err := getAuth0UserInfo(r.Context(), accessToken)
	if err != nil {
		log.Printf("Failed to get user info: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`{"message":"internal server error"}`))
		return
	}

	// Return
	w.Header().Set("Content-Type", "application/json")

	resBody := meResponse{
		Email:   userInfo.Email,
		Name:    userInfo.Name,
		Picture: userInfo.Picture,
	}
	body, err := json.Marshal(resBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`{"message":"internal server error"}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(body)
}

func postSettingsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_, _ = w.Write([]byte(`{"message":"method not allowed"}`))
		return
	}

	userId, ok := r.Context().Value(userInfoKey{}).(string)
	if !ok {
		log.Printf("Failed to get user id from context")
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`{"message":"internal server error"}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write([]byte(fmt.Sprintf(`{"message":"success","user_id":"%s"}`, userId)))
}

type Auth0UserInfoResponse struct {
	Sub           string `json:"sub"`
	Nickname      string `json:"nickname"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Updated       string `json:"updated_at"`
}

func getAuth0UserInfo(ctx context.Context, accessToken string) (*Auth0UserInfoResponse, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://"+os.Getenv("AUTH0_DOMAIN")+"/userinfo", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", "Bearer "+accessToken)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	var userInfo Auth0UserInfoResponse
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
