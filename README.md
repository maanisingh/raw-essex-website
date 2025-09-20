# Raw Essex - Premium Raw Pet Food E-commerce Website

🎉 **Generated with [Claude Code](https://claude.ai/code)**

## 🌟 Features

- **135+ Premium Products** across 7 categories
- **Complete E-commerce** with shopping cart & checkout
- **Stripe Payment Processing** with admin configuration
- **Multi-Carrier Shipping** (DPD/DHL/Royal Mail)
- **Admin Panel** with product management
- **Educational Content** with veterinary videos
- **Responsive Design** with Raw Essex branding

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Deploy automatically from GitHub
4. **Live URL**: Will be generated automatically

### Option 2: Railway
1. Connect repository to [Railway](https://railway.app)
2. Deploy with one click
3. Automatic HTTPS and custom domain support

### Option 3: Netlify
1. Connect to [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `public`

### Option 4: Docker
```bash
docker build -t raw-essex-website .
docker run -p 3000:3000 raw-essex-website
```

## 🔧 Environment Variables

Create a `.env` file with:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
DPD_API_KEY=your_dpd_api_key
DHL_API_KEY=your_dhl_api_key
PORT=3000
```

## 📱 Local Development

```bash
npm install
npm start
```

Visit: `http://localhost:3000`

## 🛠 Admin Panel

Access at: `/admin`
- Product management
- Payment settings
- Shipping configuration
- CSV import/export

## 📊 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating
- **Payments**: Stripe
- **File Upload**: Multer
- **Environment**: dotenv

## 🎯 Live URLs (Auto-Deploy Ready)

The website will be automatically deployed to permanent HTTPS URLs when connected to:

- **Vercel**: `https://raw-essex-website-[hash].vercel.app`
- **Railway**: `https://raw-essex-website-production.up.railway.app`
- **Netlify**: `https://raw-essex-website.netlify.app`

## 🔒 Security Features

- Environment-based configuration
- Input validation
- Secure payment processing
- File upload restrictions

---

**Built with ❤️ for Raw Essex Premium Pet Food**

*This website will remain online permanently once deployed to any cloud platform above.*