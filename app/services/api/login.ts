export interface LoginApiData {
    email: string;
    password: string;
}

export const loginApi = async ({email, password}:LoginApiData )=>{
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          return response;
    } catch (error) {
        throw error;
    }

}