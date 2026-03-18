var quill=new Quill("#editor",{theme:"snow"})

function sendOnce(){
document.getElementById("amount").value=1
start()
}

async function start(){

const data={
token:document.getElementById("token").value,
channel:document.getElementById("channel").value,
type:document.getElementById("type").value,
message:quill.root.innerHTML,
amount:document.getElementById("amount").value,
delay:document.getElementById("delay").value
}

await fetch("/sendToken",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify(data)
})

}

async function stop(){
await fetch("/stop",{method:"POST"})
}

async function progress(){

const r=await fetch("/progress")
const d=await r.json()

if(d.total===0) return

let percent=(d.current/d.total)*100

document.getElementById("bar").style.width=percent+"%"

}

setInterval(progress,1000)