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
