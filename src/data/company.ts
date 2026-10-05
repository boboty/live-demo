export interface CompanyInfo {
  name: string;
  shortName: string;
  creditCode: string;
  address: string;
  legalPerson: string;
  contactPhone: string;
  customsCode: string;
  eccNo: string;
  forexCode: string;
  taxNo: string;
  exportPeriod: string;
}

export const company: CompanyInfo = {
  name: '深圳海拓跨境科技有限公司',
  shortName: '海拓跨境',
  creditCode: '91440300MA5HX9KJ2Q',
  address: '深圳市南山区粤海街道科技园社区科苑路8号',
  legalPerson: '张明远',
  contactPhone: '0755-88886666',
  customsCode: '4403169ABC',
  eccNo: '4428A123456',
  forexCode: 'BOC4408XY1234',
  taxNo: '91440300MA5HX9KJ2Q',
  exportPeriod: '2026年10月',
};

export interface BusinessBatch {
  batchNo: string;
  mode: string;
  modeName: string;
  exportDate: string;
  destinationCountry: string;
  destinationName: string;
  currency: string;
  currencySymbol: string;
  orderCount: number;
  skuCount: number;
  exportAmount: number;
  exportAmountCNY: number;
  platform: string;
  port: string;
}

export const currentBatch: BusinessBatch = {
  batchNo: 'EX20261005001',
  mode: '9810',
  modeName: '跨境电商出口海外仓',
  exportDate: '2026-10-05',
  destinationCountry: 'GB',
  destinationName: '英国',
  currency: 'USD',
  currencySymbol: '$',
  orderCount: 168,
  skuCount: 4,
  exportAmount: 13402.9,
  exportAmountCNY: 92480.0,
  platform: 'Amazon UK',
  port: '深圳蛇口',
};