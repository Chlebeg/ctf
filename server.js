const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

const FLAG = "YELLOW{Czego_mi_ruszasz_header?}";
const MALWARE_NAMES = new Set([
  "filecrypt2",
  "adobeflashplayer_dcf6d65e5dfcb0db.exe"
]);

app.use(cors({
  origin: "*",
  allowedHeaders: [
    "Content-Type", "Authorization", "X-CSRF-Token", "X-Trace-Id",
    "X-Malware-Name", "X-Client-ID", "X-Api-Key"
  ],
  methods: ["POST", "OPTIONS"]
}));

app.options("/api/unlock", (req, res) => {
  res.sendStatus(200);
});

app.post("/api/unlock", (req, res) => {
  const malwareName = (req.headers["x-malware-name"]);
  console.log(`${malwareName}`)

  if (MALWARE_NAMES.has(malwareName)) {
    res.status(200).json({
      status: "success",
      flag: FLAG
    });
  } else {
    res.status(403).json({
      status: "error",
      message: "Błędne hasło"
    });
  }
});

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "ransom.html"));
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
