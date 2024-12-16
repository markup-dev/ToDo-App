import { createElement } from '../utils/createElement.js';
import { createDeleteConfirmationModal, createEditTaskModal } from './Modal.js';
import { storageService } from '../services/StorageService.js';
import { completeTask} from '../services/TaskService.js';

// Создание таблицы задач
export const createTable = () => {
	// Создание обертки таблицы с настройкой ширины
	const tableWrapper = createElement('div', ['table-wrapper']);
	tableWrapper.style.width = '90%';
	
	// Создание таблицы с необходимыми классами
	const table = createElement('table', ['table', 'table-hover', 'table-bordered', 'border-dark']);

	// Добавление заголовка и тела таблицы
	table.append(createTableHeader(), createElement('tbody'));

	tableWrapper.appendChild(table);
	return tableWrapper;
};

// Создание заголовка таблицы
const createTableHeader = () => {
	const thead = createElement('thead', ['bg-dark']);
	const tr = createElement('tr', ['text-light']);
	const headers = ['№', 'Задача', 'Статус', 'Приоритет', 'Действия'];

	// Создание ячеек заголовка
	headers.forEach(text => {
		const th = createElement('th', [], text);
		tr.appendChild(th);
	});

	thead.appendChild(tr);
	return thead;
};

// Создание кнопок действий для задачи
const createActionButtons = taskId => {
	// Создание контейнера для кнопок
	const buttonWrapper = createElement('td', ['d-flex', 'justify-content-evenly', 'gap-2']);

	// Создание кнопок управления задачей
	const editButton = createElement('button', ['btn', 'btn-primary', 'bg-gradient'], 'Изменить');
	const deleteButton = createElement('button', ['btn', 'btn-danger', 'bg-gradient'], 'Удалить');
	const completeButton = createElement('button', ['btn', 'btn-success', 'bg-gradient'], 'Завершить');

	// Обработчик редактирования задачи
	editButton.addEventListener('click', () => {
		const tasks = storageService.getTasks();
		const task = tasks.find(t => t.id === taskId);
		if (task) {
			const modal = createEditTaskModal(task);
			document.body.appendChild(modal);
			new bootstrap.Modal(modal).show();
		}
	});

	// Обработчик удаления задачи
	deleteButton.addEventListener('click', () => {
		const modal = createDeleteConfirmationModal(taskId);
		document.body.appendChild(modal);
		new bootstrap.Modal(modal).show();
	});

	// Обработчик завершения задачи
	completeButton.addEventListener('click', () => {
		completeTask(taskId);
	});

	// Проверка статуса задачи и блокировка кнопок
	const tasks = storageService.getTasks();
	const task = tasks.find(t => t.id === taskId);
	if (task && task.status === 'Выполнено') {
		editButton.disabled = true;
		completeButton.disabled = true;
	}

	buttonWrapper.append(editButton, deleteButton, completeButton);
	return buttonWrapper;
};

// Создание строки таблицы для задачи
export const createTableRow = (task, index) => {
	const tr = createElement('tr');

	// Установка цвета строки в зависимости от статуса и приоритета
	if (task.status === 'Выполнено') {
		tr.classList.add('table-secondary');
	} else {
		switch (task.priority) {
			case 'Обычная':
				tr.classList.add('table-light');
				break;
			case 'Важная':
				tr.classList.add('table-warning');
				break;
			case 'Срочная':
				tr.classList.add('table-danger');
				break;
		}
	}

	// Создание ячейки с номером
	const indexCell = createElement('td', [], String(index + 1));
	
	// Создание ячейки с текстом задачи
	const taskCell = createElement('td', [], task.task);
	// Настройка стилей для длинного текста
	taskCell.style.maxWidth = '300px';
	taskCell.style.whiteSpace = 'nowrap';
	taskCell.style.overflow = 'hidden'; 
	taskCell.style.textOverflow = 'ellipsis'; 
	taskCell.title = task.task;
	
	// Создание ячеек статуса и приоритета
	const statusCell = createElement('td', [], task.status);
	const priorityCell = createElement('td', [], task.priority);
	const actionsCell = createActionButtons(task.id);

	// Добавление зачеркивания для выполненных задач
	if (task.status === 'Выполнено') {
		taskCell.style.textDecoration = 'line-through';
	}

	// Сборка строки таблицы
	tr.append(indexCell, taskCell, statusCell, priorityCell, actionsCell);
	return tr;
};
