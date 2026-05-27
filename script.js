// ============================================
// Google Sheets Integration
// ============================================
// IMPORTANT: Replace this URL with your deployed Google Apps Script URL
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// ============================================
// Countdown — 23 minutes from page load
// ============================================
const countdownEnd = Date.now() + 23 * 60 * 1000;
function updateCountdown() {
  const diff = Math.max(0, countdownEnd - Date.now());
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent = '00';
  document.getElementById('cd-hours').textContent = '00';
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
