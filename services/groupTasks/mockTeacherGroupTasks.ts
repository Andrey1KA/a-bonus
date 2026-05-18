import {
  findCreatedTaskCardById,
  getCreatedTasksForGroupSync,
} from '@/services/groupTasks/mockCreatedTasksStore';

export type TeacherGroupTaskTab = {
  id: string;
  name: string;
};

export type TeacherGroupTaskCard = {
  id: string;
  dateFrom: string;
  dateTo: string;
  title: string;
  reward: string;
};

export type TeacherGroupTasksPayload = {
  active: TeacherGroupTaskCard[];
  overdue: TeacherGroupTaskCard[];
};

const ISO = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Демо-вкладки групп (совпадают с чипами на экране «Создать задачу»). */
const TABS: TeacherGroupTaskTab[] = [
  { id: 'tg1', name: 'Группа 1' },
  { id: 'tg-child', name: 'Детская группа' },
  { id: 'tg3', name: 'Вечерняя группа' },
  { id: 'tg-lunch', name: 'Группа обед' },
  { id: 'tg2', name: 'Группа 2' },
  { id: 'tg-long', name: 'Пример длинного названия группы' },
];

const BY_GROUP: Record<string, TeacherGroupTasksPayload> = {
  tg1: {
    active: [
      {
        id: 'tg1-a1',
        dateFrom: ISO(2026, 4, 13),
        dateTo: ISO(2026, 4, 20),
        title: 'Задача в Scratch',
        reward: '8 коинов',
      },
      {
        id: 'tg1-a2',
        dateFrom: ISO(2026, 4, 9),
        dateTo: ISO(2026, 4, 13),
        title: 'Задача на написание кода python',
        reward: '12 коинов + 3 EXP первым трем!',
      },
    ],
    overdue: [
      {
        id: 'tg1-o1',
        dateFrom: ISO(2026, 4, 13),
        dateTo: ISO(2026, 4, 20),
        title: 'Задача в Scratch',
        reward: '8 коинов',
      },
    ],
  },
  'tg-child': {
    active: [
      {
        id: 'tg-child-a1',
        dateFrom: ISO(2026, 4, 2),
        dateTo: ISO(2026, 4, 12),
        title: 'Рисунок в Tux Paint по теме «Весна»',
        reward: '5 коинов',
      },
      {
        id: 'tg-child-a2',
        dateFrom: ISO(2026, 4, 5),
        dateTo: ISO(2026, 4, 18),
        title: 'Счёт до 20 в Scratch Jr',
        reward: '6 коинов + 1 EXP первым трем!',
      },
    ],
    overdue: [
      {
        id: 'tg-child-o1',
        dateFrom: ISO(2026, 3, 10),
        dateTo: ISO(2026, 3, 25),
        title: 'Собери пазл из 12 деталей (фото)',
        reward: '4 коина',
      },
    ],
  },
  tg2: {
    active: [
      {
        id: 'tg2-a1',
        dateFrom: ISO(2026, 4, 1),
        dateTo: ISO(2026, 4, 10),
        title: 'Верстка лендинга',
        reward: '15 коинов',
      },
      {
        id: 'tg2-a2',
        dateFrom: ISO(2026, 4, 8),
        dateTo: ISO(2026, 4, 22),
        title: 'Адаптивная сетка на CSS Grid',
        reward: '10 коинов',
      },
    ],
    overdue: [],
  },
  tg3: {
    active: [
      {
        id: 'tg3-a1',
        dateFrom: ISO(2026, 3, 25),
        dateTo: ISO(2026, 4, 5),
        title: 'Мини-проект на Python',
        reward: '20 коинов',
      },
    ],
    overdue: [
      {
        id: 'tg3-o1',
        dateFrom: ISO(2026, 3, 1),
        dateTo: ISO(2026, 3, 15),
        title: 'Упражнения по циклам',
        reward: '5 коинов',
      },
    ],
  },
  'tg-lunch': {
    active: [
      {
        id: 'tg-lunch-a1',
        dateFrom: ISO(2026, 4, 7),
        dateTo: ISO(2026, 4, 14),
        title: 'Кроссворд по информатике (15 слов)',
        reward: '7 коинов',
      },
      {
        id: 'tg-lunch-a2',
        dateFrom: ISO(2026, 4, 10),
        dateTo: ISO(2026, 4, 17),
        title: 'Блиц-тест: клавиатура и горячие клавиши',
        reward: '5 коинов',
      },
    ],
    overdue: [],
  },
  'tg-long': {
    active: [
      {
        id: 'tg-long-a1',
        dateFrom: ISO(2026, 4, 1),
        dateTo: ISO(2026, 4, 30),
        title: 'Подготовка к олимпиаде: задачи на строки и массивы',
        reward: '25 коинов + 5 EXP первым трем!',
      },
    ],
    overdue: [
      {
        id: 'tg-long-o1',
        dateFrom: ISO(2026, 3, 5),
        dateTo: ISO(2026, 3, 28),
        title: 'Разбор прошлогоднего тура (письменно)',
        reward: '12 коинов',
      },
    ],
  },
};

export function getMockTeacherGroupTaskTabs(): TeacherGroupTaskTab[] {
  return TABS;
}

export function getMockTeacherGroupTasks(groupId: string): TeacherGroupTasksPayload {
  return BY_GROUP[groupId] ?? { active: [], overdue: [] };
}

/** Статические моки + задачи, созданные на экране «Создать задачу» (AsyncStorage по teacherId). */
export function getMockTeacherGroupTasksMerged(
  groupId: string,
  teacherId: string
): TeacherGroupTasksPayload {
  const base = BY_GROUP[groupId] ?? { active: [], overdue: [] };
  const created = getCreatedTasksForGroupSync(teacherId, groupId) as TeacherGroupTaskCard[];
  return {
    active: [...created, ...base.active],
    overdue: [...base.overdue],
  };
}

export function findTeacherGroupTaskCardById(
  taskId: string,
  teacherId: string
): TeacherGroupTaskCard | undefined {
  const fromCreated = findCreatedTaskCardById(teacherId, taskId) as TeacherGroupTaskCard | undefined;
  if (fromCreated) return fromCreated;
  for (const payload of Object.values(BY_GROUP)) {
    const found = [...payload.active, ...payload.overdue].find((t) => t.id === taskId);
    if (found) return found;
  }
  return undefined;
}
