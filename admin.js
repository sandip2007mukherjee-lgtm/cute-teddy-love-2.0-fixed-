import{initializeApp}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import{getFirestore,collection,onSnapshot}from"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const cfg={apiKey:"AIzaSyD-autiWDynxIrZKSB53FWaNGSTbxYComU",authDomain:"love-page-d3a05.firebaseapp.com",projectId:"love-page-d3a05",storageBucket:"love-page-d3a05.firebasestorage.app",messagingSenderId:"857612763723",appId:"1:857612763723:web:03cd1b0335015cd05943ce",measurementId:"G-ET3G72MKRT"};
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app),ADMIN="sandip2007mukherjee@gmail.com";const $=x=>document.getElementById(x);
$("loginBtn").onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){$("err").textContent=e.message}};$("logout").onclick=()=>signOut(auth);
onAuthStateChanged(auth,u=>{if(u&&u.email===ADMIN){$("login").classList.add("hide");$("dash").classList.remove("hide");load()}else{$("dash").classList.add("hide");$("login").classList.remove("hide");if(u)$("err").textContent="This Google account is not authorized."}});
function load(){
  $("list").textContent = "Loading…";
  // Read all responses without orderBy(). This avoids query/index problems and
  // also keeps older documents visible even if createdAt is missing.
  onSnapshot(collection(db,"responses"),s=>{
    const rows=[];
    s.forEach(d=>{
      const x=d.data();
      rows.push({id:d.id,...x});
    });

    rows.sort((a,b)=>{
      const ta=a.createdAt?.toMillis?a.createdAt.toMillis():0;
      const tb=b.createdAt?.toMillis?b.createdAt.toMillis():0;
      return tb-ta;
    });

    let y=0,n=0,h="";
    rows.forEach(x=>{
      x.answer==="YES"?y++:n++;
      const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString():"Just now";
      h+=`<article class="item ${x.answer==="YES"?"yes":"no"}"><div class="name">${esc(x.name)}</div><b>${x.answer==="YES"?"💖 YES":"💔 NO"} · No presses: ${x.noPresses||0}</b><div class="muted">${esc(t)}</div></article>`;
    });
    $("stats").textContent=`Total: ${y+n} | 💖 Yes: ${y} | 💔 No: ${n}`;
    $("list").innerHTML=h||"No responses yet.";
  },error=>{
    console.error("Firestore read error:",error);
    $("list").textContent="Could not load responses.";
    $("err").textContent=`Firestore error: ${error.code||"unknown"} — ${error.message||"Check Firestore rules and deployment."}`;
  });
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}