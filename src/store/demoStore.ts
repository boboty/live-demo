import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildExpenses } from '../data/expense';

export interface ExpenseState {
  confirmed: boolean;
  hasInvoice: boolean;
}

export interface DemoStore {
  customsStatus: 'pending_docs' | 'docs_generated' | 'pushed' | 'processing' | 'cleared';
  customsNo: string | null;
  clearanceDate: string | null;
  docsGenerated: boolean;

  monthlyGenerated: boolean;

  invoicePlanGenerated: boolean;
  invoiceGenerated: boolean;
  invoiceConfirmed: boolean;

  refundMatched: boolean;

  taxDataGenerated: boolean;
  declarationFormGenerated: boolean;

  expenses: ExpenseState[];

  generateCustomsDocs: () => void;
  pushCustoms: () => void;
  simulateClearance: () => void;
  generateMonthlyInventory: () => void;
  generateInvoicePlan: () => void;
  generateInvoice: () => void;
  confirmInvoice: () => void;
  matchRefund: () => void;
  generateTaxData: () => void;
  generateDeclarationForm: () => void;
  confirmExpense: (index: number) => void;
  resetAll: () => void;
}

function buildInitialExpenses(): ExpenseState[] {
  return buildExpenses().map((e) => ({
    confirmed: e.status === 'confirmed',
    hasInvoice: e.hasInvoice,
  }));
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      customsStatus: 'pending_docs',
      customsNo: null,
      clearanceDate: null,
      docsGenerated: false,

      monthlyGenerated: false,

      invoicePlanGenerated: false,
      invoiceGenerated: false,
      invoiceConfirmed: false,

      refundMatched: false,

      taxDataGenerated: false,
      declarationFormGenerated: false,

      expenses: buildInitialExpenses(),

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

      generateInvoicePlan: () => set({ invoicePlanGenerated: true }),

      generateInvoice: () => set({ invoiceGenerated: true }),

      confirmInvoice: () => set({ invoiceConfirmed: true }),

      matchRefund: () => set({ refundMatched: true }),

      generateTaxData: () => set({ taxDataGenerated: true }),

      generateDeclarationForm: () => set({ declarationFormGenerated: true }),

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
          invoicePlanGenerated: false,
          invoiceGenerated: false,
          invoiceConfirmed: false,
          refundMatched: false,
          taxDataGenerated: false,
          declarationFormGenerated: false,
          expenses: buildInitialExpenses(),
        }),
    }),
    {
      name: 'demo-9810-store',
    }
  )
);