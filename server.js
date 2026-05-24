import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './database.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'kural_secret_key_2026_xyz_poetry';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// ========== Auth Endpoints ==========

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, secret_code } = req.body;

  if (!name || !email || !secret_code) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = await getDb();
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Writer with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const secret_code_hash = await bcrypt.hash(secret_code, salt);

    const result = await db.run(
      'INSERT INTO users (name, email, secret_code_hash) VALUES (?, ?, ?)',
      [name, email, secret_code_hash]
    );

    const userId = result.lastID;
    const token = jwt.sign({ id: userId, name, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, secret_code } = req.body;

  if (!email || !secret_code) {
    return res.status(400).json({ error: 'Email and secret code are required' });
  }

  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or secret code' });
    }

    const isMatch = await bcrypt.compare(secret_code, user.secret_code_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or secret code' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// ========== Blog Endpoints ==========

app.get('/api/blogs', async (req, res) => {
  try {
    const db = await getDb();
    const blogs = await db.all('SELECT * FROM blogs WHERE status = ? ORDER BY created_at DESC', ['published']);
    res.json(blogs);
  } catch (err) {
    console.error('Fetch blogs error:', err);
    res.status(500).json({ error: 'Server error fetching blogs' });
  }
});

app.get('/api/blogs/drafts', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const drafts = await db.all(
      'SELECT * FROM blogs WHERE author_id = ? AND status = ? ORDER BY created_at DESC',
      [req.user.id, 'draft']
    );
    res.json(drafts);
  } catch (err) {
    console.error('Fetch drafts error:', err);
    res.status(500).json({ error: 'Server error fetching drafts' });
  }
});

app.post('/api/blogs', authenticateToken, async (req, res) => {
  const { title, content, image_url, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const blogStatus = status === 'draft' ? 'draft' : 'published';

  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO blogs (title, content, image_url, author_id, author_name, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content || '', image_url || null, req.user.id, req.user.name, blogStatus]
    );

    const blogId = result.lastID;
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', [blogId]);
    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Server error creating blog' });
  }
});

app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, image_url, status } = req.body;

  try {
    const db = await getDb();
    const existingBlog = await db.get('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (existingBlog.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this blog' });
    }

    const updatedTitle = title !== undefined ? title : existingBlog.title;
    const updatedContent = content !== undefined ? content : existingBlog.content;
    const updatedImageUrl = image_url !== undefined ? image_url : existingBlog.image_url;
    const updatedStatus = status !== undefined ? status : existingBlog.status;

    await db.run(
      'UPDATE blogs SET title = ?, content = ?, image_url = ?, status = ? WHERE id = ?',
      [updatedTitle, updatedContent, updatedImageUrl, updatedStatus, id]
    );

    const updatedBlog = await db.get('SELECT * FROM blogs WHERE id = ?', [id]);
    res.json(updatedBlog);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ error: 'Server error updating blog' });
  }
});

app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const existingBlog = await db.get('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (existingBlog.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await db.run('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: 'Server error deleting blog' });
  }
});

// ========== Image Upload (Base64 for Vercel) ==========

app.post('/api/upload', authenticateToken, async (req, res) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // On Vercel, we store images as base64 data URIs (no persistent filesystem)
  // The imageData should already be a data: URL from the frontend
  res.json({ fileUrl: imageData });
});

// ========== AI Analyser Endpoints ==========

app.post('/api/blogs/analyze', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const text = content || '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const hasTamil = /[\u0b80-\u0bff]/.test(text + (title || ''));
  const hasEnglish = /[a-zA-Z]/.test(text + (title || ''));
  let langMix = 'English';
  if (hasTamil && hasEnglish) {
    langMix = 'Bilingual (Tamil & English / Tanglish)';
  } else if (hasTamil) {
    langMix = 'Tamil (தமிழ்)';
  }

  let tone = 'Reflective';
  let score = 75;
  const suggestions = [];

  const lowerTitle = (title || '').toLowerCase();

  if (lowerTitle.includes('cyber') || lowerTitle.includes('technology') || lowerTitle.includes('silicon') || lowerTitle.includes('neural') || lowerTitle.includes('bytes') || lowerTitle.includes('code')) {
    tone = 'Modern Cybernetic & Analytical';
    score = 88;
  } else if (lowerTitle.includes('echo') || lowerTitle.includes('silent') || lowerTitle.includes('thought') || lowerTitle.includes('philosophy') || lowerTitle.includes('weight')) {
    tone = 'Philosophical & Lyrical';
    score = 92;
  } else if (hasTamil && (lowerTitle.includes('கவிதை') || lowerTitle.includes('குரல்') || lowerTitle.includes('மறுமலர்ச்சி') || lowerTitle.includes('மொழி'))) {
    tone = 'Tamil Classical Poetic';
    score = 95;
  } else if (wordCount > 100) {
    tone = 'Insightful Creative Essay';
    score = 82;
  }

  if (wordCount < 10) {
    suggestions.push('Your content is too brief. Expand on your title with at least 3-4 introductory sentences.');
  } else if (wordCount < 50) {
    suggestions.push('Your thoughts are starting to shape! Add a supporting example or a personal anecdote to make it neat.');
  } else {
    suggestions.push('Good narrative length. Try adding bullet points or subheadings to make the layout easier to scan.');
  }

  if (hasTamil && !text.includes('குறள்') && !text.includes('kural')) {
    suggestions.push('Recommendation: Insert a classical Tirukkural couplet at the beginning to set a profound thematic tone.');
  }

  if (!text.endsWith('?') && !text.endsWith('.') && wordCount > 0) {
    suggestions.push('Sentence structure check: Ensure your blog ends with proper punctuation to complete the thought clearly.');
  }

  if (suggestions.length < 3) {
    suggestions.push('Introduce a rhetorical question in the second paragraph to increase reader engagement.');
  }

  res.json({
    metrics: {
      wordCount,
      charCount,
      language: langMix,
      tone,
      score: Math.min(Math.max(score + Math.round((wordCount / 50)), 50), 99)
    },
    suggestions
  });
});

app.post('/api/blogs/complete', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const lowerTitle = (title || '').toLowerCase();

  let completion = '';

  if (lowerTitle.includes('echo') || lowerTitle.includes('silent')) {
    completion = "\n\nIn this digital architecture, we often forget that silence itself is a language. To break the echo chamber, we must not merely shout louder, but learn to listen to the spaces between the signals. The future of communication lies in these quiet intervals, where genuine connections are forged away from the algorithm's noise. It is there, in the unsaid, that Kural finds its truest resonance.";
  } else if (lowerTitle.includes('cyber') || lowerTitle.includes('technology') || lowerTitle.includes('silicon')) {
    completion = "\n\nWhen we translate ancient couplets into programming arrays, we breathe soul into the machine. Silicon learns to speak in metaphors, and compiler instructions start to resemble the metered rhythms of classical Tamil grammar. This convergence is not just automation; it is a digital renaissance—a cyber-poetry that bridges the gap between historical heritage and futuristic neural networks.";
  } else if (lowerTitle.includes('தமிழ்') || lowerTitle.includes('குரல்') || lowerTitle.includes('கவிதை') || /[\u0b80-\u0bff]/.test(title)) {
    completion = "\n\nவார்த்தைகளின் வலிமை மொழியின் எல்லையைத் தாண்டியது. நவீனத் தொழில்நுட்பத்தின் மூலம் நமது பாரம்பரிய சிந்தனைகளையும் குறள் வரிகளையும் உலகிற்கு கொண்டு சேர்ப்பதே இன்றைய இளைய தலைமுறையின் முக்கிய கடமையாகும். கணினித் திரைகளில் தமிழ் எழுத்துக்கள் ஒளிரும்போது, நமது கலாச்சாரம் புத்தொளி பெற்று, புதிய வடிவங்களில் உலகம் முழுவதும் பரவுகிறது.";
  } else if (lowerTitle.includes('weight') || lowerTitle.includes('whisper') || lowerTitle.includes('syllable')) {
    completion = "\n\nA single whispered syllable holds the capacity to alter trajectories. In KURAL, every letter matters, just like the precise syllables of a classic couplet. When we speak without hesitation, we allow our inner thoughts to materialize clearly. This transparency of voice is what connects us, breaking down barriers and establishing a standard of authentic storytelling.";
  } else {
    completion = "\n\nTo write clearly is to think clearly. By structuring our arguments with logical progression and emotional depth, we enable our readers to share our vision. In the end, the best content is that which speaks directly to the reader's human experience, bypassing hesitation and unlocking authentic expression. Kural serves as the canvas where this alchemy takes place.";
  }

  res.json({ completion });
});

// Export the Express app for both Vercel serverless and local dev
export default app;
