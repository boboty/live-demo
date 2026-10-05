import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { company } from '../data/company';
import { buildInitialInventory, computeMonthlySummary } from '../data/inventory';
import { useDemoStore } from '../store/demoStore';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { monthlyGenerated, generateMonthlyInventory } = useDemoStore();
  const [generating, setGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const records = buildInitialInventory();
  const summary = computeMonthlySummary(records);

  const totalIn = records.reduce((s, r) => s + r.qtyIn, 0);
  const totalReturn = records.filter((r) => r.type === '退货入库').reduce((s, r) => s + r.qtyIn, 0);
  const totalSales = records.filter((r) => r.type === '渠道销售').reduce((s, r) => s + r.qtyOut, 0);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      generateMonthlyInventory();
      setShowSummary(true);
    }, 1200);
  };

  const columns = [
    { key: 'date', label: '日期' },
    { key: 'type', label: '类型', render: (v: string) => {
      const colors: Record<string, string> = { '报关入库': '#2b6cb0', '其他入库': '#805ad5', '退货入库': '#d69e2e', '渠道销售': '#38a169' };
      return <span style={{ color: colors[v] || '#718096', fontWeight: 500 }}>{v}</span>;
    }},
    { key: 'docNo', label: '单据号' },
    { key: 'skuName', label: '商品' },
    { key: 'qtyIn', label: '入库', render: (v: number) => v > 0 ? <span style={{ color: '#2b6cb0', fontWeight: 500 }}>{v}</span> : '-' },
    { key: 'qtyOut', label: '出库', render: (v: number) => v > 0 ? <span style={{ color: '#d69e2e', fontWeight: 500 }}>{v}</span> : '-' },
    { key: 'balance', label: '结存', render: (v: number) => <span style={{ fontWeight: 500 }}>{v}</span> },
  ];

  const summaryColumns = [
    { key: 'skuName', label: 'SKU' },
    { key: 'beginQty', label: '期初' },
    { key: 'inboundQty', label: '入库' },
    { key: 'salesQty', label: '销售' },
    { key: 'returnQty', label: '退货' },
    { key: 'lossQty', label: '损耗' },
    { key: 'endQty', label: '期末' },
  ];

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">库存明细台账</div>
      <div className="page-subtitle">SKU 级别库存流水、月度汇总与损耗管理</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <KPICard label="SKU数量" value="4" />
        <KPICard label="本月入库" value={totalIn} />
        <KPICard label="渠道销售" value={totalSales} highlight color="#38a169" />
        <KPICard label="退货" value={totalReturn} color="#d69e2e" />
        <KPICard label="损耗" value={summary.reduce((s, i) => s + i.lossQty, 0)} color="#e53e3e" />
        <KPICard label="期末库存" value={summary.reduce((s, i) => s + i.endQty, 0)} highlight />
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              库存流水
            </h3>
            <DataTable columns={columns} data={records} maxHeight="420px" />
          </div>
        </div>

        <div style={{ width: 240 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              操作
            </h3>
            {!monthlyGenerated ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: generating ? '#90cdf4' : '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: generating ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? '生成中...' : '生成月末库存明细'}
              </button>
            ) : (
              <div style={{ fontSize: 13, color: '#48bb78', fontWeight: 500 }}>
                ✓ 月末明细已生成
              </div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginTop: 12 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#2d3748' }}>
              库存构成
            </h3>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              <div>🏢 报关入库 <span style={{ float: 'right', fontWeight: 500 }}>{totalIn}</span></div>
              <div>📦 渠道销售 <span style={{ float: 'right', fontWeight: 500 }}>-{totalSales}</span></div>
              <div>↩️ 退货入库 <span style={{ float: 'right', fontWeight: 500 }}>+{totalReturn}</span></div>
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 4, paddingTop: 4, fontWeight: 600 }}>
                期末结存 <span style={{ float: 'right' }}>{totalIn - totalSales + totalReturn - summary.reduce((s, i) => s + i.lossQty, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      {showSummary && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
            月末库存明细 - {company.exportPeriod}
          </h3>
          <DataTable columns={summaryColumns} data={summary} />
        </div>
      )}

      {!monthlyGenerated && (
        <div
          style={{
            marginTop: 16,
            background: '#fffbeb',
            border: '1px solid #f6e05e',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 13,
            color: '#744210',
          }}
        >
          ⚠ 提示：点击「生成月末库存明细」以查看月末库存汇总和损耗数据。
        </div>
      )}
    </div>
  );
};

export default Inventory;