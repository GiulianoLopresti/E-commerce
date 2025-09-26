document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validaciones básicas
        if (!name || !email || !password || !confirmPassword) {
            showMessage('Todos los campos son obligatorios.', 'danger');
            return;
        }
        if (password !== confirmPassword) {
            showMessage('Las contraseñas no coinciden.', 'danger');
            return;
        }

        // si el emaail es "admin@looprex.cl", el rol es Administrador, si no, es Cliente.
        const role = (email === 'admin@looprex.cl') ? 'Administrador' : 'Cliente';

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            showMessage('El correo electrónico ya está registrado.', 'danger');
            return;
        }

        const newUser = { name, email, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showMessage('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
        registerForm.reset();
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type}`;
        messageDiv.classList.remove('d-none');
    }
});