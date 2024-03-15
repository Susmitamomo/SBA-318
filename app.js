const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Custom middleware 1: Logging middleware 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Custom middleware 2: Authentication middleware 
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'coffeeShopToken') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Error-handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let products = [];
let orders = [];
let users = [];

// Route to get all products 
app.get('/products', (req, res) => {
  res.json(products);
});

// Route to create a product 
app.post('/products', authenticateUser, (req, res) => {
  const product = req.body;
  products.push(product);
  res.status(201).send('Product added successfully');
});

// Route to delete a product
app.delete('/products/:id', authenticateUser, (req, res) => {
  const productId = req.params.id;
  products = products.filter(product => product.id !== productId);
  res.send('Product deleted successfully');
});

// Route to get all products with optional query parameters for filtering
app.get('/products', (req, res) => {
    let filteredProducts = products;
  
    // Check if query parameters exist
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
    }
  
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
  
    res.json(filteredProducts);
  });
  
// Route to get all orders 
  res.json(orders);;

// Route to create an order 
app.post('/orders', (req, res) => {
  const order = req.body;
  orders.push(order);
  res.status(201).send('Order placed successfully');
});

// Route to get all users 
app.get('/users', (req, res) => {
  res.json(users);
});

// Route to create a user 
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send('User created successfully');
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
