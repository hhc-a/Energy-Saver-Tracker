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

function ensureStore(){
  if (!store.weekStart) store.weekStart = getWeekStart();
  if (typeof store.weeklyTotal !== "number") store.weeklyTotal = 0;
  if (!store.tasksDone) store.tasksDone = {};
  if (!Array.isArray(store.history)) store.history = [];
  if (!Array.isArray(store.medals)) store.medals = [];
}
ensureStore();

if(store.weekStart !== getWeekStart()){
  store.weekStart = getWeekStart();
  store.weeklyTotal = 0;
  store.tasksDone = {};
  saveStore();
}

function saveStore(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getToday(){
  return new Date().toISOString().slice(0,10);
}

function getWeekStart(){
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day===0?-6:1);
  return new Date(d.getFullYear(),d.getMonth(),diff).toISOString().slice(0,10);
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
