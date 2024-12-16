import { createElement } from '../utils/createElement.js';
import { storageService } from '../services/StorageService.js';
import { clearAllTasks } from '../services/TaskService.js';
import { createDeleteConfirmationModal } from './Modal.js';

// Создание основной формы управления задачами
export const createMainForm = () => {
	// Создание формы с кнопками управления
	const form = createElement('form', ['d-flex', 'align-items-center']);

	// Создание кнопки добавления новой задачи
	const addButton = createElement('button', ['btn', 'btn-primary', 'me-3', 'bg-gradient'], 'Добавить задачу');
	addButton.type = 'button';
	addButton.dataset.bsToggle = 'modal';
	addButton.dataset.bsTarget = '#addTaskModal';

	// Создание кнопки очистки всех задач
	const resetButton = createElement('button', ['btn', 'btn-warning', 'bg-gradient'], 'Очистить');
	resetButton.type = 'reset';

	// Обработчик клика по кнопке очистки
	resetButton.addEventListener('click', e => {
		e.preventDefault();
		// Проверка наличия задач перед очисткой
		const tasks = storageService.getTasks();
		if (tasks.length > 0) {
			// Создание модального окна подтверждения очистки
			const modal = createDeleteConfirmationModal(null);
			modal.querySelector('.modal-title').textContent = 'Подтверждение очистки';
			modal.querySelector('.modal-body p').textContent = 'Вы уверены, что хотите удалить все задачи?';

			// Настройка обработчика подтверждения
			const confirmButton = modal.querySelector('.btn-danger');
			confirmButton.addEventListener('click', () => {
					clearAllTasks();
					const bsModal = bootstrap.Modal.getInstance(modal);
					bsModal.hide();
				}
			);

			// Показ модального окна
			document.body.appendChild(modal);
			new bootstrap.Modal(modal).show();
		}
	});

	// Добавление кнопок в форму
	form.append(addButton, resetButton);
	return form;
};
