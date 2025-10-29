// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; 
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCegVqsQ4_nPeu0yNaVaJlSdujFpm3-c20",
  authDomain: "webapp-2102e.firebaseapp.com",
  projectId: "webapp-2102e",
  storageBucket: "webapp-2102e.firebasestorage.app",
  messagingSenderId: "413054292439",
  appId: "1:413054292439:web:c60d33c602fd2a7c8f3b92",
  measurementId: "G-J0SHY3TFRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseDb = getFirestore(app,'ai-ppt-gen');

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiAiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
   

