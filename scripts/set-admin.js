/**
 * Script to set custom claims for Firebase Authentication users
 * 
 * Usage:
 * 1. Download your service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate new private key"
 *    - Save as "serviceAccountKey.json" in this scripts folder
 * 
 * 2. Install firebase-admin:
 *    npm install firebase-admin
 * 
 * 3. Run:
 *    node set-admin.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Load service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Error: Could not load serviceAccountKey.json');
  console.error('   Please download it from Firebase Console:');
  console.error('   Project Settings > Service Accounts > Generate new private key');
  console.error('   Save it as: scripts/serviceAccountKey.json');
  process.exit(1);
}

// ============================================
// Configuration
// ============================================
const ADMIN_UID = 'yFPcqNasVcbEyaBt6WCPC2K6bK23';

// ============================================
// Set Admin Role
// ============================================
async function setAdminRole() {
  try {
    // Get user info first
    const user = await admin.auth().getUser(ADMIN_UID);
    console.log(`\n📋 User found: ${user.email || user.uid}`);
    console.log(`   Current claims: ${JSON.stringify(user.customClaims || {})}`);

    // Set admin role
    await admin.auth().setCustomUserClaims(ADMIN_UID, { role: 'admin' });
    
    // Verify the change
    const updatedUser = await admin.auth().getUser(ADMIN_UID);
    console.log(`\n✅ Custom claims updated!`);
    console.log(`   New claims: ${JSON.stringify(updatedUser.customClaims)}`);
    
    console.log('\n📝 Notes:');
    console.log('   - The user needs to sign out and sign in again for changes to take effect');
    console.log('   - Or refresh their ID token');
    console.log('   - Other users without claims will be treated as "operator" by default');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error setting custom claims:', error.message);
    process.exit(1);
  }
}

// ============================================
// List All Users (optional helper)
// ============================================
async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    console.log('\n📋 All users:');
    listUsersResult.users.forEach((user) => {
      console.log(`   - ${user.uid}: ${user.email || '(no email)'} | claims: ${JSON.stringify(user.customClaims || {})}`);
    });
  } catch (error) {
    console.error('Error listing users:', error.message);
  }
}

// Run
console.log('🔧 Firebase Admin - Set Custom Claims');
console.log('=====================================');
// setAdminRole();
listUsers();

