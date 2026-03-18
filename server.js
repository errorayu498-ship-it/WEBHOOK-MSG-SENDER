const express = require("express")
const axios = require("axios")
const fs = require("fs")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

let running = false

const historyFile = "./data/history.json"

function saveHistory(data){

let history=[]

if(fs.existsSync(historyFile)){
history = JSON.parse(fs.readFileSync(historyFile))
}

history.push({
...data,
time:new Date().toISOString()
})

fs.writeFileSync(historyFile,JSON.stringify(history,null,2))

}

/* -------------------------
HTML → Discord Markdown Fix
--------------------------*/

function cleanMessage(html){

if(!html) return ""

return html
.replace(/<h1>/g,"# ")
.replace(/<\/h1>/g,"\n")
.replace(/<h2>/g,"## ")
.replace(/<\/h2>/g,"\n")
.replace(/<strong>/g,"**")
.replace(/<\/strong>/g,"**")
.replace(/<b>/g,"**")
.replace(/<\/b>/g,"**")
.replace(/<em>/g,"*")
.replace(/<\/em>/g,"*")
.replace(/<i>/g,"*")
.replace(/<\/i>/g,"*")
.replace(/<p>/g,"")
.replace(/<\/p>/g,"\n")
.replace(/<br>/g,"\n")
.replace(/<br\/>/g,"\n")
.replace(/<[^>]*>/g,"")

}

/* -------------------------
Webhook Sender
--------------------------*/

async function sendWebhook(url,message){

await axios.post(url,{
content:message
})

}

/* -------------------------
Bot Sender
--------------------------*/

async function sendBot(token,channel,message){

await axios.post(
`https://discord.com/api/v10/channels/${channel}/messages`,
{content:message},
{headers:{Authorization:`Bot ${token}`}}
)

}

/* -------------------------
Webhook API
--------------------------*/

app.post("/sendWebhook",async(req,res)=>{

const {url,message,amount,delay}=req.body

const msg = cleanMessage(message)

running = true

for(let i=0;i<amount;i++){

if(!running) break

try{

await sendWebhook(url,msg)

}catch(e){

console.log("Webhook Error:",e.message)

}

await new Promise(r=>setTimeout(r,delay*1000))

}

saveHistory(req.body)

res.json({status:"done"})

})

/* -------------------------
Bot API
--------------------------*/

app.post("/sendBot",async(req,res)=>{

const {token,channel,message,amount,delay}=req.body

const msg = cleanMessage(message)

running = true

try{

if(channel){

for(let i=0;i<amount;i++){

if(!running) break

await sendBot(token,channel,msg)

await new Promise(r=>setTimeout(r,delay*1000))

}

}else{

// send to all channels

const guilds = await axios.get(
"https://discord.com/api/v10/users/@me/guilds",
{headers:{Authorization:`Bot ${token}`}}
)

for(const g of guilds.data){

const channels = await axios.get(
`https://discord.com/api/v10/guilds/${g.id}/channels`,
{headers:{Authorization:`Bot ${token}`}}
)

for(const c of channels.data){

if(!running) break

if(c.type === 0){

await sendBot(token,c.id,msg)

await new Promise(r=>setTimeout(r,delay*1000))

}

}

}

}

}catch(e){

console.log("Bot Error:",e.message)

}

saveHistory(req.body)

res.json({status:"done"})

})

/* -------------------------
History API
--------------------------*/

app.get("/history",(req,res)=>{

if(!fs.existsSync(historyFile)){

return res.json([])

}

res.json(JSON.parse(fs.readFileSync(historyFile)))

})

/* -------------------------
Stop Sender
--------------------------*/

app.post("/stop",(req,res)=>{

running = false

res.json({status:"stopped"})

})

/* -------------------------
Server Start
--------------------------*/

app.listen(3000,()=>{

console.log("🚀 Discord Portal running on port 3000")

})
