// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle (your existing code)
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.right = '2rem';
      navLinks.style.background = 'rgba(0,0,0,0.95)';
      navLinks.style.padding = '1rem';
      navLinks.style.borderRadius = '4px';
      navLinks.style.border = '1px solid rgba(255,255,255,0.2)';
    }
  });
}

// Contact form with FormSubmit.co
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const sending = document.getElementById('sending');
const success = document.getElementById('success');
const failure = document.getElementById('failure');

function hideMessages() {
  if (success) success.style.display = 'none';
  if (failure) failure.style.display = 'none';
}

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessages();

    const name = (form.elements['name'] && form.elements['name'].value || '').trim();
    const email = (form.elements['email'] && form.elements['email'].value || '').trim();
    const message = (form.elements['message'] && form.elements['message'].value || '').trim();

    if (!name || !email || !message) {
      if (failure) {
        failure.textContent = 'Please complete all fields.';
        failure.style.display = 'block';
      }
      return;
    }

    if (sendBtn) sendBtn.disabled = true;
    if (sending) sending.style.display = 'block';

    const fd = new FormData(form);
    // ensure reply-to header on admin email
    fd.set('_replyto', email);

    // request FormSubmit to send an autoresponse to the visitor
    fd.set('_autoresponse', `Thanks ${name}! I received your message and will reply to ${email} shortly.`);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      // try to read JSON body for debug and error info
      const json = await res.json().catch(() => null);

      // debug: open browser console and check this object
      console.log('FormSubmit response', res.status, json);

      if (res.ok) {
        // Note: res.ok means FormSubmit accepted the form — it does not guarantee delivery of autoresponse
        form.reset();
        if (success) {
          success.style.display = 'block';
          setTimeout(() => { if (success) success.style.display = 'none'; }, 8000);
        }
      } else {
        // Show server message if present for easier troubleshooting
        const msg = json?.message || JSON.stringify(json) || 'Failed to send.';
        if (failure) {
          failure.textContent = `${msg} Please email admin@cherylterry.com`;
          failure.style.display = 'block';
        }
      }
    } catch (err) {
      console.error('Network/JS error:', err);
      if (failure) {
        failure.textContent = 'Network error. Please email admin@cherylterry.com';
        failure.style.display = 'block';
      }
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      if (sending) sending.style.display = 'none';
    }
  });
}
