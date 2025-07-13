document.addEventListener("DOMContentLoaded", () => {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const welcomeText = document.getElementById("welcomeText");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const resourcesGrid = document.getElementById("resourcesGrid");
  const dashboardToggleBtn = document.getElementById("dashboardToggleBtn");
  const dashboard = document.getElementById("dashboard");
  const closeDashboardBtn = document.getElementById("closeDashboardBtn");
  const dashboardTabs = dashboard?.querySelectorAll(".dashboard-tab");
  const dashboardContent = document.getElementById("dashboardContent");
  const resourceViewer = document.getElementById("resourceViewer");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerBody = document.getElementById("viewerBody");
  const closeViewer = document.querySelector(".close-viewer");
  const bookmarksKey = `bookmarks_${currentUser?.email}`;
   const progressKey = `progress_${currentUser?.email}`;
  let bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];
  const filterToggleBtn = document.getElementById("menuToggleBtn");
  const filterSidebar = document.getElementById("sidebar");

  const all = JSON.parse(localStorage.getItem("global_resources")) || [];

  
  let progressData = JSON.parse(localStorage.getItem(progressKey)) || [];
    const chatBox = document.getElementById("chatBox");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const toggleChat = document.getElementById("toggleChat");
const emojiBtn = document.getElementById("emojiBtn");
const attachFileBtn = document.getElementById("attachFileBtn");
const chatFileInput = document.getElementById("chatFileInput");

const chatKey = "global_chat_messages";

// Load chat messages
function loadChatMessages() {
  const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
  const hiddenKey = `hidden_${currentUser?.email}`;
  const hiddenTimes = JSON.parse(localStorage.getItem(hiddenKey)) || [];

  chatMessages.innerHTML = messages
    .filter(msg => !hiddenTimes.includes(msg.time))
    .map((msg, index) => {
      const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isOwn = msg.email === currentUser?.email;
      const msgId = `msg-${index}`;

      return `
        <div class="chat-message" style="position: relative;" id="${msgId}">
          <div>
            <strong>${msg.name}</strong> 
            <small style="color:gray;">[${time}]</small>: ${msg.text}
            ${msg.image ? `<br><img src="${msg.image}" alt="Image" style="max-width:100px;" />` : ""}
          </div>
          <div class="msg-options" style="position: absolute; top: 0; right: 0;">
            <button class="dots-btn" onclick="toggleMsgMenu('${msgId}')">⋮</button>
            <div class="msg-menu hidden" style="background:#fff; border:1px solid #ccc; position:absolute; right:20px; top:20px; z-index:999; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <button onclick="deleteMessage(${index}, 'me')">❌ Delete for Me</button>
              ${isOwn ? `<button onclick="deleteMessage(${index}, 'everyone')">🗑️ Delete for Everyone</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

  chatMessages.scrollTop = chatMessages.scrollHeight;
}


window.deleteMessage = function(index, type) {
  let messages = JSON.parse(localStorage.getItem(chatKey)) || [];
  const hiddenKey = `hidden_${currentUser?.email}`;
  const msg = messages[index];
  if (!msg) return;

  if (type === "me") {
    let hidden = JSON.parse(localStorage.getItem(hiddenKey)) || [];
    hidden.push(msg.time);
    localStorage.setItem(hiddenKey, JSON.stringify(hidden));
  } else if (type === "everyone") {
    messages = messages.filter(m => m.time !== msg.time);
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }

  loadChatMessages();
};

window.toggleMsgMenu = function(id) {
  document.querySelectorAll('.msg-menu').forEach(menu => {
    if (!menu.closest(`#${id}`)) menu.classList.add('hidden');
  });

  const menu = document.querySelector(`#${id} .msg-menu`);
  if (menu) menu.classList.toggle('hidden');
};

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('dots-btn')) {
    document.querySelectorAll('.msg-menu').forEach(menu => menu.classList.add('hidden'));
  }
});


// Send text message
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    messages.push({
      name: currentUser?.name || "User",
      email: currentUser?.email || "anon",  // ✅ ADD THIS LINE
      text: chatInput.value.trim(),
      time: new Date().toISOString()
    });
    localStorage.setItem(chatKey, JSON.stringify(messages));
    chatInput.value = "";
    loadChatMessages();

    const audio = new Audio("https://www.myinstants.com/media/sounds/message-pop.mp3");
    audio.play();
  }
});


// Toggle chat open/collapse
toggleChat.addEventListener("click", () => {
  chatBox.classList.toggle("collapsed");
  toggleChat.textContent = chatBox.classList.contains("collapsed") ? "🔼" : "🔽";
});

// Add emoji
emojiBtn.addEventListener("click", () => {
  chatInput.value += "😊";
  chatInput.focus();
});

// Handle file upload
attachFileBtn.addEventListener("click", () => {
  chatFileInput.click();
});

chatFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    messages.push({
  name: currentUser?.name || "User",
  email: currentUser?.email || "anon",  // ✅ ADD THIS LINE
  text: "📎 Sent an image",
  image: event.target.result,
  time: new Date().toISOString()
});



    localStorage.setItem(chatKey, JSON.stringify(messages));
    loadChatMessages();

    const audio = new Audio("https://www.myinstants.com/media/sounds/message-pop.mp3");
    audio.play();
  };
  reader.readAsDataURL(file);
});

// Set role-based theme
if (currentUser?.role) {
  document.body.setAttribute("data-role", currentUser.role);
}

loadChatMessages();



  all.forEach(resource => {
  const card = document.createElement("div");
  card.className = "resource-card";
  card.innerHTML = `
   <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" width="24" />

    <h3>${resource.title}</h3>
    <p>${resource.description}</p>
    <div class="resource-links">
      <a href="${resource.link}" target="_blank">Open</a>
    </div>
  `;
  resourcesGrid.appendChild(card);
 });

  if (currentUser?.name) {
    welcomeText.textContent = `Welcome, ${currentUser.name}`;
    userNameDisplay.textContent = currentUser.name;
  }
   // ✅ Toggle filter sidebar
 filterToggleBtn?.addEventListener("click", () => {
  filterSidebar.classList.toggle("hidden");
 });

  function saveProgress(resourceId, page, timestamp = Date.now()) {
    const existing = progressData.find(p => p.id === resourceId);
    if (existing) {
      existing.page = page;
      existing.timestamp = timestamp;
    } else {
      progressData.push({ id: resourceId, page, timestamp });
    }
    localStorage.setItem(progressKey, JSON.stringify(progressData));
  }

  function getProgress(resourceId) {
    const record = progressData.find(p => p.id === resourceId);
    return record ? record.page : null;
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "ind.html";
  });

  document.getElementById("enterAppBtn")?.addEventListener("click", () => {
    document.getElementById("welcomeSection").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");
    document.getElementById("userWelcome").hidden = false;
  });

  document.getElementById("backBtn")?.addEventListener("click", () => {
    document.getElementById("mainApp").classList.add("hidden");
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("welcomeSection").classList.remove("hidden");
  });

  dashboardToggleBtn?.addEventListener("click", () => {
    dashboard.classList.toggle("hidden");
  });

  closeDashboardBtn?.addEventListener("click", () => {
    dashboard.classList.add("hidden");
  });
  
   // Enhanced resources array with thumbnails and more details
    // ✅ Step 1: Default resource data
   const fallbackResources = [
    {
      id: 1,
      class: 6,
      subject: 'Mathematics',
      title: '6th Grade MATHEMATICS',
      description: 'Comprehensive guide covering Numbers all around us ,Whole numbers ,HCF & LCM ,Integers,Fractions & Decimals ,Basic Arithmetic ,Introduction to Algebra ,Basic Geometric Concepts ,2D-3D Shapes ,Practical Geometry,Perimeter and Area ,Data Handling .',
      link: 'pdfs/6th_maths.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/LQv7gsmYZwFNvvfN2bdINsdlQv58ej8ylmQ5AaXj3Rg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFSMU1Yc1R4SUwu/anBn', 
      pages: 120,
      questions: 250
    },
    {
      id: 2,
      class: 6,
      subject: 'Science',
      title: '6th Grade Science sem1',
      description: 'Complete notes covering all science topics for 6th grade with diagrams and illustrations.',
      link: 'pdfs/6th_science_sem1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/SwnLhGktK7caqdsybwubGi1m5NzQKPa9oMDt2yX6uyc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDQvMDYvZGlL/VkVvXzI1OHgzODcu/SlBH',
      pages: 85,
      questions: 180
    },
    {
      id: 3,
      class: 6,
      subject: 'Science',
      title: '6th Grade Science sem2 ',
      description: 'Complete notes covering all science topics for 6th grade with diagrams and illustrations.',
      link: 'pdfs/6th_science_sem2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/SwnLhGktK7caqdsybwubGi1m5NzQKPa9oMDt2yX6uyc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDQvMDYvZGlL/VkVvXzI1OHgzODcu/SlBH',
      pages: 85,
      questions: 180
    },
     {
      id: 4,
      class: 6,
      subject: 'Hindi',
      title: '6th Grade Hindi',
      description: 'Interactive workbook with exercises covering all grammar concepts for 6th grade.',
      link: 'pdfs/6th_hindi.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/sGzgpPiKIokixZMOOlSENezHn1sUIvwF9LkGXFN_yms/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFiNEN0cFJKREwu/anBn',
      pages: 95,
      questions: 200
    },
    {
      id: 5,
      class: 6,
      subject: 'English',
      title: '6th Grade English',
      description: 'Interactive workbook with exercises covering all grammar concepts for 6th grade.',
      link: 'pdfs/6th_english.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/wqDN129Xa2QzDFc4Y4ULsmbe6l3VNi61IQ2EJSEclVs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjEvMDMvMzEvQWlP/dVZ2XzI1OHgzODcu/UE5H',
      pages: 95,
      questions: 200
    },
    {
      id: 6,
      class: 6,
      subject: 'Telugu',
      title: '6th Grade Telugu',
      description: 'Interactive workbook with exercises covering all grammar concepts for 6th grade.',
      link: 'pdfs/6th_telugu.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/ATlNFO0bdkogWEa722rS5RFOLHR3ti35053W-bv1bxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0LzEx/LzQ2OTMyNjI4MS9N/Sy9QUi9XTi8zMjE4/NDg3My82dGgtY2xh/c3MtdGVsdWd1LXZh/Y2hha2FtLXRleHRi/b29rLTEwMDB4MTAw/MC5qcGVn',
      pages: 95,
      questions: 200
    },
    {
      id: 7,
      class: 6,
      subject: 'History',
      title: '6th Grade Social sem1',
      description: 'Documentary series exploring ancient civilizations around the world.',
      link: 'pdfs/6th_social_sem1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/KsGtKMhdEvzQfrwdPy7cjAIJeaXT8VVFKJG5NAANA1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTE1elh4YXhid0wu/anBn',
      pages: 95,
    },
    {
      id: 8,
      class: 6,
      subject: 'History',
      title: '6th Grade Social sem2',
      description: 'Documentary series exploring ancient civilizations around the world.',
      link: 'pdfs/6th_social_sem2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/KsGtKMhdEvzQfrwdPy7cjAIJeaXT8VVFKJG5NAANA1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTE1elh4YXhid0wu/anBn',
      pages: 95,
    },
    // Add more resources following the same structure
      {
      id: 9,
      class: 7,
      subject: 'Mathematics',
      title: '7th Grade MATHEMATICS Sem1 ',
      description: 'designed to provide a comprehensive understanding of mathematical concepts, covering a wide range of topics that are essential for building a strong foundation in mathematics. ',
      link: 'pdfs/7th_Maths_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/mLPuMRmtTHYEuTqYF0-XrNr_Y4v6lcgehKCk85_1xgU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDUvMDEvSHo0/M3dUXzI1OHgzODcu/SlBH',
      pages: 278,
      questions: 250
    },
     {
      id: 10,
      class: 7,
      subject: 'Mathematics',
      title: '7th Grade MATHEMATICS Sem2 ',
      description: 'designed to provide a comprehensive understanding of mathematical concepts, covering a wide range of topics that are essential for building a strong foundation in mathematics. ',
      link: 'pdfs/7th_Maths_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/mLPuMRmtTHYEuTqYF0-XrNr_Y4v6lcgehKCk85_1xgU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDUvMDEvSHo0/M3dUXzI1OHgzODcu/SlBH',
      pages: 218,
      questions: 250
    },
    {
      id: 11,
      class: 7,
      subject: 'Science',
      title: '7th Grade Science Sem1 ',
      description: 'designed to provide students with a comprehensive understanding of various scientific concepts.',
      link: 'pdfs/7th_Science_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/LC92vcGbKl51qN4OtqmqOegXLpVvvyhXKTw8j21VdSA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8xMS9BUC03/dGgtQ2xhc3MtU2Np/ZW5jZS1TdHVkeS1N/YXRlcmlhbC1HdWlk/ZS1QZGYucG5n',
      pages: 179,
      questions: 180
    },
    {
      id: 12,
      class: 7,
      subject: 'Science',
      title: '7th Grade Science Sem1 ',
      description: 'designed to provide students with a comprehensive understanding of various scientific concepts.',
      link: 'pdfs/7th_Science_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/LC92vcGbKl51qN4OtqmqOegXLpVvvyhXKTw8j21VdSA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8xMS9BUC03/dGgtQ2xhc3MtU2Np/ZW5jZS1TdHVkeS1N/YXRlcmlhbC1HdWlk/ZS1QZGYucG5n',
      pages: 186,
      questions: 180
    },
    {
      id: 13,
      class:7 ,
      subject: 'English',
      title: ' 7th Grade English ',
      description: 'designed to enhance students language skills and critical thinking abilities.',
      link: 'pdfs/7th_English.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/mGYYqHeDp6_Wq-y0NJjYuEZ1N3QZHYOY3nhapfBxA20/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNy9UUy03/dGgtQ2xhc3MtRW5n/bGlzaC1Hb3Zlcm5t/ZW50LVRleHRib29r/LUFuc3dlcnMtVGVs/YW5nYW5hLnBuZw',
      pages: 95,
      questions: 200
    },
    {
     id: 14,
      class: 7,
      subject: 'Science',
      title: '7th Grade EVS ',
      description: 'designed to provide students with a comprehensive understanding of environmental studies.',
      link: 'pdfs/7th_EVS.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/ZmLmYYY5uRjNNOt9pLtdkOX6DgZwEz2f7kbJCh_yPEo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFQLTZmdmxkYkwu/anBn',
      pages:94 ,
      questions: 180
    },
    {
      id: 15,
      class: 7,
      subject: 'Hindi',
      title: '7th Grade Hindi',
      description: 'Documentary series exploring ancient civilizations around the world.',
      link: 'pdfs/7th_Hindi.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/WFTLd8yRv9uiRyU6igqlGcW0l_xHBTC1sCxIWZNrNH0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFDSk90MmJQd0wu/anBn',
      pages:122,
    },
    // Add more resources following the same structure
    // Add more resources following the same structure
      {
      id: 16,
      class: 7,
      subject: 'History',
      title: '7th Grade Social Sem1 ',
      description: 'an essential resource for students, covering three main subjects: History, Geography, and Civics.',
      link: 'pdfs/7th_Social-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/1Wsf4uymVpcLqCRvu_Jfn1DT3KNh6-YogQoH_-XokFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFTVnpRV2NKNkwu/anBn',
      pages: 184,
      questions: 250
    },
     {
      id: 16,
      class: 7,
      subject: 'History',
      title: '7th Grade Social Sem2',
      description: 'an essential resource for students, covering three main subjects: History, Geography, and Civics.',
      link: 'pdfs/7th_Social-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/1Wsf4uymVpcLqCRvu_Jfn1DT3KNh6-YogQoH_-XokFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFTVnpRV2NKNkwu/anBn',
      pages: 88,
      questions: 90
    },
     {
      id: 17,
      class: 7,
      subject: 'Telugu',
      title: '7th Grade Telugu',
      description: 'designed to provide students with a comprehensive understanding of the Telugu language',
      link: 'pdfs/7th_Telugu.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/un2P9VrqF2KBwgFZQ1m1N0B8XOOcNWO5aTo0fUVecIc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNC83dGgt/Q2xhc3MtVGVsdWd1/LUd1aWRlLUFuc3dl/cnMtVGVsYW5nYW5h/LnBuZw',
      pages: 154,
      questions: 250
    },
      {
      id: 18,
      class: 8,
      subject: 'Science',
      title: '8th Grade Biology Sem1',
      description: 'typically covers fundamental concepts in biology, including topics such as nutrition in plants and animals, the structure and function of living organisms, and the environment.',
      link: 'pdfs/8th_Biology_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/NCsi1NcoN2MlsLfqaEfJezGVMyKeWAfByxJFYfcGg50/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNC9UUy04/dGgtQ2xhc3MtQmlv/bG9neS1HdWlkZS1Q/ZGYtVGVsYW5nYW5h/LVN0YXRlLnBuZw',
      pages:130 ,
      questions: 250
    },
      {
      id: 19,
      class: 8,
      subject: 'Science',
      title: '8th Grade Biology Sem2',
      description: 'typically covers fundamental concepts in biology, including topics such as nutrition in plants and animals, the structure and function of living organisms, and the environment.',
      link: 'pdfs/8th_Biology_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/NCsi1NcoN2MlsLfqaEfJezGVMyKeWAfByxJFYfcGg50/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wNC9UUy04/dGgtQ2xhc3MtQmlv/bG9neS1HdWlkZS1Q/ZGYtVGVsYW5nYW5h/LVN0YXRlLnBuZw',
      pages:98 ,
      questions: 250
    },
      {
      id:20 ,
      class: 8,
      subject: 'English',
      title: '8th Grade English',
      description: 'designed to enhance students language skills and critical thinking abilities.',
      link: 'pdfs/8th_English.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/qU8JvVNY-EY4tu48L20GjMHUFzXN5zwRj-zPUUgm478/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFrQlg4Z3RWREwu/anBn',
      pages:146,
      questions: 250
    },
      {
      id:21 ,
      class: 8,
      subject: 'Science',
      title: '8th Grade EVS',
      description: 'designed to provide students with a comprehensive understanding of environmental concepts and scientific principles.',
      link: 'pdfs/8th_EVS.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/8j2r3JE9USFsdNIxwDCPK_jrLZtbTPNVUc6-n0P5iHM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFYTGNUUU9QYUwu/anBn',
      pages:110 ,
      questions: 250
    },
      {
      id:22 ,
      class: 8,
      subject: 'Hindi',
      title: '8th Grade Hindi ',
      description: 'commonly known as "Vasant," is a part of the NCERT curriculum and is designed to enhance students understanding of the Hindi language.',
      link: 'pdfs/8th_Hindi.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/MvvCwrFKgrXxqPmdTckwMppocmwqZg50x2qygAezX_I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFSZFNDKzY5dEwu/anBn',
      pages:114 ,
      questions: 250
    },
      {
      id: 23,
      class: 8,
      subject: 'Mathematics',
      title: '8th Grade Mathematics Sem1',
      description: 'designed to help students understand fundamental mathematical concepts and build a strong foundation for advanced studies.',
      link: 'pdfs/8th_Maths_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/p0m3pWMTxewd2p-u0LVH5pr4DKadQWwpyC-ABZCJ3aM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDYvMDkvcUgy/dExwXzI1OHgzODcu/SlBH',
      pages:302 ,
      questions: 250
    },
     {
      id: 24,
      class: 8,
      subject: 'Mathematics',
      title: '8th Grade Mathematics Sem1',
      description: 'designed to help students understand fundamental mathematical concepts and build a strong foundation for advanced studies.',
      link: 'pdfs/8th_Maths_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/p0m3pWMTxewd2p-u0LVH5pr4DKadQWwpyC-ABZCJ3aM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjMvMDYvMDkvcUgy/dExwXzI1OHgzODcu/SlBH',
      pages: 282,
      questions: 250
    },
      {
      id:25 ,
      class: 8,
      subject: 'Science',
      title: '8th Grade Physics Sem1 ',
      description: 'designed to provide students with a comprehensive understanding of fundamental physics concepts.',
      link: 'pdfs/8th_Physics_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/CjNrGvprb9-IlStCEE-R5foFiX96UJhmx-aDlFWpmfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wMy9UUy04/dGgtQ2xhc3MtUGh5/c2ljYWwtU2NpZW5j/ZS1TdHVkeS1NYXRl/cmlhbC5wbmc',
      pages:170 ,
      questions: 250
    },
    {
      id:26 ,
      class: 8,
      subject: 'Science',
      title: '8th Grade Physics Sem2 ',
      description: 'designed to provide students with a comprehensive understanding of fundamental physics concepts.',
      link: 'pdfs/8th_Physics_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/CjNrGvprb9-IlStCEE-R5foFiX96UJhmx-aDlFWpmfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wMy9UUy04/dGgtQ2xhc3MtUGh5/c2ljYWwtU2NpZW5j/ZS1TdHVkeS1NYXRl/cmlhbC5wbmc',
      pages: 174,
      questions: 250
    },
      {
      id:27 ,
      class: 8,
      subject: 'History',
      title: '8th Grade Geography ',
      description: 'covers essential topics such as resources, agriculture, industries, and human resources.',
      link: 'pdfs/8th_Social_Geography.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/YJtC0o1ciCUYjBNfYI6v2aFjzT_3_mb6GSWFribGx18/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQbzJIaWZkMUwu/anBn',
      pages:154 ,
      questions: 250
    },
      {
      id:28 ,
      class: 8,
      subject: 'History',
      title: '8th Grade History ',
      description: 'typically cover topics from the colonial era through Reconstruction.',
      link: 'pdfs/8th_Social_History.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/YJtC0o1ciCUYjBNfYI6v2aFjzT_3_mb6GSWFribGx18/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQbzJIaWZkMUwu/anBn',
      pages: 298,
      questions: 250
    },
      {
      id:29 ,
      class: 8,
      subject: 'History',
      title: '8th Grade Politics ',
      description: '',
      link: 'pdfs/8th_Social_Politics.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/YJtC0o1ciCUYjBNfYI6v2aFjzT_3_mb6GSWFribGx18/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQbzJIaWZkMUwu/anBn',
      pages:286 ,
      questions: 250
    },
      {
      id:30 ,
      class: 8,
      subject: 'Telugu',
      title: '8th Grade Telugu',
      description: 'designed to provide students with a comprehensive understanding of the Telugu language and its various aspects.',
      link: 'pdfs/8th_Telugu.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/Ujgra5xkVDvriJQnN6-1ZVemAO7bfQtw5hUFxOvtVI0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFOMTR4eGNwOEwu/anBn',
      pages:182 ,
      questions: 250
    },
      
      {
      id:31 ,
      class: 9,
      subject: 'Science',
      title: '9th Grade Biology',
      description: 'covers essential biological topics with an emphasis on practical applications and the significance of biology in daily life.',
      link: 'pdfs/9th_Biology.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/GvIgw94rUmp7ue0PnjiR0K8Vyopiq3eJZ1lGOiQuRGE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGFsZWVtMzYwLmNv/bS91cGxvYWRzLzIw/MjEvMDYvMjMvSlNs/OXcyXzI1OHgzODcu/UE5H',
      pages: 82,
      questions: 250
    },
    {
      id:32 ,
      class: 9,
      subject: 'English',
      title: '9th Grade English',
      description: 'provides a comprehensive approach to learning English, including various activities and exercises.',
      link: 'pdfs/9th_English.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/lsk_Ky1qus43AJtoU2VRiqWwdQwOx3qbf6CzbYT2x_k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFYTFdzSDNRcUwu/anBn',
      pages:130 ,
      questions: 250
    },
    {
      id:33 ,
      class: 9,
      subject: 'Science',
      title: '9th Grade EVS',
      description: 'there is information about EVS textbooks for other classes.',
      link: 'pdfs/9th_EVS.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/Un9UekTdTwtNyHJBoGHBpHPSjsSP1JjKzrAHj5mr28E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zYWhp/dHlhYmhhd2FuLmNv/LmluL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIxLzA3LzIzNzEu/anBn',
      pages:134 ,
      questions: 250
    },
    {
      id:34 ,
      class: 9,
      subject: 'Hindi',
      title: '9th Grade Hindi',
      description: 'designed to enhance their reading, writing, and comprehension skills in the Hindi language.',
      link: 'pdfs/9th_Hindi.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/8nbAj9W51YJ0ZSy4b8SFOhsvFi0TK5K3wW_TpDRRptk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0LzEv/Mzc4Mjg4MTQwL09T/L0VTL0ZaLzI4NzI2/MzM5L25jZXJ0LTl0/aC1jbGFzcy1oaW5k/aS10ZXh0Ym9vay1w/YXJ0LTEtMTAwMHgx/MDAwLmpwZWc',
      pages:104 ,
      questions: 250
    },
    {
      id:35 ,
      class: 9,
      subject: 'Mathematics',
      title: '9th Grade Mathematics Sem1 ',
      description: 'a comprehensive resource designed to help students understand the fundamental concepts of mathematics.',
      link: 'pdfs/9th_Maths_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/dmnK0QmPsrvbwu2Ghdt45dgDTTY8d2DGS4ZOFGTxKx4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIxLzgv/VE4vS00vTVcvMTI0/MDQ1NDAyL21hdGgt/Mi1qcGctMTAwMHgx/MDAwLmpwZw',
      pages: 250,
      questions: 250
    },
    {
      id:36 ,
      class: 9,
      subject: 'Mathematics',
      title: '9th Grade Mathematics Sem2 ',
      description: 'a comprehensive resource designed to help students understand the fundamental concepts of mathematics.',
      link: 'pdfs/9th_Maths_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/dmnK0QmPsrvbwu2Ghdt45dgDTTY8d2DGS4ZOFGTxKx4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIxLzgv/VE4vS00vTVcvMTI0/MDQ1NDAyL21hdGgt/Mi1qcGctMTAwMHgx/MDAwLmpwZw',
      pages:234 ,
      questions: 250
    },
    {
      id:37 ,
      class: 9,
      subject: 'Science',
      title: '9th Grade Physics Sem1',
      description: 'designed for students following the Punjab Board curriculum and is available in both English and Urdu mediums',
      link: 'pdfs/9th_Physics_SEM-1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/ufNAlVuYlCsGK5AkfTHQjSr2y9o6pXR28UT0voG3e2g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/Ym9va3MucGsvd3At/Y29udGVudC91cGxv/YWRzLzIwMTYvMTAv/UGh5c2ljcy05dGgt/aW4tRW5nbGlzaC1G/cmVlYm9va3MucGtf/LTEuanBn',
      pages: 140,
      questions: 250
    },
    {
      id:38 ,
      class: 9,
      subject: 'Science',
      title: '9th Grade Physics Sem2 ',
      description: 'designed for students following the Punjab Board curriculum and is available in both English and Urdu mediums',
      link: 'pdfs/9th_Physics_SEM-2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/ufNAlVuYlCsGK5AkfTHQjSr2y9o6pXR28UT0voG3e2g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mcmVl/Ym9va3MucGsvd3At/Y29udGVudC91cGxv/YWRzLzIwMTYvMTAv/UGh5c2ljcy05dGgt/aW4tRW5nbGlzaC1G/cmVlYm9va3MucGtf/LTEuanBn',
      pages: 122,
      questions: 250
    },
    {
      id:39 ,
      class: 9,
      subject: 'History',
      title: '9th Grade Economics',
      description: 'a comprehensive resource designed for students following the CBSE curriculum.',
      link: 'pdfs/9th_Social_Economics.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/PYZOxlyZFOfF2VfPAhua98s2JlkpEUmLV9ujI5NX-l4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTEyZ2VodENadEwu/anBn',
      pages:122 ,
      questions: 250
    },
    {
      id:40 ,
      class: 9,
      subject: 'History',
      title: '9th Grade Geography',
      description: 'covers a range of topics related to world geography, including the study of maps, globes, landforms, and topographical features.',
      link: 'pdfs/9th_Social_Geography.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/PYZOxlyZFOfF2VfPAhua98s2JlkpEUmLV9ujI5NX-l4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTEyZ2VodENadEwu/anBn',
      pages: 126,
      questions: 250
    },
    {
      id:41 ,
      class: 9,
      subject: 'History',
      title: '9th Grade History',
      description: 'covers the understanding of the past five centuries.',
      link: 'pdfs/9th_Social_History.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/PYZOxlyZFOfF2VfPAhua98s2JlkpEUmLV9ujI5NX-l4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTEyZ2VodENadEwu/anBn',
      pages:246 ,
      questions: 250
    },
    {
      id:42 ,
      class: 9,
      subject: 'History',
      title: '9th Grade Politics',
      description: 'Democratic Politics 1," is a Civics textbook designed for Class 9 students',
      link: 'pdfs/9th_Social_Politics.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/PYZOxlyZFOfF2VfPAhua98s2JlkpEUmLV9ujI5NX-l4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTEyZ2VodENadEwu/anBn',
      pages:194 ,
      questions: 250
    },
    {
      id:43 ,
      class: 9,
      subject: 'Telugu',
      title: '9th Grade Telugu ',
      description: 'part of the curriculum designed by the Andhra Pradesh State Council of Educational Research and Training (AP SCERT) to provide students with a comprehensive and structured learning experience.',
      link: 'pdfs/9th_Telugu.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/jzNrkmBhL7WGi4y6ZXrUFWxeClHglHxTXXJVF4dxxgw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNi9BUC1C/b2FyZC05dGgtQ2xh/c3MtVGVsdWd1LVRl/eHRib29rLVNvbHV0/aW9ucy1TdHVkeS1N/YXRlcmlhbC1HdWlk/ZS5wbmc',
      pages: 210,
      questions: 250
    },
    {
      id:44 ,
      class: 10,
      subject: 'Science',
      title: '10th Grade Biology ',
      description: 'a comprehensive resource designed for students to gain a solid foundation in biology.',
      link: 'pdfs/10th_biology.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/WjHXPQrUjwFHDCBujnzct1wdj5D154jzMXESL_kV2Fk/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5q/bnR1ZmFzdHVwZGF0/ZXMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzAyL1RT/LTEwdGgtQ2xhc3Mt/QmlvbG9neS1UZXh0/Ym9vay5qcGc',
      pages:246 ,
      questions: 250
    },
    {
      id:45 ,
      class: 10,
      subject: 'English',
      title: '10th Grade English',
      description: 'designed to enhance students language skills, focusing on reading, writing, speaking, and listening. ',
      link: 'pdfs/10th_English.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/vTmsCpTDgl8vbtNgejW2P_pnsqHVEZKcVrLNzRg-fSo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYvazE1/Ymp3dzAvcmVnaW9u/YWxib29rcy90LzIv/dy9uY2VydC1maXJz/dC1mbGlnaHQtZW5n/bGlzaC10ZXh0LWNs/YXNzLTEwLW9yaWdp/bmFsLWltYWZrcm5w/N3l2a3lqOWIuanBl/Zz9xPTcw',
      pages:154 ,
      questions: 250
    },
    {
      id:46 ,
      class: 10,
      subject: 'Hindi',
      title: '10th Grade Hindi',
      description: 'designed to enhance students understanding of the Hindi language and literature.',
      link: 'pdfs/10th_Hindi.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/F86ZKtwUjU4QNjR74AzduYEoHpb78qFk7SsD3mlwvHc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9oaW5k/aS50aXdhcmlhY2Fk/ZW15LmNvbS9hcHAv/dXBsb2Fkcy8yMDIz/LzA4LzEwLUhpbmRp/LVJhdGlvbmFsaXNl/ZC1TeWxsYWJ1cy5q/cGc',
      pages:88 ,
      questions: 250
    },
    {
      id:47 ,
      class: 10,
      subject: 'Mathematics',
      title: '10th Grade Mathematics Sem1 ',
      description: 'designed to provide a comprehensive understanding of mathematical concepts, covering topics such as Algebra, Trigonometry, Geometry, and Calculus.',
      link: 'pdfs/10th_Maths_Sem1.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/wAPWyB9IN8pEb0cfKIPJ3rIIfIHF_jEzvxq81A_7wdA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZHJ6LmxhemNkbi5j/b20vc3RhdGljL3Br/L3AvZTc2NWJlYzhh/ZWU3OGVkMGUyMmFk/Nzk0MDkyOWI2NTAu/anBnXzEyMHgxMjBx/ODAuanBn',
      pages: 206,
      questions: 250
    },
    {
      id:48 ,
      class: 10,
      subject: 'Mathematics',
      title: '10th Grade Mathematics Sem2',
      description: 'designed to provide a comprehensive understanding of mathematical concepts, covering topics such as Algebra, Trigonometry, Geometry, and Calculus.',
      link: 'pdfs/10th_Maths_Sem2.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/wAPWyB9IN8pEb0cfKIPJ3rIIfIHF_jEzvxq81A_7wdA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZHJ6LmxhemNkbi5j/b20vc3RhdGljL3Br/L3AvZTc2NWJlYzhh/ZWU3OGVkMGUyMmFk/Nzk0MDkyOWI2NTAu/anBnXzEyMHgxMjBx/ODAuanBn',
      pages: 260,
      questions: 250
    },
    {
      id:49 ,
      class: 10,
      subject: 'Science',
      title: '10th Grade Physics ',
      description: 'a comprehensive resource designed for students to understand fundamental physics concepts.',
      link: 'pdfs/10th_Physics.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/bo_iOZ17pkzXSLPdvwozHtRu7n5IH8bMphYvpefM4kI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vp/TkVoUUhwR3cyXzRK/ckZHeHhkRUFhbXNT/Z2l0UUQ1NnlubVEw/NDJhcHJGbWVJUDZq/bC02elhIWmJuT2N5/WjB6MlVSZmVYQ3Y1/MjVXS2lMcHNUMmhj/ai1xV0s3TE9yR1Y2/TzFYYWtlaV9pQXRv/dWhJUTVlX2xObTlV/LXRBSW9NQkU5VU1L/eDA4eHZkZXNCR0RB/ekVEVGxnQmpYTGJH/eUJuem9LQXRZMTFp/YktUZ2RFNUU4XzVP/cDRfbGk3NUEvdzUy/Mi1oMzI3LzEwdGgl/MjBjbGFzcyUyMHRl/eHQlMjBib29rJTIw/Y292ZXIlMjBwYWdl/LnBuZw',
      pages:186 ,
      questions: 250
    },
    {
      id: 50,
      class: 10,
      subject: 'Telugu',
      title: '10th Grade Telugu',
      description: 'designed to provide comprehensive study material for students following the Telangana curriculum.',
      link: 'pdfs/10th_telugu.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/BTGiiYpgIx3BC72GMn5rzYqrkPNgwk3lweC2hlY7HHQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcGJv/YXJkc29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wNi9BUC1C/b2FyZC0xMHRoLUNs/YXNzLVRlbHVndS1U/ZXh0Ym9vay1Tb2x1/dGlvbnMtU3R1ZHkt/TWF0ZXJpYWwtR3Vp/ZGUucG5n',
      pages:210 ,
      questions: 250
    },
     {
      id: 51,
      class: 10,
      subject: 'History',
      title: '10th Grade History ',
      description: 'designed to make history engaging and easy to understand, with a focus on applied history and its relevance to everyday life and professional skills.',
      link: 'pdfs/10th_Social_ HISTORY.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/uIcdDpoUa_1xnqhcV3a3NxT8qSo-cVmjigatnpcWFGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFZTlVmZklSQUwu/anBn',
      pages:125 ,
      questions: 250
    },
     {
      id:52 ,
      class: 10,
      subject: 'History',
      title: '10th Grade Economics ',
      description: '"Understanding Economic Development"',
      link: 'pdfs/10th_Social_ECONOMICS.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/uIcdDpoUa_1xnqhcV3a3NxT8qSo-cVmjigatnpcWFGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFZTlVmZklSQUwu/anBn',
      pages: 91,
      questions: 250
    },
     {
      id: 53,
      class: 10,
      subject: 'History',
      title: '10th Grade Geography ',
      description: 'an essential resource for students preparing for their board exams, covering topics such as resources and development, forests and wildlife, water resources, and more.',
      link: 'pdfs/10th_Social_GEOGRAPHY.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/uIcdDpoUa_1xnqhcV3a3NxT8qSo-cVmjigatnpcWFGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFZTlVmZklSQUwu/anBn',
      pages: 83,
      questions: 250
    },
    
    {
      id:54 ,
      class: 10,
      subject: 'History',
      title: '10th Grade Politics ',
      description: '"Democratic Politics II"',
      link: 'pdfs/10th_Social_POLITICS.pdf',
      type: 'pdf',
      thumbnail: 'https://imgs.search.brave.com/uIcdDpoUa_1xnqhcV3a3NxT8qSo-cVmjigatnpcWFGo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFZTlVmZklSQUwu/anBn',
      pages:74 ,
      questions: 250
    },
   
  ];
  // ✅ Step 2: Inject only if localStorage is empty
  if (!localStorage.getItem("global_resources")) {
    localStorage.setItem("global_resources", JSON.stringify(fallbackResources));
  }

  // ✅ Step 3: Read globalResources now
  const globalResources = JSON.parse(localStorage.getItem("global_resources")) || [];

  // ✅ Step 4: Assign globalResources to be used inside displayResources
  window.globalResources = globalResources;

  // ✅ Step 5: Now call displayResources
  displayResources();
 
  document.getElementById("filterBtn")?.addEventListener("click", () => {
  const classArray = Array.from(document.querySelectorAll('#classList input:checked')).map(cb => parseInt(cb.dataset.class));
  const subjectArray = Array.from(document.querySelectorAll('#subjectList input:checked')).map(cb => cb.dataset.subject);

  displayResources(classArray, subjectArray);
 });


function displayResources(selectedClasses = [], selectedSubjects = [], searchTerm = "") {
  const resourcesGrid = document.getElementById("resourcesGrid");
  resourcesGrid.innerHTML = "";

  const globalResources = JSON.parse(localStorage.getItem("global_resources")) || [];
  const deletedResources = JSON.parse(localStorage.getItem("bin_resources")) || [];
  const bookmarksKey = `bookmarks_${currentUser?.email}`;
  const bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];

  const activeResources = globalResources.filter(
    r => !deletedResources.some(dr => dr.id === r.id)
  );

  // ✅ Class + Subject + Search filter
  const filtered = activeResources.filter(r =>
    (selectedClasses.length === 0 || selectedClasses.includes(r.class)) &&
    (selectedSubjects.length === 0 || selectedSubjects.includes(r.subject)) &&
    (searchTerm === "" || r.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!filtered.length) {
    resourcesGrid.innerHTML = "<p>No resources found.</p>";
    return;
  }

  filtered.forEach(resource => {
    const isBookmarked = bookmarks.some(b => b.id === resource.id);
    const thumb = resource.thumbnail || "https://cdn-icons-png.flaticon.com/512/337/337946.png";

    const card = document.createElement("div");
    card.className = "resource-card";
    card.innerHTML = `
      <div class="resource-thumbnail" style="background-image: url('${thumb}')">
        <span class="resource-type">${resource.type}</span>
      </div>
      <div class="resource-info">
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-actions">
          <button class="action-btn view-btn" data-id="${resource.id}">👁 View</button>
          <a href="${resource.link}" download class="action-btn download-btn">⬇️ Download</a>
          
          <button class="action-btn bookmark-btn ${isBookmarked ? '★' : ''}" data-id="${resource.id}">
            ${isBookmarked ? '★' : '☆'} Bookmark
          </button>
        </div>
      </div>
    `;
    resourcesGrid.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const res = activeResources.find(r => r.id === id);
      if (res) openResourceViewer(res);
    });
  });
  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const index = bookmarks.findIndex(b => b.id === id);
      if (index >= 0) bookmarks.splice(index, 1);
      else bookmarks.push(activeResources.find(r => r.id === id));
      localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      displayResources(selectedClasses, selectedSubjects);
    });
  });
   function openResourceViewer(resource) {
  const viewer = document.getElementById("resourceViewer");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerBody = document.getElementById("viewerBody");

  viewerTitle.textContent = resource.title;

  if (resource.type === "video") {
    viewerBody.innerHTML = `
      <video controls width="100%" height="500">
        <source src="${resource.link}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  } else if (resource.type === "pdf") {
    const savedPage = getProgress(resource.id) || 1;
    viewerBody.innerHTML = `
      <iframe id="pdfFrame" src="${resource.link}#page=${savedPage}" style="width:100%; height:600px;"></iframe>
      <label>Go to Page: <input type="number" id="pageTracker" min="1" value="${savedPage}" /></label>
    `;
    saveProgress(resource.id, savedPage);
    document.getElementById("pageTracker").addEventListener("change", (e) => {
      const page = parseInt(e.target.value);
      document.getElementById("pdfFrame").src = `${resource.link}#page=${page}`;
      saveProgress(resource.id, page);
    });
  } else {
    viewerBody.innerHTML = `<p>Unsupported resource type</p>`;
  }

  viewer.classList.remove("hidden");
}
document.querySelector(".close-viewer")?.addEventListener("click", () => {
  document.getElementById("resourceViewer").classList.add("hidden");
});
}

function renderBookmarksTab() {
  const resourcesGrid = document.getElementById("resourcesGrid");
  const bookmarksKey = `bookmarks_${currentUser?.email}`;
  const bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];

  resourcesGrid.innerHTML = "";

  if (!bookmarks.length) {
    resourcesGrid.innerHTML = "<p>No bookmarks yet.</p>";
    return;
  }

  bookmarks.forEach(resource => {
    const thumb = resource.thumbnail || "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    const card = document.createElement("div");
    card.className = "resource-card";
    card.innerHTML = `
      <div class="resource-thumbnail" style="background-image: url('${thumb}')">
        <span class="resource-type">${resource.type}</span>
      </div>
      <div class="resource-info">
        <h3 class="resource-title">${resource.title}</h3>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-actions">
          <button class="action-btn view-btn" data-id="${resource.id}">👁 View</button>
          <a href="${resource.link}" download class="action-btn download-btn">⬇️ Download</a>
          <button class="action-btn bookmark-btn" data-id="${resource.id}">★ Remove Bookmark</button>
        </div>
      </div>
    `;
    resourcesGrid.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const res = bookmarks.find(r => r.id === id);
      if (res) openResourceViewer(res);
    });
  });

  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      let bookmarks = JSON.parse(localStorage.getItem(bookmarksKey)) || [];
      bookmarks = bookmarks.filter(b => b.id !== id);
      localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      renderBookmarksTab();
    });
  });
}
function renderProfileTab() {
  const dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.innerHTML = `
    <div class="profile-box">
      <h2>👤 Profile</h2>
      <p><strong>Name:</strong> ${currentUser?.name || "Guest"}</p>
      <p><strong>Email:</strong> ${currentUser?.email || "N/A"}</p>
      <p><strong>Role:</strong> ${currentUser?.role || "Not Set"}</p>
    </div>
  `;
}
function renderProgressTab() {
  dashboardContent.innerHTML = `<h3>Progress</h3>`;

  if (!progressData.length) {
    dashboardContent.innerHTML += `<p>No progress tracked yet.</p>`;
    return;
  }

  const globalResources = JSON.parse(localStorage.getItem("global_resources")) || [];

  progressData.forEach(p => {
    const res = globalResources.find(r => r.id === p.id);
    if (res) {
      const time = new Date(p.timestamp).toLocaleString();
      const detail = res.type === 'pdf'
        ? `Last page viewed: ${p.page}`
        : `Last watched: ${p.page} sec`;

      dashboardContent.innerHTML += `
        <div class="progress-item">
          <div class="progress-details">
            <strong>${res.title}</strong><br/>
            ${detail}<br/>
            Last viewed: ${time}
          </div>
          <div class="progress-actions">
            <button class="menu-btn" data-id="${p.id}">⋮</button>
            <div class="menu hidden" id="menu-${p.id}">
              <button class="delete-progress" data-id="${p.id}">🗑️ Delete</button>
              <button class="share-progress" data-id="${p.id}">🔗 Share</button>
            </div>
          </div>
        </div><hr/>
      `;
    }
  });

  // Show/hide the menu
  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      document.querySelectorAll(".menu").forEach(m => m.classList.add("hidden")); // hide all first
      document.getElementById(`menu-${id}`)?.classList.toggle("hidden"); // toggle current
    });
  });

  // Handle delete
  document.querySelectorAll(".delete-progress").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      progressData = progressData.filter(p => p.id !== id);
      localStorage.setItem(`progress_${currentUser?.email}`, JSON.stringify(progressData));
      renderProgressTab();
    });
  });

  // Handle share
  document.querySelectorAll(".share-progress").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const res = globalResources.find(r => r.id === id);
      if (res) {
        navigator.clipboard.writeText(window.location.origin + '/' + res.link)
          .then(() => alert("Link copied to clipboard!"))
          .catch(() => alert("Failed to copy link."));
      }
    });
  });
}
document.getElementById("filterBtn")?.addEventListener("click", () => {
  const classArray = Array.from(document.querySelectorAll('#classList input:checked')).map(cb => parseInt(cb.dataset.class));
  const subjectArray = Array.from(document.querySelectorAll('#subjectList input:checked')).map(cb => cb.dataset.subject);
  const searchTerm = document.getElementById("searchInput")?.value.trim() || "";
  displayResources(classArray, subjectArray, searchTerm);
});





document.getElementById("searchInput")?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();
  const classArray = Array.from(document.querySelectorAll('#classList input:checked')).map(cb => parseInt(cb.dataset.class));
  const subjectArray = Array.from(document.querySelectorAll('#subjectList input:checked')).map(cb => cb.dataset.subject);
  displayResources(classArray, subjectArray, searchTerm);
});


  function openResourceViewer(resource) {
    if (resource.type === 'pdf') {
  const savedPage = getProgress(resource.id) || 1;
   viewerBody.innerHTML = `
  <iframe id="pdfFrame" src="${resource.link}#page=${savedPage}" style="width:100%; height:600px;"></iframe>
  <label>Go to Page: <input type="number" id="pageTracker" min="1" value="${savedPage}" /></label>
 `;
  saveProgress(resource.id, savedPage); // ✅ Save progress on initial open

  document.getElementById("pageTracker").addEventListener("change", (e) => {
   const page = parseInt(e.target.value);
   const frame = document.getElementById("pdfFrame");
   frame.src = `${resource.link}#page=${page}`;
   saveProgress(resource.id, page); // ✅ Save progress when changed
  });

 }

    viewerTitle.textContent = resource.title;
    viewerBody.innerHTML = resource.type === 'pdf'
      ? `<iframe src="${resource.link}" style="width:100%; height:600px;"></iframe>`
      : `<iframe src="${resource.link.replace("watch?v=", "embed/")}" style="width:100%; height:400px;"></iframe>`;
    resourceViewer.classList.remove("hidden");
}

  closeViewer?.addEventListener("click", () => {
    resourceViewer.classList.add("hidden");
  });

  

  
  

  
  function renderSettingsTab() {
    dashboardContent.innerHTML = `
      <h3>Settings</h3>
      <form id="settingsForm" class="settings-form">
        <label for="currentPassword">Current Password</label>
        <input type="password" id="currentPassword" required />

        <label for="newPassword">New Password</label>
        <input type="password" id="newPassword" required />

        <label for="confirmPassword">Confirm New Password</label>
        <input type="password" id="confirmPassword" required />

        <label for="changeEmail">Change Email (Optional)</label>
        <input type="email" id="changeEmail" value="${currentUser.email}" />

        <button type="submit" class="save-btn">Save Changes</button>
      </form>
    `;

    document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const oldPass = document.getElementById("currentPassword").value;
      const newPass = document.getElementById("newPassword").value;
      const confirm = document.getElementById("confirmPassword").value;
      const newEmail = document.getElementById("changeEmail").value.trim();

      if (oldPass !== currentUser.password) return alert("Incorrect password");
      if (newPass !== confirm) return alert("Passwords don't match");
      if (newEmail && !/^\S+@\S+\.\S+$/.test(newEmail)) return alert("Invalid email");

      localStorage.removeItem(`user_${currentUser.email}`);
      currentUser.password = newPass;
      if (newEmail) currentUser.email = newEmail;
      localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(currentUser));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      alert("Updated successfully");
    });
  }
dashboardTabs?.forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;

    dashboardTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    if (tabName === "bookmarks") renderBookmarksTab();
    else if (tabName === "profile") renderProfileTab();
    else if (tabName === "progress") renderProgressTab();
    else if (tabName === "settings") renderSettingsTab();
  });
});


  displayResources();
}); 