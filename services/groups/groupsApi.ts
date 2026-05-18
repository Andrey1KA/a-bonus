import { Student } from "@/components/group/StudentListItem";
import { instance } from '@/services/commonApi';
import {
  mockGetAllGroups,
  mockGetStudentsByGroup,
  mockGiveCoinsToStudents,
} from '@/services/groups/mockTeacherGroups';
import { GroupDTO, PageGroupDto, UserDTO } from '@/services/types';
import { store } from '@/stores/auth/authStore';

/**
 * Мок-данные групп для любого преподавателя с непустым id — как экран «Задачи по группам».
 * Раньше только логин mock-teacher: из-за этого при другом teacher id или сбое login в persist шёл запрос на API и показывались «старые» группы.
 */
function shouldUseMockTeacherGroups(): boolean {
  try {
    const auth = store.getState()?.auth;
    const user = auth?.user;
    if (!user) return false;
    if (String(user.role ?? '').toLowerCase() !== 'teacher') return false;
    const id = user.id != null ? String(user.id).trim() : '';
    return id.length > 0;
  } catch {
    return false;
  }
}

export type Group = {
    id: string
    name: string
}

const mapGroupDTOToGroup = (groupDTO: GroupDTO): Group => {
    return {
        id: groupDTO.id?.toString() || '',
        name: groupDTO.group_name,
    };
};

const mapUserDTOToStudent = (userDTO: UserDTO): Student => {
    return {
        id: userDTO.id?.toString() || '',
        fullname: userDTO.full_name || `${userDTO.last_name} ${userDTO.first_name} ${userDTO.middle_name || ''}`.trim(),
        coins: (0).toString(),
    };
};

/** `true` — всегда мок; `false` — всегда API; не передано — см. {@link shouldUseMockTeacherGroups}. */
function resolveUseMockTeacherGroups(useMockTeacher?: boolean): boolean {
  if (useMockTeacher === true) return true;
  if (useMockTeacher === false) return false;
  return shouldUseMockTeacherGroups();
}

/**
 * Получить все группы, доступные текущему пользователю
 * @param useMockTeacher — если `true`/`false`, с экрана (надёжнее store в момент вызова); иначе авто по Redux.
 */
export const getAllGroups = async (
    page: number = 0,
    size: number = 20,
    useMockTeacher?: boolean
): Promise<{ success: boolean; data: Group[]; pagination?: { hasMore: boolean; currentPage: number; totalPages: number }; error?: string }> => {
    if (resolveUseMockTeacherGroups(useMockTeacher)) {
        return mockGetAllGroups(page, size);
    }
    try {
        const response = await instance.get<PageGroupDto>('/api/groups',  {
            params: { page, size },
        });

        const groups = response.data.content || [];

        return {
            success: true,
            data: groups.map(mapGroupDTOToGroup),
            pagination: {
                hasMore: !(response.data.last ?? true),
                currentPage: response.data.number ?? 0,
                totalPages: response.data.totalPages ?? 0,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Ошибка при получении групп',
            data: []
        };
    }
};

/**
 * Получить всех студентов группы
 * @param useMockTeacher — см. {@link getAllGroups}
 */
export const getAllStudentsByGroup = async (
    groupId: string,
    useMockTeacher?: boolean
): Promise<{ success: boolean; data: Student[]; error?: string }> => {
    if (resolveUseMockTeacherGroups(useMockTeacher)) {
        return mockGetStudentsByGroup(groupId);
    }
    try {
        const response = await instance.get<GroupDTO>(`/api/groups/${groupId}`);
        const students = response.data.students || [];
        return {
            success: true,
            data: students.map(mapUserDTOToStudent),
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Ошибка при получении студентов',
            data: []
        };
    }
};


/**
 * Зачислить алгокоины студентам
 * Использует новый API для начисления коинов каждому студенту
 * Каждый студент получает количество коинов, указанное в его поле coins
 */
export const giveCoinsToStudens = async (
    groupId: string,
    studentList: Student[],
    useMockTeacher?: boolean
): Promise<{ success: boolean; error?: string }> => {
    if (resolveUseMockTeacherGroups(useMockTeacher)) {
        return mockGiveCoinsToStudents(groupId, studentList);
    }
    try {
        // Начисляем коины каждому студенту индивидуально
        const promises = studentList
            .filter(student => student.coins && parseInt(student.coins) > 0)
            .map(student => {
                const coins = parseInt(student.coins);
                return instance.put<UserDTO>(`/api/users/${student.id}/coins`, coins);
            });
        
        if (promises.length === 0) {
            return {
                success: false,
                error: 'Не указано количество коинов для начисления',
            };
        }
        
        await Promise.all(promises);
        
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Ошибка при начислении коинов',
        };
    }
};