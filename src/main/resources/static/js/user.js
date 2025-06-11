document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');  // Элемент для бокового меню
    const userInfoElement = document.getElementById('userData');  // Элемент для отображения данных о пользователе
    const userInfoTextElement = document.getElementById('user-info');  // Элемент для отображения в navbar
    const rolesSelect = document.querySelector('select[name="rolesSelected"]'); // Селектор для ролей

    // Получение данных текущего пользователя
    fetch('/user/me')  // Путь к API для получения данных текущего пользователя
        .then(response => {
            if (!response.ok) {
                throw new Error("Не авторизован");
            }
            return response.json();
        })
        .then(user => {
            // Показываем данные о текущем пользователе в таблице
            userInfoElement.innerHTML = `
                <table class="table table-striped table-bordered align-left">
                    <thead class="table-white text-left">
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.email}</td>
                            <td>${user.name}</td>
                            <td>${user.roles.map(r => r.name).join(', ')}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            // Обновляем информацию в верхней панели (navbar)
            userInfoTextElement.innerHTML = `${user.email} with roles: ${user.roles.map(r => r.name).join(', ')}`;

            // Обновляем боковое меню
            let sidebarContent = `
                <div class="d-flex flex-column p-3 bg-light" style="width: 250px; height: 100vh;">
                    <ul class="nav nav-pills flex-column mb-auto">`;

            // Если пользователь является администратором, добавляем вкладку Admin
            if (user.roles.some(role => role.name === 'ADMIN')) {
                sidebarContent += `
                    <li class="nav-item">
                        <a href="/admin" class="nav-link ${window.location.pathname.startsWith('/admin') ? 'active' : ''}">Admin</a>
                    </li>`;
            }

            // Вкладка User всегда отображается
            sidebarContent += `
                    <li class="nav-item">
                        <a href="/js/index.html" class="nav-link ${window.location.pathname.startsWith('/user') ? 'active' : ''}">User</a>
                    </li>`;

            sidebarContent += `</ul></div>`;
            sidebar.innerHTML = sidebarContent;  // Вставляем новый HTML в боковое меню

            // Заполнение ролей для формы редактирования/добавления пользователя
            loadRoles(user);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            userInfoElement.innerHTML = '<p>Вы не авторизованы. Перенаправление...</p>';
            setTimeout(() => window.location.href = '/login', 2000);  // Редирект на login, если ошибка
        });
});

// Функция для загрузки ролей в select
function loadRoles(user) {
    fetch('/admin/roles')  // Путь к API, которое возвращает список ролей
        .then(response => response.json())
        .then(roles => {
            rolesSelect.innerHTML = '';  // Очистить текущие роли в списке
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                rolesSelect.appendChild(option);
            });

            // Если редактируем пользователя, заполняем выбранные роли
            const selectedRoles = user.roles.map(role => role.id.toString());  // Получаем ids выбранных ролей
            rolesSelect.querySelectorAll('option').forEach(option => {
                if (selectedRoles.includes(option.value)) {
                    option.selected = true;  // Отметить роли, которые уже выбраны
                }
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки ролей:', error);
        });
}
