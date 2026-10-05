/**
 * Build purchase (进项) invoice data derived from shared customs data.
 * SKU1003 has a missing invoice to keep consistency with refund anomaly.
 */
import { buildCustomsItems } from './customs';
import type { CustomsItem } from './customs';

export interface PurchaseInvoice {
  invoiceNo: string;
  supplierName: string;
  skuId: string;
  skuName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  matchStatus: 'matched' | 'pending' | 'missing';
}

const customsItems = buildCustomsItems();

export function buildPurchaseInvoices(): PurchaseInvoice[] {
  return customsItems.map((ci: CustomsItem, i) => {
    const missing = i === 2; // SKU1003 missing
    const taxRate = 0.13;
    const netAmount = +(ci.totalCNY / (1 + taxRate)).toFixed(2);
    const taxAmount = +(ci.totalCNY - netAmount).toFixed(2);
    return {
      invoiceNo: missing ? '—' : `PUR-INV-20261000${i + 1}`,
      supplierName: missing
        ? '（缺票）'
        : ['深圳市华强电子有限公司', '东莞创威电子厂', '', '宁波亮晶照明有限公司'][i],
      skuId: ci.skuId,
      skuName: ci.skuName,
      amount: missing ? 0 : netAmount,
      taxAmount: missing ? 0 : taxAmount,
      totalAmount: missing ? 0 : ci.totalCNY,
      issueDate: missing ? '—' : `2026-09-${(20 + i).toString().padStart(2, '0')}`,
      matchStatus: missing ? 'missing' : ('matched' as const),
    };
  });
}

export interface InvoicePlan {
  batchNo: string;
  customsAmountCNY: number;
  shouldIssueExportInvoice: number;
  issuedExportInvoice: number;
  purchaseInvoiceTotal: number;
  matchedPurchase: number;
  pendingPurchaseSKU: string;
  status: 'pending' | 'partial' | 'completed';
}

export function buildInvoicePlan(): InvoicePlan {
  const customsTotal = customsItems.reduce((s, i) => s + i.totalCNY, 0);
  const purchases = buildPurchaseInvoices();
  const matchedTotal = purchases
    .filter((p) => p.matchStatus === 'matched')
    .reduce((s, p) => s + p.totalAmount, 0);
  const missingSku = purchases.find((p) => p.matchStatus === 'missing');
  return {
    batchNo: 'EX20261005001',
    customsAmountCNY: customsTotal,
    shouldIssueExportInvoice: customsTotal,
    issuedExportInvoice: 0,
    purchaseInvoiceTotal: customsTotal,
    matchedPurchase: matchedTotal,
    pendingPurchaseSKU: missingSku ? `${missingSku.skuId} ${missingSku.skuName}` : '',
    status: matchedTotal >= customsTotal ? 'completed' : matchedTotal > 0 ? 'partial' : 'pending',
  };
}