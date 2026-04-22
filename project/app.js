import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// 🔴 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBzj3JME_v3R7iZi_YetdTAMR0fn8f0s1Q",
  authDomain: "deepu-d4159.firebaseapp.com",
  projectId: "deepu-d4159",
  storageBucket: "deepu-d4159.firebasestorage.app",
  messagingSenderId: "492386548547",
  appId: "1:492386548547:web:a193a08ee2d19459cf0df6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 GOOGLE LOGIN
window.googleLogin = function () {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => alert(err.message));
};

// 🚪 LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// 🔄 CHECK USER
window.checkUser = function () {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      loadContacts();
    }
  });
};

// 💾 ADD CONTACT (STORE IN FIRESTORE)
window.addContact = async function () {
  const user = auth.currentUser;

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("Enter all fields");
    return;
  }

  await addDoc(collection(db, "contacts"), {
    name,
    phone,
    user: user.email
  });

  alert("Contact Saved ✅");
  loadContacts();
};

// 📋 LOAD CONTACTS
async function loadContacts() {
  const querySnapshot = await getDocs(collection(db, "contacts"));

  let html = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();

    html += `
      <div style="margin:10px; padding:10px; border:1px solid black;">
        <h3>${data.name}</h3>
        <p>${data.phone}</p>

        <button onclick="showNumber('${data.phone}')">
          Show Number
        </button>
      </div>
    `;
  });

  document.getElementById("contacts").innerHTML = html;
}

// 📞 SHOW NUMBER
window.showNumber = function (phone) {
  alert("Phone: " + phone);
};