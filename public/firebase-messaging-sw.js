
// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyCtcyCQWsbf10uwEXwBxkyQueQhgy6r-yU",
  authDomain: "autoparc-rolcris-fba68.firebaseapp.com",
  projectId: "autoparc-rolcris-fba68",
  storageBucket: "autoparc-rolcris-fba68.firebasestorage.app",
  messagingSenderId: "765134886891",
  appId: "1:765134886891:web:7f6385a78de0fac8756bae"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://i.imgur.com/e7JOUNo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
