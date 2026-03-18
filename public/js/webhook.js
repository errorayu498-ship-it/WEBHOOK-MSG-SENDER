var quill = new Quill('#editor',{theme:'snow'})

function log(msg){

document.getElementById("status").innerHTML+=`<p>${msg}</p>`

}

async function start(){

const data={
url:document.getElementById("webhook").value,
message:quill.root.innerHTML,
amount:document.getElementById("amount").value,
delay:document.getElementById("delay").value
}

log("Starting webhook sender")

await fetch("/sendWebhook",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify(data)
})

log("Finished")

}

function sendOnce(){

document.getElementById("amount").value=1
start()

}

async function stop(){

await fetch("/stop",{method:"POST"})

log("Stopped")

}
