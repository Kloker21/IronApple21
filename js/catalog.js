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

//загрузка товаров
fetch('catalog.xml')
  .then(response => response.text())
  .then(xmlString => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const productsContainer = document.querySelector('.products .flex_container');

productsContainer.innerHTML = '';

const products = xmlDoc.querySelectorAll('product');
console.log(products);
products.forEach(product => {
  const id = product.querySelector('id').textContent;
  const name = product.querySelector('name').textContent;
  const price = product.querySelector('price').textContent;
  const firstImage = product.querySelector('photos image').textContent;
  

  const productLink = document.createElement('a');
  productLink.className = 'flex_item';
  productLink.href = `description.html?id=${id}`;
  

  productLink.dataset.model = name.split(' ')[0]; 
  const nameParts = name.split(' ');
  if (nameParts.length >= 3) {
    const lastPart = nameParts[nameParts.length - 1]; 
    
    if (lastPart.includes('GB') || lastPart.includes('TB')) {
      memory = lastPart.replace('GB', '').replace('TB', ''); 
    }
  }
  
  
  if (memory) {
    productLink.dataset.memory = memory;
  }
  
  productLink.innerHTML = `
    <img src="${firstImage}" alt="${name}">
    <div class="model">${name}</div>
    <div class="phone_info">
      <span class="price">${price}</span>
      <button class="buy">Купить</button>
    </div>
  `;
  
  productsContainer.appendChild(productLink);
});
  })
  .catch(error => console.error('Ошибка загрузки XML:', error));
  
//фильтрация
const boxes = document.querySelectorAll('input[type="checkbox"]');

function filter() {
    let colors = [];
    let models = [];
    let memory = [];

    for (let box of boxes) {
        if (box.checked) {
            if (box.name === 'color') colors.push(box.value);
            if (box.name === 'model') models.push(box.value);
            if (box.name === 'memory') memory.push(box.value);
        }
        localStorage.setItem(`filter_${box.name}_${box.value}`, box.checked);
    }

    fetch('catalog.xml')
        .then(res => res.text())
        .then(xml => {
            const doc = new DOMParser().parseFromString(xml, 'application/xml');
            const items = doc.querySelectorAll('product');
            const container = document.querySelector('.products .flex_container');
            container.innerHTML = '';

            for (let item of items) {
                const id = item.querySelector('id').textContent;
                const name = item.querySelector('name').textContent;
                const price = item.querySelector('price').textContent;
                const photos = Array.from(item.querySelectorAll('photos image')).map(img => img.textContent);
                const color = item.querySelector('characteristics color').textContent;
                const mem = item.querySelector('characteristics memory').textContent;

                let show = true;

                if (colors.length > 0 && !colors.includes(color)) {
                    show = false;
                }

                if (models.length > 0) {
                    let match = false;
                    for (let model of models) {
                        const baseName = name.split(' ').slice(0, -1).join(' ');
                        if (baseName === model) {
                            match = true;
                            break;
                        }
                    }
                    if (!match) show = false;
                }

                if (memory.length > 0 && !memory.includes(mem)) {
                    show = false;
                }

                if (show) {
                    const product = document.createElement('a');
                    product.className = 'flex_item';
                    product.href = `description.html?id=${id}`;
                    product.innerHTML = `
                        <img src="${photos[0]}" alt="${name}">
                        <div class="model">${name}</div>
                        <div class="phone_info">
                            <span class="price">${price}</span>
                            <button class="buy">Купить</button>
                        </div>
                    `;
                    container.appendChild(product);
                }
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    boxes.forEach(box => {
        const savedState = localStorage.getItem(`filter_${box.name}_${box.value}`);
        if (savedState !== null) {
            box.checked = savedState === 'true';
        }
    });
    filter();
});

for (let box of boxes) {
    box.addEventListener('change', filter);
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

document.addEventListener('DOMContentLoaded', updateCount);

//добавление в корзину
document.querySelectorAll('.buy').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productElement = button.closest('.flex_item');
        const id = parseInt(productElement.href.split('id=')[1]);
        const name = productElement.querySelector('.model').textContent;
        const price = parseFloat(productElement.querySelector('.price').textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
        const img = productElement.querySelector('img').src;
        
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
        
        alert('Товар успешно добавлен в корзину!');
        updateCount();
    });
});