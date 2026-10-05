import { buildCustomsItems } from './customs';
import { toChineseAmount } from './chineseAmount';

export interface ExportInvoice {
  invoiceNo: string;
  batchNo: string;
  issueDate: string;
  buyerName: string;
  buyerAddress: string;
  items: {
    skuId: string;
    skuName: string;
    hsCode: string;
    qty: number;
    unit: string;
    unitPriceCNY: number;
    totalCNY: number;
  }[];
  totalAmountCNY: number;
  totalAmountWords: string;
  status: 'pending' | 'generated' | 'confirmed';
}

export interface ForexRecord {
  date: string;
  bank: string;
  currency: string;
  amount: number;
  amountCNY: number;
  batchNo: string;
  status: 'matched' | 'pending';
  remark?: string;
}

const customsItems = buildCustomsItems();

export function buildExportInvoice(): ExportInvoice {
  const items = customsItems.map((item) => ({
    skuId: item.skuId,
    skuName: item.skuName,
    hsCode: item.hsCode,
    qty: item.qty,
    unit: item.unit,
    unitPriceCNY: +(item.totalCNY / item.qty).toFixed(2),
    totalCNY: item.totalCNY,
  }));
  const total = items.reduce((s, i) => s + i.totalCNY, 0);
  return {
    invoiceNo: 'EXP-INV-202610001',
    batchNo: 'EX20261005001',
    issueDate: '2026-10-05',
    buyerName: 'HaiTop Technology UK Ltd.',
    buyerAddress: 'Unit 3, Nexus Park, Feltham, London TW14 0AF, UK',
    items,
    totalAmountCNY: +total.toFixed(2),
    totalAmountWords: toChineseAmount(total),
    status: 'pending',
  };
}

export function buildForexRecords(): ForexRecord[] {
  // Sum to exactly 13402.90 USD / 92480 CNY
  const totalUSD = customsItems.reduce((s, i) => s + i.totalUSD, 0);
  const totalCNY = customsItems.reduce((s, i) => s + i.totalCNY, 0);
  return [
    { date: '2026-10-15', bank: '中国银行深圳蛇口支行', currency: 'USD', amount: +(totalUSD * 0.45).toFixed(2), amountCNY: +(totalCNY * 0.45).toFixed(2), batchNo: 'EX20261005001', status: 'matched' },
    { date: '2026-10-18', bank: '中国银行深圳蛇口支行', currency: 'USD', amount: +(totalUSD * 0.35).toFixed(2), amountCNY: +(totalCNY * 0.35).toFixed(2), batchNo: 'EX20261005001', status: 'matched' },
    { date: '2026-10-22', bank: '中国银行深圳蛇口支行', currency: 'USD', amount: +(totalUSD * 0.20).toFixed(2), amountCNY: +(totalCNY * 0.20).toFixed(2), batchNo: 'EX20261005001', status: 'matched' },
  ];
}