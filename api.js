const API_URL = 'http://localhost:8000';

// Function to perform API requests
async function fetchDataFromAPI(endpoint) {
    try {
        const token = localStorage.getItem('accessToken'); // Retrieve the token from storage
        const headers = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // Set the Authorization header
        }

        const response = await fetch(`${API_URL}/${endpoint}`, {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


// Function to get table data using API
async function getTableData(tableName) {
    return await fetchDataFromAPI(`api/${tableName}`);
}

// Function for handling login
async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

module.exports = {
    API_URL,
    getTableData,
    loginUser
};