document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        errorMessageDiv.classList.add('d-none');
        
        if (email === '' || password === '') {
            showError('El correo y la contraseña son requeridos.');
            return;
        }

        if (email.length > 100) {
            showError('El correo no puede tener más de 100 caracteres.');
            return;
        }

        const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@looprex.cl'];
        const isDomainValid = allowedDomains.some(domain => email.endsWith(domain));
        if (!isDomainValid) {
            showError('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
            return;
        }

        if (password.length < 4 || password.length > 10) {
            showError('La contraseña debe tener entre 4 y 10 caracteres.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            alert('¡Inicio de sesión exitoso!');

            if (foundUser.role === 'Administrador') {
                window.location.href = '/admin/index1.html';
            } else {
                window.location.href = '/pages/mi-cuenta.html'; 
            }
        } else {
            
            errorMessageDiv.textContent = 'Correo o contraseña incorrectos.';
            errorMessageDiv.classList.remove('d-none');
        }

    });

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('d-none'); 
    }

});