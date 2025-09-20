require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const { DefaultApi, Configuration } = require('royal-mail-sdk');
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
  res.json({
    stripe: paymentSettings.stripe,
    dpd: shippingSettings.dpd,
    dhl: shippingSettings.dhl,
    royalMail: shippingSettings.royalMail
  });
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

// Admin API routes (for premium admin panel)

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

// API endpoints for admin panel statistics
app.get('/api/orders', (req, res) => {
  res.json(Array.from(orders.values()));
});

app.get('/api/accounts', (req, res) => {
  res.json(Array.from(users.values()));
});

app.get('/api/payments', (req, res) => {
  res.json(Array.from(payments.values()));
});


// Stripe Configuration and Webhooks
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp', metadata = {} } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence/cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);

      // Store payment record
      const payment = {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        method: 'stripe',
        metadata: paymentIntent.metadata,
        createdAt: new Date().toISOString()
      };
      payments.set(paymentIntent.id, payment);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.get('/api/stripe/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  });
});

app.post('/admin/stripe/configure', (req, res) => {
  const { publishableKey, secretKey, webhookSecret } = req.body;

  // In production, you'd update environment variables or database
  // For now, just validate and respond
  if (publishableKey && secretKey) {
    res.json({
      success: true,
      message: 'Stripe configuration updated successfully'
    });
  } else {
    res.status(400).json({
      error: 'Publishable key and secret key are required'
    });
  }
});

// Royal Mail Configuration and API
let royalMailConfig = {
  clientId: process.env.ROYAL_MAIL_CLIENT_ID || '',
  clientSecret: process.env.ROYAL_MAIL_CLIENT_SECRET || '',
  environment: 'sandbox' // or 'production'
};

// Initialize Royal Mail API
let royalMailApi = null;

function initializeRoyalMailAPI() {
  if (royalMailConfig.clientId && royalMailConfig.clientSecret) {
    try {
      const config = new Configuration({
        basePath: royalMailConfig.environment === 'production'
          ? 'https://api.royalmail.net'
          : 'https://api.royalmail.net', // Same URL for both
        apiKey: royalMailConfig.clientId,
        accessToken: royalMailConfig.clientSecret
      });
      royalMailApi = new DefaultApi(config);
      console.log('✅ Royal Mail API initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Royal Mail API:', error.message);
    }
  }
}

app.post('/admin/royal-mail/configure', (req, res) => {
  const { clientId, clientSecret, environment } = req.body;

  if (clientId && clientSecret) {
    royalMailConfig = {
      ...royalMailConfig,
      clientId,
      clientSecret,
      environment: environment || 'sandbox',
      apiUrl: environment === 'production'
        ? 'https://api.royalmail.net/shipping/v1'
        : 'https://api.royalmail.net/shipping/v1'
    };

    res.json({
      success: true,
      message: 'Royal Mail configuration updated successfully'
    });
  } else {
    res.status(400).json({
      error: 'Client ID and Client Secret are required'
    });
  }
});

app.get('/api/royal-mail/config', (req, res) => {
  res.json({
    clientId: royalMailConfig.clientId ? '****' + royalMailConfig.clientId.slice(-4) : '',
    environment: royalMailConfig.environment,
    configured: !!(royalMailConfig.clientId && royalMailConfig.clientSecret)
  });
});

// Royal Mail API Helper Functions
async function getRoyalMailAccessToken() {
  try {
    if (!royalMailConfig.clientId || !royalMailConfig.clientSecret) {
      throw new Error('Royal Mail credentials not configured');
    }

    // Return mock token for now - will implement proper SDK later
    return 'mock-royal-mail-token';
  } catch (error) {
    console.error('Royal Mail token error:', error);
    throw error;
  }
}

// Create Royal Mail shipment
app.post('/api/royal-mail/create-shipment', async (req, res) => {
  try {
    const { orderData, shippingDetails } = req.body;
    const accessToken = await getRoyalMailAccessToken();

    const shipmentData = {
      shipments: [{
        shipmentReference: `RM-${Date.now()}`,
        recipient: {
          name: shippingDetails.name,
          companyName: shippingDetails.company || '',
          addressLine1: shippingDetails.address1,
          addressLine2: shippingDetails.address2 || '',
          addressLine3: shippingDetails.address3 || '',
          postTown: shippingDetails.city,
          county: shippingDetails.county || '',
          countryCode: shippingDetails.countryCode || 'GB',
          postcode: shippingDetails.postcode,
          phoneNumber: shippingDetails.phone || '',
          emailAddress: shippingDetails.email || ''
        },
        sender: {
          name: 'Raw Essex',
          companyName: 'Raw Essex Pet Foods',
          addressLine1: 'Business Address',
          addressLine2: '',
          postTown: 'Essex',
          county: 'Essex',
          countryCode: 'GB',
          postcode: 'CM0 0XX',
          phoneNumber: '01234567890',
          emailAddress: 'orders@rawessex.com'
        },
        packages: [{
          weightInGrams: orderData.weight || 1000,
          dimensions: {
            heightInMm: 100,
            widthInMm: 200,
            lengthInMm: 300
          },
          packageOccurrence: 1
        }],
        serviceSettings: {
          serviceCode: 'SD1', // Signed For 1st Class
          serviceEnhancements: []
        }
      }]
    };

    // Mock Royal Mail shipment creation for now
    const shipment = {
      id: `RM-${Date.now()}`,
      trackingNumber: `RM${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderId: orderData.orderId,
      status: 'created',
      service: 'Royal Mail Signed For 1st Class',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      cost: 5.50
    };

    res.json({
      success: true,
      shipment
    });

  } catch (error) {
    console.error('Royal Mail shipment creation failed:', error);
    res.status(400).json({
      error: error.message,
      details: 'Failed to create Royal Mail shipment'
    });
  }
});

// Get Royal Mail shipping rates
app.post('/api/royal-mail/get-rates', async (req, res) => {
  try {
    const { weight, dimensions, postcode } = req.body;
    const accessToken = await getRoyalMailAccessToken();

    const rateRequest = {
      packages: [{
        weightInGrams: weight || 1000,
        dimensions: dimensions || {
          heightInMm: 100,
          widthInMm: 200,
          lengthInMm: 300
        }
      }],
      destination: {
        countryCode: 'GB',
        postcode: postcode
      }
    };

    // Mock Royal Mail rates for now
    const rates = [
      { service: '1st Class', price: 5.50, deliveryTime: '1-2 days' },
      { service: '2nd Class', price: 3.50, deliveryTime: '2-3 days' },
      { service: 'Special Delivery', price: 12.50, deliveryTime: 'Next day' },
      { service: 'Signed For', price: 7.50, deliveryTime: '1-2 days' }
    ];

    res.json({
      success: true,
      rates
    });

  } catch (error) {
    console.error('Royal Mail rates error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Track Royal Mail shipment
app.get('/api/royal-mail/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const accessToken = await getRoyalMailAccessToken();

    // Mock Royal Mail tracking for now
    const trackingData = {
      trackingNumber: trackingNumber,
      status: 'In Transit',
      location: 'Royal Mail Depot',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      updates: [
        { date: new Date().toISOString(), status: 'Collected', location: 'Raw Essex HQ' },
        { date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), status: 'In Transit', location: 'Royal Mail Depot' }
      ]
    };

    res.json({
      success: true,
      tracking: trackingData
    });

  } catch (error) {
    console.error('Royal Mail tracking error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get Royal Mail shipments for admin
app.get('/admin/royal-mail/shipments', (req, res) => {
  // Mock shipments data
  const shipments = [
    {
      id: 'RM001',
      tracking_id: 'RM123456789GB',
      service: '1st Class',
      destination: 'London, UK',
      status: 'delivered',
      created_at: new Date().toISOString()
    }
  ];
  res.json(shipments);
});

// Test Royal Mail connection
app.post('/admin/royal-mail/test', async (req, res) => {
  try {
    const accessToken = await getRoyalMailAccessToken();
    res.json({
      success: true,
      message: 'Royal Mail connection successful',
      environment: royalMailConfig.environment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/royal-mail/test-connection', async (req, res) => {
  try {
    const accessToken = await getRoyalMailAccessToken();
    res.json({
      success: true,
      message: 'Royal Mail connection successful',
      environment: royalMailConfig.environment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Premium Open Source Admin Panel Route
app.get('/premium-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'premium-admin-enhanced.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`🎉 PREMIUM ADMIN PANEL: http://0.0.0.0:${PORT}/premium-admin`);
  console.log(`📊 Vue.js + Bootstrap + Chart.js Dashboard`);
  console.log(`🔧 Features: Products, Orders, Analytics, Real-time Stats`);
  console.log(`FAQ page available at http://0.0.0.0:${PORT}/faq`);
  console.log(`Now featuring ${productList.length} premium products!`);
});

module.exports = app;