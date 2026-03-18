⚠️ Important: Discord spam ya abuse karna Discord Terms of Service ke khilaf ho sakta hai. Is portal ko sirf testing, announcements ya automation ke liye use karein.


---

🌐 Features jo portal me honge

✅ Modern animated GUI
✅ Webhook add option
✅ Bot Token system
✅ Channel ID option
✅ Message editor (bold, embed style etc)
✅ Message Amount (kitni dafa send ho)
✅ Rate limit (seconds me delay)
✅ Buttons:

Send Once

Start (loop send)

Stop

Refresh



---

📁 GitHub Project Structure

discord-message-portal/
│
├── server.js
├── package.json
├── config.json
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md


---

📦 package.json

{
  "name": "discord-message-portal",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5"
  }
}


---

⚙️ server.js (Backend API)

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

let running = false;

async function sendWebhook(webhook, message) {
    await axios.post(webhook, {
        content: message
    });
}

async function sendBot(token, channel, message) {
    await axios.post(
        `https://discord.com/api/v10/channels/${channel}/messages`,
        { content: message },
        { headers: { Authorization: `Bot ${token}` } }
    );
}

app.post("/send", async (req, res) => {

    const { webhook, token, channel, message, amount, delay } = req.body;

    running = true;

    for (let i = 0; i < amount; i++) {

        if (!running) break;

        try {

            if (webhook) {
                await sendWebhook(webhook, message);
            }

            if (token && channel) {
                await sendBot(token, channel, message);
            }

        } catch (err) {
            console.log(err.message);
        }

        await new Promise(r => setTimeout(r, delay * 1000));
    }

    res.send("Done");
});

app.post("/stop", (req, res) => {
    running = false;
    res.send("Stopped");
});

app.listen(3000, () => console.log("Portal running on port 3000"));


---

🖥 index.html (Portal UI)

<!DOCTYPE html>
<html>
<head>
<title>Discord Message Portal</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<div class="panel">

<h1>Discord Message Portal</h1>

<input id="webhook" placeholder="Webhook URL">

<input id="token" placeholder="Bot Token">

<input id="channel" placeholder="Channel ID">

<textarea id="message" placeholder="Type your message"></textarea>

<input id="amount" type="number" placeholder="Message Amount">

<input id="delay" type="number" placeholder="Rate Limit (seconds)">

<div class="buttons">

<button onclick="send()">Send Once</button>

<button onclick="start()">Start</button>

<button onclick="stop()">Stop</button>

<button onclick="location.reload()">Refresh</button>

</div>

</div>

<script src="script.js"></script>

</body>
</html>


---

🎨 style.css (Modern GUI)

body{
background:#0f172a;
font-family:sans-serif;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
color:white;
}

.panel{
background:#1e293b;
padding:40px;
border-radius:15px;
width:400px;
box-shadow:0 0 30px #000;
}

input, textarea{
width:100%;
margin:8px 0;
padding:10px;
border:none;
border-radius:8px;
}

button{
padding:10px;
margin:5px;
border:none;
border-radius:8px;
cursor:pointer;
}


---

⚡ script.js

async function start(){

const data={
webhook:document.getElementById("webhook").value,
token:document.getElementById("token").value,
channel:document.getElementById("channel").value,
message:document.getElementById("message").value,
amount:document.getElementById("amount").value,
delay:document.getElementById("delay").value
};

await fetch("/send",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify(data)
});
}

async function stop(){
await fetch("/stop",{method:"POST"});
}

function send(){
document.getElementById("amount").value=1;
start();
}


---

🚀 Railway Hosting Guide

1️⃣ Account banao Railway par

2️⃣ GitHub repo upload karo GitHub par

3️⃣ Railway dashboard → New Project

4️⃣ Deploy from GitHub

5️⃣ Repo select karo

6️⃣ Deploy ho jaye ga automatically

7️⃣ Browser me portal open ho jaye ga

---
