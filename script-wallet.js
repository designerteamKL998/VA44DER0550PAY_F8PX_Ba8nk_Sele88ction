const wallets=[
 {name:'DuitNow',img:'assets-wallet/icn-duitnow.svg'},
 {name:'GrabPay',img:'assets-wallet/icn-grabpay.svg'},
 {name:'Touch n Go eWallet',img:'assets-wallet/icn-touchnGo.svg'},
 {name:'ShopeePay',img:'assets-wallet/icn-shopeepay.svg'},
 {name:'Boost',img:'assets-wallet/icn-boost.svg'},
 {name:'',img:null}
];
let selected=3;
const grid=document.getElementById('walletGrid'),dots=document.getElementById('dots');
function renderWallets(){
  grid.innerHTML='';
  wallets.forEach((w,i)=>{
    const el=document.createElement('div');
    el.className='wallet'+(i===selected?' selected':'');
    if(w.img) el.innerHTML=`<img src="${w.img}" alt="${w.name}"><span class="check">✓</span>`;
    el.addEventListener('click',()=>{ selected=i; renderWallets(); updateButton(); });
    grid.appendChild(el);
  });
  dots.innerHTML='<button class="active"></button><button></button><button></button>';
}
function updateButton(){
  const b=document.getElementById('proceed');
  b.innerHTML=selected>=0&&wallets[selected].name
    ? `Proceed with ${wallets[selected].name.replace(' eWallet','')} <img src="assets-wallet/icn-arrow.svg" alt="">`
    : `Select a Wallet <img src="assets-wallet/icn-arrow.svg" alt="">`;
}
renderWallets();
updateButton();

const ib=document.getElementById('importantBtn'),ic=document.getElementById('importantContent');
ib.onclick=()=>{ const open=ic.classList.toggle('open'); ib.classList.toggle('open',open); };

let seconds=256;
setInterval(()=>{
  if(seconds>0) seconds--;
  document.getElementById('timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
},1000);

let qrTimerInterval=null;

function showFailure(){
  clearInterval(qrTimerInterval);
  document.getElementById('qrView').classList.add('hidden');
  document.getElementById('failureView').classList.remove('hidden');
  document.querySelector('.topbar').style.display='none';

  const w=wallets[selected];
  const brand=document.getElementById('failureBrand');
  brand.innerHTML=w&&w.img?`<img src="${w.img}" alt="${w.name}">`:'';
}

function openQR(){
  const w=wallets[selected];
  document.getElementById('selectionView').classList.add('hidden');
  document.getElementById('failureView').classList.add('hidden');
  document.querySelector('.topbar').style.display='none';
  document.getElementById('qrView').classList.remove('hidden');

  const brand=document.getElementById('walletBrand');
  brand.innerHTML=`<img src="${w.img}" alt="${w.name}">`;

  let q=60;
  clearInterval(qrTimerInterval);
  document.getElementById('qrTimer').textContent=`${String(Math.floor(q/60)).padStart(2,'0')}:${String(q%60).padStart(2,'0')} minutes`;

  qrTimerInterval=setInterval(()=>{
    if(q>0) q--;
    document.getElementById('qrTimer').textContent=`${String(Math.floor(q/60)).padStart(2,'0')}:${String(q%60).padStart(2,'0')} minutes`;
    if(q===0) showFailure();
  },1000);
}

document.getElementById('proceed').onclick=()=>{ if(selected<0||!wallets[selected].img)return; openQR(); };

function back(){
  clearInterval(qrTimerInterval);
  document.getElementById('qrView').classList.add('hidden');
  document.getElementById('failureView').classList.add('hidden');
  document.getElementById('selectionView').classList.remove('hidden');
  document.querySelector('.topbar').style.display='flex';
}
document.getElementById('cancelDesktop').onclick=back;
document.getElementById('cancelMobile').onclick=back;

document.getElementById('returnMerchant').onclick=()=>{
  document.getElementById('failureView').classList.add('hidden');
  document.getElementById('selectionView').classList.remove('hidden');
  document.querySelector('.topbar').style.display='flex';
};
