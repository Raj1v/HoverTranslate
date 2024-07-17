import { initializeApp, applicationDefault, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app = getApp();
if (!app) {
    app = initializeApp({
        credential: applicationDefault()
    });
}

const db = getFirestore(app);

export { db };
