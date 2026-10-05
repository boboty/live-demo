import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentBatch } from '../data/company';
import { buildRefundData } from '../data/refund';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';

const TaxRefundMatch: React.FC = () => {
  const navigate = useNavigate();
  const { refundMatched, matchRefund } = useDemoStore();
  const [matching, setMatching] = useState(false);
  const [matchStep, setMatchStep] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const data = buildRefundData();

  const steps = ['正在匹配报关单...', '正在匹配平台订单...', '正在匹配收汇流水...', '正在匹配进项发票...', '正在匹配出口发票...'];

  const handleMatch = () => {
    setMatching(true);
    const interval = setInterval(() => {
      setMatchStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setMatching(false);
            matchRefund();
            setShowTable(true);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const matchColumns = [
    { key: 'skuId', label: 'SKU' },
    { key: 'skuName', label: '商品' },
    { key: 'customsMatch', label: '报关单', render: (v: boolean) => v ? '✓' : '✗' },
    { key: 'orderMatch', label: '平台订单', render: (v: boolean) => v ? '✓' : '✗' },
    { key: 'purchaseInvoiceMatch', label: '进项发票', render: (v: boolean) => v ? '✓' : <span style={{ color: '#e53e3e' }}>✗</span> },
    { key: 'exportInvoiceMatch', label: '出口发票', render: (v: boolean) => v ? '✓' : '✗' },
    { key: 'forexMatch', label: '银行收汇', render: (v: boolean) => v ? '✓' : '✗' },
    {
      key: 'matchRate', label: '匹配度', render: (v: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 60, height: 6, background: '#edf2f7', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${v}%`, background: v >= 100 ? '#48bb78' : v >= 80 ? '#d69e2e' : '#e53e3e', borderRadius: 3 }} />
          </div>
          <span style={{ fontWeight: 500, color: v >= 100 ? '#48bb78' : '#d69e2e' }}>{v}%</span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">退税资料智能匹配</div>
      <div className="page-subtitle">系统自动对报关单、平台订单、收汇流水、进项发票、出口发票进行五方数据匹配</div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#2b6cb0' }}>{currentBatch.batchNo}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#718096' }}>资料完整度</span>
              <div style={{ width: 200, height: 8, background: '#edf2f7', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${refundMatched ? data.matchRate : 60}%`, background: refundMatched ? (data.matchRate >= 100 ? '#48bb78' : '#d69e2e') : '#a0aec0', borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: refundMatched ? (data.matchRate >= 100 ? '#276749' : '#d69e2e') : '#a0aec0' }}>
                {refundMatched ? `${data.matchRate}%` : '60%'}
              </span>
            </div>
            {refundMatched && (
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#4a5568' }}>
                <span>匹配状态：<StatusBadge status={data.matchStatus === 'complete' ? 'matched' : 'partial_anomaly'} /></span>
                <span>预计退税额：<strong style={{ color: '#276749' }}>¥{data.estimatedRefund.toLocaleString()}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Five-card visualization */}
      {!matching && !refundMatched && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {['报关单', '平台订单', '进项发票', '出口发票', '银行收汇'].map((name, i) => (
            <div key={name} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', textAlign: 'center', minWidth: 120,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>
                {['📋', '🛒', '📄', '🧾', '🏦'][i]}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#2d3748', marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 11, color: '#a0aec0' }}>
                {['1票', '168笔', '3/4', '1票', '3笔'][i]}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 24, color: '#2b6cb0', fontWeight: 700 }}>→</div>
          <div style={{
            background: 'linear-gradient(135deg, #ebf8ff, #e0edf9)', border: '2px solid #90cdf4', borderRadius: 12, padding: '16px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2b6cb0' }}>智能匹配</div>
            <div style={{ fontSize: 11, color: '#2b6cb0' }}>五方核验</div>
          </div>
        </div>
      )}

      {/* Match button */}
      {!refundMatched && !matching && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={handleMatch}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #2b6cb0, #1a365d)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(43,108,176,0.3)',
            }}
          >
            🚀 开始智能匹配
          </button>
        </div>
      )}

      {/* Matching animation */}
      {matching && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 32, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#2b6cb0', marginBottom: 8 }}>
            {steps[matchStep] || '匹配完成'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: 40, height: 4, borderRadius: 2,
                background: i <= matchStep ? '#2b6cb0' : '#e2e8f0',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {showTable && refundMatched && (
        <div>
          {/* Anomalies */}
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.items.filter((i) => i.issues.length > 0).map((item) => (
              <div key={item.skuId} style={{
                background: '#fffbeb', border: '1px solid #f6c23e', borderRadius: 8, padding: '12px 16px',
              }}>
                <div style={{ fontWeight: 500, color: '#744210', marginBottom: 4 }}>⚠ {item.skuName} ({item.skuId})</div>
                {item.issues.map((issue, j) => (
                  <div key={j} style={{ fontSize: 13, color: '#975a16', marginLeft: 16 }}>{issue}</div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
                匹配详细表
              </h3>
              <button
                onClick={() => setShowTable(!showTable)}
                style={{
                  padding: '6px 16px',
                  background: '#ebf8ff',
                  color: '#2b6cb0',
                  border: '1px solid #bee3f8',
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {showTable ? '收起' : '展开'}
              </button>
            </div>
            <DataTable columns={matchColumns} data={data.items} />
          </div>
        </div>
      )}

      {refundMatched && (
        <div style={{ marginTop: 16, background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#276749' }}>
          ✓ 智能匹配已完成。报关单、平台订单、收汇流水、进项发票、出口发票已建立交叉核验关系。
        </div>
      )}
    </div>
  );
};

export default TaxRefundMatch;