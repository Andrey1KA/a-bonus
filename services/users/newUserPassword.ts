/** Те же правила, что @Size и @Pattern на пароле в UserDTO при POST /api/users. */
const MIN_LENGTH = 8;
const SPECIAL_CHARACTERS = /[()*!@#]/;

export type NewUserPasswordHint = {
    text: string;
    passed: boolean;
};

/**
 * Подсказки под полем пароля, как на сайте.
 * На экран не выводятся: их забирает создание пользователя до запроса.
 */
export function newUserPasswordHints(password: string): NewUserPasswordHint[] {
    return [
        {
            text: 'Минимум 8 символов',
            passed: password.length >= MIN_LENGTH,
        },
        {
            text: 'Хотя бы один спецсимвол: ( ) * ! @ #',
            passed: SPECIAL_CHARACTERS.test(password),
        },
    ];
}

/** Первое сообщение, которое бэк вернул бы в VALIDATION_ERROR. null — пароль подходит. */
export function newUserPasswordError(password: string): string | null {
    if (password.trim() === '') {
        return 'Пароль не может быть пустым';
    }
    const [lengthHint, specialHint] = newUserPasswordHints(password);
    if (!lengthHint.passed) {
        return 'Пароль должен быть не короче восьми символов';
    }
    if (!specialHint.passed) {
        return 'Пароль должен содержать хотя бы один спецсимвол: ( ) * ! @ #';
    }
    return null;
}
