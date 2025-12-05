const historyListEl = document.getElementById("history-list");
let currentPage = 1;
const PAGE_SIZE = 8;

function renderHistoryPage(page = 1){
  const list = store.history || [];
  historyListEl.innerHTML = "";
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(1,page), totalPages);
  const slice = list.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
  if(slice.length===0){ historyListEl.innerHTML = "<p class='muted'>尚無歷史紀錄</p>"; }
  else{
    slice.forEach(item=>{
      const div = document.createElement("div");
      div.className = "history-item";
      const names = item.actions.map(i=>TASKS[i].name).join("、") || "（無）";
      div.innerHTML = `<div class="date">${item.date} — ${item.points} 點</div>
                       <div class="muted">行為：${names}</div>
                       <div class="muted">備註：${item.note||"（無）"}</div>`;
      historyListEl.appendChild(div);
    });
  }
  document.getElementById("page-info").textContent = `第 ${currentPage} 頁 / ${totalPages} 頁`;
  document.getElementById("prev-page").disabled = currentPage<=1;
  document.getElementById("next-page").disabled = currentPage>=totalPages;
}

document.getElementById("prev-page").addEventListener("click", ()=> renderHistoryPage(currentPage-1));
document.getElementById("next-page").addEventListener("click", ()=> renderHistoryPage(currentPage+1));

renderHistoryPage();
