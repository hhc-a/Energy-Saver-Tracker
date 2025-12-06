// --- 共用常量與函數 ---
const WEEKLY_GOAL = 100;
const STORAGE_KEY = "energy_tracker_v4";

const TASKS = [
  { name: "隨手關燈", points: 3 },
  { name: "拔除未使用插頭", points: 2 },
  { name: "減少冷氣使用", points: 5 },
  { name: "調高冷氣溫度到 26 度以上", points: 2 },
  { name: "縮短洗澡時間", points: 3 },
  { name: "收集雨水/洗米水澆花或清潔", points: 2 },
  { name: "將舊衣服改造成環保袋或抹布", points: 2 },
  { name: "用手帕取代一次性紙巾", points: 2 },
  { name: "不使用時關閉電腦螢幕", points: 1 },
  { name: "減少電梯搭乘（改走樓梯）", points: 3 },
  { name: "用舊盒子、瓶子做手作或收納，減少丟棄", points: 2 },
  { name: "使用自備環保餐具", points: 1 },
  { name: "使用環保袋", points: 1 },
  { name: "種植綠植栽", points: 3 },
  { name: "多利用自然通風", points: 2 }
];

let store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

function getToday(){
  return new Date().toISOString().slice(0,10);
}

function getWeekStart(){
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day===0?-6:1);
  return new Date(d.getFullYear(),d.getMonth(),diff).toISOString().slice(0,10);
}

function saveStore(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ⭐ 新增: 根據 tasksDone 計算並初始化 store.today
function initializeTodayStore() {
  const today = getToday();
  
  // 取得已勾選的行為
  const actions = Object.keys(store.tasksDone)
    .filter(k => store.tasksDone[k] === today)
    .map(k => Number(k));

  const points = actions.reduce((sum, idx) => sum + TASKS[idx].points, 0);

  // 如果今天沒有紀錄，則使用空字串作為 note
  const note = store.today?.date === today ? (store.today.note || "") : "";

  store.today = {
    date: today,
    points: points,
    actions: actions,
    note: note
  };
}

function ensureStore(){
  if (!store.weekStart) store.weekStart = getWeekStart();
  if (typeof store.weeklyTotal !== "number") store.weeklyTotal = 0;
  if (!store.tasksDone) store.tasksDone = {};
  if (!Array.isArray(store.history)) store.history = [];
  if (!Array.isArray(store.medals)) store.medals = [];

  // ⭐ 確保在初始化後立刻計算當天的 store.today
  initializeTodayStore(); 
}

ensureStore();

if(store.weekStart !== getWeekStart()){
  store.weekStart = getWeekStart();
  store.weeklyTotal = 0;
  store.tasksDone = {};
  saveStore();
}

// 每分鐘檢查週起始
setInterval(()=>{
  const currentWeek = getWeekStart();
  if(currentWeek !== store.weekStart){
    store.weekStart = currentWeek;
    store.weeklyTotal = 0;
    store.tasksDone = {};
    saveStore();
  }
}, 60000);


function updatePoints(){
  // ⭐ 每次更新分數前，先確保 store.today 是最新的
  initializeTodayStore(); 

  const todayPoints = store.today.points; // 直接使用 store.today 的分數
  const todayPointsEl = document.getElementById("today-points");
  const weekPointsEl = document.getElementById("week-points");
  const weekPointsEl2 = document.getElementById("week-points-2");
  if(todayPointsEl) todayPointsEl.textContent = todayPoints;
  if(weekPointsEl) weekPointsEl.textContent = store.weeklyTotal;
  if(weekPointsEl2) weekPointsEl2.textContent = store.weeklyTotal;
}

function renderWalker(){
  const track = document.getElementById("track");
  const walker = document.getElementById("walker");
  if(!track || !walker) return;
  const trackWidth = Math.max(track.clientWidth - 48, 24);
  const ratio = Math.min(store.weeklyTotal / WEEKLY_GOAL,1);
  walker.style.left = (8 + Math.round(ratio * trackWidth)) + "px";
}

function setWeeklyGoalLabels(){
  const l1 = document.getElementById("weekly-goal-label");
  const l2 = document.getElementById("weekly-goal-2");
  if(l1) l1.textContent = WEEKLY_GOAL;
  if(l2) l2.textContent = WEEKLY_GOAL;
}

setWeeklyGoalLabels();

// 🟢 記錄今天資料 + 加入歷史紀錄
function saveToday() {
  // ⭐ 儲存前先確保 store.today 是根據最新勾選的狀態計算出來
  initializeTodayStore(); 
  
  const today = store.today.date;
  const points = store.today.points;
  const actions = store.today.actions;
  
  const noteInput = document.getElementById("note");
  // ⭐ 從輸入欄位取得最新備註並更新 store.today
  store.today.note = noteInput ? noteInput.value.trim() : "";
  const note = store.today.note;


  // ----- 寫入 store.history (更新或新增) -----
  const todayIndex = store.history.findIndex(item => item.date === today);
  
  // 歷史紀錄的物件使用 store.today 的值
  const historyRecord = { date: today, points: points, actions: actions, note: note };

  if (todayIndex >= 0) {
    // 今天已存在 → 更新該筆記錄
    store.history[todayIndex] = historyRecord;
  } else {
    // 今天不存在 → 新增在最前面
    store.history.unshift(historyRecord);
  }

  saveStore();
  alert("今日紀錄已儲存！");
  
  // 如果在歷史頁面，重新渲染
  if (typeof renderHistoryPage === 'function') {
    renderHistoryPage();
  }
}

window.store = store;
window.TASKS = TASKS;
window.updatePoints = updatePoints;
window.renderWalker = renderWalker;
window.saveToday = saveToday; // 匯出給 history.js 使用
window.initializeTodayStore = initializeTodayStore; // 匯出給其他頁面使用