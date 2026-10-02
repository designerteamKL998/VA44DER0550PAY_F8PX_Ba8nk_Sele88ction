const banks = [
  ["assets/bank-squre/bank-maybank.svg", "Maybank", "Maybank"],
  ["assets/bank-squre/bank-Cimb.svg", "CIMB", "CIMB Bank"],
  ["assets/bank-squre/bank-Pb.svg", "Public Bank", "Public Bank"],
  ["assets/bank-squre/bank-RHB.svg", "RHB Bank", "RHB"],
  ["assets/bank-squre/bank-HLB.svg", "Hong Leong Bank", "HLB"],
  ["assets/bank-squre/bank-alliance.svg", "Alliance Bank", "Alliance"],
  ["assets/bank-squre/bank-affin.svg", "Affin Bank", "Affin"],
  ["assets/bank-squre/bank-am.svg", "AmBank", "AmBank"],
  ["assets/bank-squre/bank-bsn.svg", "Bank Simpanan Nasional", "BSN"],
  ["assets/bank-squre/bank-ISLAM.svg", "Bank Islam", "Islam"],
  ["assets/bank-squre/bank-ocbc.svg", "OCBC Bank", "OCBC"],
];

const pagesEl = document.getElementById('bankPages');
const banksEl = document.getElementById('banks');
const dotsEl = document.getElementById('bankDots');
const searchEl = document.getElementById('bankSearch');
const emptyEl = document.getElementById('emptyState');
const continueBtn = document.getElementById('continueBtn');
const selectedMessage = document.getElementById('selectedMessage');
const transactionId = document.getElementById('transactionId').textContent;
let selectedBank = null;
let currentPage = 0;
let isSearchMode = false;

function isMobile() {
  return window.matchMedia('(max-width: 600px)').matches;
}

function createBank(bank) {
  const [src, name] = bank;
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'bank' + (selectedBank === name ? ' selected' : '');
  el.setAttribute('aria-pressed', selectedBank === name ? 'true' : 'false');
  el.innerHTML = `
    <img class="logo" src="${src}" alt="${name}">
    <span class="bank-name">${name}</span>
    <span class="check" aria-hidden="true">✓</span>
  `;
  el.addEventListener('click', () => selectBank(name));
  return el;
}

function renderDots(count) {
  dotsEl.innerHTML = '';
  if (!isMobile() || count <= 1 || isSearchMode) {
    dotsEl.hidden = true;
    return;
  }
  dotsEl.hidden = false;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'bank-dot' + (i === currentPage ? ' active' : '');
    dot.setAttribute('aria-label', `Bank page ${i + 1}`);
    dot.addEventListener('click', () => goToPage(i));
    dotsEl.appendChild(dot);
  }
}

function renderBanks(query = '') {
  const q = query.trim().toLowerCase();
  const filtered = banks.filter(bank => bank.join(' ').toLowerCase().includes(q));
  isSearchMode = Boolean(q) || !isMobile();
  emptyEl.hidden = filtered.length !== 0;
  pagesEl.classList.toggle('paged-mobile', isMobile() && !q);
  pagesEl.classList.toggle('search-results', Boolean(q));
  banksEl.innerHTML = '';

  if (!filtered.length) {
    renderDots(0);
    return;
  }

  if (isMobile() && !q) {
    // Testing setup: page 2 intentionally duplicates page 1.
    const pageOne = filtered.slice(0, 9);
    const pageTwo = pageOne.slice();
    const pageSets = [pageOne];
    if (pageOne.length === 9) pageSets.push(pageTwo);

    pageSets.forEach((set, pageIndex) => {
      const page = document.createElement('div');
      page.className = 'bank-page';
      page.dataset.page = pageIndex;
      set.forEach(bank => page.appendChild(createBank(bank)));
      banksEl.appendChild(page);
    });

    currentPage = Math.min(currentPage, pageSets.length - 1);
    renderDots(pageSets.length);
    requestAnimationFrame(() => goToPage(currentPage, false));
  } else {
    currentPage = 0;
    const page = document.createElement('div');
    page.className = 'bank-page single-page';
    filtered.forEach(bank => page.appendChild(createBank(bank)));
    banksEl.appendChild(page);
    renderDots(0);
  }
}

function goToPage(pageIndex, smooth = true) {
  const pages = banksEl.querySelectorAll('.bank-page');
  if (!pages.length) return;
  currentPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
  if (isMobile() && !isSearchMode) {
    banksEl.style.transform = `translateX(-${currentPage * 100}%)`;
    banksEl.style.transition = smooth ? 'transform .28s ease' : 'none';
  } else {
    banksEl.style.transform = '';
    banksEl.style.transition = '';
  }
  [...dotsEl.children].forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
}

let touchStartX = 0;
let touchStartY = 0;
banksEl.addEventListener('touchstart', e => {
  if (!isMobile() || isSearchMode) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, {passive:true});

banksEl.addEventListener('touchend', e => {
  if (!isMobile() || isSearchMode) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
  if (dx < 0) goToPage(currentPage + 1);
  else goToPage(currentPage - 1);
}, {passive:true});

function selectBank(name) {
  selectedBank = name;
  renderBanks(searchEl.value);
  continueBtn.disabled = false;
  selectedMessage.textContent = `${name} selected. Ready to continue.`;
}

searchEl.addEventListener('input', e => {
  currentPage = 0;
  renderBanks(e.target.value);
});

continueBtn.addEventListener('click', () => {
  if (!selectedBank) return;
  selectedMessage.textContent = `Connecting to ${selectedBank}…`;
  continueBtn.disabled = true;
  setTimeout(() => {
    selectedMessage.textContent = `${selectedBank} selected. Ready to authorise payment.`;
    continueBtn.disabled = false;
  }, 900);
});

const importantBtn = document.getElementById('importantBtn');
const importantContent = document.getElementById('importantContent');
importantBtn.addEventListener('click', () => {
  const open = importantBtn.getAttribute('aria-expanded') === 'true';
  importantBtn.setAttribute('aria-expanded', String(!open));
  importantBtn.classList.toggle('open', !open);
  importantContent.hidden = open;
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const btn = document.getElementById('copyBtn');
  try {
    await navigator.clipboard.writeText(transactionId);
    btn.setAttribute('aria-label', 'Transaction ID copied');
    const old = btn.innerHTML;
    btn.innerHTML = '<span style="font-size:11px;color:#79c93d">✓</span>';
    setTimeout(() => {
      btn.innerHTML = old;
      btn.setAttribute('aria-label', 'Copy transaction ID');
    }, 1200);
  } catch (_) {}
});

let seconds = 256;
setInterval(() => {
  if (seconds > 0) seconds--;
  document.getElementById('timer').textContent = `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
}, 1000);

window.addEventListener('resize', () => renderBanks(searchEl.value));
renderBanks();
