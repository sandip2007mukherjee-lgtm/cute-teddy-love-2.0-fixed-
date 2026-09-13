import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import{getFirestore,collection,onSnapshot,query,orderBy}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyD-autiWDynxIrZKSB53FWaNGSTbxYComU",authDomain:"love-page-d3a05.firebaseapp.com",projectId:"love-page-d3a05",storageBucket:"love-page-d3a05.firebasestorage.app",messagingSenderId:"857612763723",appId:"1:857612763723:web:03cd1b0335015cd05943ce"},ADMIN="sandip2007mukherjee@gmail.com";
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app),$=id=>document.getElementById(id);let unsub=null;
$("loginBtn").onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){$("err").textContent=e.message}};$("logout").onclick=()=>signOut(auth);
onAuthStateChanged(auth,u=>{if(unsub){unsub();unsub=null}if(u?.email===ADMIN){$("login").classList.add("hide");$("dash").classList.remove("hide");listen()}else{$("dash").classList.add("hide");$("login").classList.remove("hide");if(u)$("err").textContent="This Google account is not authorized."}});
function listen(){
  const list=$('list');
  list.innerHTML='<div class="loading">Loading responses…</div>';
  let settled=false;
  const timer=setTimeout(()=>{
    if(!settled){
      $('live').textContent='● Firebase connection is taking too long';
      list.innerHTML='<div class="empty">Firebase response load is taking too long.<br><small>Check Firestore Database and Rules.</small></div>';
    }
  },8000);

  // Read the collection without orderBy(). This avoids composite/index/query issues;
  // sorting is done locally, so the dashboard remains fast and reliable.
  unsub=onSnapshot(collection(db,'responses'),snap=>{
    settled=true; clearTimeout(timer);
    let yes=0,no=0;
    const rows=[];
    snap.forEach(d=>{
      const x=d.data();
      rows.push({id:d.id,...x});
      if(x.answer==='YES')yes++;
      if(x.answer==='NO')no++;
    });
    rows.sort((a,b)=>{
      const ta=a.createdAt?.toMillis?.() ?? 0;
      const tb=b.createdAt?.toMillis?.() ?? 0;
      return tb-ta;
    });
    $('total').textContent=rows.length;
    $('yesCount').textContent=yes;
    $('noCount').textContent=no;
    $('live').textContent=`● Live · ${rows.length?'updated just now':'waiting for responses'}`;
    if(!rows.length){list.innerHTML='<div class="empty">No responses yet 💗</div>';return;}
    list.innerHTML=rows.map((x,i)=>{
      const ok=x.answer==='YES';
      const t=x.createdAt?.toDate?.().toLocaleString?.()||'Just now';
      return `<article class="item ${ok?'yes':'no'}"><div class="row"><strong class="name">${esc(x.name)}</strong><strong class="answer ${ok?'yes':'no'}">${ok?'💖 YES':'💔 NO'}</strong></div><div class="detail">${ok?'Chose Yes 💕':'Pressed No '+(Number(x.noPresses)||0)+' times'}</div><div class="muted">#${rows.length-i} · ${esc(t)}</div></article>`;
    }).join('');
  },e=>{
    settled=true; clearTimeout(timer);
    $('live').textContent='● Firebase connection error';
    const code=e?.code||'unknown';
    const msg=code==='permission-denied'?'Permission denied — check Firestore Rules and make sure you are logged in with the admin Google account.':
      code==='failed-precondition'?'Firestore query/configuration error. This version avoids orderBy/index requirements; check Firestore Database is created.':
      code==='unavailable'?'Firebase is temporarily unavailable or the network is unstable. Please refresh once.':
      `Could not load responses (${code}). Check Firebase Firestore setup.`;
    list.innerHTML=`<div class="empty">${esc(msg)}<br><small>${esc(e?.message||'')}</small></div>`;
    console.error('Firestore error:',e);
  });
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
