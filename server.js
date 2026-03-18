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
history=JSON.parse(fs.readFileSync(historyFile))
}

history.push(data)

fs.writeFileSync(historyFile,JSON.stringify(history,null,2))

}

async function sendWebhook(url,message){

await axios.post(url,{
content:message
})

}

async function sendBot(token,channel,message){

await axios.post(
`https://discord.com/api/v10/channels/${channel}/messages`,
{content:message},
{headers:{Authorization:`Bot ${token}`}}
)

}

app.post("/sendWebhook",async(req,res)=>{

const {url,message,amount,delay}=req.body

running=true

for(let i=0;i<amount;i++){

if(!running) break

try{
await sendWebhook(url,message)
}catch(e){
console.log(e.message)
}

await new Promise(r=>setTimeout(r,delay*1000))
}

saveHistory(req.body)

res.send("done")

})

app.post("/sendBot",async(req,res)=>{

const {token,channel,message,amount,delay}=req.body

running=true

try{

if(channel){

for(let i=0;i<amount;i++){

if(!running) break

await sendBot(token,channel,message)

await new Promise(r=>setTimeout(r,delay*1000))

}

}else{

const guilds=await axios.get(
"https://discord.com/api/v10/users/@me/guilds",
{headers:{Authorization:`Bot ${token}`}}
)

for(const g of guilds.data){

const channels=await axios.get(
`https://discord.com/api/v10/guilds/${g.id}/channels`,
{headers:{Authorization:`Bot ${token}`}}
)

for(const c of channels.data){

if(c.type===0){

await sendBot(token,c.id,message)

}

}

}

}

}catch(e){

console.log(e.message)

}

saveHistory(req.body)

res.send("done")

})

app.get("/history",(req,res)=>{

if(!fs.existsSync(historyFile)) return res.json([])

res.json(JSON.parse(fs.readFileSync(historyFile)))

})

app.post("/stop",(req,res)=>{

running=false

res.send("stopped")

})

app.listen(3000,()=>{

console.log("Portal running on port 3000")

})
