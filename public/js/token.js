
var quill=new Quill("#editor",{theme:"snow"})

async function start(){

let tokens=document.getElementById("tokens").value.split("\n").filter(t=>t.trim()!="")

const data={

tokens:tokens,
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

Swal.fire("Started","Token sender started","success")

}

async function stop(){

await fetch("/stop",{method:"POST"})
Swal.fire("Stopped","Sending stopped","info")

}

async function progress(){

const r=await fetch("/progress")
const d=await r.json()

if(d.total===0) return

let p=(d.current/d.total)*100

document.getElementById("bar").style.width=p+"%"

}

setInterval(progress,1000)
