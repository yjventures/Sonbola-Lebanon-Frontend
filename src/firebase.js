// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_APIKEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const requestPermission = () => {
    // console.log('Requesting permission...')
    Notification.requestPermission().then(premission => {
        if (premission === 'granted') {
            console.log('Notification permission granted.')
            return getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPIDKEY
            })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('Token => ', currentToken)
                    } else {
                        console.log('No registration token available. Request permission to generate one.')
                    }
                })
        } else {
            console.log('Unable to get permission to notify.')
        }
    })
}


requestPermission()

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload)
        })
    })
