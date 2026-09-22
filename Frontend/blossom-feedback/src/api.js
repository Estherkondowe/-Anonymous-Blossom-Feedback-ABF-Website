import API_URL from './config';

async function request(path, options = {}) {
    const config = {
        credentials: 'include',
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers
        }
    };

    const response = await fetch(`${API_URL}${path}`, config);

    let data = null;
    try {
        data = await response.json();
    } catch {
        // empty or non-JSON response
    }

    if (!response.ok) {
        const error = new Error(data?.error || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, {
        method: 'POST',
        body: body === undefined ? undefined : JSON.stringify(body)
    }),
    patch: (path, body) => request(path, {
        method: 'PATCH',
        body: JSON.stringify(body)
    }),
    del: (path) => request(path, { method: 'DELETE' })
};

export default api;