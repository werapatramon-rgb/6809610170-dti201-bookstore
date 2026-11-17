import express from 'express';
import { randomUUID } from 'node:crypto';
import { createBookStore } from './book-store.js';

const ALLOWED_FIELDS = new Set(['title', 'author', 'sourceType', 'summary']);
const VALID_SOURCE_TYPES = new Set(['book', 'documentation', 'course']);

function problem(res, req, status, title, extra = {}) {
  return res.status(status).type('application/problem+json').json({
    type: 'about:blank',
    title,
    status,
    requestId: req.requestId,
    ...extra
  });
}

function readCommand(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: { body: ['Request body must be a JSON object'] } };
  }
  const errors = {};
  const command = {};

  for (const key of Object.keys(body)) {
    if (!ALLOWED_FIELDS.has(key)) {
      errors[key] = [`Unexpected field: ${key}`];
    }
  }

  const requiredFields = ['title', 'author', 'sourceType', 'summary'];
  for (const field of requiredFields) {
    if (body[field] === undefined) {
      if (!partial) errors[field] = [`${field} is required`];
      continue;
    }
    if (typeof body[field] !== 'string') {
      errors[field] = [`${field} must be a string`];
      continue;
    }
    const trimmed = body[field].trim();
    if (!trimmed) {
      errors[field] = [`${field} cannot be empty`];
      continue;
    }
    if (field === 'title' && trimmed.length < 3) {
      errors.title = ['title must be at least 3 characters'];
      continue;
    }
    if (field === 'sourceType' && !VALID_SOURCE_TYPES.has(trimmed)) {
      errors.sourceType = ['sourceType must be book, documentation, or course'];
      continue;
    }
    command[field] = trimmed;
  }

  if (partial && Object.keys(command).length === 0 && Object.keys(errors).length === 0) {
    errors.body = ['At least one valid field is required for update'];
  }

  return Object.keys(errors).length > 0 ? { errors } : { command };
}

export function createApp(store = createBookStore()) {
  const app = express();
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('X-Request-Id', req.requestId);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.param('id', (req, res, next, id) => {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return problem(res, req, 422, 'Invalid book ID format');
    }
    next();
  });

  app.get('/api/books', async (req, res, next) => {
    try {
      const rawLimit = req.query.limit ?? '20';
      const rawOffset = req.query.offset ?? '0';
      const take = Number(rawLimit);
      const skip = Number(rawOffset);

      if (!Number.isInteger(take) || take < 1 || take > 100 || !Number.isInteger(skip) || skip < 0) {
        return problem(res, req, 422, 'Invalid pagination parameters');
      }

      const data = await store.list({ limit: take, offset: skip });
      res.json({ data, pagination: { limit: take, offset: skip } });
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/books/:id', async (req, res, next) => {
    try {
      const book = await store.find(req.params.id);
      if (!book) return problem(res, req, 404, 'Book not found');
      res.json({ data: book });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/books', async (req, res, next) => {
    try {
      const { command, errors } = readCommand(req.body, { partial: false });
      if (errors) return problem(res, req, 422, 'Validation failed', { errors });

      const book = await store.insert(command);
      res.status(201).location(`/api/books/${book.id}`).json({ data: book });
    } catch (err) {
      next(err);
    }
  });

  app.patch('/api/books/:id', async (req, res, next) => {
    try {
      const { command, errors } = readCommand(req.body, { partial: true });
      if (errors) return problem(res, req, 422, 'Validation failed', { errors });

      const book = await store.update(req.params.id, command);
      if (!book) return problem(res, req, 404, 'Book not found');
      res.json({ data: book });
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/books/:id', async (req, res, next) => {
    try {
      const removed = await store.remove(req.params.id);
      if (!removed) return problem(res, req, 404, 'Book not found');
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, _next) => {
    if (err?.type === 'entity.parse.failed') return problem(res, req, 400, 'Malformed JSON body');
    if (err?.type === 'entity.too.large') return problem(res, req, 413, 'Payload too large');
    if (err?.code === 11000) return problem(res, req, 409, 'Duplicate book title');
    if (err?.name === 'ValidationError') return problem(res, req, 422, 'Validation failed');
    return problem(res, req, 500, 'Internal server error');
  });

  return app;
}
