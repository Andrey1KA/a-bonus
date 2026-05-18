import DeleteTaskConfirmModal from '@/components/groupTasks/DeleteTaskConfirmModal';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getMockTeacherGroupTaskDetail,
  getTeacherTaskStudentStatusLabel,
  TEACHER_TASK_STATUS_TEXT_COLOR,
} from '@/services/groupTasks/mockTeacherGroupTaskDetail';
import { hydrateMockCreatedTasks } from '@/services/groupTasks/mockCreatedTasksStore';
import { userSelector } from '@/stores/auth/authStore';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const CTA_PURPLE = '#6766AA';
const STUDENT_ROW_BG = '#ECECEF';
const CTA_RADIUS = 14;

function formatShortRu(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${String(y).slice(-2)}`;
}

export default function TeacherGroupTaskDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const user = useSelector(userSelector);
  const teacherId =
    user?.id != null && String(user.id).trim() !== '' ? String(user.id) : 'unknown';

  useEffect(() => {
    void hydrateMockCreatedTasks(teacherId);
  }, [teacherId]);

  const detail = useMemo(
    () => getMockTeacherGroupTaskDetail(id, teacherId),
    [id, teacherId]
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const onBack = () => router.back();

  const handleConfirmDelete = () => {
    setDeleteModalVisible(false);
    router.back();
  };

  const dateRange = detail
    ? `${formatShortRu(detail.dateFrom)} - ${formatShortRu(detail.dateTo)}`
    : '';

  const openStudentReview = (studentId: string) => {
    if (!id) return;
    const q = new URLSearchParams({ taskId: id, studentId });
    router.push(`/groupTask/student-check?${q.toString()}` as Href);
  };

  if (!detail) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.headerIcon} hitSlop={8} accessibilityLabel="Назад">
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            Подробнее о задаче
          </Text>
          <View style={styles.headerIcon} />
        </View>
        <Text style={[styles.missing, { color: colors.placeholder }]}>Задача не найдена.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.mainColumn}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.headerIcon} hitSlop={8} accessibilityLabel="Назад">
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            Подробнее о задаче
          </Text>
          <View style={styles.headerIcon} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{detail.title}</Text>
          <Text style={[styles.rewardLine, { color: colors.text }]}>{detail.reward}</Text>
          <Text style={[styles.periodLine, { color: colors.placeholder }]}>{dateRange}</Text>

          <View style={styles.block}>
            <Text style={[styles.blockHeading, { color: colors.text }]}>Описание:</Text>
            {detail.descriptionSteps.map((step, index) => (
              <Text key={index} style={[styles.stepLine, { color: colors.text }]}>
                {index + 1}. {step}
              </Text>
            ))}
          </View>

          <Text style={[styles.studentsSectionTitle, { color: colors.text }]}>Ученики и статус:</Text>
          {detail.students.map((s) => {
            if (s.status === 'awaiting_review') {
              return (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.88}
                  onPress={() => openStudentReview(s.id)}
                  style={[styles.studentRow, { backgroundColor: STUDENT_ROW_BG }]}
                  accessibilityLabel={`${s.fullName}, ожидает проверки, открыть проверку`}
                  accessibilityRole="button">
                  <Text style={[styles.studentName, { color: colors.text }]} numberOfLines={1}>
                    {s.fullName}
                  </Text>
                  <Text
                    style={[styles.studentStatus, { color: TEACHER_TASK_STATUS_TEXT_COLOR[s.status] }]}
                    numberOfLines={1}>
                    {getTeacherTaskStudentStatusLabel(s.status)}
                  </Text>
                </TouchableOpacity>
              );
            }
            return (
              <View key={s.id} style={[styles.studentRow, { backgroundColor: STUDENT_ROW_BG }]}>
                <Text style={[styles.studentName, { color: colors.text }]} numberOfLines={1}>
                  {s.fullName}
                </Text>
                <Text
                  style={[styles.studentStatus, { color: TEACHER_TASK_STATUS_TEXT_COLOR[s.status] }]}
                  numberOfLines={1}>
                  {getTeacherTaskStudentStatusLabel(s.status)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}>
          <Pressable
            style={({ pressed }) => [
              styles.footerBtn,
              { backgroundColor: CTA_PURPLE },
              pressed && styles.footerBtnPressed,
            ]}
            onPress={() => {}}
            hitSlop={8}
            accessibilityLabel="Изменить задачу">
            <Text style={styles.footerBtnText}>Изменить</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.footerBtn,
              { backgroundColor: CTA_PURPLE },
              pressed && styles.footerBtnPressed,
            ]}
            onPress={() => setDeleteModalVisible(true)}
            hitSlop={8}
            accessibilityLabel="Удалить задачу">
            <Text style={styles.footerBtnText}>Удалить</Text>
          </Pressable>
        </View>
      </View>

      <DeleteTaskConfirmModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainColumn: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  headerIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  missing: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    paddingHorizontal: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
  },
  rewardLine: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  periodLine: {
    fontSize: 14,
    marginBottom: 20,
  },
  block: {
    marginBottom: 24,
  },
  blockHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  stepLine: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  studentsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  studentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  studentStatus: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: '46%',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
  },
  footerBtn: {
    flex: 1,
    borderRadius: CTA_RADIUS,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnPressed: {
    opacity: 0.88,
  },
  footerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
