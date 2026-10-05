import React from 'react';
import { useNavigate } from 'react-router-dom';
import { company, currentBatch } from '../data/company';
import { useDemoStore } from '../store/demoStore';

const modules = [
  {
    id: 'qualification',
    title: '资质备案',
    path: '/qualification',
    badge: '7项备案',
    badge2: '已完成6项',
    color: '#2b6cb0',
  },
  {
    id: 'customs',
    title: '报关单证生成',
    path: '/customs',
    badge: '系统演示 →',
    badge2: '',
    color: '#2b6cb0',
    interactive: true,
  },
  {
    id: 'tax',
    title: '税务申报',
    path: '/tax',
    badge: '本期待申报',
    badge2: '查看 →',
    color: '#276749',
  },
  {
    id: 'inventory',
    title: '库存明细台账',
    path: '/inventory',
    badge: '4个SKU',
    badge2: '系统演示 →',
    color: '#2b6cb0',
    interactive: true,
  },
  {
    id: 'invoice-forex',
    title: '发票收汇',
    path: '/invoice-forex',
    badge: '收汇 100%',
    badge2: '系统演示 →',
    color: '#2b6cb0',
    interactive: true,
  },
  {
    id: 'refund',
    title: '退税资料匹配',
    path: '/refund',
    badge: '匹配 92%',
    badge2: '系统演示 →',
    color: '#c05621',
    interactive: true,
  },
  {
    id: 'expense',
    title: '费用确认',
    path: '/expense',
    badge: '2项待确认',
    badge2: '查看 →',
    color: '#b7791f',
  },
  {
    id: 'disposal',
    title: '核销滞销分销',
    path: '/disposal',
    badge: '1项异常',
    badge2: '查看 →',
    color: '#c53030',
  },
];

const ServiceCenter: React.FC = () => {
  const navigate = useNavigate();
  const customsStatus = useDemoStore((s) => s.customsStatus);

  const getModuleBadge = (mod: typeof modules[0]) => {
    if (mod.id === 'customs') {
      if (customsStatus === 'pending_docs') return { badge: '1票待生成', badge2: '系统演示 →', interactive: true };
      if (customsStatus === 'cleared') return { badge: '已结关 ✓', badge2: '查看详情 →', interactive: true };
      return { badge: '1票处理中', badge2: '系统演示 →', interactive: true };
    }
    return mod;
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#718096' }}>
          当前企业：{company.name}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
      >
        {modules.map((mod) => {
          const mb = getModuleBadge(mod);
          return (
            <div
              key={mod.id}
              onClick={() => navigate(mod.path)}
              style={{
                background: '#fff',
                border: `1px solid ${mod.interactive ? '#bed9f7' : '#e2e8f0'}`,
                borderRadius: 12,
                padding: '24px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: mod.interactive ? '0 1px 4px rgba(43,108,176,0.08)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#90cdf4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = mod.interactive ? '0 1px 4px rgba(43,108,176,0.08)' : 'none';
                e.currentTarget.style.borderColor = mod.interactive ? '#bed9f7' : '#e2e8f0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a202c' }}>
                  {mod.title}
                </h3>
                {mod.interactive && (
                  <span
                    style={{
                      fontSize: 11,
                      background: '#ebf8ff',
                      color: '#2b6cb0',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 500,
                      border: '1px solid #bee3f8',
                    }}
                  >
                    系统演示
                  </span>
                )}
              </div>

              {(mod.id === 'customs') && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: '#4a5568', marginBottom: 4 }}>
                    出口批次：{currentBatch.batchNo}
                  </div>
                  <div style={{ fontSize: 13, color: '#4a5568' }}>
                    {currentBatch.skuCount} SKU · {currentBatch.orderCount} 订单 · {currentBatch.currencySymbol}{currentBatch.exportAmount.toLocaleString()}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 13, color: '#2b6cb0', fontWeight: 500, marginTop: 8 }}>
                {mb.badge2 || mb.badge}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 32,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '16px 20px',
          fontSize: 13,
          color: '#718096',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>💡</span>
        点击任一模块进入对应业务工作台。标注「系统演示」的模块包含完整的交互操作流程。
      </div>
    </div>
  );
};

export default ServiceCenter;