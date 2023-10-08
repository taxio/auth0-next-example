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

	"connectrpc.com/connect"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	demo "github.com/taxio/auth0-next-example/backend/gen/demo/v1"
	"github.com/taxio/auth0-next-example/backend/gen/demo/v1/demov1connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

const address = "localhost:3001"

func main() {
	if err := run(context.Background()); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context) error {
	mux := http.NewServeMux()

	path, handler := demov1connect.NewDemoServiceHandler(&demoServiceServer{})
	mux.Handle(path, auth0Middleware()(userInjectionMiddleware(handler)))
	fmt.Println("Server listening on", address)

	return http.ListenAndServe(address, h2c.NewHandler(mux, &http2.Server{}))
}

type demoServiceServer struct{}

func (d demoServiceServer) GetMe(ctx context.Context, req *connect.Request[demo.GetMeRequest]) (*connect.Response[demo.GetMeResponse], error) {
	authHeader := req.Header().Get("Authorization")
	accessToken := strings.Replace(authHeader, "Bearer ", "", 1)

	userInfo, err := getAuth0UserInfo(ctx, accessToken)
	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&demo.GetMeResponse{
		Email:   userInfo.Email,
		Name:    userInfo.Name,
		Picture: userInfo.Picture,
	}), nil
}

func (d demoServiceServer) UpdateSettings(ctx context.Context, req *connect.Request[demo.UpdateSettingsRequest]) (*connect.Response[demo.UpdateSettingsResponse], error) {
	authHeader := req.Header().Get("Authorization")
	accessToken := strings.Replace(authHeader, "Bearer ", "", 1)

	userInfo, err := getAuth0UserInfo(ctx, accessToken)
	if err != nil {
		return nil, err
	}

	userId, ok := ctx.Value(userInfoKey{}).(string)
	if !ok {
		return nil, fmt.Errorf("failed to get user id from context")
	}

	if userInfo.Sub != userId {
		return nil, fmt.Errorf("user id from token does not match user id from context")
	}

	return connect.NewResponse(&demo.UpdateSettingsResponse{
		Name:    userInfo.Name,
		Picture: userInfo.Picture,
	}), nil
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
