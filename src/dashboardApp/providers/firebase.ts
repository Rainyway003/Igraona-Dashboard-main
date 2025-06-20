// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuYMd4WN2UhAMnIryb12kPBt73vXg49CE",
  authDomain: "turnirturnira4igraonaigraona.firebaseapp.com",
  projectId: "turnirturnira4igraonaigraona",
  storageBucket: "turnirturnira4igraonaigraona.firebasestorage.app",
  messagingSenderId: "123691287955",
  appId: "1:123691287955:web:5ea79a559c04113ae29466",
  measurementId: "G-K7X57Q6MQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)