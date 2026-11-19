import { instance } from '@/services/commonApi';
import { UserDTO } from '@/services/types';
import { newUserPasswordError } from '@/services/users/newUserPassword';

/**
 * Создать пользователя. Пароль проверяется теми же правилами, что на бэке,
 * и запрос не уходит, если он им не соответствует. Отдельного экрана нет.
 */
export const createUser = async (
    user: UserDTO
): Promise<{ success: boolean; data?: UserDTO; error?: string }> => {
    const passwordError = newUserPasswordError(user.password ?? '');
    if (passwordError) {
        return { success: false, error: passwordError };
    }

    try {
        const response = await instance.post<UserDTO>('/api/users', {
            login: user.login,
            password: user.password,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.middle_name,
            email: user.email,
            date_of_birth: user.date_of_birth,
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Ошибка при создании пользователя',
        };
    }
};
