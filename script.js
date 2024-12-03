// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDflJNP8ZtMOqYDzVt2RX27xHpR_8aPfz8",
  authDomain: "simplecomment-5a36d.firebaseapp.com",
  projectId: "simplecomment-5a36d",
  storageBucket: "simplecomment-5a36d.firebasestorage.app",
  messagingSenderId: "935865322373",
  appId: "1:935865322373:web:adb4d1016a4bd197cad2ec",
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ambil Elemen DOM
const commentForm = document.getElementById("comment-form");
const commentsContainer = document.getElementById("comments-container");

// Fungsi untuk Menampilkan Komentar
async function getComments() {
  try {
    // Query untuk mengambil komentar terbaru
    const q = query(collection(db, "comment"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    // Bersihkan kontainer sebelum menampilkan komentar
    commentsContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const { name, comment } = doc.data();
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
        <strong>${name}</strong>: ${comment}
      `;
      commentsContainer.appendChild(commentElement);
    });

    // Jika tidak ada komentar
    if (querySnapshot.empty) {
      commentsContainer.innerHTML = "<p>No comments found.</p>";
    }
  } catch (error) {
    console.error("Failed to load comments:", error);
    commentsContainer.innerHTML = `<p>Error: Unable to load comments.</p>`;
  }
}

// Fungsi untuk Submit Komentar
async function submitComment(event) {
  event.preventDefault(); // Hindari reload halaman

  const nameInput = document.getElementById("name");
  const commentInput = document.getElementById("comment");

  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();

  if (name && comment) {
    try {
      // Tambahkan data ke Firestore
      await addDoc(collection(db, "comment"), {
        name: name,
        comment: comment,
        timestamp: new Date(),
      });

      console.log("Comment submitted successfully!");

      // Bersihkan input
      nameInput.value = "";
      commentInput.value = "";

      // Refresh komentar
      await getComments();
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Error: Unable to submit comment. Please try again.");
    }
  } else {
    alert("Please fill in both fields.");
  }
}

// Event Listener untuk Form Submit
commentForm.addEventListener("submit", submitComment);

// Load Komentar saat halaman pertama kali dimuat
window.onload = getComments;
