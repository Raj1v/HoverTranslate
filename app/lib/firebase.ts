import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
let app;

if (getApps().length === 0) {
    app = initializeApp({
        credential: applicationDefault()
    });
}
else{
    app = getApps()[0];
}

const db = getFirestore(app);

export { db };