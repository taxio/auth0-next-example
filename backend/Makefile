BIN:=$(shell pwd)/bin

tools:
	GOBIN=$(BIN) go install github.com/bufbuild/buf/cmd/buf@latest
	GOBIN=$(BIN) go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
	GOBIN=$(BIN) go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	GOBIN=$(BIN) go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
