// alok padal portfolio - 2026

// theme: manual toggle button + auto based on time
// user can also click the button to override
let manualOverride = false;

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const btn = document.getElementById('modeBtn');
  if (btn) btn.textContent = dark ? '☀ Light' : '🌙 Dark';
}

function toggleTheme() {
  manualOverride = true;
  const isDark = document.body.classList.contains('dark');
  applyTheme(!isDark);
}

function autoTheme() {
  if (manualOverride) return;
  const h = new Date().getHours();
  applyTheme(h >= 18 || h < 6);
}

autoTheme();
setInterval(() => { if (!manualOverride) autoTheme(); }, 60000);


// clocks - updates every second
// nepal time (UTC+5:45) needs manual calculation since JS has no built-in for it
// 5h 45min = 345 minutes = 20,700,000 ms ahead of UTC

function pad(n) { return String(n).padStart(2, '0'); }

function tickClocks() {
  const now = new Date();

  // nepal
  const npOffset = (5 * 60 + 45) * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const np = new Date(utc + npOffset);
  const nh = np.getHours(), nm = np.getMinutes(), ns = np.getSeconds();

  document.getElementById('nepalTime').innerHTML =
    pad(nh % 12 || 12) + ':' + pad(nm) +
    '<span class="sec">:' + pad(ns) + '</span>' +
    '<span class="ap"> ' + (nh >= 12 ? 'PM' : 'AM') + '</span>';

  document.getElementById('nepalDate').textContent =
    np.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  document.getElementById('nepalMode').textContent =
    (nh >= 6 && nh < 18) ? '☀ Daytime in Nepal' : '🌙 Nighttime in Nepal';

  // local
  const lh = now.getHours(), lm = now.getMinutes(), ls = now.getSeconds();

  document.getElementById('userTime').innerHTML =
    pad(lh % 12 || 12) + ':' + pad(lm) +
    '<span class="sec">:' + pad(ls) + '</span>' +
    '<span class="ap"> ' + (lh >= 12 ? 'PM' : 'AM') + '</span>';

  document.getElementById('userDate').textContent =
    now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  document.getElementById('userMode').textContent =
    (lh >= 6 && lh < 18) ? '☀ Daytime where you are' : '🌙 Nighttime where you are';

  const tzEl = document.getElementById('userTZ');
  if (tzEl) tzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
}

tickClocks();
setInterval(tickClocks, 1000);


// scroll reveal
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 }).observe;

document.querySelectorAll('.reveal').forEach(el => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 }).observe(el);
});


// contact form using Formspree - completely free, no backend, no setup headache
// steps: go to formspree.io → sign up free → new form → copy the endpoint URL
// paste it below. done. messages go straight to alokpadal45@gmail.com
// example url looks like: https://formspree.io/f/xpzgkwjr

const FORM_ENDPOINT = 'https://formspree.io/f/mrerbgnd';

async function sendMessage() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const msgEl   = document.getElementById('formMsg');

  msgEl.className = 'form-msg';
  msgEl.textContent = '';

  if (!name || !email || !message) {
    msgEl.textContent = 'Please fill in your name, email and message.';
    msgEl.className = 'form-msg err';
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    msgEl.textContent = 'That email address does not look right.';
    msgEl.className = 'form-msg err';
    return;
  }

  if (FORM_ENDPOINT === 'YOUR_FORMSPREE_URL') {
    msgEl.textContent = 'Form works! Add your Formspree URL in script.js to receive real messages.';
    msgEl.className = 'form-msg ok';
    return;
  }

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject: subject || 'Portfolio message', message })
    });

    if (res.ok) {
      msgEl.textContent = 'Message sent. I will get back to you soon.';
      msgEl.className = 'form-msg ok';
      showToast('Sent!');
      ['fname','femail','fsubject','fmessage'].forEach(id => {
        document.getElementById(id).value = '';
      });
      document.getElementById('charCount').textContent = '0';
    } else {
      throw new Error('not ok');
    }
  } catch {
    msgEl.textContent = 'Something went wrong. Email me at alokpadal45@gmail.com';
    msgEl.className = 'form-msg err';
  }
}

function countChars(el) {
  const cc = document.getElementById('charCount');
  if (cc) cc.textContent = el.value.length;
}


// toast
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}


// active nav link on scroll
const allSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-right a[href^="#"]');

allSections.forEach(section => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.45 }).observe(section);
});