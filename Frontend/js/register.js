document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const API_BASE_URL = 'http://localhost:8081/api';

    const token = localStorage.getItem('jwt_token');
    const userId = localStorage.getItem('userId');
    const profileLink = document.getElementById('profile-link');

    if (token && userId && profileLink) {
        profileLink.innerHTML = `<a href="profile.html">Mi refugio</a>`;
    }

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('telefono').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirmed = document.getElementById('passwordConfirmed').value;
        const profilePictureInput = document.getElementById('foto').value.trim();

        if (password !== passwordConfirmed) {
            alert('La contraseña no coincide.');
            return;
        }

        const registerData = {
            fullName: fullName,
            email: email,
            password: password,
            phone: phone ? phone : null,
            profilePicture: profilePictureInput ? profilePictureInput : null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Error al registrar el usuario.');
            }
            alert('Tu alma ha sido vinculada al refugio con éxito. Ya puedes iniciar sesión.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Error al registrarse: ${error.message}`);
        }
    });
});