
const WL=['123456','password','12345678','qwerty','123456789','12345','1234','111111','dragon','123123','baseball','iloveyou','trustno1','sunshine','master','welcome','shadow','ashley','football','jesus','michael','ninja','mustang','password1','superman','batman','monkey','admin','letmein','hello','abc123','pass','test','root','guest','login','1q2w3e','qwerty123','password123','admin123','letmein','hunter2','starwars','princess','harley','ranger','solo','cheese','killer','freedom','summer','donald','hockey','computer','google','charlie','hello123','changeme','secret','loveyou','passw0rd'];
function sw(n,b){document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tab-pane').forEach(x=>x.classList.remove('active'));document.getElementById('tp-'+n).classList.add('active');}
function genHashes(t){
  if(!t){['md5','sha1','sha256','sha512'].forEach(a=>{document.getElementById('h-'+a).textContent='—';});return;}
  document.getElementById('h-md5').textContent=CryptoJS.MD5(t).toString();
  document.getElementById('h-sha1').textContent=CryptoJS.SHA1(t).toString();
  document.getElementById('h-sha256').textContent=CryptoJS.SHA256(t).toString();
  document.getElementById('h-sha512').textContent=CryptoJS.SHA512(t).toString().slice(0,64)+'…';
}
function identHash(h){
  h=h.trim();if(!h){document.getElementById('identResult').innerHTML='';return;}
  const types=[];
  if(/^[a-f0-9]{32}$/i.test(h))types.push({n:'MD5',cls:'badge-red',sec:'Broken — collision attacks trivial'});
  if(/^[a-f0-9]{40}$/i.test(h))types.push({n:'SHA-1',cls:'',sec:'Weak — SHA-1 chosen-prefix collisions demonstrated',s:'background:#fff7e6;color:var(--orange);border:1px solid var(--orange)'});
  if(/^[a-f0-9]{64}$/i.test(h))types.push({n:'SHA-256',cls:'badge-green',sec:'Good — use bcrypt for passwords'});
  if(/^[a-f0-9]{128}$/i.test(h))types.push({n:'SHA-512',cls:'badge-green',sec:'Strong — still prefer bcrypt for passwords'});
  if(/^\$2[aby]\$/.test(h))types.push({n:'bcrypt',cls:'badge-green',sec:'Excellent — designed for password hashing'});
  if(/^\$argon2/.test(h))types.push({n:'Argon2',cls:'badge-green',sec:'Best — PHC winner'});
  if(!types.length){document.getElementById('identResult').innerHTML=`<span class="badge badge-outline">Unknown (${h.length} chars)</span>`;return;}
  document.getElementById('identResult').innerHTML=types.map(t=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--cream-dkr)"><span class="badge ${t.cls||''}" style="${t.s||''}">${t.n}</span><span style="font-size:13px;color:var(--muted)">${t.sec}</span></div>`).join('');
}
function loadTestHash(){
  const a=document.getElementById('crackAlgo').value;
  const pw='password123';
  let h='';
  if(a==='md5')h=CryptoJS.MD5(pw).toString();
  else if(a==='sha1')h=CryptoJS.SHA1(pw).toString();
  else h=CryptoJS.SHA256(pw).toString();
  document.getElementById('crackIn').value=h;
  clog('Loaded test hash for "'+pw+'" ('+a.toUpperCase()+')\n','out-info');
}
function clog(m,cls){const el=document.getElementById('crackLog');const d=document.createElement('div');d.className='output-line '+(cls||'out-muted');d.textContent=m;el.appendChild(d);el.scrollTop=el.scrollHeight;}
async function startCrack(){
  const hash=document.getElementById('crackIn').value.trim();const algo=document.getElementById('crackAlgo').value;
  if(!hash){clog('Error: no hash entered.','out-err');return;}
  document.getElementById('crackLog').innerHTML='';
  document.getElementById('cpw').style.display='block';
  clog('Starting dictionary attack…','out-info');clog('Algorithm: '+algo.toUpperCase(),'out-info');clog('Wordlist: '+WL.length+' passwords','out-info');clog('─'.repeat(40),'out-head');
  for(let i=0;i<WL.length;i++){
    if(i%8===0){await new Promise(r=>setTimeout(r,10));document.getElementById('cpf').style.width=((i/WL.length)*100)+'%';document.getElementById('cpl').textContent='Trying: '+WL[i]+' ('+i+'/'+WL.length+')';}
    let attempt='';
    if(algo==='md5')attempt=CryptoJS.MD5(WL[i]).toString();
    else if(algo==='sha1')attempt=CryptoJS.SHA1(WL[i]).toString();
    else attempt=CryptoJS.SHA256(WL[i]).toString();
    if(attempt.toLowerCase()===hash.toLowerCase()){
      document.getElementById('cpf').style.width='100%';
      clog('','');clog('✓ CRACKED!  Password: "'+WL[i]+'"','out-ok');clog('Attempts needed: '+(i+1)+' / '+WL.length,'out-ok');
      document.getElementById('cpl').textContent='Cracked in '+(i+1)+' attempts';return;
    }
  }
  document.getElementById('cpf').style.width='100%';
  clog('✗ Not found in wordlist.','out-err');clog('Try a longer wordlist or brute-force.','out-muted');document.getElementById('cpl').textContent='Not found';
}