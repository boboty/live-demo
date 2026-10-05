export interface SKU {
  id: string;
  name: string;
  nameEn: string;
  hsCode: string;
  brand: string;
  material: string;
  purpose: string;
  unit: string;
  gWeight: number;
  nWeight: number;
  volume: number;
  priceUSD: number;
  priceCNY: number;
}

export const skus: SKU[] = [
  {
    id: 'SKU1001',
    name: '智能蓝牙耳机 Pro',
    nameEn: 'Smart Bluetooth Earbuds Pro',
    hsCode: '8518300090',
    brand: 'HaiTop',
    material: 'ABS塑料/电子元件',
    purpose: '无线音频传输与通话',
    unit: '个',
    gWeight: 0.085,
    nWeight: 0.072,
    volume: 0.00012,
    priceUSD: 25.5,
    priceCNY: 175.95,
  },
  {
    id: 'SKU1002',
    name: '三合一无线充电器',
    nameEn: '3-in-1 Wireless Charger',
    hsCode: '8504401990',
    brand: 'HaiTop',
    material: 'PC塑料/电子元件/硅胶',
    purpose: '同时为多设备无线充电',
    unit: '个',
    gWeight: 0.21,
    nWeight: 0.18,
    volume: 0.00045,
    priceUSD: 18.8,
    priceCNY: 129.72,
  },
  {
    id: 'SKU1003',
    name: '便携式户外电源 200W',
    nameEn: 'Portable Power Station 200W',
    hsCode: '8504401990',
    brand: 'HaiTop',
    material: '锂电池/铝合金壳体',
    purpose: '户外应急储能供电',
    unit: '个',
    gWeight: 3.2,
    nWeight: 2.85,
    volume: 0.0085,
    priceUSD: 30.0,
    priceCNY: 207.0,
  },
  {
    id: 'SKU1004',
    name: '智能LED台灯',
    nameEn: 'Smart LED Desk Lamp',
    hsCode: '9405219000',
    brand: 'HaiTop',
    material: '铝合金/ABS塑料/LED模组',
    purpose: '办公阅读照明',
    unit: '个',
    gWeight: 0.65,
    nWeight: 0.52,
    volume: 0.0028,
    priceUSD: 39.829,
    priceCNY: 274.82,
  },
];