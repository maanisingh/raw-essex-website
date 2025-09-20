require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const products = require('./src/data/expanded-products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/pages'));

let productList = [...products];

// In-memory storage for demo (replace with database in production)
let shoppingCarts = new Map(); // userId -> cart items
let orders = [];
let users = new Map(); // Store user accounts: email/phone -> user data
let userSessions = new Map(); // Store active sessions: sessionId -> userId
let payments = new Map(); // Store payment records: paymentId -> payment data
let paymentSettings = {
  bankTransfer: {
    enabled: true,
    bankName: 'Your Bank Name',
    accountName: 'Raw Essex Ltd',
    sortCode: '12-34-56',
    accountNumber: '12345678',
    reference: 'RAWESSEX-{orderId}'
  },
  openBanking: {
    enabled: false,
    clientId: '',
    redirectUrl: ''
  },
  paypal: {
    enabled: false,
    clientId: '',
    secretKey: ''
  }
};
let shippingSettings = {
  dpd: { enabled: false, apiKey: '', pricePerKg: 5.99, freeShippingThreshold: 50 },
  dhl: { enabled: false, apiKey: '', pricePerKg: 7.99, freeShippingThreshold: 75 },
  royalMail: { enabled: true, apiKey: '', pricePerKg: 3.99, freeShippingThreshold: 30 }
};

// Website routes
app.get('/', (req, res) => {
  res.render('home', { products: productList });
});

app.get('/products', (req, res) => {
  const category = req.query.category;
  const search = req.query.search;

  let filteredProducts = productList;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower))
    );
  }

  res.render('products', {
    products: filteredProducts,
    selectedCategory: category,
    searchQuery: search || ''
  });
});

// Educational pages
app.get('/why-raw', (req, res) => {
  res.render('why-raw');
});

app.get('/feeding-guide', (req, res) => {
  res.render('feeding-guide');
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

app.get('/raw-benefits', (req, res) => {
  res.render('raw-benefits');
});

app.get('/vet-advice', (req, res) => {
  res.render('vet-advice');
});

// Cart page
app.get('/cart', (req, res) => {
  res.render('cart');
});

// Individual product page
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productList.find(p => p.id === productId);

  if (product) {
    res.render('product-detail', { product });
  } else {
    res.status(404).send('Product not found');
  }
});

// Admin settings routes
app.get('/admin/settings', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({
      stripe: paymentSettings.stripe,
      dpd: shippingSettings.dpd,
      dhl: shippingSettings.dhl,
      royalMail: shippingSettings.royalMail
    });
  } else {
    res.render('admin-settings');
  }
});

app.post('/admin/settings', (req, res) => {
  const { stripe, dpd, dhl, royalMail } = req.body;

  if (stripe) {
    paymentSettings.stripe = { ...paymentSettings.stripe, ...stripe };
  }
  if (dpd) {
    shippingSettings.dpd = { ...shippingSettings.dpd, ...dpd };
  }
  if (dhl) {
    shippingSettings.dhl = { ...shippingSettings.dhl, ...dhl };
  }
  if (royalMail) {
    shippingSettings.royalMail = { ...shippingSettings.royalMail, ...royalMail };
  }

  res.json({ success: true, message: 'Settings updated successfully' });
});

app.get('/admin/test-settings', (req, res) => {
  const results = {
    stripe: {
      status: paymentSettings.stripe.enabled ? 'Enabled' : 'Disabled',
      message: paymentSettings.stripe.secretKey ? 'Secret key configured' : 'No secret key'
    },
    dpd: {
      status: shippingSettings.dpd.enabled ? 'Enabled' : 'Disabled',
      message: shippingSettings.dpd.apiKey ? 'API key configured' : 'No API key'
    },
    dhl: {
      status: shippingSettings.dhl.enabled ? 'Enabled' : 'Disabled',
      message: shippingSettings.dhl.apiKey ? 'API key configured' : 'No API key'
    },
    royalMail: {
      status: shippingSettings.royalMail.enabled ? 'Enabled' : 'Disabled',
      message: 'Standard shipping option'
    }
  };
  res.json(results);
});

// Authentication routes
app.get('/auth', (req, res) => {
  res.render('auth');
});

// Admin panel routes
app.get('/admin', (req, res) => {
  res.render('admin', { products: productList });
});

app.get('/admin/products', (req, res) => {
  res.json(productList);
});

app.post('/admin/products', (req, res) => {
  const newProduct = {
    id: Date.now(),
    ...req.body,
    price: parseFloat(req.body.price)
  };
  productList.push(newProduct);
  res.json(newProduct);
});

app.put('/admin/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = productList.findIndex(p => p.id === id);

  if (productIndex !== -1) {
    productList[productIndex] = {
      ...productList[productIndex],
      ...req.body,
      price: parseFloat(req.body.price)
    };
    res.json(productList[productIndex]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/admin/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = productList.findIndex(p => p.id === id);

  if (productIndex !== -1) {
    const deletedProduct = productList.splice(productIndex, 1)[0];
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// File upload endpoint for CMS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.post('/admin/upload-csv', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read the uploaded file
    const csvContent = fs.readFileSync(req.file.path, 'utf8');

    // Parse CSV and add products (basic implementation)
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    let importedCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 5) {
        const newProduct = {
          id: Date.now() + i,
          name: values[0]?.trim() || '',
          price: parseFloat(values[1]) || 0,
          category: values[2]?.trim() || '',
          description: values[3]?.trim() || '',
          status: values[4]?.trim() || 'in_stock',
          image: values[5]?.trim() || '/images/default.jpg'
        };

        if (newProduct.name && newProduct.price > 0) {
          productList.push(newProduct);
          importedCount++;
        }
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: `Successfully imported ${importedCount} products`,
      count: importedCount,
      totalProducts: productList.length
    });

  } catch (error) {
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Image upload endpoint
app.post('/admin/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const imageUrl = '/images/' + req.file.filename;
  res.json({ imageUrl: imageUrl });
});

// Search endpoint for admin
app.get('/admin/search', (req, res) => {
  const search = req.query.q;
  const category = req.query.category;

  let filteredProducts = productList;

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower))
    );
  }

  res.json(filteredProducts);
});

// Get all categories
app.get('/admin/categories', (req, res) => {
  const categories = [...new Set(productList.map(p => p.category))];
  res.json(categories);
});

// Export products as CSV
app.get('/admin/export-csv', (req, res) => {
  const csvHeader = 'Name,Price,Category,Description,Status,Image\n';
  const csvRows = productList.map(p =>
    `"${p.name}","${p.price}","${p.category}","${p.description}","${p.status}","${p.image}"`
  ).join('\n');

  const csvContent = csvHeader + csvRows;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="raw-essex-products.csv"');
  res.send(csvContent);
});

// Shopping Cart API Routes
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const cart = shoppingCarts.get(userId) || [];
  res.json(cart);
});

app.post('/api/cart/:userId/add', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity = 1 } = req.body;

  const product = productList.find(p => p.id == productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let cart = shoppingCarts.get(userId) || [];
  const existingItem = cart.find(item => item.productId == productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
  }

  shoppingCarts.set(userId, cart);
  res.json({ success: true, cartCount: cart.reduce((sum, item) => sum + item.quantity, 0) });
});

app.delete('/api/cart/:userId/remove/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  let cart = shoppingCarts.get(userId) || [];
  cart = cart.filter(item => item.productId != productId);

  shoppingCarts.set(userId, cart);
  res.json({ success: true });
});

app.post('/api/cart/:userId/update', (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  let cart = shoppingCarts.get(userId) || [];
  const item = cart.find(item => item.productId == productId);

  if (item) {
    if (quantity <= 0) {
      cart = cart.filter(item => item.productId != productId);
    } else {
      item.quantity = quantity;
    }
  }

  shoppingCarts.set(userId, cart);
  res.json({ success: true });
});

// Payment endpoints
app.get('/api/payment/methods', (req, res) => {
  const availableMethods = [];

  if (paymentSettings.bankTransfer.enabled) {
    availableMethods.push({
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer directly to our bank account',
      icon: 'fas fa-university',
      processingTime: 'Instant verification with payment reference'
    });
  }

  if (paymentSettings.openBanking.enabled) {
    availableMethods.push({
      id: 'open_banking',
      name: 'Open Banking',
      description: 'Secure bank-to-bank transfer',
      icon: 'fas fa-shield-alt',
      processingTime: 'Instant payment'
    });
  }

  if (paymentSettings.paypal.enabled) {
    availableMethods.push({
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with PayPal or card',
      icon: 'fab fa-paypal',
      processingTime: 'Instant payment'
    });
  }

  res.json(availableMethods);
});

app.post('/api/payment/initiate', async (req, res) => {
  const { userId, paymentMethod, orderId } = req.body;

  const order = orders.find(o => o.id === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  if (paymentMethod === 'bank_transfer') {
    const payment = {
      id: paymentId,
      orderId: order.id,
      userId,
      method: 'bank_transfer',
      amount: order.total,
      status: 'pending',
      reference: paymentSettings.bankTransfer.reference.replace('{orderId}', order.id),
      bankDetails: {
        bankName: paymentSettings.bankTransfer.bankName,
        accountName: paymentSettings.bankTransfer.accountName,
        sortCode: paymentSettings.bankTransfer.sortCode,
        accountNumber: paymentSettings.bankTransfer.accountNumber
      },
      createdAt: new Date()
    };

    payments.set(paymentId, payment);

    res.json({
      success: true,
      paymentId,
      instructions: {
        method: 'bank_transfer',
        bankDetails: payment.bankDetails,
        reference: payment.reference,
        amount: payment.amount,
        message: 'Please transfer the exact amount using the reference number provided'
      }
    });
  } else {
    res.status(400).json({ error: 'Payment method not supported yet' });
  }
});

app.post('/api/payment/confirm', async (req, res) => {
  const { paymentId, transactionReference } = req.body;

  const payment = payments.get(paymentId);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  payment.status = 'confirmed';
  payment.transactionReference = transactionReference;
  payment.confirmedAt = new Date();

  // Update order status
  const order = orders.find(o => o.id === payment.orderId);
  if (order) {
    order.status = 'paid';
    order.paymentId = paymentId;
  }

  res.json({ success: true, message: 'Payment confirmed' });
});

// Checkout and Payment
app.post('/api/checkout', async (req, res) => {
  const { userId, paymentMethod, shippingAddress } = req.body;
  const cart = shoppingCarts.get(userId) || [];

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total >= 30 ? 0 : 3.99;
  const finalTotal = total + shipping;

  try {
    const order = {
      id: Date.now(),
      userId,
      items: cart,
      subtotal: total,
      shipping: shipping,
      total: finalTotal,
      shippingAddress,
      status: 'pending_payment',
      paymentMethod,
      createdAt: new Date()
    };

    orders.push(order);
    shoppingCarts.delete(userId);

    res.json({
      success: true,
      orderId: order.id,
      total: finalTotal,
      nextStep: 'payment'
    });
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// User Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, phone, name, password } = req.body;

  // Validate input
  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone number is required' });
  }
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  const identifier = email || phone;

  // Check if user already exists
  if (users.has(identifier)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create new user
  const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const user = {
    id: userId,
    email: email || null,
    phone: phone || null,
    name,
    password, // In production, hash this password
    createdAt: new Date(),
    isActive: true
  };

  users.set(identifier, user);

  // Create session
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  userSessions.set(sessionId, userId);

  res.json({
    success: true,
    user: { id: userId, email, phone, name },
    sessionId
  });
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' });
  }

  const user = users.get(identifier);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create session
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  userSessions.set(sessionId, user.id);

  res.json({
    success: true,
    user: { id: user.id, email: user.email, phone: user.phone, name: user.name },
    sessionId
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { sessionId } = req.body;

  if (sessionId && userSessions.has(sessionId)) {
    userSessions.delete(sessionId);
  }

  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = userSessions.get(sessionId);
  const user = Array.from(users.values()).find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({
    user: { id: user.id, email: user.email, phone: user.phone, name: user.name }
  });
});

// User account endpoints
app.get('/api/user/orders', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = userSessions.get(sessionId);
  const userOrders = orders.filter(order => order.userId === userId);

  res.json(userOrders);
});

app.post('/api/user/reorder/:orderId', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { orderId } = req.params;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = userSessions.get(sessionId);
  const originalOrder = orders.find(order => order.id === parseInt(orderId) && order.userId === userId);

  if (!originalOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Clear current cart and add items from the original order
  shoppingCarts.set(userId, originalOrder.items.map(item => ({
    ...item,
    addedAt: new Date()
  })));

  res.json({
    success: true,
    message: 'Items added to cart',
    cartCount: originalOrder.items.reduce((sum, item) => sum + item.quantity, 0)
  });
});

app.get('/api/user/profile', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = userSessions.get(sessionId);
  const user = Array.from(users.values()).find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const userOrders = orders.filter(order => order.userId === userId);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  res.json({
    user: { id: user.id, email: user.email, phone: user.phone, name: user.name },
    stats: {
      totalOrders: userOrders.length,
      totalSpent: totalSpent,
      memberSince: user.createdAt
    }
  });
});

// Admin API endpoints
app.get('/admin/orders', (req, res) => {
  res.json(orders);
});

app.get('/admin/accounts', (req, res) => {
  // Get all registered users and their activity
  const accounts = new Map();

  // Add registered users
  for (const [identifier, user] of users.entries()) {
    accounts.set(user.id, {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      isRegistered: true,
      createdAt: user.createdAt,
      cartItems: 0,
      totalCartValue: 0,
      lastActivity: user.createdAt,
      orders: []
    });
  }

  // Add users from shopping carts
  for (const [userId, cart] of shoppingCarts.entries()) {
    if (!accounts.has(userId)) {
      accounts.set(userId, {
        userId,
        email: null,
        phone: null,
        name: 'Guest User',
        isRegistered: false,
        createdAt: new Date(),
        cartItems: cart.length,
        totalCartValue: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        lastActivity: new Date(),
        orders: []
      });
    } else {
      const account = accounts.get(userId);
      account.cartItems = cart.length;
      account.totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      account.lastActivity = new Date();
    }
  }

  // Add users from orders
  orders.forEach(order => {
    if (!accounts.has(order.userId)) {
      accounts.set(order.userId, {
        userId: order.userId,
        email: null,
        phone: null,
        name: 'Guest User',
        isRegistered: false,
        createdAt: order.createdAt,
        cartItems: 0,
        totalCartValue: 0,
        lastActivity: order.createdAt,
        orders: [order]
      });
    } else {
      const account = accounts.get(order.userId);
      account.orders.push(order);
      if (order.createdAt > account.lastActivity) {
        account.lastActivity = order.createdAt;
      }
    }
  });

  res.json(Array.from(accounts.values()));
});

app.put('/admin/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = orders.find(o => o.id === parseInt(orderId));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date();

  res.json({ success: true, order });
});

// Admin payment endpoints
app.get('/admin/payments', (req, res) => {
  res.json(Array.from(payments.values()));
});

app.get('/admin/payment-settings', (req, res) => {
  res.json(paymentSettings);
});

app.put('/admin/payment-settings', (req, res) => {
  const { bankTransfer, openBanking, paypal } = req.body;

  if (bankTransfer) {
    paymentSettings.bankTransfer = { ...paymentSettings.bankTransfer, ...bankTransfer };
  }

  if (openBanking) {
    paymentSettings.openBanking = { ...paymentSettings.openBanking, ...openBanking };
  }

  if (paypal) {
    paymentSettings.paypal = { ...paymentSettings.paypal, ...paypal };
  }

  res.json({ success: true, settings: paymentSettings });
});

app.put('/admin/payments/:paymentId/status', (req, res) => {
  const { paymentId } = req.params;
  const { status, notes } = req.body;

  const payment = payments.get(paymentId);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  payment.status = status;
  payment.adminNotes = notes;
  payment.updatedAt = new Date();

  // Update related order status
  if (status === 'confirmed') {
    const order = orders.find(o => o.id === payment.orderId);
    if (order && order.status === 'pending_payment') {
      order.status = 'confirmed';
    }
  }

  res.json({ success: true, payment });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Admin panel available at http://0.0.0.0:${PORT}/admin`);
  console.log(`FAQ page available at http://0.0.0.0:${PORT}/faq`);
  console.log(`Admin settings at http://0.0.0.0:${PORT}/admin/settings`);
  console.log(`Now featuring ${productList.length} premium products!`);
});

module.exports = app;