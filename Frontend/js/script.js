const token = localStorage.getItem('jwt_token');
    const userId = localStorage.getItem('userId');
    const profileLink = document.getElementById('profile-link');

    if (token && userId && profileLink) {
        profileLink.innerHTML = `<a href="profile.html">Mi refugio</a>`;
    }