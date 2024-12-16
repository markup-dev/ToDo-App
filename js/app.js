// Импорт необходимых сервисов и компонентов
import { authService } from './services/AuthService.js';
import { createElement } from './utils/createElement.js';
import { createMainForm } from './components/Form.js';
import { createTable } from './components/Table.js';
import { createTaskModal, createAuthModal, createDeleteConfirmationModal } from './components/Modal.js';
import { createSearchContainer } from './components/Search.js';

const createHeader = () => createElement('h1', ['mb-5', 'fw-bold'], 'ToDo App');

// Создание блока информации о пользователе
const createUserInfo = () => {
	const userInfo = createElement('div', ['user-info', 'd-flex', 'align-items-center', 'gap-3']);
	const userText = createElement('span', ['fs-5']);
	const logoutBtn = createElement('button', ['btn', 'btn-outline-danger', 'btn-sm', 'bg-gradient'], 'Выйти');

	// Обработчик клика по кнопке выхода
	logoutBtn.addEventListener('click', () => {
		const modal = createDeleteConfirmationModal(null);
		modal.querySelector('.modal-title').textContent = 'Подтверждение выхода';
		modal.querySelector('.modal-body p').textContent = 'Вы уверены, что хотите выйти из аккаунта?';

		const confirmButton = modal.querySelector('.btn-danger');
		confirmButton.textContent = 'Выйти';

		// Обработчик подтверждения выхода
		confirmButton.addEventListener(
			'click',
			() => {
				const bsModal = bootstrap.Modal.getInstance(modal);
				bsModal.hide();
				authService.logout();
				showAuthModal();
			}
		);

		document.body.appendChild(modal);
		new bootstrap.Modal(modal).show();
	});

	userInfo.append(userText, logoutBtn);
	return userInfo;
};

// Обновление информации о пользователе
const updateUserInfo = username => {
	const userInfo = document.querySelector('.user-info');
	const userText = userInfo.querySelector('span');
	const logoutBtn = userInfo.querySelector('button');

	if (username) {
		userText.textContent = `Пользователь: ${username}`;
		logoutBtn.style.display = 'block';
	} else {
		userText.textContent = '';
		logoutBtn.style.display = 'none';
	}
};

// Показ модального окна авторизации
const showAuthModal = () => {
	const authModal = createAuthModal();
	document.body.appendChild(authModal);
	const modal = new bootstrap.Modal(authModal, {
		backdrop: 'static',
		keyboard: false
	});
	modal.show();
};

// Построение основной страницы приложения
const buildPage = () => {
	const body = document.body;
	body.className = 'w-100 d-flex align-items-center justify-content-center';
	body.style.background = 'linear-gradient(180deg, #3697ef, #914e9d) fixed no-repeat';
	body.style.minHeight = '100vh';

	const container = document.getElementById('app-container');
	container.className =
		'my-5 border border-secondary border-3 p-3 d-flex align-items-center justify-content-center flex-column bg-light';
	container.style.width = '1000px';
	container.style.minHeight = '350px';
	container.style.borderRadius = '30px';

	const userControls = createElement('div', [
		'd-flex',
		'justify-content-between',
		'align-items-center',
		'w-75',
		'mb-3'
	]);
	userControls.append(createUserInfo(), createMainForm());

	const searchContainer = createSearchContainer();

	container.append(
		createHeader(), 
		userControls, 
		searchContainer,
		createTable(), 
		createTaskModal()
	);
};

// Инициализация приложения
const init = () => {
	buildPage();
	const currentUser = authService.init();

	if (currentUser) {
		updateUserInfo(currentUser);
	} else {
		showAuthModal();
	}
};

// Запуск приложения после загрузки DOM
window.addEventListener('DOMContentLoaded', init);
