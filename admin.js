import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import{getFirestore,collection,getDocs}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const cfg={apiKey:"AIzaSyD-autiWDynxIrZKSB53FWaNGSTbxYComU",authDomain:"love-page-d3a05.firebaseapp.com",projectId:"love-page-d3a05",storageBucket:"love-page-d3a05.firebasestorage.app",messagingSenderId:"857612763723",appId:"1:857612763723:web:03cd1b0335015cd05943ce",measurementId:"G-ET3G72MKRT"};
const ADMIN="sandip2007mukherjee@gmail.com";
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
const $=id=>document.getElementById(id);

$("loginBtn").onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){$("err").textContent=e.message}};
$("logout").onclick=()=>signOut(auth);

onAuthStateChanged(auth,u=>{
  if(u?.email===ADMIN){$("login").classList.add("hide");$("dash").classList.remove("hide");load();}
  else{$("dash").classList.add("hide");$("login").classList.remove("hide");if(u)$("err").textContent="This Google account is not authorized.";}
});

async function load(){
  $("list").innerHTML='<div class="loading">Loading responses…</div>';
  try{
    const snap=await getDocs(collection(db,"responses"));
    const rows=[];let yes=0,no=0;
    snap.forEach(d=>{const x=d.data();rows.push({id:d.id,...x});if(x.answer==="YES")yes++;else if(x.answer==="NO")no++;});
    rows.sort((a,b)=>{const ta=a.createdAt?.toMillis?.()||0,tb=b.createdAt?.toMillis?.()||0;return tb-ta;});
    $("stats").innerHTML=`<div class="stat"><b>${rows.length}</b><span>Total</span></div><div class="stat"><b>💖 ${yes}</b><span>YES</span></div><div class="stat"><b>💔 ${no}</b><span>NO</span></div>`;
    if(!rows.length){$("list").innerHTML="<p>No responses yet.</p>";return;}
    $("list").innerHTML=rows.map((x,i)=>{
      const answer=x.answer||"UNKNOWN";
      const t=x.createdAt?.toDate?.().toLocaleString?.()||"Just now";
      return `<article class="item ${answer.toLowerCase()}"><div class="row"><strong>#${i+1} ${esc(x.name)}</strong><b>${answer==="YES"?"💖 YES":"💔 NO"}</b></div><div class="detail">They typed: <strong>${answer}</strong> · NO presses: ${Number(x.noPresses)||0}</div><div class="muted">${esc(t)}</div></article>`;
    }).join("");
  }catch(e){console.error(e);$("list").innerHTML="<p>Could not load responses.</p>";$("err").textContent=`Firestore error: ${e.code||"unknown"}`;}
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
