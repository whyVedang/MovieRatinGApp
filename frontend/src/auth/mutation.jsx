import { login, logout, signup } from "../services/auth.js"
export const MutateUserLogin = async ({ email, password }) => {
    return await login({ email, password });
};

export const MutateUserRegister = async ({ username,email, password }) => {
    return await signup({ username,email, password });
};

export const MutateLogout = async () => {
    try {
        await logout();
        
        localStorage.removeItem('movie_mate_token');
        
        return { success: true };
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};