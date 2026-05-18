import { Stack } from 'expo-router';

/**
 * Отдельный стек для задач по группам: стабильные пути (create, student-check)
 * не перехватываются динамическим [id].
 */
export default function GroupTaskLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
