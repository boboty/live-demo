import { company, currentBatch } from './company';
import { buildCustomsItems } from './customs';
import { buildPurchaseInvoices } from './purchaseInvoice';
import { buildForexRecords } from './invoiceForex';
import type { PurchaseInvoice } from './purchaseInvoice';

export interface TaxDeclarationForm {
  taxpayerName: string;
  creditCode: string;
  taxPeriod: string;
  batchNo: string;
  declarationNo: string;
  exportSalesAmount: number;
  taxFreeExportSales: number;
  exportInvoiceAmount: number;
  forexAmount: number;
  purchaseInvoiceAmount: number;
  purchaseInvoices: PurchaseInvoice[];
  refundableTax: number;
  docMatchStatus: 'complete' | 'partial_anomaly';
  dataValidation: 'passed' | 'failed';
  declarationDate: string;
}

export function buildTaxDeclarationForm(): TaxDeclarationForm {
  const customsItems = buildCustomsItems();
  const exportTotal = customsItems.reduce((s, i) => s + i.totalCNY, 0);
  const forexTotal = buildForexRecords().reduce((s, r) => s + r.amountCNY, 0);
  const purchases = buildPurchaseInvoices();
  const purchaseTotal = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const refundable = Math.round(exportTotal * 0.13);

  const missingPurchases = purchases.filter((p) => p.matchStatus !== 'matched').length;
  const docMatchStatus: 'complete' | 'partial_anomaly' =
    missingPurchases === 0 ? 'complete' : 'partial_anomaly';

  return {
    taxpayerName: '深圳海拓跨境科技有限公司',
    creditCode: '91440300MA5HX9KJ2Q',
    taxPeriod: company.exportPeriod,
    batchNo: currentBatch.batchNo,
    declarationNo: 'DB-202610-001',
    exportSalesAmount: exportTotal,
    taxFreeExportSales: exportTotal,
    exportInvoiceAmount: exportTotal,
    forexAmount: forexTotal,
    purchaseInvoiceAmount: purchaseTotal,
    purchaseInvoices: purchases,
    refundableTax: refundable,
    docMatchStatus,
    dataValidation: 'passed',
    declarationDate: '2026-10-18',
  };
}