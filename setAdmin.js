// setAdmin.js
const admin = require("firebase-admin");

// Ganti dengan path serviceAccountKey.json yang kamu download dari Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = "admin@laundry.com"; // ganti dengan email adminmu

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log("✅ Admin berhasil dibuat!");
    process.exit();
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
