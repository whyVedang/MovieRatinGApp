import { login, logout, signup } from "../services/auth.js"
export const MutateUserLogin = async ({ username, password }) => {
    return await login({ username, password });
};

export const MutateUserRegister = async ({ username, password }) => {
    return await signup({ username, password });
};

export const MutateLogout = async () => {
    try {
        await logout();
        
        localStorage.removeItem('movie_mate_user');
        
        return { success: true };
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};