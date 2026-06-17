const API_BASE_URL = 'http://localhost:3000/api/tasks';

export async function getTasks() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data.data;
}

export async function createTask(text) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, completed: false })
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    const data = await response.json();
    return data.data;
}

export async function updateTask(id, updates) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    const data = await response.json();
    return data.data;
}

export async function deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete task');
    }
}
