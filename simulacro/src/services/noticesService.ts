import { randomUUID } from 'node:crypto';

export interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface NoticesChanges {
  title?: string;
  description?: string;
}

// Datos en memoria: se pierden cada vez que el servidor se reinicia.
const notices: Notice[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Guía pública del centro',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Normas de convivencia',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
];

export function list(page: number, limit: number, search?: string) {


  const start = (page - 1) * limit;
  let filteredNotices = notices;
  if (search) {
    filteredNotices = notices.filter((notice) =>
  notice.title.toLowerCase().includes(search.toLowerCase()), );
  }
  return {
    data: filteredNotices.slice(start, start + limit),
    pagination: { page, limit, total: filteredNotices.length },
  };
}

export function getById(id: string): Notice | undefined {
  return notices.find((notice) => notice.id === id);
}

export function create(title: string, description: string): Notice {
  const notice: Notice = {
    id: randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  notices.push(notice);
  return notice;
}

export function update(id: string, changes: NoticesChanges): Notice | undefined {
  const notice = getById(id);
  if (!notice) {
    return undefined;
  }
  if (changes.title !== undefined) {
    notice.title = changes.title;
  }
  if (changes.description !== undefined) {
    notice.description = changes.description;
  }
  return notice;
}