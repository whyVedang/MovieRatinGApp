import { GuestLogin } from '../services/api';

export const MutateLogin = async () => {
    try {
        const data = await GuestLogin();
        console.log(data);
        const sessionId = data.guest_session_id;
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
