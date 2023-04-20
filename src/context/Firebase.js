import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyDvoQ6UsRck6aybSpJQGajnhxVq1zhIRDw",
  authDomain: "hakka-5f5e6.firebaseapp.com",
  projectId: "hakka-5f5e6",
  storageBucket: "hakka-5f5e6.appspot.com",
  messagingSenderId: "9844416811",
  appId: "1:9844416811:web:357e4bf5155dcdcf59256e",
  measurementId: "G-WMVKTGJRB9"
})

const storage = getStorage(firebaseConfig)
const db = getFirestore(firebaseConfig)
export { db, storage }

