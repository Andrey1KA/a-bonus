export type TeacherTaskSubmissionAttempt = {
  attemptNumber: number;
  /** Ссылка на работу (если есть) */
  link?: string;
  /** Текст ответа ученика */
  studentMessage?: string;
  /** Предыдущий комментарий преподавателя к этой попытке */
  teacherComment?: string;
};

const KEY = (taskId: string, studentId: string) => `${taskId}:${studentId}`;

/** Демо-история сдач для экрана проверки (ожидает проверки). */
const SUBMISSIONS_BY_TASK_STUDENT: Record<string, TeacherTaskSubmissionAttempt[]> = {
  'tg1-a2:s1': [
    {
      attemptNumber: 1,
      link: 'https://www.ekarta-ek.ru/',
    },
  ],
};

export function getMockTeacherTaskStudentSubmissions(
  taskId: string,
  studentId: string
): TeacherTaskSubmissionAttempt[] {
  return SUBMISSIONS_BY_TASK_STUDENT[KEY(taskId, studentId)] ?? [];
}
