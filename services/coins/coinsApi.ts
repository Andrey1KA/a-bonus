import { CoinsHistoryListItemDto } from '@/components/coin/CoinsHistoryListItem';
import { instance } from '@/services/commonApi';
import { mockGetAllCoinsHistory } from '@/services/coins/mockTeacherCoinsHistory';
import { EnrollmentHistoryDTO, PageEnrollmentHistoryDTO } from '@/services/types';
import { store } from '@/stores/auth/authStore';

/** Как «Группы» / «Задачи по группам»: мок для любого преподавателя с непустым id. */
function shouldUseMockTeacherCoins(): boolean {
  try {
    const user = store.getState()?.auth?.user;
    if (!user) return false;
    if (String(user.role ?? '').toLowerCase() !== 'teacher') return false;
    const id = user.id != null ? String(user.id).trim() : '';
    return id.length > 0;
  } catch {
    return false;
  }
}

/** `true` — мок; `false` — API; не передано — авто (преподаватель + id). */
function resolveUseMockTeacherCoins(useMockTeacher?: boolean): boolean {
  if (useMockTeacher === true) return true;
  if (useMockTeacher === false) return false;
  return shouldUseMockTeacherCoins();
}

export type CoinsHistoryData = {
    date: string
    data: CoinsHistoryListItemDto[]
}

const mapEnrollmentHistoryToListItem = (history: EnrollmentHistoryDTO): CoinsHistoryListItemDto => {
    return {
        fullname: history.student_name,
        coins: history.enrolled_coins,
    };
};

const groupHistoryByDate = (history: EnrollmentHistoryDTO[]): CoinsHistoryData[] => {
    const grouped: Record<string, CoinsHistoryListItemDto[]> = {};
    
    history.forEach(item => {
        const date = new Date(item.date).toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        });
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(mapEnrollmentHistoryToListItem(item));
    });
    
    return Object.entries(grouped).map(([date, data]) => ({
        date,
        data,
    }));
};

/**
 * Получить всю историю начисления коинов преподавателем с пагинацией
 * @param useMockTeacher — явно с экрана (демо mock-teacher); иначе определяется по store.
 */
export const getAllCoinsHistory = async (
  page: number = 0,
  size: number = 20,
  useMockTeacher?: boolean
): Promise<{ success: boolean; data: CoinsHistoryData[]; pagination?: { hasMore: boolean; currentPage: number; totalPages: number }; error?: string }> => {
    if (resolveUseMockTeacherCoins(useMockTeacher)) {
        const uid = store.getState()?.auth?.user?.id;
        const teacherId = uid != null && String(uid).trim() !== '' ? String(uid) : 'unknown';
        const mock = await mockGetAllCoinsHistory(page, size, teacherId);
        return {
            success: mock.success,
            data: groupHistoryByDate(mock.content),
            pagination: mock.pagination,
        };
    }

    try {
        const response = await instance.get<PageEnrollmentHistoryDTO>('/api/users/allCoinsHistory', {
            params: { page, size },
        });


        const history = response.data.content || [];
        return {
            success: true,
            data: groupHistoryByDate(history),
            pagination: {
                hasMore: !(response.data.last ?? true),
                currentPage: response.data.number ?? 0,
                totalPages: response.data.totalPages ?? 0,
            },
        };
    } catch (error: any) {
        try {
            const response = await instance.get<EnrollmentHistoryDTO[]>('/api/users/allCoinsHistory');
            return {
                success: true,
                data: groupHistoryByDate(response.data),
            };
        } catch (fallbackError: any) {
            return {
                success: false,
                error: fallbackError.response?.data?.message || error.response?.data?.message || 'Ошибка при получении истории начисления коинов',
                data: []
            };
        }
    }
};

