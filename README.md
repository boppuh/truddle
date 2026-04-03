# Truddle 📊

**Professional Trading Dashboard - Vol Regime, Derivatives, Trader's Cockpit, Premarket & Energy**

Truddle is a focused trading dashboard that provides essential trading tools and market analysis in a clean, professional interface.

## 🎯 Core Features

### 📈 **Vol Regime Analysis**
- VIX volatility regime tracking
- Term structure analysis
- Regime classification and alerts

### 📊 **Derivatives Desk** 
- Options scoreboard and analytics
- Interest rates and Fed watch
- Volatility surface analysis
- Crypto derivatives tracking

### 🎛️ **Trader's Cockpit**
- Real-time trading overview
- Position monitoring
- Risk management dashboard
- Quick trade execution

### 🌅 **Premarket Analysis**
- Economic events calendar
- Earnings announcements
- Pre-market movers and alerts
- Market opening preparation

### ⚡ **Gulf Energy Trading**
- Energy commodities tracking
- Crack spread analysis
- Oil and gas sector monitoring
- Energy exposure scoring

## 🏗️ Architecture

- **Frontend**: Next.js 16.2.1 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Icons**: Lucide React icons
- **Backend**: Connects to MC Backend 3-API structure
- **Charts**: Recharts for data visualization

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/boppuh/truddle.git
cd truddle

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## 📊 API Integration

Truddle connects to the MC Backend through API proxying:

```typescript
// All /api/* calls are proxied to MC Backend (localhost:8000)
// Supports the complete 3-API structure:
// - /api/research/* - Research and backtesting
// - /api/trading/* - Real-time trading operations  
// - /api/sigint/* - Signal intelligence
```

## 🎨 Navigation

Clean sidebar navigation with professional trading interface:

- **Vol Regime** - Market volatility analysis (landing page)
- **Derivatives** - Options and derivatives trading
- **Cockpit** - Trading operations overview
- **Premarket** - Pre-market analysis and preparation
- **Energy** - Energy sector and commodities

## 🌐 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile example for production deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
API_BACKEND_URL=http://localhost:8000  # MC Backend URL
NEXT_PUBLIC_APP_NAME=Truddle
```

### Backend Connection
Ensure MC Backend is running on port 8000 for full functionality.

## 📈 Professional Use

Truddle is designed for professional trading operations:

- **Clean Interface**: Focused trading workflow
- **Real-time Data**: Live market data integration
- **Professional Navigation**: Efficient trading operations
- **Responsive Design**: Works on desktop and tablet

## 🔗 Related Projects

- **[MC Backend](https://github.com/boppuh/mc-backend)** - 3-API backend infrastructure
- **[Trading Desk](https://github.com/boppuh/trading-desk)** - Pipeline management and research

## 📄 License

Private repository for professional trading operations.

---

**Truddle** - Professional trading dashboard for serious market operations.