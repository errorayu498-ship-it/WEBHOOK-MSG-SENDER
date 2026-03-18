const express = require("express")
const axios = require("axios")
const fs = require("fs")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

let running=false
let progress={current:0,total:0}

const historyFile="./data/history.json"
const visitorFile="./data/visitors.json"

if(!fs.existsSync(visitorFile)){
fs.writeFileSync(visitorFile,JSON.stringify({count:0}))
}

app.get("/visit",(req,res)=>{

let v=JSON.parse(fs.readFileSync(visitorFile))
v.count++
fs.writeFileSync(visitorFile,JSON.stringify(v))
res.json(v)

})

function saveHistory(data){

let history=[]

if(fs.existsSync(historyFile)){
history=JSON.parse(fs.readFileSync(historyFile))
}

history.push({...data,time:new Date().toISOString()})

fs.writeFileSync(historyFile,JSON.stringify(history,null,2))

}

function cleanMessage(html){

if(!html) return ""

return html
.replace(/<h1>/g,"# ")
.replace(/<\/h1>/g,"\n")
.replace(/<strong>/g,"**")
.replace(/<\/strong>/g,"**")
.replace(/<em>/g,"*")
.replace(/<\/em>/g,"*")
.replace(/<p>/g,"")
.replace(/<\/p>/g,"\n")
.replace(/<br>/g,"\n")
.replace(/<[^>]*>/g,"")

}

async function sendMessage(token,channel,message,isBot){

let headers={}

if(isBot){
headers.Authorization=`Bot ${token}`
}else{
headers.Authorization=token
}

await axios.post(
`https://discord.com/api/v10/channels/${channel}/messages`,
{content:message},
{headers}
)

}

app.post("/sendWebhook",async(req,res)=>{

const {url,message,amount,delay}=req.body
const msg=cleanMessage(message)

running=true
progress.total=amount
progress.current=0

for(let i=0;i<amount;i++){

if(!running) break

try{
await axios.post(url,{content:msg})
}catch(e){
console.log(e.message)
}

progress.current++

await new Promise(r=>setTimeout(r,delay*1000))

}

saveHistory(req.body)

res.json({status:"done"})

})

app.post("/sendToken",async(req,res)=>{

const {token,channel,message,amount,delay,type}=req.body

const msg=cleanMessage(message)

running=true
progress.total=amount
progress.current=0

try{

for(let i=0;i<amount;i++){

if(!running) break

await sendMessage(token,channel,msg,type==="bot")

progress.current++

await new Promise(r=>setTimeout(r,delay*1000))

}

}catch(e){

console.log(e.message)

}

saveHistory(req.body)

res.json({status:"done"})

})

app.get("/progress",(req,res)=>{
res.json(progress)
})

app.post("/stop",(req,res)=>{
running=false
res.json({status:"stopped"})
})

app.listen(3000,()=>{
console.log("Portal running on port 3000")
})
