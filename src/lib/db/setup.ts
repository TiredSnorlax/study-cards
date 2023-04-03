import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBazW8ezdl457-cmYQIPu_F2nzcKu8wVE",
  authDomain: "study-cards-9fe56.firebaseapp.com",
  projectId: "study-cards-9fe56",
  storageBucket: "study-cards-9fe56.appspot.com",
  messagingSenderId: "587506418443",
  appId: "1:587506418443:web:150804a8b90ab42915580e",
  measurementId: "G-VCZ90KEQ2N"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export { app, db, auth }
