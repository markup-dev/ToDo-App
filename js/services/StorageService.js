// Переменная для хранения информации о текущем пользователе
let currentUser = null;

// Сервис для работы с локальным хранилищем
export const storageService = {
	// Установка текущего пользователя
	// Используется при входе в систему и выходе из нее
	setCurrentUser: user => {
		currentUser = user;
	},

	// Получение информации о текущем пользователе
	// Используется для проверки авторизации
	getCurrentUser: () => currentUser,

	// Получение списка задач текущего пользователя
	// Возвращает массив задач из localStorage или пустой массив, если пользователь не авторизован
	getTasks: () => {
		if (!currentUser) return [];
		const tasks = localStorage.getItem(currentUser);
		return tasks ? JSON.parse(tasks) : [];
	},

	// Сохранение списка задач в localStorage
	// Привязывает задачи к текущему пользователю
	saveTasks: tasks => {
		if (!currentUser) return;
		localStorage.setItem(currentUser, JSON.stringify(tasks));
	}
};
