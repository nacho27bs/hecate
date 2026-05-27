document.addEventListener('DOMContentLoaded', () => {
    const ritualForm = document.querySelector('.ritual-form');
    const API_BASE_URL = 'http://localhost:8081/api';

    const token = localStorage.getItem('jwt_token');
    const userId = localStorage.getItem('userId');
    const profileLink = document.getElementById('profile-link');

    if (token && userId && profileLink) {
        profileLink.innerHTML = `<a href="profile.html">Mi refugio</a>`;
    }

    const dateInput = document.querySelector('[name="fecha"]');
    if (dateInput) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    if (!ritualForm) return;

    ritualForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!token || !userId) {
            alert('Para sellar una cita primero debes identificarte en el refugio.');
            window.location.href = 'login.html';
            return;
        }

        const serviceValue = document.querySelector('[name="servicio"]').value;
        const dateValue = document.querySelector('[name="fecha"]').value;
        const timeValue = document.querySelector('[name="hora"]').value;

        const fechaSeleccionada = new Date(`${dateValue}T${timeValue}`);
        const ahora = new Date();
        if (fechaSeleccionada < ahora) {
            alert('No puedes viajar al pasado. Selecciona una fecha y hora futura para tu ritual.');
            return;
        }

        let serviceName = "Solo Mesa (Cafetería)";
        if (serviceValue === 'tarot') {
            serviceName = "Lectura de Tarot";
        } else if (serviceValue === 'posos') {
            serviceName = "Lectura de Posos de Té";
        }

        const dateTime = `${dateValue}T${timeValue}:00`;

        const resrvationData = {
            serviceName: serviceName,
            dateTime: dateTime
        };

        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(resrvationData)
            });
            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Las deidades no han podido registrar tu cita.');
            }

            const data = await response.json();

            alert(`El pacto ha sido sellado.`);
            window.location.href = 'profile.html';
            
        } catch (error) {
            alert(`Error al guardar tu cita: ${error.message}`);
        }
    });
});