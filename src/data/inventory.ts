import { skus } from './skus';

export interface InventoryRecord {
  date: string;
  type: '报关入库' | '其他入库' | '退货入库' | '渠道销售';
  docNo: string;
  skuId: string;
  skuName: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
  orderId?: string;
  logisticsNo?: string;
  channel?: string;
  batchNo: string;
}

export interface MonthlySummary {
  skuId: string;
  skuName: string;
  beginQty: number;
  inboundQty: number;
  salesQty: number;
  returnQty: number;
  lossQty: number;
  endQty: number;
}

export interface DisposalCase {
  skuId: string;
  skuName: string;
  warehouse: string;
  stockQty: number;
  daysNoSale: number;
  riskAmount: number;
  risk: '滞销' | '正常';
  suggestion: string;
  status: '待处理' | '已处理';
}

export function buildInitialInventory() {
  const records: InventoryRecord[] = [
    { date: '2026-10-02', type: '报关入库', docNo: 'IN20261002001', skuId: 'SKU1001', skuName: '智能蓝牙耳机 Pro', qtyIn: 1680, qtyOut: 0, balance: 1680, batchNo: 'EX20261005001' },
    { date: '2026-10-02', type: '报关入库', docNo: 'IN20261002002', skuId: 'SKU1002', skuName: '三合一无线充电器', qtyIn: 1200, qtyOut: 0, balance: 1200, batchNo: 'EX20261005001' },
    { date: '2026-10-02', type: '报关入库', docNo: 'IN20261002003', skuId: 'SKU1003', skuName: '便携式户外电源 200W', qtyIn: 400, qtyOut: 0, balance: 400, batchNo: 'EX20261005001' },
    { date: '2026-10-02', type: '报关入库', docNo: 'IN20261002004', skuId: 'SKU1004', skuName: '智能LED台灯', qtyIn: 800, qtyOut: 0, balance: 800, batchNo: 'EX20261005001' },
    { date: '2026-10-03', type: '渠道销售', docNo: 'SALE-001', skuId: 'SKU1001', skuName: '智能蓝牙耳机 Pro', qtyIn: 0, qtyOut: 420, balance: 1260, orderId: 'ORD-10001', logisticsNo: 'LOGX1A2B3C', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-04', type: '渠道销售', docNo: 'SALE-002', skuId: 'SKU1002', skuName: '三合一无线充电器', qtyIn: 0, qtyOut: 350, balance: 850, orderId: 'ORD-10002', logisticsNo: 'LOGX4D5E6F', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-05', type: '渠道销售', docNo: 'SALE-003', skuId: 'SKU1001', skuName: '智能蓝牙耳机 Pro', qtyIn: 0, qtyOut: 580, balance: 680, orderId: 'ORD-10003', logisticsNo: 'LOGX7G8H9I', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-06', type: '渠道销售', docNo: 'SALE-004', skuId: 'SKU1003', skuName: '便携式户外电源 200W', qtyIn: 0, qtyOut: 120, balance: 280, orderId: 'ORD-10004', logisticsNo: 'LOGX0J1K2L', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-07', type: '渠道销售', docNo: 'SALE-005', skuId: 'SKU1004', skuName: '智能LED台灯', qtyIn: 0, qtyOut: 250, balance: 550, orderId: 'ORD-10005', logisticsNo: 'LOGX3M4N5O', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-08', type: '渠道销售', docNo: 'SALE-006', skuId: 'SKU1002', skuName: '三合一无线充电器', qtyIn: 0, qtyOut: 400, balance: 450, orderId: 'ORD-10006', logisticsNo: 'LOGX6P7Q8R', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-09', type: '退货入库', docNo: 'RET-001', skuId: 'SKU1001', skuName: '智能蓝牙耳机 Pro', qtyIn: 12, qtyOut: 0, balance: 692, orderId: 'ORD-10007', logisticsNo: 'LOGX9S0T1U', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-10', type: '退货入库', docNo: 'RET-002', skuId: 'SKU1004', skuName: '智能LED台灯', qtyIn: 8, qtyOut: 0, balance: 558, orderId: 'ORD-10008', logisticsNo: 'LOGXV2W3X4', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-11', type: '渠道销售', docNo: 'SALE-007', skuId: 'SKU1004', skuName: '智能LED台灯', qtyIn: 0, qtyOut: 180, balance: 378, orderId: 'ORD-10009', logisticsNo: 'LOGXY5Z6A7', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-12', type: '退货入库', docNo: 'RET-003', skuId: 'SKU1002', skuName: '三合一无线充电器', qtyIn: 3, qtyOut: 0, balance: 453, orderId: 'ORD-10010', logisticsNo: 'LOGXB8C9D0', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-13', type: '渠道销售', docNo: 'SALE-008', skuId: 'SKU1001', skuName: '智能蓝牙耳机 Pro', qtyIn: 0, qtyOut: 490, balance: 202, orderId: 'ORD-10011', logisticsNo: 'LOGXE1F2G3', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-14', type: '渠道销售', docNo: 'SALE-009', skuId: 'SKU1002', skuName: '三合一无线充电器', qtyIn: 0, qtyOut: 280, balance: 173, orderId: 'ORD-10012', logisticsNo: 'LOGXH4I5J6', channel: 'Amazon UK', batchNo: 'EX20261005001' },
    { date: '2026-10-15', type: '其他入库', docNo: 'ADJ-001', skuId: 'SKU1003', skuName: '便携式户外电源 200W', qtyIn: 5, qtyOut: 0, balance: 285, batchNo: 'EX20261005001' },
  ];
  return records;
}

export function computeMonthlySummary(records: InventoryRecord[]): MonthlySummary[] {
  return skus.map((sku) => {
    const skuRecords = records.filter((r) => r.skuId === sku.id);
    const inboundQty = skuRecords.reduce((s, r) => s + r.qtyIn, 0);
    const salesQty = skuRecords.filter((r) => r.type === '渠道销售').reduce((s, r) => s + r.qtyOut, 0);
    const returnQty = skuRecords.filter((r) => r.type === '退货入库').reduce((s, r) => s + r.qtyIn, 0);
    const lossQty = Math.floor(Math.random() * 3) + 1; // simulate small loss
    const endQty = inboundQty - salesQty + returnQty - lossQty;
    return {
      skuId: sku.id,
      skuName: sku.name,
      beginQty: 0,
      inboundQty,
      salesQty,
      returnQty,
      lossQty,
      endQty,
    };
  });
}

export function buildDisposalCases(): DisposalCase[] {
  return [
    {
      skuId: 'SKU1003',
      skuName: '便携式户外电源 200W',
      warehouse: '英国海外仓',
      stockQty: 85,
      daysNoSale: 45,
      riskAmount: 6800,
      risk: '滞销',
      suggestion: '建议通过 Amazon Outlet 渠道进行促销分销',
      status: '待处理',
    },
  ];
}