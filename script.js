// ============================================
// Google Sheets Integration
// ============================================
// IMPORTANT: Replace this URL with your deployed Google Apps Script URL
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ============================================
// Countdown — Early Bird ends May 31, 2026, 11:59 PM IST
// ============================================
const countdownEnd = new Date('2026-05-31T23:59:00+05:30').getTime();
function updateCountdown() {
  const diff = Math.max(0, countdownEnd - Date.now());
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// Scroll animations
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ============================================
// Form submission → Google Sheets
// ============================================
// Helper for bulletproof redirection across all browsers
function doRedirect() {
  const url = 'https://sortmyscene.com/event/zero-point-five-summit-jun-14-2026/tickets';
  console.log('Initiating robust redirect to:', url);
  try {
    window.location.href = url;
  } catch (e) {
    try {
      window.location.assign(url);
    } catch (e2) {
      try {
        window.location = url;
      } catch (e3) {
        window.open(url, '_self');
      }
    }
  }
}

function handleSubmit(e) {
  if (e) e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const originalText = btn ? btn.textContent : '🎫 Get Your Pass Now';
  if (btn) {
    btn.textContent = '⏳ Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }

  // Collect form fields safely
  let formData = {};
  try {
    formData = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      firstName: document.getElementById('firstName') ? document.getElementById('firstName').value.trim() : '',
      lastName: document.getElementById('lastName') ? document.getElementById('lastName').value.trim() : '',
      email: document.getElementById('email') ? document.getElementById('email').value.trim() : '',
      phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
      city: document.getElementById('city') ? document.getElementById('city').value.trim() : '',
      role: document.getElementById('role') ? document.getElementById('role').value : '',
      company: document.getElementById('company') ? document.getElementById('company').value.trim() : '',
      linkedin: '',
      question: document.getElementById('question') ? document.getElementById('question').value.trim() : '',
      why: '',
      source: 'main_form'
    };
  } catch (err) {
    console.error('Error parsing form data:', err);
  }

  // Asynchronous background call with try/catch to protect flow from synchronous fetch parser crash
  try {
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Background log fetch error:', err));
    }
  } catch (err) {
    console.error('Background sync failed to initialize:', err);
  }

  // Show Booking In Progress modal safely
  try {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
  } catch (err) {
    console.error('Error activating modal:', err);
  }

  // Reset form safely
  try {
    if (e && e.target && typeof e.target.reset === 'function') {
      e.target.reset();
    } else {
      const form = document.getElementById('applicationForm');
      if (form) form.reset();
    }
  } catch (err) {
    console.error('Error resetting form:', err);
  }

  // Reset button state safely
  try {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  } catch (err) {
    console.error('Error resetting button styles:', err);
  }

  // Redirect after 800ms
  setTimeout(doRedirect, 800);
}

// ============================================
// Lead Capture Popup
// ============================================
function showLeadPopup() {
  document.getElementById('leadPopup').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLeadPopup() {
  document.getElementById('leadPopup').classList.remove('active');
  document.body.style.overflow = '';
}

// Auto-show popup after 3 seconds (only if not already submitted this session)
if (!sessionStorage.getItem('popupSubmitted')) {
  setTimeout(showLeadPopup, 3000);
}

// Close popup on overlay click (outside modal)
document.getElementById('leadPopup').addEventListener('click', function(e) {
  if (e.target === this) closeLeadPopup();
});

function handlePopupSubmit(e) {
  if (e) e.preventDefault();

  const btn = document.getElementById('popupSubmitBtn');
  const originalText = btn ? btn.textContent : '🎫 Get Your Passes Now';
  if (btn) {
    btn.textContent = '⏳ Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }

  // Collect popup fields safely
  let formData = {};
  try {
    formData = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      firstName: document.getElementById('popupFirstName') ? document.getElementById('popupFirstName').value.trim() : '',
      lastName: document.getElementById('popupLastName') ? document.getElementById('popupLastName').value.trim() : '',
      email: document.getElementById('popupEmail') ? document.getElementById('popupEmail').value.trim() : '',
      phone: document.getElementById('popupPhone') ? document.getElementById('popupPhone').value.trim() : '',
      city: document.getElementById('popupCity') ? document.getElementById('popupCity').value.trim() : '',
      role: document.getElementById('popupRole') ? document.getElementById('popupRole').value : '',
      company: document.getElementById('popupCompany') ? document.getElementById('popupCompany').value.trim() : '',
      linkedin: '',
      question: '',
      why: '',
      source: 'popup'
    };
  } catch (err) {
    console.error('Error parsing popup form data:', err);
  }

  // Asynchronous background call with try/catch to protect flow from synchronous fetch parser crash
  try {
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Background popup log fetch error:', err));
    }
  } catch (err) {
    console.error('Background popup sync failed to initialize:', err);
  }

  // Close popup and show Booking In Progress modal safely
  try {
    sessionStorage.setItem('popupSubmitted', 'true');
    closeLeadPopup();
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');
  } catch (err) {
    console.error('Error displaying modal from popup:', err);
  }

  // Reset form safely
  try {
    if (e && e.target && typeof e.target.reset === 'function') {
      e.target.reset();
    } else {
      const form = document.getElementById('popupForm');
      if (form) form.reset();
    }
  } catch (err) {
    console.error('Error resetting popup form:', err);
  }

  // Reset button state safely
  try {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  } catch (err) {
    console.error('Error resetting popup button styles:', err);
  }

  // Redirect after 800ms
  setTimeout(doRedirect, 800);
}

// ============================================
// Cofounder Form Modal
// ============================================
function openCofounderModal() {
  document.getElementById('cofounderModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCofounderModal() {
  document.getElementById('cofounderModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close popup on overlay click (outside modal)
const cfModal = document.getElementById('cofounderModal');
if (cfModal) {
  cfModal.addEventListener('click', function(e) {
    if (e.target === this) closeCofounderModal();
  });
}

function limitCheckboxes(checkbox) {
  const checkboxes = document.querySelectorAll('#cfSuperpowers input[type="checkbox"]');
  const checked = document.querySelectorAll('#cfSuperpowers input[type="checkbox"]:checked');
  const errorMsg = document.getElementById('superpowerError');
  
  if (checked.length > 3) {
    checkbox.checked = false; // Prevent checking
  }
  
  // Update error message display
  if (checked.length > 3) {
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
  }
}

function handleCofounderSubmit(e) {
  if (e) e.preventDefault();

  // Validate checkboxes (max 3, but also ensure at least 1)
  const checkedSuperpowers = document.querySelectorAll('#cfSuperpowers input[type="checkbox"]:checked');
  if (checkedSuperpowers.length === 0 || checkedSuperpowers.length > 3) {
    document.getElementById('superpowerError').style.display = 'block';
    document.getElementById('superpowerError').textContent = 'Please select between 1 and 3 superpowers.';
    return;
  }

  const btn = document.getElementById('cofounderSubmitBtn');
  const originalText = btn ? btn.textContent : 'Submit Application';
  if (btn) {
    btn.textContent = '⏳ Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }

  // Get selected superpowers
  const superpowers = Array.from(checkedSuperpowers).map(cb => cb.value).join(', ');

  // Get selected scale value
  const scaleInput = document.querySelector('input[name="cfScale"]:checked');
  const scale = scaleInput ? scaleInput.value : '';

  // Collect form fields
  let formData = {};
  try {
    formData = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source: 'cofounder_form',
      // Section 1
      firstName: document.getElementById('cfName') ? document.getElementById('cfName').value.trim() : '',
      email: document.getElementById('cfEmail') ? document.getElementById('cfEmail').value.trim() : '',
      phone: document.getElementById('cfPhone') ? document.getElementById('cfPhone').value.trim() : '',
      city: document.getElementById('cfCity') ? document.getElementById('cfCity').value.trim() : '',
      linkedin: document.getElementById('cfLink') ? document.getElementById('cfLink').value.trim() : '',
      currentJob: document.getElementById('cfJob') ? document.getElementById('cfJob').value.trim() : '',
      // Section 2
      superpowers: superpowers,
      proofOfWork: document.getElementById('cfProof') ? document.getElementById('cfProof').value.trim() : '',
      uniqueSkill: document.getElementById('cfUniqueSkill') ? document.getElementById('cfUniqueSkill').value.trim() : '',
      // Section 3
      hoursCommitment: document.getElementById('cfHours') ? document.getElementById('cfHours').value : '',
      priorityScale: scale,
      resilience: document.getElementById('cfResilience') ? document.getElementById('cfResilience').value : '',
      investment: document.getElementById('cfMoney') ? document.getElementById('cfMoney').value : '',
      // Section 4
      whyThisShow: document.getElementById('cfWhyThis') ? document.getElementById('cfWhyThis').value.trim() : '',
      vision: document.getElementById('cfVision') ? document.getElementById('cfVision').value.trim() : '',
      selloutNumber: document.getElementById('cfSellout') ? document.getElementById('cfSellout').value.trim() : '',
      quitReason: document.getElementById('cfQuit') ? document.getElementById('cfQuit').value.trim() : '',
      // Section 5
      equitySplit: document.getElementById('cfEquity') ? document.getElementById('cfEquity').value : '',
      falloutFault: document.getElementById('cfFallout') ? document.getElementById('cfFallout').value.trim() : '',
      feedbackHandling: document.getElementById('cfFeedback') ? document.getElementById('cfFeedback').value : '',
      anythingElse: document.getElementById('cfAnythingElse') ? document.getElementById('cfAnythingElse').value.trim() : ''
    };
  } catch (err) {
    console.error('Error parsing cofounder form data:', err);
  }

  // Submit to Google Sheet via async fetch
  try {
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(err => console.error('Background cofounder log fetch error:', err));
    }
  } catch (err) {
    console.error('Background cofounder sync failed to initialize:', err);
  }

  // Show Success modal
  setTimeout(() => {
    closeCofounderModal();
    const successModal = document.getElementById('cofounderSuccessModal');
    if (successModal) successModal.classList.add('active');
    
    // Reset form
    const form = document.getElementById('cofounderForm');
    if (form) form.reset();
    
    // Reset button
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }, 1000);
}
