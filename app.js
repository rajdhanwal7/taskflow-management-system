import { saveTheme, loadTheme } from './modules/storage.js';
import { validateTask, sanitizeHTML } from './modules/validation.js';
import { renderTasks, renderStats, updateEmptyState, debounce } from './modules/render.js';
import { getTasks, createTask, updateTask, deleteTask as deleteTaskApi } from './modules/api.js';

let tasks = [];
let currentFilter = 'all';
let currentSearch = '';
let lastAction = null;
let deleteTargetId = null;

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const validationError = document.getElementById('validationError');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const undoSection = document.getElementById('undoSection');
const undoBtn = document.getElementById('undoBtn');
const emptyCTA = document.getElementById('emptyCTA');
const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const filterBtns = document.querySelectorAll('.filter-btn');

const statElements = {
    total: document.getElementById('totalTasks'),
    completed: document.getElementById('completedTasks'),
    pending: document.getElementById('pendingTasks'),
    percent: document.getElementById('completionPercent')
};

async function init() {
    try {
        tasks = await getTasks();
    } catch (err) {
        console.error('Failed to load tasks:', err);
    }
    applyTheme(loadTheme());
    render();
    setupEventListeners();
}

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
}

function render() {
    const count = renderTasks(tasks, taskList, currentFilter, currentSearch);
    renderStats(tasks, statElements);
    updateEmptyState(count > 0, emptyState, taskList);
}

function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    taskInput.addEventListener('input', debounce(handleInputValidate, 150));
    themeToggle.addEventListener('click', handleThemeToggle);
    searchInput.addEventListener('input', debounce(handleSearch, 250));
    taskList.addEventListener('click', handleTaskAction);
    filterBtns.forEach(btn => btn.addEventListener('click', handleFilterChange));
    undoBtn.addEventListener('click', handleUndo);
    emptyCTA.addEventListener('click', () => taskInput.focus());
    cancelDelete.addEventListener('click', closeModal);
    confirmDelete.addEventListener('click', confirmDeleteTask);
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeModal();
    });
    document.addEventListener('keydown', handleKeydown);
    taskList.addEventListener('dragstart', handleDragStart);
    taskList.addEventListener('dragover', handleDragOver);
    taskList.addEventListener('drop', handleDrop);
}

async function handleAddTask(e) {
    e.preventDefault();
    
    const text = taskInput.value;
    const validation = validateTask(text);
    
    if (!validation.valid) {
        showError(validation.error);
        return;
    }
    
    hideError();
    
    try {
        const newTask = await createTask(text.trim());
        tasks.unshift(newTask);
        taskInput.value = '';
        render();
    } catch (err) {
        console.error('Failed to create task:', err);
    }
}

function handleInputValidate() {
    const validation = validateTask(taskInput.value);
    if (validation.error) {
        showError(validation.error);
    } else {
        hideError();
    }
}

function showError(msg) {
    taskInput.classList.add('error');
    validationError.textContent = msg;
    validationError.classList.add('visible');
}

function hideError() {
    taskInput.classList.remove('error');
    validationError.classList.remove('visible');
}

function handleThemeToggle() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    saveTheme(isDark);
}

function handleSearch(e) {
    currentSearch = e.target.value;
    render();
}

function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;
    
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn === e.target);
        btn.setAttribute('aria-pressed', btn === e.target);
    });
    
    render();
}

function handleTaskAction(e) {
    const action = e.target.dataset.action;
    const taskItem = e.target.closest('.task-item');
    
    if (!taskItem || !action) return;
    
    const id = parseInt(taskItem.dataset.id);
    
    if (action === 'toggle') {
        handleToggleTask(id);
    } else if (action === 'edit') {
        handleEditTask(id, taskItem);
    } else if (action === 'delete') {
        handleDeleteTask(id);
    }
}

async function handleToggleTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    
    const previousState = [...tasks];
    const newCompleted = !tasks[taskIndex].completed;
    
    try {
        const updatedTask = await updateTask(id, { completed: newCompleted, text: tasks[taskIndex].text });
        tasks[taskIndex] = updatedTask;
        saveLastAction('toggle', previousState);
        render();
    } catch (err) {
        console.error('Failed to update task:', err);
    }
}

async function handleEditTask(id, taskItem) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const previousState = [...tasks];
    
    const taskTextEl = taskItem.querySelector('.task-text');
    const currentText = task.text;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = currentText;
    
    taskTextEl.replaceWith(input);
    input.focus();
    input.select();
    
    const finishEdit = async () => {
        const newText = input.value.trim();
        const validation = validateTask(newText);
        
        if (validation.valid) {
            try {
                const updatedTask = await updateTask(id, { text: newText, completed: task.completed });
                const taskIndex = tasks.findIndex(t => t.id === id);
                tasks[taskIndex] = updatedTask;
                saveLastAction('edit', previousState);
            } catch (err) {
                console.error('Failed to update task:', err);
            }
        }
        
        render();
    };
    
    input.addEventListener('blur', finishEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            render();
        }
    });
}

function handleDeleteTask(id) {
    deleteTargetId = id;
    deleteModal.style.display = 'flex';
}

async function confirmDeleteTask() {
    if (deleteTargetId === null) return;
    
    const previousState = [...tasks];
    const taskIndex = tasks.findIndex(t => t.id === deleteTargetId);
    
    if (taskIndex !== -1) {
        const taskItem = taskList.querySelector(`[data-id="${deleteTargetId}"]`);
        if (taskItem) {
            taskItem.classList.add('deleting');
            try {
                await deleteTaskApi(deleteTargetId);
                setTimeout(() => {
                    tasks = tasks.filter(t => t.id !== deleteTargetId);
                    saveLastAction('delete', previousState);
                    deleteTargetId = null;
                    closeModal();
                    render();
                }, 300);
            } catch (err) {
                console.error('Failed to delete task:', err);
            }
        }
    }
}

function closeModal() {
    deleteModal.style.display = 'none';
    deleteTargetId = null;
}

function saveLastAction(type, previousState) {
    lastAction = { type, state: previousState };
    undoSection.style.display = 'block';
}

function handleUndo() {
    if (!lastAction) return;
    
    tasks = lastAction.state;
    lastAction = null;
    undoSection.style.display = 'none';
    render();
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
    
    if (e.key === 'Delete' && document.activeElement === taskList) {
        const selected = document.querySelector('.task-item:focus-within');
        if (selected) {
            const id = parseInt(selected.dataset.id);
            handleDeleteTask(id);
        }
    }
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = e.target.closest('.task-item');
    if (draggedItem) {
        draggedItem.classList.add('dragging');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        taskList.appendChild(dragging);
    } else {
        taskList.insertBefore(dragging, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        dragging.classList.remove('dragging');
        
        const newOrder = [];
        taskList.querySelectorAll('.task-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) newOrder.push(task);
        });
        
        tasks = newOrder;
    }
    draggedItem = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

init();