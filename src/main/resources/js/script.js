document.addEventListener('DOMContentLoaded', function () {
    // Обработчик для модального окна редактирования
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const button = event.target;
            const tableRow = button.closest('tr');
            const modalId = button.getAttribute('data-bs-target');
            const modal = document.querySelector(modalId);

            // Получаем данные из строки таблицы
            const userId = tableRow.querySelector('td:nth-child(1)').textContent.trim();
            const name = tableRow.querySelector('td:nth-child(2)').textContent.trim();
            const email = tableRow.querySelector('td:nth-child(3)').textContent.trim();
            const rolesString = tableRow.querySelector('td:nth-child(4)').textContent.trim();

            // Заполняем форму в модальном окне
            const form = modal.querySelector('form');
            form.querySelector('input[name="id"]').value = userId;
            form.querySelector('input[name="name"]').value = name;
            form.querySelector('input[name="email"]').value = email;
            form.querySelector('input[name="password"]').value = '';

            // Обрабатываем роли
            const rolesSelect = form.querySelector('select[name="roles"]');
            const currentRoles = rolesString.split(',').map(r => r.trim());

            // Сбрасываем все выделения
            Array.from(rolesSelect.options).forEach(option => {
                option.selected = false;
            });

            // Устанавливаем текущие роли
            Array.from(rolesSelect.options).forEach(option => {
                if (currentRoles.includes(option.text.trim())) {
                    option.selected = true;
                }
            });
        });
    });

    // Обработчик для модального окна удаления
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const button = event.target;
            const tableRow = button.closest('tr');

            // Заполнение скрытых полей формы для удаления
            document.getElementById('delete-user-name').value = tableRow.querySelector('td:nth-child(1)').textContent.trim();
            document.getElementById('delete-user-email').value = tableRow.querySelector('td:nth-child(2)').textContent.trim();
            document.getElementById('delete-user-roles').value = tableRow.querySelector('td:nth-child(3)').textContent.trim();

            // Открытие модального окна для удаления
            const modal = new bootstrap.Modal(document.getElementById('deleteModal-' + tableRow.querySelector('td:nth-child(1)').textContent.trim()));
            modal.show();
        });
    });
});