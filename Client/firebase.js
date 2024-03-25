import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBi8tquJisglnH50NlBxKU0PBnsagO_7M",
  authDomain: "messenger-74234.firebaseapp.com",
  projectId: "messenger-74234",
  storageBucket: "messenger-74234.appspot.com",
  messagingSenderId: "351560904832",
  appId: "1:351560904832:web:8d52113f3ba366412c7665",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
