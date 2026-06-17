const MIN_LENGTH = 3;
const MAX_LENGTH = 100;

export function validateTask(text) {
    const trimmed = text.trim();
    
    if (!trimmed) {
        return { valid: false, error: 'Task cannot be empty' };
    }
    
    if (trimmed.length < MIN_LENGTH) {
        return { valid: false, error: `Task must be at least ${MIN_LENGTH} characters` };
    }
    
    if (trimmed.length > MAX_LENGTH) {
        return { valid: false, error: `Task must be at most ${MAX_LENGTH} characters` };
    }
    
    return { valid: true, error: null };
}

export function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}