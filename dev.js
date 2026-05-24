// Local development server entry point
// This file is NOT used in Vercel deployment — only for local dev with `npm run dev`
import app from './server.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Kural server running locally on port ${PORT}`);
});
