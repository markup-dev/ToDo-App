// Импорт необходимых модулей
import { createElement } from '../utils/createElement.js';
import { addTask } from '../services/TaskService.js';
import { authService } from '../services/AuthService.js';
import { deleteTask, editTask } from '../services/TaskService.js';

// Создание модального окна для добавления задачи
export const createTaskModal = () => {
	// Создание основного контейнера модального окна
	const modal = createElement('div', ['modal', 'fade']);
	modal.id = 'addTaskModal';
	modal.tabIndex = -1;

	// Создание диалогового окна
	const modalDialog = createElement('div', ['modal-dialog']);
	const form = createElement('form', ['modal-content']);

	// Создание заголовка модального окна
	const modalHeader = createElement('div', ['modal-header']);
	const title = createElement('h5', ['modal-title'], 'Добавить новую задачу');
	title.id = 'addTaskModalLabel';

	// Кнопка закрытия модального окна
	const closeButton = createElement('button', ['btn-close']);
	closeButton.type = 'button';
	closeButton.dataset.bsDismiss = 'modal';

	modalHeader.append(title, closeButton);

	// Создание тела модального окна
	const modalBody = createElement('div', ['modal-body']);

	// Группа полей для ввода задачи
	const taskGroup = createElement('div', ['mb-3']);
	const taskLabel = createElement('label', ['form-label'], 'Задача');
	const taskInput = createElement('input', ['form-control']);
	taskInput.type = 'text';
	taskInput.required = true;
	taskInput.maxLength = 150;
	taskInput.placeholder = 'Введите задачу';

	// Счетчик символов
	const charCounter = createElement('small', ['text-muted'], '0/200 символов');

	taskGroup.append(taskLabel, taskInput, charCounter);

	// Группа полей для выбора приоритета
	const priorityGroup = createElement('div', ['mb-3']);
	const priorityLabel = createElement('label', ['form-label'], 'Приоритет');
	const prioritySelect = createElement('select', ['form-select']);

	// Добавление опций приоритета
	const priorities = ['Обычная', 'Важная', 'Срочная'];
	priorities.forEach(priority => {
		const option = createElement('option', [], priority);
		prioritySelect.append(option);
	});

	priorityGroup.append(priorityLabel, prioritySelect);
	modalBody.append(taskGroup, priorityGroup);

	// Создание футера модального окна
	const modalFooter = createElement('div', ['modal-footer']);
	const submitButton = createElement('button', ['btn', 'btn-primary', 'bg-gradient'], 'Добавить');
	submitButton.type = 'submit';
	submitButton.disabled = true;

	const resetButton = createElement('button', ['btn', 'btn-warning', 'bg-gradient'], 'Очистить');
	resetButton.type = 'reset';

	modalFooter.append(resetButton, submitButton);

	// Сборка всех элементов модального окна
	form.append(modalHeader, modalBody, modalFooter);
	modalDialog.appendChild(form);
	modal.appendChild(modalDialog);

	// Обработчик ввода текста задачи
	taskInput.addEventListener('input', () => {
		const currentLength = taskInput.value.length;
		const isValid = taskInput.value.trim().length > 0;
		submitButton.disabled = !isValid;

		// Обновление счетчика символов
		charCounter.textContent = `${currentLength}/150 символов`;

		// Валидация поля ввода
		if (taskInput.value.length > 0) {
			taskInput.classList.toggle('is-valid', isValid);
			taskInput.classList.toggle('is-invalid', !isValid);
		} else {
			taskInput.classList.remove('is-valid', 'is-invalid');
		}
	});

	// Обработчик отправки формы
	form.addEventListener('submit', e => {
		e.preventDefault();
		const taskValue = taskInput.value.trim();
		if (!taskValue) return;

		// Создание новой задачи
		const newTask = {
			task: taskValue,
			priority: prioritySelect.value,
			status: 'В процессе',
			id: Math.random().toString().substring(2, 10)
		};

		addTask(newTask);

		// Сброс формы
		charCounter.textContent = '0/150 символов';
		form.reset();
		submitButton.disabled = true;
	});

	return modal;
};

// Создание модального окна для редактирования задачи
export const createEditTaskModal = task => {
	// Создание основного контейнера модального окна
	const modal = createElement('div', ['modal', 'fade']);
	modal.id = 'editTaskModal';
	modal.tabIndex = -1;

	// Создание диалогового окна
	const modalDialog = createElement('div', ['modal-dialog']);
	const form = createElement('form', ['modal-content']);

	// Создание заголовка модального окна
	const modalHeader = createElement('div', ['modal-header']);
	const title = createElement('h5', ['modal-title'], 'Редактировать задачу');
	title.id = 'editTaskModalLabel';

	// Кнопка закрытия
	const closeButton = createElement('button', ['btn-close']);
	closeButton.type = 'button';
	closeButton.dataset.bsDismiss = 'modal';

	modalHeader.append(title, closeButton);

	// Создание тела модального окна
	const modalBody = createElement('div', ['modal-body']);

	// Группа полей для редактирования задачи
	const taskGroup = createElement('div', ['mb-3']);
	const taskLabel = createElement('label', ['form-label'], 'Задача');
	const taskInput = createElement('input', ['form-control']);
	taskInput.type = 'text';
	taskInput.required = true;
	taskInput.maxLength = 150;
	taskInput.value = task.task;
	taskInput.placeholder = 'Введите задачу';

	// Счетчик символов
	const charCounter = createElement('small', ['text-muted'], `${task.task.length}/150 символов`);

	taskGroup.append(taskLabel, taskInput, charCounter);

	// Группа полей для выбора приоритета
	const priorityGroup = createElement('div', ['mb-3']);
	const priorityLabel = createElement('label', ['form-label'], 'Приоритет');
	const prioritySelect = createElement('select', ['form-select']);

	// Добавление опций приоритета с выбором текущего значения
	const priorities = ['Обычная', 'Важная', 'Срочная'];
	priorities.forEach(priority => {
		const option = createElement('option', [], priority);
		if (priority === task.priority) {
			option.selected = true;
		}
		prioritySelect.append(option);
	});

	priorityGroup.append(priorityLabel, prioritySelect);
	modalBody.append(taskGroup, priorityGroup);

	// Создание футера модального окна
	const modalFooter = createElement('div', ['modal-footer']);
	const submitButton = createElement('button', ['btn', 'btn-primary', 'bg-gradient'], 'Сохранить');
	submitButton.type = 'submit';

	const resetButton = createElement('button', ['btn', 'btn-warning', 'bg-gradient'], 'Очистить');
	resetButton.type = 'reset';

	modalFooter.append(resetButton, submitButton);

	// Сборка всех элементов модального окна
	form.append(modalHeader, modalBody, modalFooter);
	modalDialog.appendChild(form);
	modal.appendChild(modalDialog);

	// Валидация ввода
	taskInput.addEventListener('input', () => {
		const currentLength = taskInput.value.length;
		const isValid = taskInput.value.trim().length > 0;
		submitButton.disabled = !isValid;

		charCounter.textContent = `${currentLength}/150 символов`;

		if (taskInput.value.length > 0) {
			taskInput.classList.toggle('is-valid', isValid);
			taskInput.classList.toggle('is-invalid', !isValid);
		} else {
			taskInput.classList.remove('is-valid', 'is-invalid');
		}
	});

	// Обработка отправки формы
	form.addEventListener('submit', e => {
		e.preventDefault();
		const taskValue = taskInput.value.trim();
		if (!taskValue) return;

		// Обновление задачи
		const updatedTask = {
			...task,
			task: taskValue,
			priority: prioritySelect.value
		};

		editTask(updatedTask);

		// Закрытие модального окна
		const bsModal = bootstrap.Modal.getInstance(modal);
		bsModal.hide();
	});

	// Удаление модального окна после закрытия
	modal.addEventListener('hidden.bs.modal', () => modal.remove());

	return modal;
};

// Создание модального окна подтверждения удаления
export const createDeleteConfirmationModal = taskId => {
	// Создание основного контейнера модального окна
	const modal = createElement('div', ['modal', 'fade']);
	modal.id = 'deleteConfirmModal';
	modal.tabIndex = -1;

	// Создание структуры модального окна
	const modalDialog = createElement('div', ['modal-dialog']);
	const modalContent = createElement('div', ['modal-content']);
	const modalHeader = createElement('div', ['modal-header']);
	const modalBody = createElement('div', ['modal-body']);
	const modalFooter = createElement('div', ['modal-footer']);

	// Создание заголовка
	const title = createElement('h5', ['modal-title'], 'Подтверждение удаления');
	const closeButton = createElement('button', ['btn-close']);
	closeButton.type = 'button';
	closeButton.dataset.bsDismiss = 'modal';

	// Создание текста подтверждения
	const bodyText = createElement('p', [], 'Вы уверены, что хотите удалить эту задачу?');

	// Создание кнопок
	const confirmButton = createElement('button', ['btn', 'btn-danger', 'bg-gradient'], 'Удалить');
	const cancelButton = createElement('button', ['btn', 'btn-secondary', 'bg-gradient'], 'Отмена');
	cancelButton.dataset.bsDismiss = 'modal';

	// Сборка модального окна
	modalHeader.append(title, closeButton);
	modalBody.appendChild(bodyText);
	modalFooter.append(cancelButton, confirmButton);
	modalContent.append(modalHeader, modalBody, modalFooter);
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	// Обработчик подтверждения удаления
	confirmButton.addEventListener('click', () => {
		confirmButton.blur();
		const bsModal = bootstrap.Modal.getInstance(modal);
		bsModal.hide();
		deleteTask(taskId);
		modal.remove();
	});

	// Удаление модального окна после закрытия
	modal.addEventListener('hidden.bs.modal', () => modal.remove());

	return modal;
};

// Создание модального окна авторизации
export const createAuthModal = () => {
	// Создание основного контейнера модального окна
	const modal = createElement('div', ['modal', 'fade']);
	modal.id = 'authModal';
	modal.tabIndex = -1;

	// Создание структуры модального окна
	const modalDialog = createElement('div', ['modal-dialog']);
	const modalContent = createElement('div', ['modal-content']);
	const modalHeader = createElement('div', ['modal-header']);
	const modalBody = createElement('div', ['modal-body']);

	// Создание заголовка
	const title = createElement('h5', ['modal-title'], 'Добро пожаловать!');

	// Создание формы авторизации
	const form = createElement('form');
	const inputGroup = createElement('div', ['form-group', 'mb-3']);
	const label = createElement('label', ['form-label'], 'Введите ваше имя:');
	const input = createElement('input', ['form-control']);
	input.type = 'text';
	input.required = true;

	// Создание кнопки входа
	const submitBtn = createElement('button', ['btn', 'btn-primary', 'bg-gradient'], 'Войти');
	submitBtn.type = 'submit';
	submitBtn.disabled = true;

	// Валидация ввода имени
	input.addEventListener('input', () => {
		const isValid = input.value.trim().length > 0;
		submitBtn.disabled = !input.value.trim();

		if (input.value.length > 0) {
			input.classList.toggle('is-valid', isValid);
			input.classList.toggle('is-invalid', !isValid);
		} else {
			input.classList.remove('is-valid', 'is-invalid');
		}
	});

	// Обработка отправки формы
	form.addEventListener('submit', e => {
		e.preventDefault();
		const username = input.value.trim();
		if (username) {
			authService.login(username);
			const bsModal = bootstrap.Modal.getInstance(modal);
			bsModal.hide();
			modal.addEventListener('hidden.bs.modal', () => {
				modal.remove();
			});
		}
	});

	// Сборка модального окна
	inputGroup.append(label, input);
	form.append(inputGroup, submitBtn);
	modalHeader.appendChild(title);
	modalBody.appendChild(form);
	modalContent.append(modalHeader, modalBody);
	modalDialog.appendChild(modalContent);
	modal.appendChild(modalDialog);

	return modal;
};
