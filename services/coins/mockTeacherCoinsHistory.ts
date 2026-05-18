import {
  getPersistedMockEnrollmentEntriesSync,
  hydrateMockCoinsHistory,
} from '@/services/coins/mockCoinsHistoryStore';
import type { EnrollmentHistoryDTO } from '@/services/types';

const MOCK_DELAY_MS = 350;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Статическая демо-история (дополняется записями с экрана «Группы»). */
export const MOCK_ENROLLMENT_HISTORY_BASELINE: EnrollmentHistoryDTO[] = [
  { teacher_name: 'Демо Преподаватель', student_name: 'Иванов Иван Петрович', enrolled_coins: 12, date: '2025-03-28T14:20:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Петрова Мария Сергеевна', enrolled_coins: 8, date: '2025-03-28T14:18:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Сидоров Алексей Игоревич', enrolled_coins: 15, date: '2025-03-28T12:05:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Козлова Анна Владимировна', enrolled_coins: 5, date: '2025-03-28T11:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Смирнов Даниил Олегович', enrolled_coins: 20, date: '2025-03-28T09:30:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Морозова Елизавета Андреевна', enrolled_coins: 7, date: '2025-03-27T16:40:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Волков Пётр Николаевич', enrolled_coins: 10, date: '2025-03-27T15:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Новиков Артём Павлович', enrolled_coins: 3, date: '2025-03-27T10:15:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Фёдорова София Романовна', enrolled_coins: 25, date: '2025-03-26T18:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Лебедев Максим Дмитриевич', enrolled_coins: 6, date: '2025-03-26T14:22:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Орлова Виктория Ильинична', enrolled_coins: 14, date: '2025-03-26T11:10:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Кузнецов Роман Сергеевич', enrolled_coins: 9, date: '2025-03-25T09:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Иванов Иван Петрович', enrolled_coins: 4, date: '2025-03-24T13:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Петрова Мария Сергеевна', enrolled_coins: 11, date: '2025-03-24T10:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Сидоров Алексей Игоревич', enrolled_coins: 18, date: '2025-03-23T15:30:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Козлова Анна Владимировна', enrolled_coins: 2, date: '2025-03-22T08:45:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Смирнов Даниил Олегович', enrolled_coins: 30, date: '2025-03-21T17:20:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Морозова Елизавета Андреевна', enrolled_coins: 16, date: '2025-03-20T12:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Волков Пётр Николаевич', enrolled_coins: 5, date: '2025-03-19T09:10:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Новиков Артём Павлович', enrolled_coins: 22, date: '2025-03-18T14:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Фёдорова София Романовна', enrolled_coins: 7, date: '2025-03-17T11:30:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Лебедев Максим Дмитриевич', enrolled_coins: 13, date: '2025-03-16T16:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Орлова Виктория Ильинична', enrolled_coins: 1, date: '2025-03-15T10:00:00.000Z' },
  { teacher_name: 'Демо Преподаватель', student_name: 'Кузнецов Роман Сергеевич', enrolled_coins: 19, date: '2025-03-14T13:40:00.000Z' },
];

function mergeHistory(teacherId: string): EnrollmentHistoryDTO[] {
  const persisted = getPersistedMockEnrollmentEntriesSync(teacherId);
  const merged = [...persisted, ...MOCK_ENROLLMENT_HISTORY_BASELINE];
  merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return merged;
}

export async function mockGetAllCoinsHistory(
  page: number,
  size: number,
  teacherId: string
): Promise<{
  success: boolean;
  content: EnrollmentHistoryDTO[];
  pagination: { hasMore: boolean; currentPage: number; totalPages: number };
}> {
  await delay(MOCK_DELAY_MS);
  await hydrateMockCoinsHistory(teacherId);
  const full = mergeHistory(teacherId);
  const total = full.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * size;
  const content = full.slice(start, start + size);
  return {
    success: true,
    content,
    pagination: {
      hasMore: safePage < totalPages - 1,
      currentPage: safePage,
      totalPages,
    },
  };
}
