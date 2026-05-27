document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userId = localStorage.getItem('userId') || 1;
    const API_BASE_URL = 'http://localhost:8081/api';

    const dynamicContent = document.getElementById('dynamic-content');
    const btnShowProfile = document.getElementById('btn-show-profile');
    const btnShowReservations = document.getElementById('btn-show-reservations');
    const btnLogout = document.getElementById('btn-logout');

    let userLogged = null;

    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403 || response.status === 401) {
                    manejarSesionExpirada();
                }
                throw new Error('No se pudo obtener el perfil del servidor');
            }
            userLogged = await response.json();
            renderProfile(userLogged);
        } catch (error) {
            dynamicContent.innerHTML = `<p class="error-msg">Error: ${error.message}</p>`;
        }
    }

    async function fetchUserReservations() {
        try {
            dynamicContent.innerHTML = '<p class="loading-msg">Invocando tus reservas al oráculo...</p>';

            const response = await fetch(`${API_BASE_URL}/reservations/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                dynamicContent.innerHTML = '<p class="info-msg"> No tienes ningún ritual programado.</p>';
                return;
            }

            if (!response.ok) {
                throw new Error('Error al traer la lista de rituales');
            }

            const reservations = await response.json();
            renderReservations(reservations);

        } catch (error) {
            dynamicContent.innerHTML = `<p class="error-msg">Error: ${error.message}</p>`;
        }
    }

    function renderProfile(user) {
        dynamicContent.innerHTML = `
            <div class="profile-center-card">
                <div class="profile-avatar-frame">
                    <img src="${user.profilePicture || '../assets/img/landing.jpg'}" alt="Avatar místico">
                </div>
                <h2>${user.fullName}</h2>
                <p class="profile-intro">Bienvenido a tu refugio privado en La Guarida.</p>

                <div class="profile-fields">
                    <div class="form-group">
                        <label>Identificador de Usuario:</label>
                        <input type="text" class="readonly-input" value="Refugio Nº ${user.id || userId}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Correo Electrónico:</label>
                        <input type="text" class="readonly-input" value="${user.email}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Línea de Contacto</label>
                        <input type="text" class="readonly-input" value="${user.phone || 'No registrado'}" readonly>
                    </div>
                </div>
            </div>
        `;
    }

    function renderReservations(reservations) {
        let html = `<div class="profile-center-box">
            <h3 class="section-title" style="margin-bottom: 30px;">Tus Rituales</h3>`;

        reservations.forEach(res => {
            const fechaCita = new Date(res.dateTime);
            const dia = fechaCita.getDate();
            const mes = fechaCita.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
            const hora = fechaCita.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            html += `
                    <article class="ritual-card" id="reserva-${res.reservationId ||res.id}">
                        <div class="ritual-date">
                            <span class="day">${dia}</span>
                            <span class="month">${mes}</span>
                        </div>
                        <div class="ritual-info">
                            <h4>Ritual: ${res.serviceName.toUpperCase()}</h4>
                            <p>Hora del Ritual: ${hora} hs</p>
                            <p>Código de Resguardo: #${res.reservationId || res.id}</p>
                        </div>
                        <div class="ritual-status">
                            <span class="badge">${res.status || 'CONFIRMADA'}</span>
                            <button class="btn-cancel" onclick="cancelarReserva(${res.reservationId || res.id})"> Romper Pacto (Cancelar)</button>
                        </div>
                    </article>
                `;
        });

        html += '</div>';
        dynamicContent.innerHTML = html;
    }

    window.cancelarReserva = async function (reservationId) {
        if (confirm("¿Seguro que deseas cancelar esta cita?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('El servidor denegó la cancelación.');
                }
                alert("El pacto ha sido cancelado.");
                fetchUserReservations();
            } catch (error) {
                alert(`Error al cancelar la cita: ${error.message}`);
            }
        }
    };

    function manejarSesionExpirada() {
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        localStorage.clear();
        window.location.href = 'login.html';
    }

    btnShowProfile.addEventListener('click', () => {
        setActiveButton(btnShowProfile);
        fetchUserProfile();
    });

    btnShowReservations.addEventListener('click', () => {
        setActiveButton(btnShowReservations);
        fetchUserReservations();
    });

    btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    function setActiveButton(activeBtn) {
        document.querySelectorAll('.btn-menu-lateral').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    setActiveButton(btnShowProfile);
    fetchUserProfile();
});