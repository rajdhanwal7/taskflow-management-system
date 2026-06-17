import { sanitizeHTML } from './validation.js';

export function renderTasks(tasks, container, filter = 'all', search = '') {
    container.innerHTML = '';
    
    let filteredTasks = [...tasks];
    
    if (filter === 'active') {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(t => t.completed);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredTasks = filteredTasks.filter(t => 
            t.text.toLowerCase().includes(searchLower)
        );
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        li.draggable = true;
        
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle" aria-label="Toggle completion"></div>
            <div class="task-content">
                <div class="task-text">${sanitizeHTML(task.text)}</div>
                <div class="task-date">${formatDate(task.createdAt)}</div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit" data-action="edit" aria-label="Edit task">✏️</button>
                <button class="task-btn delete" data-action="delete" aria-label="Delete task">🗑️</button>
            </div>
        `;
        
        container.appendChild(li);
    });
    
    return filteredTasks.length;
}

export function renderStats(tasks, elements) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    elements.total.textContent = total;
    elements.completed.textContent = completed;
    elements.pending.textContent = pending;
    elements.percent.textContent = `${percent}%`;
}

export function updateEmptyState(hasTasks, emptyStateEl, taskListEl) {
    if (hasTasks) {
        emptyStateEl.classList.remove('visible');
        taskListEl.style.display = 'flex';
    } else {
        emptyStateEl.classList.add('visible');
        taskListEl.style.display = 'none';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}