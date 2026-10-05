export interface ExpenseItem {
  type: string;
  supplier: string;
  amount: number;
  hasInvoice: boolean;
  invoiceNo?: string;
  batchNo: string;
  status: 'confirmed' | 'pending';
}

export function buildExpenses(): ExpenseItem[] {
  return [
    { type: '报关费', supplier: '深圳海通报关行', amount: 650, hasInvoice: true, invoiceNo: 'BG202610001', batchNo: 'EX20261005001', status: 'confirmed' },
    { type: '运输费', supplier: '深圳海远集装箱运输', amount: 2800, hasInvoice: false, batchNo: 'EX20261005001', status: 'pending' },
    { type: '服务费', supplier: '蜂税通科技', amount: 1800, hasInvoice: true, invoiceNo: 'FW202610002', batchNo: 'EX20261005001', status: 'confirmed' },
    { type: '仓储费', supplier: '谷仓海外仓', amount: 850, hasInvoice: true, invoiceNo: 'CC202610003', batchNo: 'EX20261005001', status: 'confirmed' },
    { type: '其他费用', supplier: '检验检疫局', amount: 380, hasInvoice: true, invoiceNo: 'QT202610004', batchNo: 'EX20261005001', status: 'confirmed' },
  ];
}