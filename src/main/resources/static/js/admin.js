document.addEventListener('DOMContentLoaded', function () {
    const userInfoElement = document.getElementById('user-info');
    const sidebar = document.getElementById('sidebar');

    // Получение данных текущего пользователя
    fetch('/user/me')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            userInfoElement.innerHTML = `${user.email} with roles: ${user.roles.map(role => role.name).join(', ')}`;

            sidebar.innerHTML = `
                <div class="d-flex flex-column p-3 bg-light" style="width: 250px; height: 100vh;">
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item">
                            <a href="/admin" class="nav-link ${window.location.pathname.startsWith('/admin') ? 'active' : ''}">Admin</a>
                        </li>
                        <li class="nav-item">
                            <a href="/js/index.html" class="nav-link ${window.location.pathname.startsWith('/user') ? 'active' : ''}">User</a>
                        </li>
                    </ul>
                </div>
            `;
        })
        .catch(error => {
            console.error('Ошибка:', error);
            userInfoElement.textContent = 'Error loading user';
        });

    // Функция для загрузки и отображения списка пользователей
    function fetchUsers() {
        fetch('/admin/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(users => updateUsersTable(users))
            .catch(error => {
                console.error('Ошибка загрузки пользователей:', error);
                alert('Ошибка загрузки пользователей: ' + error.message);
            });
    }

    // Обновление таблицы пользователей
    function updateUsersTable(users) {
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(r => r.name).join(', ')}</td>
                <td>
                    <button class="btn btn-info btn-sm edit-btn" data-id="${user.id}" 
                            data-bs-toggle="modal" data-bs-target="#editModal">
                        Edit
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">
                        Delete
                    </button>
                </td>`;
            tableBody.appendChild(row);
        });

        // Назначение обработчиков для кнопок Edit
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                fetchUserForEdit(userId);
            });
        });

        // Назначение обработчиков для кнопок Delete
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                deleteUser(userId);
            });
        });
    }

    // Загрузка данных пользователя для редактирования
    function fetchUserForEdit(userId) {
        fetch(`/admin/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(user => fillEditForm(user))
            .catch(error => {
                console.error('Ошибка получения данных пользователя:', error);
                alert('Ошибка загрузки данных пользователя: ' + error.message);
            });
    }

    // Заполнение формы редактирования
    function fillEditForm(user) {
        const form = document.getElementById('editUserForm');

        // Заполнение основных полей
        form.querySelector('input[name="userId"]').value = user.id;
        form.querySelector('input[name="name"]').value = user.name || '';
        form.querySelector('input[name="email"]').value = user.email || '';
        form.querySelector('input[name="password"]').value = '';

        // Загрузка и установка ролей
        fetchRoles().then(roles => {
            const rolesSelect = form.querySelector('select[name="rolesSelected"]');
            rolesSelect.innerHTML = '';

            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;

                // Отмечаем роли, которые есть у пользователя
                if (user.roles.some(r => r.id === role.id)) {
                    option.selected = true;
                }

                rolesSelect.appendChild(option);
            });
        });
    }

    // Загрузка списка всех ролей
    function fetchRoles() {
        return fetch('/admin/roles')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Ошибка загрузки ролей:', error);
                alert('Ошибка загрузки ролей: ' + error.message);
                return [];
            });
    }

    // Удаление пользователя
    function deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            fetch(`/admin/users/${userId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    fetchUsers(); // Обновляем список пользователей
                    alert('Пользователь успешно удалён');
                })
                .catch(error => {
                    console.error('Ошибка удаления пользователя:', error);
                    alert('Ошибка при удалении пользователя: ' + error.message);
                });
        }
    }

    // Обработчик сохранения изменений пользователя
    document.getElementById('saveChangesBtn')?.addEventListener('click', function() {
        const form = document.getElementById('editUserForm');
        const userId = form.querySelector('input[name="userId"]').value;

        const dto = {
            id: parseInt(userId),
            name: form.querySelector('input[name="name"]').value.trim(),
            email: form.querySelector('input[name="email"]').value.trim(),
            password: form.querySelector('input[name="password"]').value.trim(),
            rolesSelected: Array.from(form.querySelectorAll('select[name="rolesSelected"] option:checked'))
                .map(option => parseInt(option.value))
        };

        // Валидация данных
        if (!dto.name || !dto.email) {
            alert('Заполните обязательные поля: Имя, Фамилия, Email');
            return;
        }

        fetch(`/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(() => {
                alert('Пользователь успешно обновлён');
                // Закрываем модальное окно без jQuery
                const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
                fetchUsers(); // Обновляем список пользователей
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при обновлении пользователя: ' + error.message);
            });
    });

    // Обработчик формы добавления нового пользователя
    document.getElementById('addUserForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const dto = {
            name: this.querySelector('input[name="name"]').value.trim(),
            email: this.querySelector('input[name="email"]').value.trim(),
            password: this.querySelector('input[name="password"]').value.trim(),
            rolesSelected: Array.from(this.querySelectorAll('select[name="rolesSelected"] option:checked'))
                .map(option => parseInt(option.value))
        };

        // Валидация данных
        if (!dto.name || !dto.email || !dto.password) {
            alert('Заполните все обязательные поля: Имя, Фамилия, Email, Пароль');
            return;
        }

        fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(() => {
                alert('Пользователь успешно создан');
                this.reset(); // Очищаем форму
                fetchUsers(); // Обновляем список пользователей
                // закрытие модальное окно без jQuery
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                modal.hide();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при создании пользователя: ' + error.message);
            });
    });

    // Инициализация при загрузке страницы
    fetchUsers();

    // Загрузка ролей для формы добавления пользователя
    fetchRoles().then(roles => {
        const addFormSelect = document.querySelector('#addUserForm select[name="rolesSelected"]');
        if (addFormSelect) {
            addFormSelect.innerHTML = '';
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name;
                addFormSelect.appendChild(option);
            });
        }
    });
});