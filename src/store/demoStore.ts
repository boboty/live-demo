import { create } from 'zustand';
import { buildExpenses } from '../data/expense';

export interface DemoStore {
  // Customs
  customsStatus: 'pending_docs' | 'docs_generated' | 'pushed' | 'processing' | 'cleared';
  customsNo: string | null;
  clearanceDate: string | null;
  docsGenerated: boolean;

  // Inventory
  monthlyGenerated: boolean;

  // Invoice
  invoiceGenerated: boolean;
  invoiceConfirmed: boolean;

  // Refund
  refundMatched: boolean;

  // Tax
  taxDataGenerated: boolean;

  // Expense
  expenses: { confirmed: boolean; hasInvoice: boolean }[];

  // Actions
  generateCustomsDocs: () => void;
  pushCustoms: () => void;
  simulateClearance: () => void;
  generateMonthlyInventory: () => void;
  generateInvoice: () => void;
  confirmInvoice: () => void;
  matchRefund: () => void;
  generateTaxData: () => void;
  confirmExpense: (index: number) => void;
  resetAll: () => void;
}

const initialExpenses = buildExpenses();

export const useDemoStore = create<DemoStore>((set) => ({
  customsStatus: 'pending_docs',
  customsNo: null,
  clearanceDate: null,
  docsGenerated: false,

  monthlyGenerated: false,

  invoiceGenerated: false,
  invoiceConfirmed: false,

  refundMatched: false,

  taxDataGenerated: false,

  expenses: initialExpenses.map(() => ({ confirmed: false, hasInvoice: false })),

  generateCustomsDocs: () =>
    set({ customsStatus: 'docs_generated', docsGenerated: true }),

  pushCustoms: () => set({ customsStatus: 'pushed' }),

  simulateClearance: () =>
    set({
      customsStatus: 'cleared',
      customsNo: '530120261000123456',
      clearanceDate: '2026-10-05 16:32',
    }),

  generateMonthlyInventory: () => set({ monthlyGenerated: true }),

  generateInvoice: () => set({ invoiceGenerated: true }),

  confirmInvoice: () => set({ invoiceConfirmed: true }),

  matchRefund: () => set({ refundMatched: true }),

  generateTaxData: () => set({ taxDataGenerated: true }),

  confirmExpense: (index: number) =>
    set((state) => {
      const expenses = [...state.expenses];
      expenses[index] = { ...expenses[index], confirmed: true };
      return { expenses };
    }),

  resetAll: () =>
    set({
      customsStatus: 'pending_docs',
      customsNo: null,
      clearanceDate: null,
      docsGenerated: false,
      monthlyGenerated: false,
      invoiceGenerated: false,
      invoiceConfirmed: false,
      refundMatched: false,
      taxDataGenerated: false,
      expenses: initialExpenses.map(() => ({ confirmed: false, hasInvoice: false })),
    }),
}));