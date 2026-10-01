const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
let token;
let eventId = 'test-event-id-123';
let inviteToken;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  try {
    console.log('1. Testing /api/health');
    const health = await axios.get(`${API_URL}/health`);
    console.log('Health:', health.data);

    console.log('\n2. Testing /api/auth/register');
    const registerEmail = `test${Date.now()}@example.com`;
    const register = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: registerEmail,
      password: 'password123'
    });
    console.log('Register:', register.data.user);
    token = register.data.token;

    console.log('\n3. Testing /api/auth/login');
    const login = await axios.post(`${API_URL}/auth/login`, {
      email: registerEmail,
      password: 'password123'
    });
    console.log('Login:', login.data.user);

    console.log('\n4. Testing /api/auth/me');
    const me = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Me:', me.data);

    console.log('\n5. Testing /api/users/me/reminders (PATCH)');
    const reminders = await axios.patch(`${API_URL}/users/me/reminders`, {
      enabled: true,
      minutesBefore: 30
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Reminders:', reminders.data);

    console.log('\n6. Testing Ticketmaster API (Expecting 401 since no valid key)');
    try {
      await axios.get(`${API_URL}/events`);
    } catch (e) {
      console.log('Events API Error (Expected):', e.response?.data || e.message);
    }

    console.log('\n7. Testing /api/rsvps (POST)');
    const rsvp = await axios.post(`${API_URL}/rsvps`, {
      eventId,
      eventName: 'Test Concert',
      eventDate: '2026-10-08',
      eventTime: '10:00 AM',
      venue: 'Test Venue'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('RSVP Create:', rsvp.data);

    console.log('\n8. Testing Duplicate RSVP Prevention');
    try {
      await axios.post(`${API_URL}/rsvps`, {
        eventId,
        eventName: 'Test Concert',
        eventDate: '2026-10-08'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.log('Duplicate RSVP Error (Expected):', e.response?.data || e.message);
    }

    console.log('\n9. Testing /api/invites (POST)');
    const invite = await axios.post(`${API_URL}/invites`, {
      eventId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Invite Create:', invite.data);
    inviteToken = invite.data.token;

    console.log('\n10. Testing /api/invites/:token (GET)');
    const getInvite = await axios.get(`${API_URL}/invites/${inviteToken}`);
    console.log('Invite GET:', getInvite.data);

    console.log('\n11. Testing /api/invites/:token/click (POST)');
    const clickInvite = await axios.post(`${API_URL}/invites/${inviteToken}/click`);
    console.log('Invite Click:', clickInvite.data);

    console.log('\n12. Testing /api/rsvps (GET)');
    const getRsvps = await axios.get(`${API_URL}/rsvps`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('RSVPs GET:', getRsvps.data);

    console.log('\n13. Testing /api/rsvps/:eventId (DELETE)');
    const deleteRsvp = await axios.delete(`${API_URL}/rsvps/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('RSVP Delete:', deleteRsvp.data);

    console.log('\nAll tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Start app server and run tests
const app = require('./src/app');
const connectDB = require('./src/config/db');

connectDB().then(() => {
  const server = app.listen(5000, async () => {
    console.log('Server started for testing...');
    await sleep(1000);
    await runTests();
    server.close();
  });
}).catch(err => {
  console.error(err);
  process.exit(1);
});
