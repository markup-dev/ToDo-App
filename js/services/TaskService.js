import { storageService } from './StorageService.js';
import { createTableRow } from '../components/Table.js';

// Функция сортировки задач
// Сортирует задачи по статусу (выполненные в конец)
// и приоритету (срочные -> важные -> обычные)
export const sortTasks = tasks => {
	return tasks.sort((a, b) => {
		// Сначала сортируем по статусу
		if (a.status === 'Выполнено' && b.status !== 'Выполнено') return 1;
		if (a.status !== 'Выполнено' && b.status === 'Выполнено') return -1;

		// Если статусы одинаковые, сортируем по приоритету
		if (a.status === b.status) {
			const priorityOrder = {
				Срочная: 0, // Наивысший приоритет
				Важная: 1,
				Обычная: 2 // Низший приоритет
			};
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		}
		return 0;
	});
};

// Добавление новой задачи
// Сохраняет задачу в хранилище и обновляет список
export const addTask = task => {
	const tasks = storageService.getTasks();
	tasks.push(task);
	storageService.saveTasks(tasks);
	updateTasksList();
};

// Редактирование существующей задачи
// Находит задачу по ID и обновляет её данные
export const editTask = updatedTask => {
	const tasks = storageService.getTasks();
	const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
	if (taskIndex !== -1) {
		tasks[taskIndex] = updatedTask;
		storageService.saveTasks(tasks);
		updateTasksList();
	}
};

// Удаление задачи по ID
// Фильтрует массив задач, исключая удаляемую
export const deleteTask = taskId => {
	const tasks = storageService.getTasks();
	const updatedTasks = tasks.filter(task => task.id !== taskId);
	storageService.saveTasks(updatedTasks);
	updateTasksList();
};

// Отметка задачи как выполненной
// Изменяет статус задачи на "Выполнено"
export const completeTask = taskId => {
	const tasks = storageService.getTasks();
	const taskIndex = tasks.findIndex(task => task.id === taskId);
	if (taskIndex !== -1) {
		tasks[taskIndex].status = 'Выполнено';
		storageService.saveTasks(tasks);
		updateTasksList();
	}
};

// Очистка всех задач пользователя
// Сохраняет пустой массив задач
export const clearAllTasks = () => {
	storageService.saveTasks([]);
	updateTasksList();
};

// Обновление списка задач в интерфейсе
// Получает задачи из хранилища, сортирует их и отображает в таблице
export const updateTasksList = () => {
	const tbody = document.querySelector('tbody');
	tbody.innerHTML = ''; // Очистка текущего списка

	// Получение и сортировка задач
	const tasks = storageService.getTasks();
	const sortedTasks = sortTasks(tasks);

	// Создание строк таблицы для каждой задачи
	sortedTasks.forEach((task, index) => {
		const tr = createTableRow(task, index);
		tbody.appendChild(tr);
	});
};
