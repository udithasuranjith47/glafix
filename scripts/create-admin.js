/**
 * One-time script to create the Glafix admin user in Firebase Authentication.
 * Run once, then delete this file.
 *
 * Usage:
 *   node scripts/create-admin.js <email> <password>
 *
 * Example:
 *   node scripts/create-admin.js you@example.com yourpassword
 */

const API_KEY = "AIzaSyAXCWMB6sYWcrGAKqJNM_tcsTlZ_Bwuti0";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.js <email> <password>");
  process.exit(1);
}

async function createAdmin() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await res.json();

  if (data.error) {
    if (data.error.message === "EMAIL_EXISTS") {
      console.log("✓ Admin user already exists — you're good to go.");
    } else {
      console.error("✗ Error:", data.error.message);
      console.error("  Make sure Email/Password sign-in is enabled in your Firebase Console.");
      console.error("  Firebase Console → Authentication → Sign-in method → Email/Password → Enable");
    }
    return;
  }

  console.log("✓ Admin user created successfully!");
  console.log("  Email:", data.email);
  console.log("  UID:  ", data.localId);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Log in at http://localhost:3000/admin/login");
  console.log("  2. Go to Firebase Console → Authentication → Settings → User actions");
  console.log("     and DISABLE 'Email/Password sign-up' so nobody else can register.");
  console.log("  3. Delete this script file — it's no longer needed.");
}

createAdmin().catch(console.error);
