document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const API_BASE_URL = 'http://localhost:8081/api';

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Las credenciales introducidas no son válidas.');
            }

            const data = await response.json();

            localStorage.setItem('jwt_token', data.token); 
            localStorage.setItem('userId', data.userId.toString());

            window.location.href = 'profile.html';

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});