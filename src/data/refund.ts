import { buildCustomsItems } from './customs';
import type { CustomsItem } from './customs';
import { currentBatch } from './company';

export interface RefundMatchItem {
  skuId: string;
  skuName: string;
  customsMatch: boolean;
  orderMatch: boolean;
  purchaseInvoiceMatch: boolean;
  exportInvoiceMatch: boolean;
  forexMatch: boolean;
  matchRate: number;
  issues: string[];
}

export interface RefundSummary {
  batchNo: string;
  matchRate: number;
  matchStatus: 'complete' | 'partial_anomaly';
  estimatedRefund: number;
  estimatedRefundCNY: number;
  totalExportAmount: number;
  items: RefundMatchItem[];
}

const customsItems = buildCustomsItems();

export function buildRefundData(): RefundSummary {
  const items: RefundMatchItem[] = customsItems.map((ci: CustomsItem, i) => {
    const issues: string[] = [];
    const hasPurchaseInvoice = i !== 2; // SKU1003 missing purchase invoice

    if (!hasPurchaseInvoice) {
      issues.push(`SKU ${ci.skuId} 未找到完整进项发票`);
      issues.push(`¥${(ci.totalCNY * 0.6).toFixed(2)} 采购金额待确认`);
    }

    const matchCount = [true, true, hasPurchaseInvoice, true, true].filter(Boolean).length;

    return {
      skuId: ci.skuId,
      skuName: ci.skuName,
      customsMatch: true,
      orderMatch: true,
      purchaseInvoiceMatch: hasPurchaseInvoice,
      exportInvoiceMatch: true,
      forexMatch: true,
      matchRate: Math.round((matchCount / 5) * 100),
      issues,
    };
  });

  const matchRate = Math.round(
    items.reduce((s, i) => s + i.matchRate, 0) / items.length
  );

  const totalExport = customsItems.reduce((s, i) => s + i.totalCNY, 0);

  return {
    batchNo: currentBatch.batchNo,
    matchRate,
    matchStatus: matchRate >= 100 ? 'complete' : 'partial_anomaly',
    estimatedRefund: 12030,
    estimatedRefundCNY: 12030,
    totalExportAmount: totalExport,
    items,
  };
}