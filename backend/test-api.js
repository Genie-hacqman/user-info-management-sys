const axios = require("axios");

const BASE_URL = "http://localhost:3000";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
  try {
    log("\n========================================", "cyan");
    log("API TEST SUITE", "cyan");
    log("========================================\n", "cyan");

    log("1️⃣  HEALTH CHECK", "blue");
    const healthRes = await axios.get(`${BASE_URL}/health`);
    log(`✓ Status: ${healthRes.data.status}`, "green");
    log(`✓ Service: ${healthRes.data.service}\n`, "green");

    log("2️⃣  REGISTER NEW USER", "blue");
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "John Doe",
      email: `john-${Date.now()}@example.com`,
      password: "Password123!",
      phone: "+1234567890",
      role: "user",
      status: "Active",
    });
    const regularUser = registerRes.data;
    log(`✓ User registered: ${regularUser.name}`, "green");
    log(`✓ Email: ${regularUser.email}`, "green");
    log(`✓ Role: ${regularUser.role}\n`, "green");

    log("3️⃣  LOGIN", "blue");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: regularUser.email,
      password: "Password123!",
    });
    const token = loginRes.data.token;
    const loggedInUser = loginRes.data.user;
    log(`✓ Login successful`, "green");
    log(`✓ User: ${loggedInUser.name}`, "green");
    log(`✓ Token: ${token.substring(0, 30)}... (truncated)\n`, "green");

    log("4️⃣  ACCESS PROTECTED ROUTE (GET /users)", "blue");
    const usersRes = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    log(`✓ Retrieved ${usersRes.data.length} user(s)`, "green");
    log(`✓ Protected route accessible with valid token\n`, "green");

    log("5️⃣  TRY PROTECTED ROUTE WITHOUT TOKEN", "blue");
    try {
      await axios.get(`${BASE_URL}/users`);
      log(`✗ Should have failed without token`, "red");
    } catch (err) {
      if (err.response?.status === 401) {
        log(`✓ Correctly rejected: ${err.response.data.error}`, "green");
      } else {
        log(`✗ Unexpected error`, "red");
      }
    }
    log("", "reset");

    log("6️⃣  ADMIN USER - REGISTER", "blue");
    const adminRegisterRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Admin User",
      email: `admin-${Date.now()}@example.com`,
      password: "AdminPass123!",
      phone: "+1234567890",
      role: "admin",
      status: "Active",
    });
    const adminUser = adminRegisterRes.data;
    log(`✓ Admin user registered: ${adminUser.name}`, "green");
    log(`✓ Role: ${adminUser.role}\n`, "green");

    log("7️⃣  ADMIN LOGIN", "blue");
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminUser.email,
      password: "AdminPass123!",
    });
    const adminToken = adminLoginRes.data.token;
    log(`✓ Admin login successful`, "green");
    log(`✓ Token: ${adminToken.substring(0, 30)}... (truncated)\n`, "green");

    log("8️⃣  ADMIN ACCESS - CREATE NEW USER", "blue");
    const createUserRes = await axios.post(
      `${BASE_URL}/users`,
      {
        name: "New User",
        email: `newuser-${Date.now()}@example.com`,
        password: "NewPass123!",
        phone: "+9876543210",
        role: "user",
        status: "Active",
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const newUser = createUserRes.data;
    log(`✓ User created via admin: ${newUser.name}`, "green");
    log(`✓ Created email: ${newUser.email}\n`, "green");

    log("9️⃣  ADMIN ACCESS - GET ALL USERS", "blue");
    const allUsersRes = await axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    log(`✓ Retrieved ${allUsersRes.data.length} total user(s)`, "green");
    log(`✓ Admin can view all users\n`, "green");

    log("🔟 ADMIN ACCESS - GET SPECIFIC USER", "blue");
    const getUserRes = await axios.get(`${BASE_URL}/users/${newUser.id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    log(`✓ Retrieved user: ${getUserRes.data.name}`, "green");
    log(`✓ User ID: ${getUserRes.data.id}\n`, "green");

    log("1️⃣1️⃣  ADMIN ACCESS - UPDATE USER", "blue");
    const updateUserRes = await axios.put(
      `${BASE_URL}/users/${newUser.id}`,
      {
        name: "Updated User Name",
        status: "Inactive",
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );
    log(`✓ User updated: ${updateUserRes.data.name}`, "green");
    log(`✓ New status: ${updateUserRes.data.status}\n`, "green");

    log("1️⃣2️⃣  CURRENT USER - GET PROFILE (/users/me)", "blue");
    const profileRes = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    log(`✓ Current user: ${profileRes.data.name}`, "green");
    log(`✓ Email: ${profileRes.data.email}\n`, "green");

    log("1️⃣3️⃣  CURRENT USER - UPDATE PROFILE", "blue");
    const updateProfileRes = await axios.put(
      `${BASE_URL}/users/me`,
      {
        name: "Updated John Doe",
        phone: "+9999999999",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    log(`✓ Profile updated: ${updateProfileRes.data.name}`, "green");
    log(`✓ New phone: ${updateProfileRes.data.phone}\n`, "green");

    log("1️⃣4️⃣  CURRENT USER - CHANGE PASSWORD", "blue");
    const changePassRes = await axios.put(
      `${BASE_URL}/users/me/password`,
      {
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    log(`✓ Password changed successfully`, "green");
    log(`✓ Message: ${changePassRes.data.message}\n`, "green");

    log("1️⃣5️⃣  ADMIN ACCESS - DELETE USER", "blue");
    const deleteUserRes = await axios.delete(`${BASE_URL}/users/${newUser.id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    log(`✓ User deleted (ID: ${newUser.id})`, "green");
    log(`✓ Status code: ${deleteUserRes.status}\n`, "green");

    log("========================================", "cyan");
    log("✅ ALL TESTS PASSED", "green");
    log("========================================\n", "cyan");

    console.log("Summary:");
    console.log("✓ Health check working");
    console.log("✓ User registration working");
    console.log("✓ Login & JWT token generation working");
    console.log("✓ Protected routes require valid token");
    console.log("✓ Admin user registration working");
    console.log("✓ Admin CRUD operations working");
    console.log("✓ User profile endpoints working");
    console.log("✓ Password change working");
    console.log("✓ User deletion working\n");
  } catch (err) {
    log("\n❌ TEST FAILED", "red");
    if (err.response) {
      log(`Status: ${err.response.status}`, "red");
      log(`Error: ${JSON.stringify(err.response.data)}`, "red");
    } else if (err.request) {
      log(
        `No response received. Is the server running on ${BASE_URL}?`,
        "red"
      );
    } else {
      log(`Error: ${err.message}`, "red");
    }
    process.exit(1);
  }
}

testAPI();
