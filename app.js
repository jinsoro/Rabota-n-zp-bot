// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// 1. Включаем полноэкранный режим
if (tg.requestFullscreen) {
    tg.requestFullscreen();
}
// Разворачиваем на всю высоту (на случай, если fullscreen не сработал)
tg.expand();

// Применяем цвета темы Telegram (если нужно)
tg.setHeaderColor('#1c2536');

// --- ЛОГИКА КАЛЕНДАРЯ ---
let currentDate = new Date(); // Текущая дата
let selectedDate = new Date();

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const calendarDays = document.getElementById('calendar-days');
const monthYearLabel = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

function renderCalendar() {
    calendarDays.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYearLabel.textContent = `${monthNames[month]} ${year} г.`;
    
    // Первый день месяца (0 - Вс, 1 - Пн...)
    let firstDay = new Date(year, month, 1).getDay();
    // Корректировка для России (неделя начинается с Пн)
    if (firstDay === 0) firstDay = 7;
    firstDay -= 1; 
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Пустые ячейки перед первым днем
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'empty');
        calendarDays.appendChild(emptyDiv);
    }
    
    // Дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;
        
        // Проверка на сегодняшний день
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // Проверка на выбранный день
        if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }

        // Клик по дню
        dayDiv.addEventListener('click', () => {
            selectedDate = new Date(year, month, i);
            renderCalendar(); // Перерисовываем, чтобы выделить новый день
            
            // Здесь можно добавить логику: показать смену за этот день
            console.log('Выбран день:', selectedDate.toLocaleDateString());
        });

        calendarDays.appendChild(dayDiv);
    }
}

// Обработчики кнопок календаря
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Первый рендер
renderCalendar();

// --- ЛОГИКА БОТА ---
// Отправка сообщения боту (чтобы бот знал, что приложение открыто)
tg.ready();
tg.MainButton.setText("Сохранить");
tg.MainButton.onClick(() => {
    // Это пример. MainButton - это кнопка внизу экрана Telegram.
    // Если она вам не нужна, не вызывайте tg.MainButton.show()
    console.log("Нажата кнопка Сохранить");
});

// Пример сохранения в облако Telegram (CloudStorage)
// На кнопку FAB (добавить смену) повесим тестовое сохранение
document.getElementById('add-shift-btn').addEventListener('click', () => {
    const shiftData = {
        date: selectedDate.toISOString(),
        hours: 8,
        earnings: 5000
    };

    // Сохраняем в облако Telegram
    tg.CloudStorage.setItem('test_shift', JSON.stringify(shiftData), (error, success) => {
        if (error) {
            tg.showAlert("Ошибка сохранения: " + error);
        } else {
            tg.showAlert("Смена сохранена в облако Telegram!");
        }
    });
});

// --- ЛОГИКА НИЖНЕГО МЕНЮ ---
const navBtns = document.querySelectorAll('.nav-btn');
navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Убираем активный класс со всех
        navBtns.forEach(b => b.classList.remove('active'));
        // Добавляем текущему
        e.currentTarget.classList.add('active');
        
        // Здесь логика переключения экранов (пока просто заглушка)
        const tab = e.currentTarget.dataset.tab;
        console.log("Переход на вкладку:", tab);
    });
});
