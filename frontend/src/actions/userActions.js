export const registerUser = async (userDetails) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },      
            body: JSON.stringify(userDetails),
        })
        return response.json()
    } catch (err) {
        console.log(err)
    }
}

export const loginUser = async (userDetails) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(userDetails),
        })
        return response.json()
    } catch (err) {
        console.log(err)
    }
}


//forgot password 
export const requestPasswordReset = async (email) => {
    try {
      // Use the same base URL format as your other API calls
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }
      
      return data;
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
};
  
export const resetPassword = async (token, password) => {
    try {
      // Use the same base URL format as your other API calls
      const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
};