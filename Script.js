// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

if(menuBtn && navLinks){
  menuBtn.addEventListener('click', () => {
    if(navLinks.style.display === 'flex'){
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

const destinationEmail = 'admin@cherylterry.com';
const ajaxEndpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(destinationEmail);

function hideMessages(){
  success.style.display = 'none';
  failure.style.display = 'none';
}

form.addEventListener('submit', async function(e){
  e.preventDefault();
  hideMessages();

  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const message = form.elements['message'].value.trim();

  if(!name || !email || !message){
    failure.textContent = 'Please complete all fields.';
    failure.style.display = 'block';
    return;
  }

  sendBtn.disabled = true;
  sending.style.display = 'block';

  const fd = new FormData(form);
  fd.set('_replyto', email);

  try {
    const res = await fetch(ajaxEndpoint, {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    });

    if(res.ok){
      form.reset();
      // ✍️ UPDATED SUCCESS MESSAGE TEXT IN JAVASCRIPT
      success.textContent = 'Message sent! Check your inbox for an automated confirmation reply.';
      success.style.display = 'block';
      setTimeout(() => success.style.display = 'none', 8000);
    } else {
      const j = await res.json().catch(() => null);
      failure.textContent = j?.message || 'Failed to send. Please email admin@cherylterry.com';
      failure.style.display = 'block';
    }
  } catch(err){
    failure.textContent = 'Network error. Please email admin@cherylterry.com';
    failure.style.display = 'block';
  } finally {
    sendBtn.disabled = false;
    sending.style.display = 'none';
  }
});
