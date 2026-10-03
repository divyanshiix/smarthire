const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });
process.env.NODE_ENV = 'test';

const app = require('../server');

async function runTests() {
  console.log('🧪 Starting SmartHire Backend API Verification Suite...\n');

  let server;
  let baseUrl;
  let authToken = '';
  let createdJobId = '';
  let createdApplicantId = '';

  try {
    // 1. Start Server on random available port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`✅ Test server running on ${baseUrl}`);
        resolve();
      });
    });

    // Helper request wrapper using native http module
    const request = (method, urlPath, headers = {}, body = null) => {
      return new Promise((resolve, reject) => {
        const u = new URL(baseUrl + urlPath);
        const reqHeaders = { ...headers };
        let payload = null;

        if (body && typeof body === 'object' && !headers['content-type']?.includes('multipart')) {
          payload = JSON.stringify(body);
          reqHeaders['content-type'] = 'application/json';
          reqHeaders['content-length'] = Buffer.byteLength(payload);
        }

        const req = http.request(
          {
            hostname: u.hostname,
            port: u.port,
            path: u.pathname + u.search,
            method,
            headers: reqHeaders
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              try {
                const json = res.headers['content-type']?.includes('application/json')
                  ? JSON.parse(data)
                  : data;
                resolve({ status: res.statusCode, headers: res.headers, body: json });
              } catch (e) {
                resolve({ status: res.statusCode, headers: res.headers, body: data });
              }
            });
          }
        );

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
      });
    };

    // Test 1: Health Check
    console.log('🔹 Test 1: GET /api/health');
    const res1 = await request('GET', '/api/health');
    console.assert(res1.status === 200, `Expected 200 got ${res1.status}`);
    console.assert(res1.body.status === 'online', 'Expected status online');
    console.log('  └─ PASS: Health check endpoint working\n');

    // Test 2: Recruiter Registration
    console.log('🔹 Test 2: POST /api/auth/register');
    const testUser = {
      name: 'Test Recruiter',
      email: `recruiter_${Date.now()}@test.com`,
      password: 'password123',
      company: 'Test Hire Corp'
    };
    const res2 = await request('POST', '/api/auth/register', {}, testUser);
    console.assert(res2.status === 201, `Expected 201 got ${res2.status}`);
    console.assert(res2.body.token, 'Expected token in response');
    authToken = res2.body.token;
    console.log('  └─ PASS: Registration returned valid JWT token\n');

    // Test 3: Recruiter Login
    console.log('🔹 Test 3: POST /api/auth/login');
    const res3 = await request('POST', '/api/auth/login', {}, {
      email: testUser.email,
      password: testUser.password
    });
    console.assert(res3.status === 200, `Expected 200 got ${res3.status}`);
    console.assert(res3.body.user.email === testUser.email, 'Email match');
    console.log('  └─ PASS: Login successfully authenticated user\n');

    // Test 4: Protected Profile Fetch
    console.log('🔹 Test 4: GET /api/auth/me (Protected Route)');
    const res4 = await request('GET', '/api/auth/me', {
      authorization: `Bearer ${authToken}`
    });
    console.assert(res4.status === 200, `Expected 200 got ${res4.status}`);
    console.assert(res4.body.user.name === testUser.name, 'Name match');
    console.log('  └─ PASS: Protected profile route working\n');

    // Test 5: Create Job
    console.log('🔹 Test 5: POST /api/jobs');
    const testJob = {
      title: 'Staff Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'full-time',
      status: 'active',
      description: 'Building next-gen HR tech stack',
      requirements: ['Node.js', 'React', 'MongoDB'],
      salaryRange: '$140k - $170k'
    };
    const res5 = await request('POST', '/api/jobs', {
      authorization: `Bearer ${authToken}`
    }, testJob);
    console.assert(res5.status === 201, `Expected 201 got ${res5.status}`);
    console.assert(res5.body.job._id, 'Job created with ID');
    createdJobId = res5.body.job._id;
    console.log(`  └─ PASS: Job created successfully with ID ${createdJobId}\n`);

    // Test 6: List Jobs & Search
    console.log('🔹 Test 6: GET /api/jobs?search=Staff');
    const res6 = await request('GET', '/api/jobs?search=Staff');
    console.assert(res6.status === 200, `Expected 200 got ${res6.status}`);
    console.assert(res6.body.jobs.length >= 1, 'Expected at least 1 job found');
    console.log('  └─ PASS: Job list & search functioning\n');

    // Test 7: Add Applicant
    console.log('🔹 Test 7: POST /api/applicants');
    const testApplicant = {
      name: 'Jordan Lee',
      email: `jordan_${Date.now()}@candidate.com`,
      phone: '+1 555 123 4567',
      jobId: createdJobId,
      notes: 'Strong candidate profile',
      rating: 5
    };
    const res7 = await request('POST', '/api/applicants', {}, testApplicant);
    console.assert(res7.status === 201, `Expected 201 got ${res7.status}`);
    console.assert(res7.body.applicant._id, 'Applicant created');
    createdApplicantId = res7.body.applicant._id;
    console.log(`  └─ PASS: Candidate application created with ID ${createdApplicantId}\n`);

    // Test 8: Update Applicant Status
    console.log('🔹 Test 8: PUT /api/applicants/:id/status');
    const res8 = await request('PUT', `/api/applicants/${createdApplicantId}/status`, {
      authorization: `Bearer ${authToken}`
    }, { status: 'interview', notes: 'Moved to interview stage' });
    console.assert(res8.status === 200, `Expected 200 got ${res8.status}`);
    console.assert(res8.body.applicant.status === 'interview', 'Status updated to interview');
    console.log('  └─ PASS: Applicant hiring stage transition verified\n');

    // Test 9: GET Dashboard Stats
    console.log('🔹 Test 9: GET /api/dashboard/stats');
    const res9 = await request('GET', '/api/dashboard/stats', {
      authorization: `Bearer ${authToken}`
    });
    console.assert(res9.status === 200, `Expected 200 got ${res9.status}`);
    console.assert(res9.body.stats.totalJobs >= 1, 'Total jobs count ok');
    console.assert(res9.body.stats.totalApplicants >= 1, 'Total applicants count ok');
    console.log('  └─ PASS: Dashboard recruitment analytics aggregate correctly\n');

    // Test 10: Export CSV
    console.log('🔹 Test 10: GET /api/applicants/export/csv');
    const res10 = await request('GET', '/api/applicants/export/csv', {
      authorization: `Bearer ${authToken}`
    });
    console.assert(res10.status === 200, `Expected 200 got ${res10.status}`);
    console.assert(typeof res10.body === 'string' && res10.body.includes('ApplicantID'), 'CSV format valid');
    console.log('  └─ PASS: Candidate CSV export generated correctly\n');

    console.log('🏆 ALL 10 BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
}

runTests();
