const taskListEl = document.getElementById("task-list");
const noteEl = document.getElementById("note");
const saveBtn = document.getElementById("save-btn");
const todayPointsEl = document.getElementById("today-points");
const weekPointsEl = document.getElementById("week-points");
const weekPointsEl2 = document.getElementById("week-points-2");
const weeklyGoalLabel = document.getElementById("weekly-goal-label");
const weeklyGoalLabel2 = document.getElementById("weekly-goal-2");
const track = document.getElementById("track");
const walker = document.getElementById("walker");
const medalNote = document.getElementById("medal-note");
const saveSound = document.getElementById("save-sound");

weeklyGoalLabel.textContent = WEEKLY_GOAL;
weeklyGoalLabel2.textContent = WEEKLY_GOAL;

renderTasks();
updatePoints();
renderWalker();

function renderTasks(){
  taskListEl.innerHTML = "";
  TASKS.forEach((t,idx)=>{
    const doneToday = store.tasksDone[idx] === getToday();
    const div = document.createElement("div");
    div.className = "task";
    const left = document.createElement("div");
    left.innerHTML = `<div class="name">${t.name}</div><div class="points small muted">${t.points} 點</div>`;
    const btn = document.createElement("button");
    btn.textContent = doneToday ? "已完成" : `+${t.points}`;
    if(doneToday) btn.disabled = true;
    btn.addEventListener("click", ()=> markTask(idx));
    div.appendChild(left); div.appendChild(btn); taskListEl.appendChild(div);
  });
}

function markTask(idx){
  const t = TASKS[idx];
  if(store.tasksDone[idx] === getToday()) return;
  if(store.weeklyTotal + t.points > WEEKLY_GOAL){ alert(`加上此項目會超過本週上限 ${WEEKLY_GOAL} 點`); return; }
  store.tasksDone[idx] = getToday();
  store.weeklyTotal += t.points;
  saveStore();
  renderTasks();
  updatePoints();
  renderWalker();
}

saveBtn.addEventListener("click", saveTodayRecord);

function saveTodayRecord(){
  const today = getToday();
  const already = store.history.some(h=>h.date===today);
  if(already){ alert("今天已經儲存過紀錄囉！"); return; }
  const actions = Object.keys(store.tasksDone).filter(i=>store.tasksDone[i]===today).map(Number);
  const points = actions.reduce((s,i)=> s + TASKS[i].points,0);
  const note = noteEl.value.trim();
  store.history.unshift({date:today,actions,points,note,timestamp:new Date().toISOString()});
  saveStore();
  try{ saveSound.currentTime=0; saveSound.play(); } catch(e){}
  updatePoints(); renderWalker(); alert("已儲存今天的紀錄！");
}

function updatePoints(){
  const today = getToday();
  const todayPoints = Object.keys(store.tasksDone).reduce((s,k)=> store.tasksDone[k]===today ? s + TASKS[k].points : s,0);
  todayPointsEl.textContent = todayPoints;
  weekPointsEl.textContent = store.weeklyTotal;
  weekPointsEl2.textContent = store.weeklyTotal;
}

function renderWalker(){
  const trackWidth = Math.max(track.clientWidth - 48, 24);
  const ratio = Math.min(store.weeklyTotal / WEEKLY_GOAL,1);
  walker.style.left = (8 + Math.round(ratio * trackWidth)) + "px";
}

document.getElementById("save-btn")?.addEventListener("click", saveToday);