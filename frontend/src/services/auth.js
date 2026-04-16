const api = import.meta.env.VITE_BACKENDAPI + "/auth"

export const signup = async ({ username, password }) => {
    const res = await fetch(`${api}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
    }
    return res.json();
}

export const login = async ({ username, password }) => {
    const res = await fetch(`${api}/login`, {
    method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }
    return res.json();
}

export const logout = async () => {
    const res=await fetch(`${api}/logout`,{
        method: 'POST',
        credentials: 'include'
    });

    if(!res.ok) throw new Error('Logout failed');
    return res.json();
}