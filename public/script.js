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
