import { faker } from '@faker-js/faker';

async function uploadProducts() {
    let products = [];
    for(let i = 0; i < 6; i++) {
      let product = {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image()
      }
      products.push(product);
    }
    return products;
};

export default uploadProducts;