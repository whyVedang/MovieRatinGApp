import { GuestLogin,GetRequestToken,ValidateWithLogin,CreateSession,DeleteSession } from '../services/api';

export const MutateGuestLogin = async () => {
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
export const MutateUserLogin = async ({username,password}) => {
    try {
        const data = await GetRequestToken();
        const valid_data = await ValidateWithLogin({ username, password, request_token: data.request_token });
        const session_data=await CreateSession({ request_token: valid_data.request_token });
        console.log(data);
        console.log(valid_data);
        console.log(session_data);
        return session_data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
};

export const MutateLogout = async () => {
    try {
        // Get stored session ID
        const sessionId = localStorage.getItem('tmdb_session_id');
        
        if (!sessionId) {
            console.log('No active session to logout from');
            return { success: true };
        }
        
        // Call API to delete session
        const data = await DeleteSession({ session_id: sessionId });
        console.log('Logout successful:', data);
        
        // Clear session data from localStorage
        localStorage.removeItem('tmdb_session_id');
        
        return data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};