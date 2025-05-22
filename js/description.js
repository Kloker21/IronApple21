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

//загрузка товара
const url = new URLSearchParams(window.location.search);
const id = url.get('id');

fetch('catalog.xml')
    .then(res => res.text())
    .then(xml => {
        const doc = new DOMParser().parseFromString(xml, 'application/xml');
        const items = doc.querySelectorAll('product');
        let item = null;

        for (let product of items) {
            if (product.querySelector('id').textContent === id) {
                item = product;
                break;
            }
        }
        
        if (!item) {
            throw new Error('Товар не найден');
        }

        const name = item.querySelector('name').textContent;
        const price = item.querySelector('price').textContent;
        const photos = Array.from(item.querySelectorAll('photos image')).map(img => img.textContent);
        const color = item.querySelector('characteristics color').textContent;
        const mem = item.querySelector('characteristics memory').textContent;
        const chars = Array.from(item.querySelectorAll('characteristics characteristic'))
            .map(char => char.textContent.split(' - '));

        show(name, price, photos, chars, color, mem);

        if (typeof Swiper !== 'undefined') {
            new Swiper('.mySwiper', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });

//кнопка купить
function setupBuyButton() {
    const buyButton = document.querySelector('.buy-button');
    
    if (buyButton) {
        buyButton.addEventListener('click', function(e) {
            const id = parseInt(new URLSearchParams(window.location.search).get('id'));
            const name = document.querySelector('.titul').textContent;
            const price = parseFloat(document.querySelector('.price').textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
            const img = document.querySelector('.swiper-slide img').getAttribute('src');
            
            console.log('Данные товара:', { id, name, price, img }); 
    
            const product = {
                id: id,
                name: name,
                price: price,
                img: img,
                quantity: 1
            };
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCount();
            
            alert('Товар успешно добавлен в корзину!');
        });
    }
}

document.addEventListener('DOMContentLoaded', setupBuyButton);

//отображение товара
function show(name, price, photos, chars, color, mem) {
    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = photos.map(photo => `
        <div class="swiper-slide">
            <img src="${photo}" alt="${name}" id='photo'>
        </div>
    `).join('');

    document.querySelector('.price').textContent = price;

    const container = document.querySelector('.har-ka');
    container.innerHTML = chars.map(([title, value]) => `
        <p><span class="division">${title} -</span> ${value}</p>
    `).join('');

    container.innerHTML += `
        <p><span class="division">Цвет -</span> ${color}</p>
        <p><span class="division">Память -</span> ${mem}</p>
    `;

    document.title = name;
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

document.addEventListener('DOMContentLoaded', () => {
    updateCount();
});



