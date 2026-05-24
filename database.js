import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// On Vercel serverless, use /tmp for writable storage
// Locally, use the server directory
const isVercel = process.env.VERCEL === '1';
const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
const dbPath = isVercel
  ? path.join(os.tmpdir(), 'kural.db')
  : path.join(currentFileDir, 'kural.db');

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign key constraints
  await dbInstance.get('PRAGMA foreign_keys = ON');

  // Create Users table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      secret_code_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Blogs table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      author_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      status TEXT CHECK(status IN ('published', 'draft')) DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  return dbInstance;
}
