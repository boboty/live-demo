import { skus } from './skus';

export interface PlatformOrder {
  orderId: string;
  platform: string;
  channel: string;
  orderDate: string;
  skuId: string;
  skuName: string;
  qty: number;
  unitPriceUSD: number;
  totalUSD: number;
  buyerName: string;
  logisticsNo: string;
  logisticsCompany: string;
  deliveryCountry: string;
  status: 'shipped' | 'delivered' | 'returned';
}

const buyers = [
  'John Smith', 'Emma Wilson', 'James Brown', 'Sarah Davis',
  'Michael Taylor', 'Lisa Anderson', 'David Thomas', 'Anna Jackson',
];

const logistics = [
  { no: 'YTN', name: 'Yanwen Express' },
  { no: 'EUB', name: 'China Post EUB' },
  { no: 'SF', name: 'SF International' },
  { no: 'DHL', name: 'DHL eCommerce' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let orderCounter = 10001;

export function generateOrders(count: number, baseDate: string): PlatformOrder[] {
  const orders: PlatformOrder[] = [];
  for (let i = 0; i < count; i++) {
    const sku = randomItem(skus);
    const qty = Math.floor(Math.random() * 5) + 1;
    const buyer = randomItem(buyers);
    const logistic = randomItem(logistics);
    const dayOffset = Math.floor(Math.random() * 5);
    const dateObj = new Date(baseDate);
    dateObj.setDate(dateObj.getDate() + dayOffset);
    const dateStr = dateObj.toISOString().slice(0, 10);

    orders.push({
      orderId: `ORD-${orderCounter++}`,
      platform: 'Amazon UK',
      channel: 'Amazon.com',
      orderDate: dateStr,
      skuId: sku.id,
      skuName: sku.name,
      qty,
      unitPriceUSD: sku.priceUSD,
      totalUSD: +(sku.priceUSD * qty).toFixed(2),
      buyerName: buyer,
      logisticsNo: `LOG${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      logisticsCompany: logistic.name,
      deliveryCountry: '英国',
      status: Math.random() > 0.03 ? 'delivered' : Math.random() > 0.5 ? 'shipped' : 'returned',
    });
  }
  return orders;
}