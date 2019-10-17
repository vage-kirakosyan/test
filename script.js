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
          productRender();
        }
      );
  }
};

const productRender = () => {
  if(store.products !== undefined) {
    const listing = store.products.map(item => {
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
  }
};

store.getProducts();
