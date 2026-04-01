export const logoutApi = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    throw error;
  }
};
