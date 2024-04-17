
// FILEPATH: /Users/koteronroan/Desktop/my-testing-app-server/shopping-cart.test.js

const request = require('supertest');
const app = require('./index');

describe('Shopping Cart API Tests', () => {
  it('should return cart items on GET /cart', async () => {
    const response = await request(app).get('/cart');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should add a new item to the cart on POST /cart', async () => {
    const newItem = {
      name: 'Test Item',
      image: 'test-image.jpg',
      quantity: 1,
      price: 9.99
    };
    const response = await request(app)
      .post('/cart')
      .send(newItem);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should update an item in the cart on PUT /cart/:id', async () => {
    const itemId = '1234567890'; // Replace with a valid item ID
    const updatedItem = {
      name: 'Updated Item',
      image: 'updated-image.jpg',
      quantity: 2,
      price: 19.99
    };
    const response = await request(app)
      .put(`/cart/${itemId}`)
      .send(updatedItem);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should delete an item from the cart on DELETE /cart/:id', async () => {
    const itemId = '1234567890'; // Replace with a valid item ID
    const response = await request(app).delete(`/cart/${itemId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});