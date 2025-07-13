 document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enterBtn');
    const mainApp = document.getElementById('mainApp');
    const welcomePage = document.getElementById('welcomePage');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const studentLoginBtn = document.getElementById('studentLoginBtn');
    const teacherLoginBtn = document.getElementById('teacherLoginBtn');
    
    const teacherSignupBtn = document.getElementById('teacherSignupBtn');
    const teacherFields = document.getElementById('teacherFields');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const userWelcome = document.getElementById('userWelcome');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

   const forgotPasswordModal = document.getElementById('forgotPasswordModal'); // Forgot Password modal
   const loginToSignupLink = document.getElementById('loginToSignup'); // Link in Login modal
    const signupToLoginLink = document.getElementById('signupToLogin'); // Link in Signup modal
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
      // Add this code inside the DOMContentLoaded event listener
       const backBtn = document.getElementById('backBtn');
       if (backBtn) {
         backBtn.addEventListener('click', () => {
         const mainApp = document.getElementById('mainApp');
         const welcomePage = document.getElementById('welcomePage');

          if (mainApp && welcomePage) {
            // Hide mainApp
             mainApp.classList.add('hidden');
             mainApp.style.display = 'none';

            // Show welcomePage like original view
             welcomePage.classList.remove('hidden');
             welcomePage.style.display = 'flex'; // or 'block' if your welcomePage layout is block-based
             welcomePage.classList.add('fade-in');

            // Optional: reset scroll
             window.scrollTo(0, 0);
           }
          });
        }



    const studentSignupBtn = document.getElementById('studentSignupBtn');
    if (studentSignupBtn) {
       studentSignupBtn.addEventListener('click', () => {
        teacherFields.classList.add('hidden');
       });
    }




    // Navigate from Login to Signup
    if (loginToSignupLink) {
        loginToSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('hidden');
            signupModal.classList.remove('hidden');
        });
    }

    // Navigate from Signup to Login
    if (signupToLoginLink) {
        signupToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        });
    }

    // Navigate to Forgot Password
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('hidden');
            if (forgotPasswordModal) forgotPasswordModal.classList.remove('hidden');
        });
    }
    document.querySelectorAll('.close-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) modal.classList.add('hidden');
    });
   });
   document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();

    try {
        const response = await fetch('http://localhost:3000/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('A reset link has been sent to your email.');
            document.getElementById('forgotPasswordModal').classList.add('hidden');
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        console.error(err);
        alert('Failed to send reset link. Please try again later.');
    }
   });

   


 
 const resetPasswordForm = document.getElementById('resetPasswordForm');
 if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');
    const newPassword = document.getElementById('newPassword').value.trim();

    const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });

    if (response.ok) {
        alert('Password successfully reset. You can now log in.');
        window.location.href = '/';
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
  });
 }



    // Navigate from Login to Signup
    if (loginToSignupLink) {
        loginToSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.remove('hidden');
        });
    } else {
        console.error('Login to Signup link not found in the DOM.');
    }

    // Navigate from Signup to Login
    if (signupToLoginLink) {
        signupToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        });
    } else {
        console.error('Signup to Login link not found in the DOM.');
    }




    

    let currentUser  = null;

    enterBtn.addEventListener('click', () => {
        welcomePage.classList.add('hidden');
        mainApp.classList.remove('hidden');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            signupModal.classList.add('hidden');
        });
    });

   // Show/hide modals
loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));
document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', () => {
  loginModal.classList.add('hidden');
  signupModal.classList.add('hidden');
}));

// Role toggle for teacher fields
if (studentSignupBtn && teacherFields) {
  studentSignupBtn.addEventListener('click', () => teacherFields.classList.add('hidden'));
}

teacherSignupBtn.addEventListener('click', () => teacherFields.classList.remove('hidden'));

// Store Signup Info
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const role = teacherFields.classList.contains('hidden') ? 'student' : 'teacher';

  // Additional fields if teacher
  const specialization = document.getElementById('teacherSpecialization')?.value || '';
  const profession = document.getElementById('profesion')?.value || '';
  const classes = Array.from(document.querySelectorAll('input[name="class"]:checked')).map(c => c.value);
  const subjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(s => s.value);

  const userData = {
    name,
    email,
    password,
    role,
    specialization,
    profession,
    classes,
    subjects
  };

  // Save in localStorage using email as key
  localStorage.setItem(`user_${email}`, JSON.stringify(userData));

  alert("Sign up successful! You can now log in.");
  signupModal.classList.add('hidden');
});

// Login & redirect
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const savedUser = localStorage.getItem(`user_${email}`);

  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (user.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(user));
       if (user.role === 'student') {
  window.location.href = 'welcome.html';
 } else if (user.role === 'teacher') {
  window.location.href = 'teacher.html'; // ← You must create this page
 }

    } else {
      alert('Incorrect password.');
    }
  } else {
    alert('User not found. Please sign up first.');
  }
});




function proceedToMainApp(username) {
    loginModal.classList.add('hidden');
    signupModal.classList.add('hidden');
    mainApp.classList.remove('hidden');
    document.getElementById('welcomeText').textContent = `Welcome, ${username}`;
}

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        // Simulate login
        currentUser  = { name: email.split('@')[0], type: 'student' }; // Example user
        updateUIForLoginState();
        loginModal.classList.add('hidden');
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const userType = teacherFields.classList.contains('hidden') ? 'student' : 'teacher';
        // Simulate signup
        currentUser  = { name, email, type: userType }; // Example user
        updateUIForLoginState();
        signupModal.classList.add('hidden');
    });

    logoutBtn.addEventListener('click', () => {
        currentUser  = null;
        updateUIForLoginState();
    });

    function updateUIForLoginState() {
        if (currentUser ) {
            userWelcome.hidden = false;
            userNameDisplay.textContent = currentUser .name;
            loginBtn.hidden = true;
            signupBtn.hidden = true;
            logoutBtn.hidden = false;
        } else {
            userWelcome.hidden = true;
            loginBtn.hidden = false;
            signupBtn.hidden = false;
            logoutBtn.hidden = true;
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const welcomePage = document.getElementById('welcomePage');
    const mainApp = document.getElementById('mainApp');
    const enterBtn = document.getElementById('enterBtn');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const filterBtn = document.getElementById('filterBtn');
    const searchInput = document.getElementById('searchInput');
    const resourcesGrid = document.getElementById('resourcesGrid');
    const classList = document.getElementById('classList');
    const subjectList = document.getElementById('subjectList');

    const userWelcomeSpan = document.getElementById('userWelcome');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    const modalBackdrop = document.getElementById('modalBackdrop');
    const loginModalClose = modalBackdrop.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');

    const signupModalBackdrop = document.getElementById('signupModalBackdrop');
    const signupModalClose = signupModalBackdrop.querySelector('.close-btn');
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupClass = document.getElementById('signupClass');

    const resources = [
        // Add your resources here as in your previous code
    ];

    let currentUser  = null;

    function saveUser (user) {
        if (!user || !user.email) return;
        localStorage.setItem('user_' + user.email, JSON.stringify(user));
    }

    function getUser (email) {
        const u = localStorage.getItem('user_' + email);
        return u ? JSON.parse(u) : null;
    }

    function getFilters() {
        const selectedClasses = [...classList.querySelectorAll('input[type=checkbox]:checked')].map(cb => parseInt(cb.dataset.class));
        const selectedSubjects = [...subjectList.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.dataset.subject);
        return { selectedClasses, selectedSubjects };
    }

    function filterResources(searchTerm='') {
        searchTerm = searchTerm.toLowerCase().trim();
        let filtered = resources.filter(r => {
            if (currentUser ) {
                return r.class === currentUser .class && currentUser .subjects.includes(r.subject);
            } else {
                const { selectedClasses, selectedSubjects } = getFilters();
                return selectedClasses.includes(r.class) && selectedSubjects.includes(r.subject);
            }
        }).filter(r => !searchTerm || r.title.toLowerCase().includes(searchTerm) || r.description.toLowerCase().includes(searchTerm));

        displayResources(filtered);
    }

    function displayResources(resourcesList) {
        resourcesGrid.innerHTML = '';
        if (resourcesList.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No resources found matching your criteria.';
            p.style.color = '#666';
            resourcesGrid.appendChild(p);
            return;
        }
        resourcesList.forEach(resource => {
            const card = document.createElement('article');
            card.className = 'resource-card';
            card.tabIndex = 0;

            const title = document.createElement('h3');
            title.textContent = resource.title;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.textContent = resource.description;
            card.appendChild(desc);

            if (resource.class !== null && resource.subject !== null) {
                const info = document.createElement('p');
                info.style.fontSize = '0.8rem';
                info.style.color = '#666';
                info.textContent = `Class ${resource.class} | Subject: ${resource.subject}`;
                card.appendChild(info);
            }

            const linksDiv = document.createElement('div');
            linksDiv.className = 'resource-links';
            const link = document.createElement('a');
            link.href = resource.link;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = resource.type === 'pdf' ? 'Download PDF' : 'Watch Video';
            linksDiv.appendChild(link);
            card.appendChild(linksDiv);

            resourcesGrid.appendChild(card);
        });
    }

    enterBtn.addEventListener('click', () => {
        welcomePage.style.display = 'none';
        mainApp.style.display = 'flex';
        updateUIForLoginState();
        searchInput.focus();
    });

    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        mainContent.classList.toggle('shifted');
        const expanded = sidebar.classList.contains('show');
        menuToggleBtn.setAttribute('aria-expanded', expanded);
    });

    filterBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterResources();
        sidebar.classList.remove('show');
        mainContent.classList.remove('shifted');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    });

    searchInput.addEventListener('input', () => {
        filterResources(searchInput.value);
    });

    loginBtn.addEventListener('click', () => openModal(modalBackdrop));
    loginModalClose.addEventListener('click', () => closeModal(modalBackdrop));
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(modalBackdrop); });

    signupBtn.addEventListener('click', () => openModal(signupModalBackdrop));
    signupModalClose.addEventListener('click', () => closeModal(signupModalBackdrop));
    signupModalBackdrop.addEventListener('click', e => { if (e.target === signupModalBackdrop) closeModal(signupModalBackdrop); });

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = loginEmailInput.value.toLowerCase().trim();
        const password = loginPasswordInput.value.trim();
        const user = getUser (email);
        if (!user || user.password !== password) {
            alert('Invalid email or password');
            return;
        }
        currentUser  = user;
        closeModal(modalBackdrop);
        updateUIForLoginState();
        alert(`Welcome back, ${currentUser .name}!`);
    });

    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = signupName.value.trim();
        const email = signupEmail.value.toLowerCase().trim();
        const password = signupPassword.value.trim();
        const classVal = parseInt(signupClass.value);
        const subjects = [...signupForm.querySelectorAll('input[name="subjects"]:checked')].map(cb => cb.value);
        const newUser  = { name, email, password, class: classVal, subjects };
        saveUser (newUser );
        currentUser  = newUser ;
        closeModal(signupModalBackdrop);
        updateUIForLoginState();
        alert(`Welcome, ${name}! Your account was created.`);
    });

    logoutBtn.addEventListener('click', () => {
        currentUser  = null;
        updateUIForLoginState();
    });

    function openModal(modal) {
        modal.style.display = 'flex';
        const firstInput = modal.querySelector('input, select');
        if (firstInput) firstInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

 function updateUIForLoginState() {
    const userWelcome = document.getElementById("userWelcome"); // ✅ define it
    const userNameDisplay = document.getElementById("userNameDisplay");
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (currentUser) {
        if (userWelcome) userWelcome.hidden = false;
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
        if (loginBtn) loginBtn.hidden = true;
        if (signupBtn) signupBtn.hidden = true;
        if (logoutBtn) logoutBtn.hidden = false;
    } else {
        if (userWelcome) userWelcome.hidden = true;
        if (loginBtn) loginBtn.hidden = false;
        if (signupBtn) signupBtn.hidden = false;
        if (logoutBtn) logoutBtn.hidden = true;
    }
  }


    // Initialize default state on page load
    filterResources();
});
