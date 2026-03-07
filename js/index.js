let allIssues = [];
let API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
async function loadIssues() {
  showSpinner();
  const res = await fetch(API);
  const data = await res.json();
  allIssues = data.data;
  displayIssues(allIssues);
  hideSpinner();
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
  const count = document.getElementById("count");
  if (count) {
    count.innerText = filtered.length;
  }
  displayIssues(filtered);
  hideSpinner();
}

// _________________display issue__________________
function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");
  const emptyState = document.getElementById("emptyState");

  if (!container) {
    console.error("Container element not found!");
    return;
  }

  container.innerHTML = "";

  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  issues.forEach((issue) => {
    const isOpen = issue.status?.toLowerCase() === "open";
    const card = document.createElement("div");

    // কার্ডের মেইন ক্লাস (এখানেই সব বর্ডার আর শ্যাডো থাকবে)
    card.className = `flex flex-col justify-between bg-white rounded-lg shadow-md border-t-4 cursor-pointer hover:-translate-y-1 transition-transform p-4 ${
      isOpen ? "border-t-green-500" : "border-t-purple-500"
    }`;

    card.onclick = () => {
      if (typeof openModal === "function") {
        openModal(issue._id || issue.id);
      }
    };

    card.innerHTML = `
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <img class="w-[30px] h-[30px]" src="${isOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png"}" alt="status" />
        <h3 class="bg-red-100 font-semibold text-red-600 py-1 px-5 rounded-3xl text-xs">
          ${issue.priority || "HIGH"}
        </h3>
      </div>
      <h2 class="text-sm font-semibold line-clamp-1">${issue.title || "Untitled"}</h2>
      <p class="text-[#64748b] text-xs line-clamp-2">${issue.description || "No description provided."}</p>
      <div class="flex gap-2">
        <span class="bg-red-100 text-[10px] font-semibold border border-red-600 text-red-600 py-1 px-3 rounded-3xl">
          <i class="fa-solid fa-bug"></i> BUG
        </span>
        <span class="bg-yellow-100 text-[10px] font-semibold border border-yellow-600 text-yellow-600 py-1 px-3 rounded-3xl">
          help wanted
        </span>
      </div>
    </div>
    
    <div class="mt-4">
      <hr class="border-gray-100 mb-2" />
      <p class="text-gray-400 text-[10px]">#${issue.id?.toString().slice(-4) || "1"} by ${issue.author || "User"}</p>
      <p class="text-gray-400 text-[10px]">${new Date().toLocaleDateString()}</p>
    </div>
  `;

    container.appendChild(card);
  });
}

// _____________scrch _________________
async function handleSearch() {
  const text = document.getElementById("searchInput").value;

  if (!text.trim()) {
    displayIssues(allIssues);
    return;
  }

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`;

  showSpinner();
  try {
    const res = await fetch(url);
    const data = await res.json();

    displayIssues(data.data);

    const countElement = document.getElementById("count");
    if (countElement) countElement.innerText = data.data.length;
  } catch (error) {
    console.error("Search failed:", error);
  }
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

// _________________________modal function________________
async function openModal(id) {
  const modal = document.getElementById("my_modal_2");
  const contentArea = document.getElementById("modal-content-area");

  // ১. প্রথমে মডেলটি ওপেন করো (Loading অবস্থা দেখাবে)
  modal.showModal();
  contentArea.innerHTML = `<h3 class="text-lg font-bold">Loading...</h3><span class="loading loading-spinner text-primary"></span>`;

  try {
    // ২. সিঙ্গেল ইস্যুর ডাটা ফেচ করো
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const result = await res.json();
    const issue = result.data;

    // ৩. মডেলে ডাটা বসিয়ে দাও
    contentArea.innerHTML = `
            <h3 class="text-xl font-bold text-primary">${issue.title || "No Title"}</h3>
            <div class="py-4 space-y-3">
                <div class="flex gap-3 items-center">
                   <span class="badge badge-warning">${issue.status}</span>
                   <p class="text-gray-400 text-[10px]">#${issue.id?.toString().slice(-4) || "1"} by ${issue.author || "User"}</p>
                   <p class="text-gray-400 text-[10px]">${new Date().toLocaleDateString()}</p>
                </div>
                <div class="flex gap-2">
                  <span class="bg-red-100 text-[10px] font-semibold border border-red-600 text-red-600 py-1 px-3 rounded-3xl">
                    <i class="fa-solid fa-bug"></i> BUG
                  </span>
                  <span class="bg-yellow-100 text-[10px] font-semibold border border-yellow-600 text-yellow-600 py-1 px-3 rounded-3xl">
                    help wanted
                  </span>
                </div>
              
                <p class="text-gray-600"><strong>Description:</strong> ${issue.description || "N/A"}</p>
                <div class="flex gap-2">
                    <span class="badge badge-error text-white">${issue.priority}</span>
                </div>
                <p class="text-xs text-gray-400">Issue ID: ${id}</p>

                <div class="grid grid-cols-3 justify-center items-center bg-[#f8fafc] p-4">
                  <div>
                    <p class="text-gray-400">Assignee:</p>
                    <p class="font-semibold">#${issue.id?.toString().slice(-4) || "1"} by ${issue.author || "User"}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">Priority:</p>
                    <h3 class="bg-red-100 font-semibold text-red-600 py-1 px-5 rounded-3xl text-xs">
                      ${issue.priority || "HIGH"}
                    </h3>
                    
                  </div>
                  
                </div>
            </div>
        `;
  } catch (error) {
    contentArea.innerHTML = `<h3 class="text-lg font-bold text-red-500">Error!</h3><p>Could not load data.</p>`;
    console.error("Modal Data Fetch Error:", error);
  }
}

loadIssues();
