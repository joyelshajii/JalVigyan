package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"water-use-sentinel/server/db"
	"water-use-sentinel/server/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func spaFileServer(distDir string) http.Handler {
	fileServer := http.FileServer(http.Dir(distDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		path := filepath.Join(distDir, filepath.Clean(r.URL.Path))
		info, err := os.Stat(path)
		if os.IsNotExist(err) || info.IsDir() {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "water_sentinel.db"
	}

	log.Printf("Starting JalVigyan Water Sentinel Backend on :%s (Database: %s)", port, dbPath)

	store, err := db.NewStore(dbPath)
	if err != nil {
		log.Fatalf("Fatal: Failed to initialize SQLite store: %v", err)
	}

	api := handlers.NewAPI(store)
	mux := http.NewServeMux()
	api.RegisterRoutes(mux)

	distDir := "client/dist"
	if _, err := os.Stat(distDir); err == nil {
		log.Printf("Serving compiled frontend bundle from %s", distDir)
		mux.Handle("/", spaFileServer(distDir))
	} else {
		log.Printf("Client dist folder '%s' not found. API running standalone on port %s", distDir, port)
	}

	handler := corsMiddleware(mux)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	log.Printf("JalVigyan Backend ready at http://localhost:%s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server terminated: %v", err)
	}
}
