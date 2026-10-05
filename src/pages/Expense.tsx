import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildExpenses } from '../data/expense';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';
import FishboneDiagram from '../components/FishboneDiagram/FishboneDiagram';
import type { FishboneBranch } from '../components/FishboneDiagram/FishboneDiagram';

const Expense: React.FC = () => {
  const navigate = useNavigate();
  const { expenses, confirmExpense } = useDemoStore();
  const expenseData = buildExpenses();

  const totalAmount = expenseData.reduce((s, e) => s + e.amount, 0);
  const confirmedAmount = expenses.reduce((s, state, i) => state.confirmed ? s + expenseData[i].amount : s, 0);
  const pendingAmount = totalAmount - confirmedAmount;
  const invoiceComplete = expenseData.filter((e) => e.hasInvoice).length / expenseData.length;

  const handleConfirm = (index: number) => {
    if (window.confirm(`确认费用「${expenseData[index].type}」¥${expenseData[index].amount.toFixed(2)}？`)) {
      confirmExpense(index);
    }
  };

  const columns = [
    { key: 'type', label: '费用类型', render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'supplier', label: '供应商' },
    { key: 'amount', label: '金额', render: (v: number) => `¥${v.toFixed(2)}` },
    {
      key: 'hasInvoice', label: '发票', render: (v: boolean) => v
        ? <span style={{ color: '#276749' }}>✓ 已取得</span>
        : <span style={{ color: '#c05621' }}>⚠ 未取得</span>,
    },
    { key: 'status', label: '状态', render: (_: any, row: any) => {
      const idx = expenseData.indexOf(row);
      const state = expenses[idx];
      if (!state) return <StatusBadge status="pending" />;
      return state.confirmed ? <StatusBadge status="confirmed" /> : <StatusBadge status="pending" />;
    }},
    {
      key: 'actions', label: '操作', render: (_: any, row: any) => {
        const idx = expenseData.indexOf(row);
        const state = expenses[idx];
        if (state?.confirmed) return <span style={{ color: '#a0aec0', fontSize: 12 }}>已确认</span>;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); handleConfirm(idx); }}
            style={{
              padding: '4px 12px',
              background: '#48bb78',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            确认
          </button>
        );
      },
    },
  ];

  // Fishbone: expense evidence structure
  const expenseFishboneTop: FishboneBranch[] = [
    { id: 'e-invoice', title: '发票', detail: '报关费 BG202610001' },
    { id: 'e-receipt', title: '流水单', detail: '银行付款回单' },
    { id: 'e-contract', title: '合同', detail: '运输服务合同' },
    { id: 'e-receipt2', title: '收据', detail: '仓储费收据' },
  ];

  const expenseFishboneBottom: FishboneBranch[] = [
    { id: 'e-screenshot', title: '后台截图', detail: '平台扣费截图' },
    { id: 'e-email', title: '邮件确认', detail: '供应商邮件' },
    { id: 'e-invoice-overseas', title: '境外Invoice', detail: '海外仓商业发票' },
  ];

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">费用确认</div>
      <div className="page-subtitle">业务费用归集与凭证确认 · 多资料交叉验证</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <KPICard label="本批费用" value={`¥${totalAmount.toFixed(2)}`} highlight />
        <KPICard label="已确认" value={`¥${confirmedAmount.toFixed(2)}`} color="#276749" />
        <KPICard label="待确认" value={`¥${pendingAmount.toFixed(2)}`} color="#d69e2e" />
        <KPICard label="凭证完整度" value={`${Math.round(invoiceComplete * 100)}%`} color="#2b6cb0" />
      </div>

      {/* Fishbone: evidence structure */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 20px 12px', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#2d3748' }}>
          费用凭证关系图（鱼骨图）
        </h3>
        <div style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>
          费用事实由哪些资料共同支撑
        </div>
        <FishboneDiagram
          topic="费用"
          topicSub="境内境外"
          topBranches={expenseFishboneTop}
          bottomBranches={expenseFishboneBottom}
        />
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          费用明细
        </h3>
        <DataTable columns={columns} data={expenseData} />
      </div>

      {expenseData.filter((_, i) => !expenses[i]?.confirmed).length > 0 && (
        <div style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #f6e05e', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#744210' }}>
          ⚠ 仍有 {expenseData.filter((_, i) => !expenses[i]?.confirmed).length} 项费用待确认。
          其中运输费 ¥2,800 尚未取得合规发票（Invoice），需补充后确认。
        </div>
      )}
    </div>
  );
};

export default Expense;