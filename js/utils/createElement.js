// Утилита для создания HTML элементов с заданными классами и текстовым содержимым
export const createElement = (tag, classNames = [], textContent = '') => {
    // Создание элемента
    const element = document.createElement(tag);
    
    // Добавление классов, если они указаны
    if (classNames.length) {
        element.classList.add(...classNames);
    }
    
    // Добавление текстового содержимого, если оно указано
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
};
