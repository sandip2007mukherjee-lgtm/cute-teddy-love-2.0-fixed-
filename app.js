import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-autiWDynxIrZKSB53FWaNGSTbxYComU",
  authDomain: "love-page-d3a05.firebaseapp.com",
  projectId: "love-page-d3a05",
  storageBucket: "love-page-d3a05.firebasestorage.app",
  messagingSenderId: "857612763723",
  appId: "1:857612763723:web:03cd1b0335015cd05943ce",
  measurementId: "G-ET3G72MKRT"
};

const db = getFirestore(initializeApp(firebaseConfig));
const $ = id => document.getElementById(id);

let visitorName = "";
let noCount = 0;
let finished = false;

$("go").onclick = () => {
  const n = $("n").value.trim();
  if (!n) {
    $("err").textContent = "Please enter your name 💗";
    return;
  }
  visitorName = n;
  $("hello").textContent = `Hey ${visitorName} 💕`;
  $("name").classList.add("hide");
  $("q").classList.remove("hide");
};

$("no").onclick = () => {
  if (finished) return;

  noCount++;

  const btn = $("no");

  // Keep the No button inside the question card so it can ALWAYS be clicked.
  const dx = (Math.random() * 80) - 40;
  const dy = (Math.random() * 50) - 25;
  const scale = Math.max(0.55, 1 - noCount * 0.07);

  btn.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

  if (noCount >= 6) {
    finished = true;
    showSad();
    saveResponse("NO", noCount); // save in background; never block the animation
  } else {
    $("status").textContent = `Are you sure? 🥺 (${noCount}/6)`;
  }
};

$("yes").onclick = () => {
  if (finished) return;
  finished = true;
  showHappy();
  saveResponse("YES", noCount); // save in background; never block the animation
};

function showHappy() {
  $("q").classList.add("hide");
  $("result").classList.remove("hide");
  $("rt").textContent = "🧸❤️";
  $("title").textContent = "Yayyy! You made Sandip very happy! 💖";
  $("msg").textContent =
    `Awww ${visitorName}... 🥰 You just made Sandip's heart very happy! Thank you for choosing Yes! ❤️`;

  for (let i = 0; i < 16; i++) {
    setTimeout(spawnHeart, i * 100);
  }
}

function showSad() {
  $("q").classList.add("hide");
  $("result").classList.remove("hide");
  $("rt").textContent = "🧸💔";
  $("rt").style.filter = "grayscale(.25)";
  $("title").textContent = "Aww… 🥺💔";
  $("msg").textContent =
    `${visitorName}, you pressed No 6 times… Sandip is a little sad now. 💔 But your feelings matter, always. 🥹`;
}

async function saveResponse(answer, noPresses) {
  try {
    await addDoc(collection(db, "responses"), {
      name: visitorName,
      answer,
      noPresses,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Firestore save error:", error);
  }
}

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = "❤️";
  h.style.left = (20 + Math.random() * 60) + "vw";
  h.style.top = (55 + Math.random() * 15) + "vh";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1900);
}
