import * as firebase from 'firebase'
  require('@firebase/firestore')
  var firebaseConfig = {
    apiKey: "AIzaSyBJxIi7kstjZVIEwLK06cz7fDrJxmAunF4",
    authDomain: "wireless-library-app-b8a88.firebaseapp.com",
    projectId: "wireless-library-app-b8a88",
    storageBucket: "wireless-library-app-b8a88.appspot.com",
    messagingSenderId: "864611927149",
    appId: "1:864611927149:web:5ae8263610ae554a23eb64"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore()