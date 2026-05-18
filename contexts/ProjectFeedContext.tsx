import {
  MOCK_PROJECT_FEED,
  MOCK_TEACHER_PROJECT_FEED,
  type ProjectFeedItem,
} from '@/services/feed/mockProjectFeed';
import { userSelector } from '@/stores/auth/authStore';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSelector } from 'react-redux';

type ProjectFeedContextValue = {
  items: ProjectFeedItem[];
  addProject: (item: ProjectFeedItem) => void;
  hideProject: (projectId: string) => void;
  isProjectHidden: (projectId: string) => boolean;
  toggleLike: (projectId: string) => void;
  isLiked: (projectId: string) => boolean;
  getLikeCount: (item: ProjectFeedItem) => number;
};

const ProjectFeedContext = createContext<ProjectFeedContextValue | null>(null);

export function ProjectFeedProvider({ children }: { children: ReactNode }) {
  const user = useSelector(userSelector);
  const role = String(user?.role ?? '').toLowerCase();
  const isTeacher = role === 'teacher';

  const [published, setPublished] = useState<ProjectFeedItem[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());

  const baseMock = isTeacher ? MOCK_TEACHER_PROJECT_FEED : MOCK_PROJECT_FEED;

  const items = useMemo(() => {
    const all = [...published, ...baseMock];
    return all.filter((p) => !hiddenIds.has(p.id));
  }, [published, baseMock, hiddenIds]);

  const hideProject = useCallback((projectId: string) => {
    setHiddenIds((prev) => {
      if (prev.has(projectId)) return prev;
      const next = new Set(prev);
      next.add(projectId);
      return next;
    });
  }, []);

  const isProjectHidden = useCallback(
    (projectId: string) => hiddenIds.has(projectId),
    [hiddenIds]
  );
  const addProject = useCallback((item: ProjectFeedItem) => {
    setPublished((prev) => [item, ...prev]);
  }, []);

  const toggleLike = useCallback((projectId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }, []);

  const isLiked = useCallback((projectId: string) => likedIds.has(projectId), [likedIds]);

  const getLikeCount = useCallback(
    (item: ProjectFeedItem) => item.likes + (likedIds.has(item.id) ? 1 : 0),
    [likedIds]
  );

  const value = useMemo(
    () => ({
      items,
      addProject,
      hideProject,
      isProjectHidden,
      toggleLike,
      isLiked,
      getLikeCount,
    }),
    [items, addProject, hideProject, isProjectHidden, toggleLike, isLiked, getLikeCount]
  );

  return <ProjectFeedContext.Provider value={value}>{children}</ProjectFeedContext.Provider>;
}

export function useProjectFeed() {
  const ctx = useContext(ProjectFeedContext);
  if (!ctx) {
    throw new Error('useProjectFeed must be used within ProjectFeedProvider');
  }
  return ctx;
}
