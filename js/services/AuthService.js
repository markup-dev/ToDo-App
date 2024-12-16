import { storageService } from './StorageService.js';
import { updateTasksList } from './TaskService.js';

// Сервис авторизации пользователей
export const authService = {
	// Инициализация сервиса
	// Проверяет наличие сохраненной сессии пользователя
	init: () => {
		const currentUser = localStorage.getItem('currentUser');
		if (currentUser) {
			// Если пользователь найден, устанавливаем его как текущего
			storageService.setCurrentUser(currentUser);
			// Загружаем его задачи
			updateTasksList();
			return currentUser;
		}
		return null;
	},

	// Вход пользователя в систему
	// Сохраняет информацию о пользователе и инициализирует его данные
	login: username => {
		// Сохранение пользователя в localStorage
		localStorage.setItem('currentUser', username);
		storageService.setCurrentUser(username);

		// Создание хранилища задач для нового пользователя
		if (!localStorage.getItem(username)) {
			localStorage.setItem(username, JSON.stringify([]));
		}

		// Обновление интерфейса
		const userText = document.querySelector('.user-info span');
		const logoutBtn = document.querySelector('.user-info button');
		userText.textContent = `Пользователь: ${username}`;
		logoutBtn.style.display = 'block';

		// Загрузка задач пользователя
		updateTasksList();
	},

	// Выход пользователя из системы
	// Очищает данные текущей сессии
	logout: () => {
		// Удаление информации о текущем пользователе
		localStorage.removeItem('currentUser');
		storageService.setCurrentUser(null);

		// Очистка списка задач в интерфейсе
		document.querySelector('tbody').innerHTML = '';

		// Обновление интерфейса
		const userText = document.querySelector('.user-info span');
		const logoutBtn = document.querySelector('.user-info button');
		userText.textContent = '';
		logoutBtn.style.display = 'none';
	}
};
