const STORAGE_KEY = 'taskflow_tasks';
const THEME_KEY = 'taskflow_theme';

export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks:', e);
    }
}

export function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load tasks:', e);
        return [];
    }
}

export function saveTheme(isDark) {
    try {
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch (e) {
        console.error('Failed to save theme:', e);
    }
}

export function loadTheme() {
    try {
        return localStorage.getItem(THEME_KEY) === 'dark';
    } catch (e) {
        console.error('Failed to load theme:', e);
        return false;
    }
}