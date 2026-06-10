import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "dist");
const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".eot":  "application/vnd.ms-fontobject",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  // Strip query string
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(DIST_DIR, urlPath);

  // Resolve to index.html for SPA client-side routing
  const serveFile = (targetPath) => {
    fs.readFile(targetPath, (err, data) => {
      if (err) {
        // Fall back to index.html for any missing file (SPA fallback)
        fs.readFile(path.join(DIST_DIR, "index.html"), (err2, indexData) => {
          if (err2) {
            res.writeHead(500);
            res.end("Internal Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(indexData);
        });
        return;
      }
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  };

  // If path has no extension, treat as SPA route and serve index.html
  if (!path.extname(filePath)) {
    serveFile(path.join(DIST_DIR, "index.html"));
    return;
  }

  serveFile(filePath);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
