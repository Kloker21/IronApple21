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

//корзина
const cartItems = document.querySelector('.basket_items');
const totalPrice = document.querySelector('.total');
const checkoutBtn = document.querySelector('.place');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

//обновление корзины
function updateCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty">Корзина пустая</div>';
        totalPrice.textContent = 'Итого: 0 BYN';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'basket_item';
        
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="basket_info">
                <div class="basket_name">Цена</div>
                <div class="basket_price">${item.price} BYN</div>
            </div>
            <div class="basket_actions">
                <button class="minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="plus" data-id="${item.id}">+</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        
        total += item.price * item.quantity;
    });
    totalPrice.textContent = `Итого: ${total} BYN`;
}

//изменение количества
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity++;
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCount();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity--;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
        
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCount();
    }
}

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

//оформление заказа
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        window.location.href = 'form.html';
    } else {
        alert('Корзина пустая');
    }
});

cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('plus')) {
        const id = parseInt(e.target.dataset.id);
        increaseQuantity(id);
    }

    if (e.target.classList.contains('minus')) {
        const id = parseInt(e.target.dataset.id);
        decreaseQuantity(id);
    }
});

document.addEventListener('DOMContentLoaded', updateCount);

updateCart();
