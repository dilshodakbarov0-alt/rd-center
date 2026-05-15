import type { UserRole } from './types';

export const ROLE_LABELS: Record<UserRole, { ru: string; uz: string }> = {
  parent: { ru: 'Родитель', uz: 'Ota-ona' },
  specialist: { ru: 'Специалист', uz: 'Mutaxassis' },
  methodologist: { ru: 'Методист', uz: 'Metodist' },
  admin: { ru: 'Администратор', uz: 'Administrator' },
};

export const ROLE_HOME: Record<UserRole, string> = {
  parent: '/dashboard',
  specialist: '/specialist',
  methodologist: '/methods',
  admin: '/admin',
};

export const ROLE_NAV: Record<UserRole, Array<{ key: string; href: string; ru: string; uz: string }>> = {
  parent: [
    { key: 'dashboard', href: '/dashboard', ru: 'Главная', uz: 'Bosh sahifa' },
    { key: 'family-photos', href: '/family-photos', ru: 'Фото семьи', uz: 'Oila rasmlari' },
    { key: 'characters', href: '/characters', ru: 'Персонажи', uz: 'Personajlar' },
    { key: 'cards', href: '/cards', ru: 'Карточки', uz: 'Kartochkalar' },
    { key: 'games', href: '/games', ru: 'Игры', uz: "O'yinlar" },
    { key: 'ai-lesson', href: '/ai-lesson', ru: 'AI-уроки', uz: 'AI-darslar' },
    { key: 'videos', href: '/videos', ru: 'Видео', uz: 'Videolar' },
    { key: 'progress', href: '/progress', ru: 'Прогресс', uz: 'Rivojlanish' },
  ],
  specialist: [
    { key: 'specialist', href: '/specialist', ru: 'Мои дети', uz: 'Bolalarim' },
    { key: 'videos', href: '/specialist/videos', ru: 'Видео занятий', uz: 'Dars videolari' },
  ],
  methodologist: [
    { key: 'methods', href: '/methods', ru: 'Метод. база', uz: 'Metodik baza' },
    { key: 'methods-upload', href: '/methods/upload', ru: 'Загрузить', uz: 'Yuklash' },
    { key: 'methods-review', href: '/methods/review', ru: 'На проверке', uz: "Ko'rib chiqish" },
  ],
  admin: [
    { key: 'admin', href: '/admin', ru: 'Панель', uz: 'Panel' },
    { key: 'admin-users', href: '/admin/users', ru: 'Пользователи', uz: 'Foydalanuvchilar' },
    { key: 'admin-ai', href: '/admin/ai-gateway', ru: 'AI Gateway', uz: 'AI Gateway' },
    { key: 'admin-content', href: '/admin/content', ru: 'Контент', uz: 'Kontent' },
    { key: 'admin-audit', href: '/admin/audit', ru: 'Аудит', uz: 'Audit' },
  ],
};
