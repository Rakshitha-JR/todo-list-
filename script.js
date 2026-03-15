let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter="all";

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

function autoDelete(){

let now = Date.now();

tasks = tasks.filter(task=>{

let age = now - task.created;

if(task.type==="daily" && age>86400000) return false;

if(task.type==="weekly" && age>604800000) return false;

return true;

});

save();

}

function addTask(){

let input=document.getElementById("taskInput");
let type=document.getElementById("taskType").value;

if(input.value.trim()==="") return;

tasks.push({
text:input.value,
completed:false,
type:type,
created:Date.now()
});

input.value="";

save();
render();

}

function toggle(index){

tasks[index].completed=!tasks[index].completed;

save();
render();

}

function deleteTask(index){

tasks.splice(index,1);

save();
render();

}

function editTask(index){

let newText=prompt("Edit task",tasks[index].text);

if(newText){
tasks[index].text=newText;
save();
render();
}

}

function filterTasks(type){
currentFilter=type;
render();
}

function searchTasks(){

let input=document.getElementById("searchInput").value.toLowerCase();

let list=document.getElementById("taskList");

Array.from(list.children).forEach(li=>{

let text=li.innerText.toLowerCase();

li.style.display=text.includes(input)?"flex":"none";

});

}

function updateProgress(){

let completed=tasks.filter(t=>t.completed).length;

let percent=tasks.length?(completed/tasks.length)*100:0;

document.getElementById("progressBar").style.width=percent+"%";

}

function updateDashboard(){

let total=tasks.length;
let completed=tasks.filter(t=>t.completed).length;
let remaining=total-completed;
let daily=tasks.filter(t=>t.type==="daily").length;
let weekly=tasks.filter(t=>t.type==="weekly").length;

document.getElementById("totalTasks").innerText=total;
document.getElementById("completedTasks").innerText=completed;
document.getElementById("remainingTasks").innerText=remaining;
document.getElementById("dailyTasks").innerText=daily;
document.getElementById("weeklyTasks").innerText=weekly;

}

function render(){

autoDelete();

let list=document.getElementById("taskList");

list.innerHTML="";

let filteredTasks=tasks.filter(task=>{

if(currentFilter==="active") return !task.completed;

if(currentFilter==="completed") return task.completed;

return true;

});

filteredTasks.forEach((task,index)=>{

let li=document.createElement("li");

if(task.completed) li.classList.add("completed");

li.innerHTML=`

<div>

<input type="checkbox" ${task.completed?"checked":""} onclick="toggle(${index})">

<span ondblclick="editTask(${index})">${task.text} (${task.type})</span>

</div>

<button onclick="deleteTask(${index})">Delete</button>

`;

list.appendChild(li);

});

updateDashboard();
updateProgress();

}
