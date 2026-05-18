import type { TeacherGroupTaskCard } from '@/services/groupTasks/mockTeacherGroupTasks';
import { findTeacherGroupTaskCardById } from '@/services/groupTasks/mockTeacherGroupTasks';

export type TeacherTaskStudentStatusKind =
  | 'awaiting_review'
  | 'revision'
  | 'not_completed'
  | 'accepted';

export type TeacherTaskDetailStudent = {
  id: string;
  fullName: string;
  status: TeacherTaskStudentStatusKind;
};

export type TeacherGroupTaskDetail = TeacherGroupTaskCard & {
  descriptionSteps: string[];
  students: TeacherTaskDetailStudent[];
};

const STATUS_LABEL: Record<TeacherTaskStudentStatusKind, string> = {
  awaiting_review: 'Ожидает проверки',
  revision: 'На доработке',
  not_completed: 'Не выполнена',
  accepted: 'Принята',
};

export function getTeacherTaskStudentStatusLabel(status: TeacherTaskStudentStatusKind): string {
  return STATUS_LABEL[status];
}

export const TEACHER_TASK_STATUS_TEXT_COLOR: Record<TeacherTaskStudentStatusKind, string> = {
  awaiting_review: '#B8860B',
  revision: '#B8860B',
  not_completed: '#C62828',
  accepted: '#2E7D32',
};

const DEFAULT_STEPS = [
  'Ознакомьтесь с формулировкой задания и требованиями к результату.',
  'Выполните работу в указанной среде или по инструкции преподавателя.',
  'Проверьте результат перед отправкой.',
  'При необходимости приложите ссылку или файл с решением.',
  'Дождитесь проверки и комментария преподавателя.',
];

const PYTHON_STEPS = [
  'Откройте среду разработки Python (например, VS Code или PyCharm).',
  'Создайте файл с решением и напишите код согласно условию задачи.',
  'Запустите программу локально и убедитесь, что она работает без ошибок.',
  'При необходимости оформите код в репозитории или подготовьте архив.',
  'Прикрепите ссылку или инструкцию для проверки в ответе на задание.',
];

const SCRATCH_STEPS = [
  'Откройте Scratch и создайте проект по условию.',
  'Сохраните проект и получите ссылку «Поделиться».',
  'Проверьте, что по ссылке открывается именно ваша работа.',
  'Сдайте ссылку преподавателю способом, указанным в задании.',
];

const STUDENTS_PYTHON: TeacherTaskDetailStudent[] = [
  { id: 's1', fullName: 'Бут Данил Игоревич', status: 'awaiting_review' },
  { id: 's2', fullName: 'Иванов Иван Петрович', status: 'revision' },
  { id: 's3', fullName: 'Петрова Мария Сергеевна', status: 'not_completed' },
  { id: 's4', fullName: 'Сидоров Алексей Игоревич', status: 'accepted' },
  { id: 's5', fullName: 'Козлова Анна Владимировна', status: 'awaiting_review' },
];

const STUDENTS_SHORT: TeacherTaskDetailStudent[] = [
  { id: 's1', fullName: 'Смирнов Даниил Олегович', status: 'accepted' },
  { id: 's2', fullName: 'Морозова Елизавета Андреевна', status: 'awaiting_review' },
];

const EXTRA: Partial<
  Record<
    string,
    {
      descriptionSteps: string[];
      students: TeacherTaskDetailStudent[];
    }
  >
> = {
  'tg1-a2': { descriptionSteps: PYTHON_STEPS, students: STUDENTS_PYTHON },
  'tg1-a1': { descriptionSteps: SCRATCH_STEPS, students: STUDENTS_SHORT },
  'tg1-o1': { descriptionSteps: SCRATCH_STEPS, students: STUDENTS_SHORT },
  'tg2-a1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg2-a2': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg3-a1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg3-o1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg-child-a1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg-child-a2': { descriptionSteps: SCRATCH_STEPS, students: STUDENTS_SHORT },
  'tg-child-o1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg-lunch-a1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg-lunch-a2': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
  'tg-long-a1': { descriptionSteps: PYTHON_STEPS, students: STUDENTS_SHORT },
  'tg-long-o1': { descriptionSteps: DEFAULT_STEPS, students: STUDENTS_SHORT },
};

export function getMockTeacherGroupTaskDetail(
  taskId: string | undefined,
  teacherId: string
): TeacherGroupTaskDetail | undefined {
  if (!taskId) return undefined;
  const card = findTeacherGroupTaskCardById(taskId, teacherId);
  if (!card) return undefined;
  const add = EXTRA[taskId] ?? {
    descriptionSteps: DEFAULT_STEPS,
    students: STUDENTS_SHORT,
  };
  return { ...card, descriptionSteps: add.descriptionSteps, students: add.students };
}
