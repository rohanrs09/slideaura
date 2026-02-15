// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; 
import { getAI, getGenerativeModel, getLiveGenerativeModel, GoogleAIBackend, ResponseModality } from "firebase/ai";  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//past used it 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webapp-2102e.firebaseapp.com",
  projectId: "webapp-2102e",
  storageBucket: "webapp-2102e.firebasestorage.app",
  messagingSenderId: "413054292439",
  appId: "1:413054292439:web:10b387ae0e2a332c8f3b92",
  measurementId: "G-QND440MYHD"
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: "aigen-b3e60.firebaseapp.com",
//   projectId: "aigen-b3e60",
//   storageBucket: "aigen-b3e60.firebasestorage.app",
//   messagingSenderId: "1006394322725",
//   appId: "1:1006394322725:web:6467780bac2438eea4f4cc",
//   measurementId: "G-E8BHQ8LVSB"
// };

// Validate required environment variables
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error("❌ VITE_FIREBASE_API_KEY is required. Please set it in your .env file");
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use default Firestore database (remove named database to avoid offline errors)
export const firebaseDb = getFirestore(app);

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiAiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });


// Create a `LiveGenerativeModel` instance with the flash-live model (only model that supports the Live API)
export const GeminiAiLiveModel = getLiveGenerativeModel(ai, {
  model: "gemini-2.0-flash-live-001",
  // Configure the model to respond with text
  generationConfig: {
    responseModalities: [ResponseModality.TEXT],
  }, 
});
   

