/* Хранилище листинга полученного с API, дабы при каждом чихе не бегать на сервер*/
const store = {
  products: undefined,

  getProducts() {
    fetch('http://www.mocky.io/v2/5d944b9f2f00006b008ff619')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(
        data => {
          this.products = data.data;
          productRender(data.data, createFilterSettings());
          setCheckedFilter();
          console.log(this.products);
        }
      );
  },
};

/* Тут рендерим листинг с товарами */
const productRender = (productArr, settings) => {
  const filteredListing = productArr
    .filter(prod => {
      if (settings.category === '1'
        || settings.category === '2'
        || settings.category === '3'
        || settings.category === '4'
      ) {
        return String(prod.category.id) === settings.category;
      } else if (settings.category === undefined || settings.category === '0') {
        return true
      }
    })
    .filter(prod => {
      if (settings.price === '1') {
        return prod.price < 5000;
      } else if (settings.price === '2') {
        return prod.price >= 5000;
      } else {
        return true;
      }
    })
    .filter(prod => {
      if (settings.quantity === 'true') {
        return prod.quantity > 0;
      } else if (settings.quantity === 'false' || settings.quantity === undefined) {
        return true;
      }
    });
  if (filteredListing.length === 0) {
    document.getElementById('productsBox').innerHTML = '<p class="listingError">По данному запросу товаров нет</p>';
  } else {
    const listing = filteredListing.map(item => (
      `<div class="product">
           <img class="img" src="${item.image}" />
           <div class="infoBox">
             <p class="title">${item.title}</p>
             <p class="category">${item.category.title !== undefined ? item.category.title : ''}</p>
             <p class="price">Цена: ${item.price}</p>
           </div>
         </div>`
    ));
    document.getElementById('productsBox').innerHTML = listing.join('');
  }
};

/* Обрабатываем выбор категории */
const onChangeCategoryHandler = (e) => {
  const value = e.target.value;
  applyFilter('category', value);
  productRender(store.products, createFilterSettings());
};

/* Обрабатываем нажатие на фильтр цены */
const onChangePriceHandler = (e) => {
  const value = e.target.value;
  applyFilter('price', value);
  productRender(store.products, createFilterSettings());
  console.log(e);
};

/* Обрабатываем нажатие на "Товары в наличии" */
const onChangeQuantityHandler = (e) => {
  const value = e.target.checked;
  applyFilter('quantity', value);
  productRender(store.products, createFilterSettings());
};

/* Добавляем в урл параметры */
const applyFilter = (name, val) => {
  let newSearch ='';
  const parameters = getFilterParams();
  for(let i=0; i<parameters.length; i++) {
    if(parameters[i][0] !== name) {
      newSearch += `${parameters[i].join('=')}&`;
      console.log('newSearch ' + newSearch);
    }
  }
  newSearch += `${name}=${val}`;
  history.pushState({}, 'applyFilter', `?${newSearch}`);
};

/* Берем параметры из урла */
const getFilterParams = () => {
  return document.location.search
    .slice(1)
    .split('&')
    .map(item => item.split('='));
};

/* Тут настройки фильтрации для функции рендера */
const createFilterSettings = () => {
  const parameters = getFilterParams();
  const filterSettings = {
    category: undefined,
    price: undefined,
    quantity: undefined,
  };
  parameters.forEach(item => {
    if(item.includes('category')) {
      filterSettings.category = item[1];
    } else if(item.includes('price')) {
      filterSettings.price = item[1];
    } else if(item.includes('quantity')) {
      filterSettings.quantity = item[1];
    }
  });
  return filterSettings;
};

/* Стираем все параметры фильтров из урла и сбрасываем выделение с фильтров */
const onClickClrButtonHandler = () => {
  history.replaceState({}, 'ClrButton', 'index.html?clr=true');
  productRender(store.products, createFilterSettings());
  document.getElementById('category').value = '0';
  const priceBtns = document.getElementsByClassName('priceBtn');
  for (let btn of priceBtns) {
    btn.checked = false;
  }
  document.getElementById('quantity').checked = false;
};

/* Ставим фильтры при ручном вводе параметров в урл */
const setCheckedFilter = () => {
  const filtersSetting = createFilterSettings();
  if(filtersSetting.category!==undefined) {
    document.getElementById('category').value = filtersSetting.category;
  }
  const priceBtns = document.getElementsByClassName('priceBtn');
  for (let btn of priceBtns) {
    if(btn.value === filtersSetting.price) {
      btn.checked = true;
    }
  }
  if(filtersSetting.quantity === 'true') {
    document.getElementById('quantity').checked = true;
  }
};

window.onload = function() {
  store.getProducts();

  document
    .getElementById('category')
    .addEventListener('change', onChangeCategoryHandler);

  const priceBtns = document.getElementsByClassName('priceBtn');
  for (let btn of priceBtns) {
    btn.addEventListener('change', onChangePriceHandler)
  }

  document
    .getElementById('quantity')
    .addEventListener('change', onChangeQuantityHandler);

  document
    .getElementById('clrButton')
    .addEventListener('click', onClickClrButtonHandler)
};
