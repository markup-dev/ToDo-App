import { createElement } from '../utils/createElement.js';
import { storageService } from '../services/StorageService.js';
import { updateTasksList, sortTasks } from '../services/TaskService.js';
import { createTableRow } from './Table.js';

export const createSearchContainer = () => {
	const searchContainer = createElement('div', ['w-75', 'mb-4', 'd-flex', 'gap-2', 'align-items-center']);

	const searchInput = createElement('input', ['form-control']);
	searchInput.type = 'text';
	searchInput.placeholder = 'Поиск задач...';

	const searchButton = createElement('button', ['btn', 'btn-primary', 'bg-gradient'], 'Найти');

	const clearButton = createElement('button', ['btn', 'btn-secondary', 'bg-gradient'], 'Очистить');

	const handleSearch = () => {
		const searchTerm = searchInput.value.toLowerCase().trim();
		const tasks = storageService.getTasks();
		const tbody = document.querySelector('tbody');
		tbody.innerHTML = '';

		const filteredTasks = tasks.filter(task => task.task.toLowerCase().includes(searchTerm));

		const sortedTasks = sortTasks(filteredTasks);

		sortedTasks.forEach((task, index) => {
			const tr = createTableRow(task, index);
			tbody.appendChild(tr);
		});
	};

	searchInput.addEventListener('input', handleSearch);
	searchButton.addEventListener('click', handleSearch);
	clearButton.addEventListener('click', () => {
		searchInput.value = '';
		updateTasksList();
	});

	searchContainer.append(searchInput, searchButton, clearButton);
	return searchContainer;
};
