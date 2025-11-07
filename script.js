
// Realistic Diamond Rain Background
const canvas = document.getElementById('diamondRain');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
window.addEventListener('resize', resize); resize();

const diamonds = [];
for(let i=0;i<70;i++){
  diamonds.push({
    x: Math.random()*W,
    y: Math.random()*H,
    s: 0.5 + Math.random()*1.5,
    speed: 0.2 + Math.random()*0.5,
    twinkle: Math.random()*360
  });
}

function drawDiamond(x,y,s,angle){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(angle);
  const g = ctx.createLinearGradient(-s,-s,s,s);
  g.addColorStop(0,'rgba(255,255,255,0.9)');
  g.addColorStop(0.5,'rgba(0,229,255,0.5)');
  g.addColorStop(1,'rgba(255,43,214,0.7)');
  ctx.fillStyle=g;
  ctx.beginPath();
  ctx.moveTo(0,-s*2);
  ctx.lineTo(s*1.5,0);
  ctx.lineTo(0,s*2);
  ctx.lineTo(-s*1.5,0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animate(){
  ctx.clearRect(0,0,W,H);
  for(const d of diamonds){
    d.y += d.speed;
    d.twinkle += 1;
    if(d.y > H+10){ d.y = -10; d.x = Math.random()*W; }
    const angle = Math.sin(d.twinkle*Math.PI/180)*0.2;
    drawDiamond(d.x,d.y,d.s,angle);
  }
  requestAnimationFrame(animate);
}
animate();

// Form submission
document.getElementById('year').textContent = new Date().getFullYear();
async function handleDirectSubmit(e){
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const json = Object.fromEntries(data.entries());
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    });
    if(res.ok){
      toast.querySelector('strong').textContent = 'Application Sent!';
      toast.querySelector('span').textContent = 'Thanks — we’ll be in touch soon.';
      form.reset();
    } else {
      toast.querySelector('strong').textContent = 'Submission failed';
    }
  } catch {
    toast.querySelector('strong').textContent = 'Network error';
  }
  setTimeout(()=>toast.classList.remove('show'),4000);
  return false;
}
window.handleDirectSubmit = handleDirectSubmit;
