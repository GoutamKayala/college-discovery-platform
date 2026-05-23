import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  getColleges,
  getCollegeById,
  registerUser,
  getUserByEmail,
  getUserById,
  saveCollege,
  unsaveCollege,
  getSavedColleges,
  saveComparison,
  getSavedComparisons,
  deleteComparison,
  addReview,
  predictColleges,
  loadDatabase
} from './server/db.js';



// Load initial DB to ensure folders are created and seeded on load
loadDatabase();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini Client', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined in the environment. AI features will run in simulation fallback.');
}

// Helper to hash password
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Simple authentication middleware
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token missing' });
    return;
  }

  try {
    // Decrypt simple token format: `tkn-<userId>-<timestamp>`
    if (!token.startsWith('tkn-')) {
      res.status(403).json({ error: 'Invalid token structure' });
      return;
    }
    const parts = token.split('-');
    const userId = parts[1];
    const user = getUserById(`usr-${userId}`);
    if (!user) {
      res.status(403).json({ error: 'User does not exist' });
      return;
    }
    // Set user on request
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Authentication failed' });
  }
}

// ============================================
// REST API ROUTES
// ============================================

// 1. Login/Register Endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  const hash = hashPassword(password);
  const newUser = registerUser(name, email, hash);
  if (!newUser) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  // Generate simple persistent session token
  const idValue = newUser.id.split('-')[1];
  const token = `tkn-${idValue}-${Date.now()}`;
  res.status(201).json({
    message: 'User registered successfully!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const hash = hashPassword(password);
  if (user.passwordHash !== hash) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  // Generate simple persistent session token
  const idValue = user.id.split('-')[1];
  const token = `tkn-${idValue}-${Date.now()}`;
  res.status(200).json({
    message: 'Logged in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Auth query user data using token
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = (req as any).user;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// 2. College Search and Filtering API
app.get('/api/colleges', (req, res) => {
  const q = req.query.q as string;
  const location = req.query.location as string;
  const course = req.query.course as string;
  const minFees = req.query.minFees ? Number(req.query.minFees) : undefined;
  const maxFees = req.query.maxFees ? Number(req.query.maxFees) : undefined;
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as 'asc' | 'desc';
  const collegeType = req.query.collegeType as string;
  const exam = req.query.exam as string;

  const list = getColleges({ q, location, course, minFees, maxFees, sortBy, sortOrder, collegeType, exam });
  res.json(list);
});

// Single College API
app.get('/api/colleges/:id', (req, res) => {
  const id = req.params.id;
  const college = getCollegeById(id);
  if (!college) {
    res.status(444).json({ error: 'College not found' });
    return;
  }
  res.json(college);
});

// Submit College Review API
app.post('/api/colleges/:id/review', (req, res) => {
  const id = req.params.id;
  const { userName, rating, comment } = req.body;
  if (!userName || !rating || !comment) {
    res.status(400).json({ error: 'All fields (userName, rating, comment) are required.' });
    return;
  }

  const updatedCollege = addReview(id, userName, Number(rating), comment);
  if (!updatedCollege) {
    res.status(404).json({ error: 'College not found.' });
    return;
  }

  res.status(201).json({
    message: 'Review added successfully!',
    reviews: updatedCollege.reviews,
    rating: updatedCollege.rating
  });
});

// 3. Saved Colleges Action Endpoints
app.post('/api/save-college', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const { collegeId, unsave } = req.body;

  if (!collegeId) {
    res.status(400).json({ error: 'collegeId is required' });
    return;
  }

  if (unsave) {
    unsaveCollege(user.id, collegeId);
    res.json({ success: true, saved: false, message: 'Unsaved successfully' });
  } else {
    saveCollege(user.id, collegeId);
    res.json({ success: true, saved: true, message: 'Saved successfully' });
  }
});

app.get('/api/save-college', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const list = getSavedColleges(user.id);
  res.json(list);
});

// 4. Saved Comparisons Engine Endpoint
app.post('/api/save-comparison', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const { collegeIds } = req.body;

  if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
    res.status(400).json({ error: 'At least 2 collegeIds are required to save a comparison.' });
    return;
  }

  const result = saveComparison(user.id, collegeIds);
  res.json({ success: true, message: result.message || 'Comparison saved successfully' });
});

app.get('/api/comparisons', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const list = getSavedComparisons(user.id);
  res.json(list);
});

app.delete('/api/comparisons/:id', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;
  deleteComparison(user.id, id);
  res.json({ success: true, message: 'Comparison removed successfully' });
});

// 5. Predictor Tool Algorithm
app.post('/api/predictor', (req, res) => {
  const { exam, rank } = req.body;
  if (!exam || rank === undefined || isNaN(Number(rank))) {
    res.status(400).json({ error: 'Valid exam name and rank number are required.' });
    return;
  }

  const results = predictColleges(exam, Number(rank));
  res.json(results);
});

// 6. Gemini-powered Personal Educational Counselor Endpoints
app.post('/api/ai/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Valid chat messages list is required.' });
    return;
  }

  // Get active subset of colleges to inject into the system context
  const targetColleges = getColleges({ sortBy: 'rating' }).slice(0, 15);
  const collegeContext = targetColleges.map(c => {
    return `- ${c.name} (${c.location}): Fees avg ₹${c.fees.toLocaleString()}/yr, rating ${c.rating}/5, placement ${c.placementPercentage}%, Avg salary ₹${c.averagePackage} LPA. Established ${c.establishedYear}. Main courses: ${c.courses.map(co => co.name).join(', ')}.`;
  }).join('\n');

  const systemInstruction = `You are "EduPath Assistant", a premium, senior educational career counsellor of India.
Use the following list of real premium colleges to answer queries honestly, professionally, and accurately:
${collegeContext}

IMPORTANT: 
1. If the student asks about other colleges, you can share general advice, but prefer steering them to explore our supported colleges.
2. Be highly encouraging, articulate, clear, and highlight placement records, budgets, and location benefits.
3. Keep answers concise, highly readable, structured in beautiful Markdown paragraphs or clean lists. Do not write too long.`;

  // Use Gemini Client if initialized
  if (ai) {
    try {
      // Map frontend prompt array to Gemini SDK messages format
      // Taking last 6 messages to stay fast and avoid token bloat
      const latestMessages = messages.slice(-6);
      const prompt = latestMessages[latestMessages.length - 1].content;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || "I am analyzing your preferences. Could you tell me more about your current exam scoring or rank?" });
    } catch (err: any) {
      console.error('Gemini generateContent error:', err);
      res.json({
        reply: "I apologize, I am temporarily overloaded. I can tell you that IIT Bombay, IIT Madras, and BITS Pilani are premier, high-rating selection options. Please try asking again in a moment, or filter our dynamic list columns!",
        error: err.message
      });
    }
  } else {
    // Expanded fallback mock assistant — covers a wide range of topics
    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let reply = '';

    if (lastMsg.includes('iit bombay') || lastMsg.includes('iitb')) {
      reply = "**IIT Bombay** is India's most prestigious tech institute. It requires a **JEE Advanced rank under 100** for CSE. Annual fees are ~₹2.2 Lakhs, and the average placement package is **₹25.8 LPA** with top recruiters like Google, Microsoft, and Goldman Sachs visiting every year.";
    } else if (lastMsg.includes('iit delhi') || lastMsg.includes('iitd')) {
      reply = "**IIT Delhi** is ranked among India's top 2 engineering institutes. JEE Advanced closing rank for CSE is around **150**. Fees are ~₹2.2 Lakhs/yr and average placement package is **₹24+ LPA**. It has excellent research facilities and a vibrant startup ecosystem.";
    } else if (lastMsg.includes('iit madras') || lastMsg.includes('iitm')) {
      reply = "**IIT Madras** is ranked #1 in India's NIRF rankings consistently. CSE cutoff is around JEE Advanced rank **200**. Average placement package is **₹26.2 LPA**. It is known for strong AI/ML research and has one's of India's best incubation centers.";
    } else if (lastMsg.includes('bits pilani') || lastMsg.includes('bits')) {
      reply = "**BITS Pilani** is a premier private institution with no JEE requirement — it uses the **BITSAT** exam (score 360+). Annual fees are ~₹5.5 Lakhs. The average placement stands at **₹23.2 LPA**. It is famous for its WILP and dual-degree programs.";
    } else if (lastMsg.includes('nit trichy') || lastMsg.includes('nit tiruchirappalli')) {
      reply = "**NIT Trichy** is the highest-ranked NIT in India. JEE Main closing rank for CSE (Home State) is ~**1,500**. Annual fees are ~₹1.5 Lakhs and placement average is around **₹20 LPA**. It has excellent industry connections in Tamil Nadu and South India.";
    } else if (lastMsg.includes('nit') || lastMsg.includes('national institute')) {
      reply = "**NITs (National Institutes of Technology)** are excellent government institutes. Top choices include NIT Trichy, NIT Warangal, and NIT Surathkal. Admission is through **JEE Main** (ranks 1,000–15,000 for CSE). Fees are ~₹1–2 Lakhs/yr with average placements of ₹15–22 LPA.";
    } else if (lastMsg.includes('iiit hyderabad') || lastMsg.includes('iiit-h')) {
      reply = "**IIIT Hyderabad** is India's top institute for Computer Science and AI. It offers **UGEE** and JEE-based admissions. Average placement is an outstanding **₹30.5 LPA** — the highest nationally. Programs in CSE, CSD, ECE, and CSAM are exceptional.";
    } else if (lastMsg.includes('iiit') || lastMsg.includes('triple i t')) {
      reply = "**IIITs (Indian Institutes of Information Technology)** are specialized for CS/IT. Top options: IIIT Hyderabad (₹30.5 LPA avg), IIIT Bangalore, IIIT Delhi, and IIIT Allahabad. Admissions are via JoSAA counselling using **JEE Main** scores.";
    } else if (lastMsg.includes('jadavpur') || lastMsg.includes('jU')) {
      reply = "**Jadavpur University, Kolkata** offers world-class engineering at virtually no cost — fees under ₹10,000/year! It is highly competitive with a state-level **WBJEE** exam. Average placement is ~₹18 LPA. Exceptional value for West Bengal students.";
    } else if (lastMsg.includes('dtu') || lastMsg.includes('delhi technological')) {
      reply = "**Delhi Technological University (DTU)** is a top Delhi state university. Admission is through **JEE Main** (Delhi quota rank around 3,000–5,000 for CSE). Annual fees are ~₹1.7 Lakhs and average placement is ~₹18–20 LPA with giants like Amazon, Adobe, and Deloitte.";
    } else if (lastMsg.includes('iit') || lastMsg.includes('jee advanced')) {
      reply = "The **IITs** are India's elite engineering institutes (Bombay, Delhi, Madras, Kanpur, Kharagpur, Roorkee, etc.). Admission requires **JEE Advanced** — typically a rank under 5,000 for core branches. Fees are ~₹2.2 Lakhs/yr with average placements of ₹20–26 LPA depending on branch and institute.";
    } else if (lastMsg.includes('fees') || lastMsg.includes('budget') || lastMsg.includes('cheap') || lastMsg.includes('affordable') || lastMsg.includes('low cost')) {
      reply = "For **low-budget quality education**, consider:\n- **Jadavpur University** — fees under ₹10,000/yr\n- **NITs** — ~₹1.5 Lakhs/yr\n- **IITs** — ~₹2.2 Lakhs/yr (with fee waivers for low-income families)\n- **Government/State Universities** — often ₹30,000–80,000/yr\n\nScholarships like **NSP** and **SC/ST waivers** can reduce costs further.";
    } else if (lastMsg.includes('placement') || lastMsg.includes('package') || lastMsg.includes('salary') || lastMsg.includes('lpa') || lastMsg.includes('recruit')) {
      reply = "**Top colleges ranked by placement packages:**\n- IIIT Hyderabad — ₹30.5 LPA avg\n- IIT Madras — ₹26.2 LPA avg\n- IIT Bombay — ₹25.8 LPA avg\n- IIT Delhi — ₹24.1 LPA avg\n- BITS Pilani — ₹23.2 LPA avg\n- NIT Trichy — ₹20 LPA avg\n\nShare your rank or exam score and I can narrow this down further!";
    } else if (lastMsg.includes('cse') || lastMsg.includes('computer science') || lastMsg.includes('software')) {
      reply = "**Best colleges for Computer Science Engineering (CSE):**\n- IIT Bombay, IIT Delhi, IIT Madras (JEE Advanced top 200)\n- IIIT Hyderabad (UGEE/JEE)\n- BITS Pilani (BITSAT 360+)\n- NIT Trichy, NIT Warangal (JEE Main rank < 5,000)\n- DTU Delhi (JEE Main Delhi rank < 5,000)\n\nAll have 90–100% placement rates for CSE graduates.";
    } else if (lastMsg.includes('jee main') || lastMsg.includes('jee mains')) {
      reply = "**JEE Main** is the gateway to NITs, IIITs, GFTIs, and some state colleges. Key cutoffs:\n- **CSE at top NITs** — rank under 5,000\n- **ECE at top NITs** — rank under 15,000\n- **IIITs (CSE)** — rank under 8,000\n\nJEE Main is held **twice yearly** (Jan & Apr). Top scorers (99+ percentile) qualify for JEE Advanced for IITs.";
    } else if (lastMsg.includes('rank') || lastMsg.includes('cutoff') || lastMsg.includes('score')) {
      reply = "Here is a quick **rank reference guide** for popular colleges:\n- IIT Bombay CSE: JEE Advanced < 100\n- IIT Delhi CSE: JEE Advanced < 150\n- NIT Trichy CSE: JEE Main < 1,500 (Home State)\n- IIIT Hyderabad CSE: JEE Main < 500 OR UGEE\n- BITS Pilani CSE: BITSAT score > 360\n- DTU Delhi CSE: JEE Main Delhi rank < 5,000\n\nWhat is your current rank or score? I can suggest options accordingly!";
    } else if (lastMsg.includes('ai') || lastMsg.includes('machine learning') || lastMsg.includes('data science')) {
      reply = "**Best colleges for AI / ML / Data Science:**\n- **IIIT Hyderabad** — CSD (CSE + Data Science) program, ₹30.5 LPA avg\n- **IIT Bombay** — BTech CSE with AI electives\n- **IIT Madras** — BS Data Science + BTech AI programs\n- **BITS Pilani** — CS with AI/ML minor\n- **Amrita University** — Dedicated B.Tech AI/ML program\n\nThe field is booming — Data Scientists earn ₹15–50 LPA at entry level!";
    } else if (lastMsg.includes('location') || lastMsg.includes('state') || lastMsg.includes('city') || lastMsg.includes('zone')) {
      reply = "**Colleges by location:**\n- **Mumbai/Pune** — IIT Bombay, VJTI, Pune University\n- **Delhi/NCR** — IIT Delhi, DTU, IIIT Delhi, Jawaharlal Nehru\n- **Hyderabad** — IIIT Hyderabad, BITS Hyderabad, Osmania University\n- **Chennai** — IIT Madras, CEG (Anna Univ), SASTRA\n- **Kolkata** — Jadavpur University, IIEST Shibpur\n- **Bangalore** — IISc, IIIT Bangalore, RV College\n\nWhich city or region are you targeting?";
    } else if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('hey') || lastMsg.includes('start') || lastMsg.includes('help')) {
      reply = "**Hello! Welcome to EduPath AI Counselor** 👋\n\nI can help you with:\n- Finding colleges matching your **JEE rank or BITSAT score**\n- Comparing **placements, fees, and courses**\n- Identifying **low-budget, high-quality** institutes\n- Understanding cutoffs for **IITs, NITs, IIITs, and BITS**\n\nTell me your exam, rank, budget, or preferred location and I'll guide you right away!";
    } else {
      reply = "I am here to help with your college search! Here are some things I can assist with:\n\n- **Best colleges for your JEE/BITSAT rank**\n- **Low-fee quality institutions** across India\n- **Top placement colleges** by average LPA\n- **Stream-specific** recommendations (CSE, ECE, Mech, AI/ML)\n- **State/city-based** college options\n\nTry asking something like: *'Best colleges for JEE Advanced rank 500'* or *'Affordable colleges in Tamil Nadu'*!";
    }

    res.json({ reply });
  }
});

// ============================================
// FRONTEND SERVING WITH VITE MIDDLEWARE / STATIC
// ============================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log('Initiated Vite Middleware.');
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduPath Fullstack Server listening on http://localhost:${PORT}`);
  });
}

startServer();
