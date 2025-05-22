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

//слайдер
document.addEventListener('DOMContentLoaded', () => {
    var swiper = new Swiper('.mySwiper', {
        loop: true,
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
    updateCount();
});

