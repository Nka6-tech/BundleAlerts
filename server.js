
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve website files, including the APK download
app.use(express.static(__dirname));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Temporary usage storage
let latestUsage = {
    mobileMB: 0,
    wifiMB: 0,
    allowanceMB: 0,
    updatedAt: null
};

// Receive usage data
app.post("/api/usage", (req, res) => {
    const { mobileMB, wifiMB, allowanceMB } = req.body;

    if (
        !Number.isFinite(mobileMB) ||
        !Number.isFinite(wifiMB) ||
        !Number.isFinite(allowanceMB) ||
        mobileMB < 0 ||
        wifiMB < 0 ||
        allowanceMB < 0
    ) {
        return res.status(400).json({
            error: "Send valid non-negative numbers."
        });
    }

    latestUsage = {
        mobileMB,
        wifiMB,
        allowanceMB,
        updatedAt: new Date().toISOString()
    };

    res.json({
        message: "Usage data received successfully.",
        usage: latestUsage
    });
});

// Read usage data
app.get("/api/usage", (req, res) => {
    res.json(latestUsage);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`BundleAlerts website running at http://localhost:${PORT}`);
});
