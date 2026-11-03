import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'site-config.json');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Password111000';
const TOKEN_SECRET =
  process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function safeTimingEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB) && a.length === b.length;
}

function createAdminToken(username: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({ sub: username, exp: expiresAt })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  return {
    token: `${payload}.${signature}`,
    expiresAt,
  };
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');

  if (!safeTimingEqual(signature, expectedSig)) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as { sub?: string; exp?: number };
    if (!decoded.exp || Date.now() > decoded.exp) {
      return false;
    }
    return decoded.sub === ADMIN_USERNAME;
  } catch {
    return false;
  }
}

function extractBearerToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
  return authHeader.slice('Bearer '.length).trim();
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Please sign in as Admin.' });
    return;
  }
  next();
}

async function readStoredConfig(): Promise<Record<string, unknown> | null> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function writeStoredConfig(data: Record<string, unknown>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function clearStoredConfig(): Promise<void> {
  try {
    await fs.unlink(CONFIG_FILE);
  } catch {
    // Ignore if file does not exist
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // Public endpoint: read saved official tariff & policy overrides
  app.get('/api/config', async (_req: Request, res: Response) => {
    const saved = await readStoredConfig();
    res.json({ config: saved });
  });

  // Admin Login endpoint
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const body = req.body as { username?: unknown; password?: unknown };
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const validUser = safeTimingEqual(username, ADMIN_USERNAME);
    const validPass = safeTimingEqual(password, ADMIN_PASSWORD);

    if (!validUser || !validPass) {
      res.status(401).json({
        ok: false,
        error: 'Invalid username or password. Only authorized administrators can modify fare policies.',
      });
      return;
    }

    const { token, expiresAt } = createAdminToken(ADMIN_USERNAME);
    res.json({ ok: true, token, expiresAt });
  });

  // Verify existing admin session token
  app.get('/api/admin/session', (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    res.json({ authenticated: verifyAdminToken(token) });
  });

  // Protected Admin endpoint: update fare rates, policies, or contact info
  app.put('/api/admin/config', requireAdminAuth, async (req: Request, res: Response) => {
    const body = req.body as {
      pricingConfig?: unknown;
      contactConfig?: unknown;
    };

    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid configuration payload.' });
      return;
    }

    await writeStoredConfig({
      pricingConfig: body.pricingConfig ?? null,
      contactConfig: body.contactConfig ?? null,
      updatedAt: new Date().toISOString(),
    });

    res.json({ ok: true });
  });

  // Protected Admin endpoint: reset to official default tariffs
  app.delete('/api/admin/config', requireAdminAuth, async (_req: Request, res: Response) => {
    await clearStoredConfig();
    res.json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JMD Tour & Travels server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
