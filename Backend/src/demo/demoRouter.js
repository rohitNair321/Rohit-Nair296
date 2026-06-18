// demo/demoRouter.js
// Mounted at /api when DEMO_MODE=true.
// Returns realistic dummy data for every endpoint so new developers can explore
// the full API surface without any external service credentials.
//
// HOW IT WORKS
// ─────────────
// 1. Copy .env.example → .env  (DEMO_MODE=true is already set)
// 2. npm run dev
// 3. Visit http://localhost:3000/api-docs  ← full interactive Swagger UI
// 4. Login: POST /api/auth/login  { email:"admin@demo.com", password:"admin123" }
// 5. Use the returned token as  Authorization: Bearer <token>  on protected routes.
//
// When wiring a real backend, replace the of() blocks in the Angular services
// (app.service.ts, auth.service.ts, chat-api.service.ts) with real HttpClient calls.

'use strict';

const express = require('express');
const router  = express.Router();

const {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_PROFILE,
  DEMO_NOTIFICATIONS,
  DEMO_CHAT_SESSIONS,
  BOT_REPLIES,
  DEMO_USAGE,
  DEMO_BALANCE,
  DEMO_CHAT_STATS,
  DEMO_ANALYTICS_DASHBOARD,
  DEMO_POSTS,
} = require('./demoData');

// ─── tiny helpers ────────────────────────────────────────────────────────────

const ok = (res, data, message = 'Success') =>
  res.json({ success: true, statusCode: 200, message, data, timestamp: new Date().toISOString() });

const created = (res, data, message = 'Created') =>
  res.status(201).json({ success: true, statusCode: 201, message, data, timestamp: new Date().toISOString() });

const fail = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, statusCode, message, timestamp: new Date().toISOString() });

/** In demo mode we accept any "Bearer XXX" as a valid admin token. */
function demoAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 401, 'Authorization token required. Login with POST /api/auth/login first.');
  }
  req.demoRole = 'admin';
  next();
}

/** Returns a random bot reply. */
function botReply() {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

/** Returns posts filtered/paginated for public listing. */
function publishedPosts(query = {}) {
  const page  = Math.max(1, parseInt(query.page  || '1'));
  const limit = Math.max(1, parseInt(query.limit || '12'));
  let posts = DEMO_POSTS.filter(p => p.status === 'published');
  if (query.tag)    posts = posts.filter(p => p.tags.includes(query.tag));
  if (query.search) posts = posts.filter(p => p.title.toLowerCase().includes(query.search.toLowerCase()));
  const total = posts.length;
  posts = posts.slice((page - 1) * limit, page * limit);
  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ═════════════════════════════════════════════════════════════════════════════
//   AUTH  —  /api/auth/*  and  /api/v1/auth/*
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and password management
 *   - name: Profile
 *     description: Portfolio profile — read (public) and update (admin only)
 *   - name: Contact
 *     description: Contact form submission and admin notification inbox
 *   - name: Chat
 *     description: AI chat widget — sessions, messages, usage stats
 *   - name: Analytics
 *     description: Google Analytics dashboard data (admin only)
 *   - name: Posts
 *     description: Blog / LinkedIn learning post management
 *   - name: Health
 *     description: Server and database health checks
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login (admin or guest)
 *     description: |
 *       **Demo credentials:**
 *       - Admin → `admin@demo.com` / `admin123`
 *       - Guest → any other email + password
 *
 *       Returns a `token`. Pass it as `Authorization: Bearer <token>` on protected routes.
 *       The token is also set as an `httpOnly` cookie for browser clients.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@demo.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:   { type: boolean, example: true }
 *                 message:   { type: string,  example: Login successful }
 *                 token:
 *                   type: string
 *                   example: demo_admin_1718700000000
 *                   description: Pass as Authorization header on subsequent requests
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:    { type: string, example: demo-user-001 }
 *                     email: { type: string, example: admin@demo.com }
 *                     role:  { type: string, example: admin }
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 */
function handleLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 400, 'Email and password are required.');
  const isAdmin = email.toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;
  const role    = isAdmin ? 'admin' : 'guest';
  const token   = `demo_${role}_${Date.now()}`;
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 86400000, path: '/' });
  return res.json({
    success: true, message: 'Login successful.',
    token,
    user: { id: DEMO_PROFILE.id, email, role },
  });
}

router.post('/auth/login',    handleLogin);
router.post('/v1/auth/login', handleLogin);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout — clears the session cookie
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: Logged out successfully }
 */
function handleLogout(req, res) {
  res.clearCookie('token', { path: '/' });
  return ok(res, null, 'Logged out successfully');
}
router.post('/auth/logout',    handleLogout);
router.post('/v1/auth/logout', handleLogout);

/**
 * @swagger
 * /api/auth/initApp:
 *   get:
 *     summary: Initialize app — called on frontend startup to restore session
 *     description: |
 *       Called by the Angular app on startup (`initiateApp()` in AuthService).
 *       Returns the current user's `id`, `role`, and `email` so the frontend
 *       can restore admin/guest state without a full login.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:    { type: string, example: demo-user-001 }
 *                 role:  { type: string, enum: [admin, guest], example: guest }
 *                 email: { type: string, nullable: true, example: null }
 */
function handleInitApp(req, res) {
  return res.json({ id: DEMO_PROFILE.id, role: 'guest', email: null });
}
router.get('/auth/initApp', handleInitApp);
router.get('/v1/auth/init', handleInitApp);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     description: In demo mode the OTP is logged to the server console. In production it is emailed.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@demo.com
 *     responses:
 *       200:
 *         description: OTP sent (or logged to console in demo mode)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: If that email is registered a reset OTP has been sent. }
 */
function handleForgotPassword(req, res) {
  return ok(res, null, 'If that email is registered, a reset OTP has been sent. (demo mode — check server console)');
}
router.post('/auth/forgot-password',    handleForgotPassword);
router.post('/v1/auth/forgot-password', handleForgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:       { type: string, format: email, example: admin@demo.com }
 *               otp:         { type: string, example: "123456" }
 *               newPassword: { type: string, example: NewSecurePass123 }
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: OTP invalid or expired
 */
function handleResetPassword(req, res) {
  return ok(res, null, 'Password has been reset. (demo mode)');
}
router.post('/auth/reset-password',    handleResetPassword);
router.post('/v1/auth/reset-password', handleResetPassword);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Change password (admin only — must be logged in)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, currentPassword, newPassword]
 *             properties:
 *               email:           { type: string, format: email, example: admin@demo.com }
 *               currentPassword: { type: string, example: admin123 }
 *               newPassword:     { type: string, example: NewSecurePass456 }
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Current password incorrect
 */
function handleUpdatePassword(req, res) {
  return ok(res, null, 'Password updated successfully. (demo mode)');
}
router.put('/auth/update-password',    demoAuth, handleUpdatePassword);
router.put('/v1/auth/update-password', demoAuth, handleUpdatePassword);

// ═════════════════════════════════════════════════════════════════════════════
//   PROFILE  —  /api/profile/*  and  /api/v1/profile/*
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/profile/getMyProfile:
 *   get:
 *     summary: Get portfolio profile (public)
 *     description: |
 *       Returns the full profile object. No authentication required — this is the
 *       data that populates the public-facing portfolio page.
 *
 *       **Frontend wiring point:** Replace `of(MOCK_PROFILE)` in `AppService.getProfile()`
 *       with `this.http.get<Profile>('/api/v1/profile')`.
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 */
function handleGetProfile(req, res) {
  return res.json({ profile: DEMO_PROFILE });
}
router.get('/profile/getMyProfile', handleGetProfile);
router.get('/v1/profile',           handleGetProfile);

/**
 * @swagger
 * /api/profile/saveUpdateMyProfile:
 *   put:
 *     summary: Update portfolio profile (admin only)
 *     description: |
 *       Accepts `multipart/form-data` so that `avatar` (image) and `resume` (PDF)
 *       can be uploaded alongside the JSON fields.
 *
 *       Array fields (`skills`, `experiences`, `themes`) must be sent as
 *       **JSON-stringified strings** (see field descriptions).
 *
 *       **Frontend wiring point:** Replace `of(updated)` in `AppService.updateProfile()`
 *       with `this.http.put<{profile:Profile}>('/api/v1/profile', formData)`.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:      { type: string, example: Alex Johnson }
 *               description:    { type: string, example: Full-stack developer }
 *               email:          { type: string, format: email, example: alex@demo.com }
 *               primary_phone:  { type: string, example: "+1 (555) 123-4567" }
 *               location:       { type: string, example: "San Francisco, CA" }
 *               linkedin:       { type: string, example: "https://linkedin.com/in/alexjohnson" }
 *               github:         { type: string, example: "https://github.com/alexjohnson" }
 *               website:        { type: string, example: "https://alexjohnson.dev" }
 *               logo_initials:  { type: string, maxLength: 3, example: AJ }
 *               openToWork:     { type: boolean, example: true }
 *               currenttheme:   { type: string, example: boilerplate }
 *               skills:
 *                 type: string
 *                 description: JSON-stringified array e.g. '["Angular","Node.js"]'
 *                 example: '["Angular","TypeScript","Node.js"]'
 *               experiences:
 *                 type: string
 *                 description: JSON-stringified array of ExperienceDTO objects
 *                 example: '[]'
 *               themes:
 *                 type: string
 *                 description: JSON-stringified array of ThemeDefinition objects
 *                 example: '[]'
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile image (JPG or PNG)
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF only)
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized — token missing or invalid
 *       403:
 *         description: Forbidden — admin role required
 */
function handleUpdateProfile(req, res) {
  const updated = { ...DEMO_PROFILE, ...req.body, updated_at: new Date().toISOString() };
  return res.json({ profile: updated });
}
router.put('/profile/saveUpdateMyProfile', demoAuth, handleUpdateProfile);
router.put('/v1/profile',                  demoAuth, handleUpdateProfile);

/**
 * @swagger
 * /api/profile/me/resume:
 *   get:
 *     summary: Get signed download URL for resume (admin only)
 *     description: |
 *       Returns a time-limited signed URL for the resume PDF stored in Supabase Storage.
 *       In demo mode, returns a direct asset path.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:        { type: string, example: "assets/Rohit.Nair.pdf" }
 *                 expires_in: { type: integer, example: 600, description: Seconds until URL expires }
 *       404:
 *         description: No resume on file
 */
router.get('/profile/me/resume', demoAuth, (req, res) => {
  return ok(res, { url: 'assets/Rohit.Nair.pdf', expires_in: 600 }, 'Resume URL generated');
});
router.get('/v1/profile/resume', demoAuth, (req, res) => {
  return ok(res, { url: 'assets/Rohit.Nair.pdf', expires_in: 600 }, 'Resume URL generated');
});

/**
 * @swagger
 * /api/profile/me/resume:
 *   delete:
 *     summary: Delete resume from storage (admin only)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume deleted, updated profile returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       404:
 *         description: No resume on file
 */
router.delete('/profile/me/resume', demoAuth, (req, res) => {
  return res.json({ profile: { ...DEMO_PROFILE, resume_url: null } });
});
router.delete('/v1/profile/resume', demoAuth, (req, res) => {
  return res.json({ profile: { ...DEMO_PROFILE, resume_url: null } });
});

// ═════════════════════════════════════════════════════════════════════════════
//   CONTACT / NOTIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/contact/send:
 *   post:
 *     summary: Submit the public contact form
 *     description: |
 *       Saves the message and (in production) emails the admin.
 *       In demo mode the message is accepted and discarded.
 *
 *       **Frontend wiring point:** Replace `of({success:true})` in
 *       `AppService.sendContactMessage()` with an HTTP POST to this endpoint.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, message]
 *             properties:
 *               first_name: { type: string, example: John }
 *               last_name:  { type: string, example: Doe }
 *               email:      { type: string, format: email, example: john@example.com }
 *               message:    { type: string, example: "I'd love to collaborate on a project!" }
 *     responses:
 *       200:
 *         description: Message received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string,  example: Message received successfully }
 */
function handleContactSend(req, res) {
  return ok(res, null, 'Message received successfully. (demo mode)');
}
router.post('/contact/send', handleContactSend);
router.post('/v1/contact',   handleContactSend);

/**
 * @swagger
 * /api/contact/notifications:
 *   get:
 *     summary: Get all contact notifications (admin only)
 *     description: |
 *       Returns the notification inbox — contact form submissions listed newest first.
 *
 *       **Frontend wiring point:** Replace `of(MOCK_NOTIFICATIONS)` in
 *       `AppService.getNotifications()` with an HTTP GET to this endpoint.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 */
router.get('/contact/notifications', demoAuth, (req, res) => {
  return res.json(DEMO_NOTIFICATIONS);
});

/**
 * @swagger
 * /api/contact/notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: notif-001 }
 *     responses:
 *       200:
 *         description: Updated notification list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 *       404:
 *         description: Notification not found
 */
router.put('/contact/notifications/:id/read', demoAuth, (req, res) => {
  const updated = {
    ...DEMO_NOTIFICATIONS,
    notificationList: DEMO_NOTIFICATIONS.notificationList.map(n =>
      n.id === req.params.id ? { ...n, is_read: true } : n
    ),
  };
  return res.json(updated);
});

/**
 * @swagger
 * /api/contact/delete/{id}:
 *   delete:
 *     summary: Delete a contact notification (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: notif-001 }
 *     responses:
 *       200:
 *         description: Deleted — updated notification list returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 *       404:
 *         description: Notification not found
 */
router.delete('/contact/delete/:id', demoAuth, (req, res) => {
  const updated = {
    ...DEMO_NOTIFICATIONS,
    notificationList: DEMO_NOTIFICATIONS.notificationList.filter(n => n.id !== req.params.id),
  };
  return res.json(updated);
});

// ═════════════════════════════════════════════════════════════════════════════
//   CHAT  —  /api/v1/chat/*
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/chat/send:
 *   post:
 *     summary: Send a message to the AI chatbot
 *     description: |
 *       The AI reads the portfolio context and responds in markdown.
 *
 *       **Frontend wiring point:** Replace `of({response: reply})` in
 *       `AppService.aiChat()` with an HTTP POST to this endpoint.
 *
 *       In production the backend calls OpenAI with the profile as system context.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 example: What tech stack does this boilerplate use?
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: seed-session-001
 *               userId:
 *                 type: string
 *                 nullable: true
 *                 example: demo-user-001
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:            { type: boolean, example: true }
 *                 statusCode:         { type: integer, example: 200 }
 *                 message:            { type: string,  example: Message sent successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     response:           { type: string, example: "This boilerplate uses Angular 19, PrimeNG, Highcharts…" }
 *                     sessionId:          { type: string, example: seed-session-001 }
 *                     limitReached:       { type: boolean, example: false }
 *                     remainingQuestions: { type: integer, example: 8 }
 */
router.post('/v1/chat/send', (req, res) => {
  const { sessionId } = req.body;
  return ok(res, {
    response: botReply(),
    sessionId: sessionId || `demo-sess-${Date.now()}`,
    limitReached: false,
    remainingQuestions: Math.floor(Math.random() * 5) + 5,
  }, 'Message sent successfully');
});

/**
 * @swagger
 * /api/v1/chat/sessions:
 *   get:
 *     summary: Get all chat sessions for the current user
 *     description: |
 *       Returns the session list sorted newest-first. In the frontend the chat widget
 *       shows these in its history panel.
 *
 *       **Frontend wiring point:** Replace `of(loadSessions())` in
 *       `ChatApiService.getSessions()` with an HTTP GET to this endpoint.
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Session list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:    { type: boolean }
 *                 statusCode: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatSession'
 */
router.get('/v1/chat/sessions', (req, res) => {
  return ok(res, DEMO_CHAT_SESSIONS, 'Sessions retrieved successfully');
});

/**
 * @swagger
 * /api/v1/chat/sessions/{id}:
 *   get:
 *     summary: Get a single chat session by ID
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: seed-session-001 }
 *     responses:
 *       200:
 *         description: Chat session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/ChatSession'
 *       404:
 *         description: Session not found
 */
router.get('/v1/chat/sessions/:id', (req, res) => {
  const session = DEMO_CHAT_SESSIONS.find(s => s.id === req.params.id) || DEMO_CHAT_SESSIONS[0];
  return ok(res, session, 'Session retrieved successfully');
});

/**
 * @swagger
 * /api/v1/chat/sessions/{id}:
 *   delete:
 *     summary: Delete a chat session
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: seed-session-001 }
 *     responses:
 *       200:
 *         description: Session deleted
 */
router.delete('/v1/chat/sessions/:id', (req, res) => {
  return ok(res, { deleted: req.params.id }, 'Session deleted successfully');
});

/**
 * @swagger
 * /api/v1/chat/sessions:
 *   delete:
 *     summary: Delete ALL chat sessions (admin only)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All sessions deleted
 */
router.delete('/v1/chat/sessions', demoAuth, (req, res) => {
  return ok(res, { deleted: DEMO_CHAT_SESSIONS.length }, 'All sessions deleted');
});

/**
 * @swagger
 * /api/v1/chat/stats:
 *   get:
 *     summary: Get chat statistics (admin only)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSessions:        { type: integer, example: 38 }
 *                     totalMessages:        { type: integer, example: 224 }
 *                     adminSessions:        { type: integer, example: 12 }
 *                     guestSessions:        { type: integer, example: 26 }
 *                     avgMessagesPerSession: { type: number, example: 5.9 }
 */
router.get('/v1/chat/stats', demoAuth, (req, res) => {
  return ok(res, DEMO_CHAT_STATS, 'Chat statistics retrieved successfully');
});

/**
 * @swagger
 * /api/v1/chat/balance:
 *   get:
 *     summary: Get OpenAI cost balance (admin only)
 *     description: |
 *       Returns the current OpenAI spend vs. the configured hard limit.
 *       In demo mode, returns static dummy values.
 *
 *       **Frontend wiring point:** Replace `of(MOCK_BALANCE)` in
 *       `ChatApiService.getBalance()` with an HTTP GET to this endpoint.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/BalanceResponse'
 */
router.get('/v1/chat/balance', demoAuth, (req, res) => {
  return ok(res, DEMO_BALANCE, 'Balance retrieved');
});

/**
 * @swagger
 * /api/v1/chat/usage:
 *   get:
 *     summary: Get AI token usage breakdown (admin only)
 *     description: |
 *       Returns token counts, costs, trend over time, per-model breakdown,
 *       per-role breakdown, and per-session breakdown — all in one call.
 *
 *       **Frontend wiring point:** Replace `of(MOCK_USAGE_RESPONSE)` in
 *       `ChatApiService.getUsage()` with an HTTP GET to this endpoint.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: string, example: 14d }
 *         description: Time range (e.g. 7d, 14d, 30d)
 *     responses:
 *       200:
 *         description: Usage data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/UsageResponse'
 */
router.get('/v1/chat/usage', demoAuth, (req, res) => {
  return ok(res, DEMO_USAGE, 'Usage data retrieved');
});

// ═════════════════════════════════════════════════════════════════════════════
//   ANALYTICS  —  /api/v1/analytics/*
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Full analytics dashboard — all metrics in one call (admin only)
 *     description: |
 *       Aggregates page views, visitor stats, geographic data, device breakdown,
 *       traffic sources, and top pages into a single response.
 *       In production this calls the Google Analytics 4 Data API.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, example: 7daysAgo }
 *         description: GA4 date expression or ISO date
 *       - in: query
 *         name: endDate
 *         schema: { type: string, example: today }
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/AnalyticsDashboard'
 */
router.get('/v1/analytics/dashboard', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD, 'Analytics dashboard data retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/pageviews:
 *   get:
 *     summary: Page views over time (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, example: 7daysAgo }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, example: today }
 *     responses:
 *       200:
 *         description: Page view time series
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:      { type: string, example: "20250611" }
 *                       pageViews: { type: integer, example: 127 }
 *                       sessions:  { type: integer, example: 89 }
 */
router.get('/v1/analytics/pageviews', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.pageViews, 'Page views retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/visitors:
 *   get:
 *     summary: Visitor statistics (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated visitor metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:         { type: integer, example: 1247 }
 *                     newUsers:           { type: integer, example: 856 }
 *                     activeUsers:        { type: integer, example: 423 }
 *                     sessions:           { type: integer, example: 1580 }
 *                     avgSessionDuration: { type: number,  example: 185.5 }
 *                     bounceRate:         { type: number,  example: 0.42 }
 */
router.get('/v1/analytics/visitors', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.visitorStats, 'Visitor stats retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/geographic:
 *   get:
 *     summary: Geographic breakdown — countries and cities (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Geographic data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       country:  { type: string, example: United States }
 *                       city:     { type: string, example: New York }
 *                       users:    { type: integer, example: 245 }
 *                       sessions: { type: integer, example: 380 }
 */
router.get('/v1/analytics/geographic', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.geographic, 'Geographic data retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/devices:
 *   get:
 *     summary: Device and OS breakdown (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       device:   { type: string, enum: [desktop, mobile, tablet], example: desktop }
 *                       os:       { type: string, example: Windows }
 *                       users:    { type: integer, example: 580 }
 *                       sessions: { type: integer, example: 890 }
 */
router.get('/v1/analytics/devices', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.devices, 'Device data retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/traffic:
 *   get:
 *     summary: Traffic source breakdown (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Traffic sources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       source:   { type: string, example: google }
 *                       medium:   { type: string, example: organic }
 *                       sessions: { type: integer, example: 680 }
 *                       users:    { type: integer, example: 450 }
 */
router.get('/v1/analytics/traffic', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.traffic, 'Traffic sources retrieved');
});

/**
 * @swagger
 * /api/v1/analytics/pages:
 *   get:
 *     summary: Top pages by views (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top pages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:        { type: string, example: / }
 *                       title:       { type: string, example: Home }
 *                       pageViews:   { type: integer, example: 1250 }
 *                       avgDuration: { type: number,  example: 145.5 }
 */
router.get('/v1/analytics/pages', demoAuth, (req, res) => {
  return ok(res, DEMO_ANALYTICS_DASHBOARD.topPages, 'Top pages retrieved');
});

// ═════════════════════════════════════════════════════════════════════════════
//   POSTS  —  /api/v1/posts/*
// ═════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: List all published posts (paginated, public)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *       - in: query
 *         name: tag
 *         schema: { type: string, example: Angular }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: signals }
 *     responses:
 *       200:
 *         description: Paginated post list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:      { type: array, items: { $ref: '#/components/schemas/Post' } }
 *                     total:      { type: integer, example: 2 }
 *                     page:       { type: integer, example: 1 }
 *                     limit:      { type: integer, example: 12 }
 *                     totalPages: { type: integer, example: 1 }
 */
router.get('/v1/posts', (req, res) => {
  return ok(res, publishedPosts(req.query), 'Posts retrieved');
});

/**
 * @swagger
 * /api/v1/posts/featured:
 *   get:
 *     summary: Get featured posts for the homepage (public)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 3 }
 *     responses:
 *       200:
 *         description: Featured posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 */
router.get('/v1/posts/featured', (req, res) => {
  const limit = parseInt(req.query.limit || '3');
  const featured = DEMO_POSTS.filter(p => p.is_featured && p.status === 'published').slice(0, limit);
  return ok(res, featured, 'Featured posts retrieved');
});

/**
 * @swagger
 * /api/v1/posts/admin/all:
 *   get:
 *     summary: Get all posts including drafts (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published, archived] }
 *     responses:
 *       200:
 *         description: All posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts: { type: array, items: { $ref: '#/components/schemas/Post' } }
 *                     total: { type: integer }
 */
router.get('/v1/posts/admin/all', demoAuth, (req, res) => {
  let posts = [...DEMO_POSTS];
  if (req.query.status) posts = posts.filter(p => p.status === req.query.status);
  return ok(res, { posts, total: posts.length }, 'Admin posts retrieved');
});

/**
 * @swagger
 * /api/v1/posts/upload/cover:
 *   post:
 *     summary: Upload a cover image for a post (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPG, PNG, WebP)
 *     responses:
 *       200:
 *         description: Uploaded image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:  { type: string, example: "https://storage.example.com/covers/demo-cover.jpg" }
 *                     path: { type: string, example: "covers/demo-cover.jpg" }
 */
router.post('/v1/posts/upload/cover', demoAuth, (req, res) => {
  return ok(res, {
    url: 'https://placehold.co/1200x630/1a1a2e/ffffff?text=Cover+Image',
    path: `covers/demo-cover-${Date.now()}.jpg`,
  }, 'Cover uploaded');
});

/**
 * @swagger
 * /api/v1/posts/slug/{slug}:
 *   get:
 *     summary: Get a single published post by slug (public)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, example: token-driven-theme-engine-angular }
 *     responses:
 *       200:
 *         description: Post data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found or not published
 */
router.get('/v1/posts/slug/:slug', (req, res) => {
  const post = DEMO_POSTS.find(p => p.slug === req.params.slug && p.status === 'published');
  if (!post) return fail(res, 404, 'Post not found');
  return ok(res, post, 'Post retrieved');
});

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:           { type: string, example: "My New Post" }
 *               content:         { type: string, example: "<p>Post content here…</p>" }
 *               content_raw:     { type: string }
 *               excerpt:         { type: string }
 *               status:          { type: string, enum: [draft, published, archived], default: draft }
 *               is_featured:     { type: boolean, default: false }
 *               week_number:     { type: integer }
 *               tags:            { type: array, items: { type: string } }
 *               cover_image_url: { type: string }
 *               linkedin_url:    { type: string }
 *               seo_title:       { type: string }
 *               seo_description: { type: string }
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 */
router.post('/v1/posts', demoAuth, (req, res) => {
  const newPost = {
    id: `post-${Date.now()}`,
    slug: (req.body.title || 'untitled').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    status: 'draft',
    is_featured: false,
    view_count: 0,
    impressions: 0,
    author_id: 'demo-user-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...req.body,
  };
  return created(res, newPost, 'Post created');
});

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a post (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid, example: post-001 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of post fields to update
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.put('/v1/posts/:id', demoAuth, (req, res) => {
  const post = DEMO_POSTS.find(p => p.id === req.params.id) || DEMO_POSTS[0];
  return ok(res, { ...post, ...req.body, updated_at: new Date().toISOString() }, 'Post updated');
});

/**
 * @swagger
 * /api/v1/posts/{id}/impressions:
 *   patch:
 *     summary: Update LinkedIn impression count (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: post-001 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               impressions: { type: integer, example: 9500 }
 *     responses:
 *       200:
 *         description: Impressions updated
 */
router.patch('/v1/posts/:id/impressions', demoAuth, (req, res) => {
  return ok(res, { id: req.params.id, impressions: req.body.impressions }, 'Impressions updated');
});

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post (admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: post-001 }
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete('/v1/posts/:id', demoAuth, (req, res) => {
  return ok(res, { deleted: req.params.id }, 'Post deleted');
});

/**
 * @swagger
 * /api/v1/posts/{id}/view:
 *   post:
 *     summary: Track a page view for a post (public)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: post-001 }
 *     responses:
 *       200:
 *         description: View tracked
 */
router.post('/v1/posts/:id/view', (req, res) => {
  return ok(res, { id: req.params.id, tracked: true }, 'View tracked');
});

// ─────────────────────────────────────────────────────────────────────────────

module.exports = router;
