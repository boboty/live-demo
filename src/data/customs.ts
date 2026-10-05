import { skus } from './skus';

export interface CustomsDoc {
  type: string;
  typeName: string;
  status: 'pending' | 'generated' | 'confirmed';
  content?: string;
}

export interface CustomsDeclaration {
  batchNo: string;
  status: 'pending_docs' | 'docs_generated' | 'pushed' | 'processing' | 'cleared';
  customsNo?: string;
  clearanceDate?: string;
  docs: CustomsDoc[];
  items: CustomsItem[];
}

export interface CustomsItem {
  skuId: string;
  skuName: string;
  skuNameEn: string;
  hsCode: string;
  brand: string;
  material: string;
  purpose: string;
  qty: number;
  unit: string;
  grossWeight: number;
  netWeight: number;
  volume: number;
  unitPriceUSD: number;
  totalUSD: number;
  totalCNY: number;
  boxCount: number;
  originCountry: string;
  destinationCountry: string;
  piecesPerBox: number;
}

export function buildCustomsItems(): CustomsItem[] {
  const boxAssignment = [
    { qty: 200, piecesPerBox: 50 },
    { qty: 150, piecesPerBox: 30 },
    { qty: 50, piecesPerBox: 10 },
    { qty: 100, piecesPerBox: 20 },
  ];

  return skus.map((sku, i) => {
    const assign = boxAssignment[i];
    const qty = assign.qty;
    return {
      skuId: sku.id,
      skuName: sku.name,
      skuNameEn: sku.nameEn,
      hsCode: sku.hsCode,
      brand: sku.brand,
      material: sku.material,
      purpose: sku.purpose,
      qty,
      unit: sku.unit,
      grossWeight: +(sku.gWeight * qty).toFixed(2),
      netWeight: +(sku.nWeight * qty).toFixed(2),
      volume: +(sku.volume * qty).toFixed(4),
      unitPriceUSD: sku.priceUSD,
      totalUSD: +(sku.priceUSD * qty).toFixed(2),
      totalCNY: +(sku.priceCNY * qty).toFixed(2),
      boxCount: Math.ceil(qty / assign.piecesPerBox),
      originCountry: '中国',
      destinationCountry: '英国',
      piecesPerBox: assign.piecesPerBox,
    };
  });
}