const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

async function loadIssues(){
    showSpinner();
    const res = await fetch(API)
const data = await res.json()

displayIssues(data.data)

hideSpinner()
}

// ____________felter btns________________
function filterIssues(filter, btn) {
  showSpinner();
  const allBtns = document.querySelectorAll(".tab-btn");
  allBtns.forEach((b) => {
    b.classList.remove("btn-primary");
    b.classList.add("text-black");
  });
  btn.classList.add("btn-primary");
  btn.classList.remove("text-black");

  const filtered =
    filter === "all"
      ? allIssues
      : allIssues.filter((i) => i.status?.toLowerCase() === filter);
  displayIssues(filtered);
  hideSpinner();
}

// _________________display issue__________________

function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");
  const emptyState = document.getElementById("emptyState");
  container.innerHTML = "";
// _______________issu mt htakle eita____________
  if (!issues || issues.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  issues.forEach((issue) => {
    const isOpen = issue.status?.toLowerCase() === "open";
    const card = document.createElement("div");
    card.className = `issue-card ${isOpen ? "open" : "closed"} p-4 flex flex-col gap-2`;
    card.onclick = () => openModal(issue._id || issue.id);
    card.innerHTML = `
       
    `;
  });
}

// _____________scrch _________________
async function handleSearch() {
  const text = document.getElementById("searchInput").value;
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=%7BsearchText%7D${text}`;

  showSpinner();
  const res = await fetch(url);
  const data = await res.json();
  displayIssues(data.data);
  hideSpinner();
}

//__________Show/hide spinner________________
const showSpinner = () => {
  document.getElementById("spinner").classList.remove("hidden");
  document.getElementById("spinner").classList.add("flex");
  document.getElementById("issuesContainer").classList.add("hidden");
};

const hideSpinner = () => {
  document.getElementById("spinner").classList.add("hidden");
  document.getElementById("issuesContainer").classList.remove("hidden");
};















