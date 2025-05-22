//бургер
const burgerMenu = document.querySelector('.burger');
const burgerOpen = document.querySelector('.burger-open');
const burgerClose = document.querySelector('.burger-close');

burgerOpen.addEventListener('click', () => {
    burgerMenu.classList.add('open');
    burgerOpen.style.display = 'none';
});

burgerClose.addEventListener('click', () => {
    burgerMenu.classList.remove('open');
    burgerOpen.style.display = 'block';
});

//валидация
function validateField(field) {
    const value = field.value.trim();
    const placeholder = field.placeholder.toLowerCase();
    
    if (placeholder.includes('375298794769')) {
        if (!/^\d{12}$/.test(value)) {
            field.style.border = '1px solid red';
            return false;
        }
    } 
    else if (placeholder.includes('ул.гагарина')) {
        if (value.length < 10) {
            field.style.border = '1px solid red';
            return false;
        }
    }
    else {
        if (!/^[а-яА-Я]{3,}$/.test(value)) {
            field.style.border = '1px solid red';
            return false;
        }
    }
    
    field.style.border = '1px solid #ccc';
    return true;
}

//форма
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const inputs = document.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        const orderNumber = Math.floor(Math.random() * 100) + 1;
        alert(`Вы успешно заказали товар, ваш номер заказа - ${orderNumber}, скоро с вами свяжется наш оператор.`);
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    }
});

//счетчик
function updateCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    
    cart.forEach(item => {
        total += item.quantity;
    });
    
    document.querySelectorAll('.count').forEach(count => {
        count.textContent = total;
    });
}

document.addEventListener('DOMContentLoaded', updateCount);


