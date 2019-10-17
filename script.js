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
          productRender(data.data);
          console.log(store.products);
        }
      );
  },
};

const state = {
  category: 1,
  price: 0,
  quantity: false,
};

const productRender = (productArr) => {
    const listing = productArr.map(item => {
        return (
          `<div class="product">
           <img class="img" src="${item.image}" />
           <div class="infoBox">
             <p class="title">${item.title}</p>
             <p class="category">${item.category.title !== undefined ? item.category.title : ''}</p>
             <p class="price">Цена: ${item.price}</p>
           </div>
         </div>`
        );
      });
    document.getElementById('productsBox').innerHTML = listing.join('');
};

const onChangeCategoryHandler = (e) => {
  const value = e.target.value;
  productRender(setCategoryFilter(state.category, store.products));
  console.log(value);
};

const onChangePriceHandler = (e) => {
  const value = e.target.value;
  productRender(setPriceFilter(state.price, store.products));
  console.log(value);
};

const onChangeQuantityHandler = (e) => {
  state.quantity = e.target.checked;
  productRender(setQuantityFilter(state.quantity, store.products));
};

const setCategoryFilter = (state, products) => {
  if(state === 1) {
    return products.filter(prod => prod.category.id !== 1);
  } else if(state === 2) {
    return products.filter(prod => prod.category.id !== 2);
  } else if(state === 3) {
    return products.filter(prod => prod.category.id !== 3);
  } else if(state === 4) {
    return products.filter(prod => prod.category.id !== 4);
  }
};
const setPriceFilter = (state, products) => {
  if(state === 1) {
    return products.filter(prod => prod.price > 5000);
  } else if(state === 2) {
    return products.filter(prod => prod.price <= 5000);
  }
};
const setQuantityFilter = (state, products) => {
  if(state === true) {
    return products.filter(prod => prod.quantity > 0);
  }
};

const applyFilter = () => {

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
};