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
    // ensure reply-to header on admin email (so admin can reply easily)
    fd.set('_replyto', email);

    // request FormSubmit to send an autoresponse to the visitor (JS backup)
    fd.set('_autoresponse', `Thanks ${name}! I received your message and will reply to ${email} shortly.`);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      // read full response text (some responses are HTML even when status 200)
      const resText = await res.text().catch(() => null);

      // try to parse JSON if possible
      let json = null;
      try { json = resText ? JSON.parse(resText) : null; } catch (err) { json = null; }

      console.log('FormSubmit response status:', res.status);
      console.log('FormSubmit response (parsed):', json);
      console.log('FormSubmit response (raw):', resText);

      if (res.ok) {
        // accepted by FormSubmit — still not a guarantee that email delivery happened
        form.reset();
        if (success) {
          success.style.display = 'block';
          setTimeout(() => { if (success) success.style.display = 'none'; }, 8000);
        }
      } else {
        // prefer any server message (JSON.message or raw text) to show useful hint
        const serverMsg = json?.message || resText || 'Failed to send.';
        if (failure) {
          failure.textContent = `${serverMsg} Please email chezzaterry@yahoo.com
`;
          failure.style.display = 'block';
        }
      }
    } catch (err) {
      console.error('Network/JS error:', err);
      if (failure) {
        failure.textContent = 'Network error. Please email chezzaterry@yahoo.com
';
        failure.style.display = 'block';
      }
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      if (sending) sending.style.display = 'none';
    }
  });
}
