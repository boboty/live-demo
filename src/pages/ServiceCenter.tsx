import React from 'react';
import { useNavigate } from 'react-router-dom';
import { company } from '../data/company';
import { useDemoStore } from '../store/demoStore';
import { buildRefundData } from '../data/refund';

const ServiceCenter: React.FC = () => {
  const navigate = useNavigate();
  const customsStatus = useDemoStore((s) => s.customsStatus);
  const monthlyGenerated = useDemoStore((s) => s.monthlyGenerated);
  const invoiceConfirmed = useDemoStore((s) => s.invoiceConfirmed);
  const invoiceGenerated = useDemoStore((s) => s.invoiceGenerated);
  const invoicePlanGenerated = useDemoStore((s) => s.invoicePlanGenerated);
  const refundMatched = useDemoStore((s) => s.refundMatched);
  const taxDataGenerated = useDemoStore((s) => s.taxDataGenerated);
  const declarationFormGenerated = useDemoStore((s) => s.declarationFormGenerated);

  const refundRate = refundMatched ? buildRefundData().matchRate : 95;

  const modules = [
    {
      id: 'qualification',
      title: '资质备案',
      path: '/qualification',
      badge: '7项备案',
      badge2: '已完成6项',
      color: '#2b6cb0',
      interactive: false,
    },
    {
      id: 'customs',
      title: '报关单证生成',
      path: '/customs',
      badge: customsStatus === 'pending_docs' ? '1票待生成' : customsStatus === 'cleared' ? '已结关 ✓' : '1票处理中',
      badge2: customsStatus === 'pending_docs' ? '系统演示 →' : customsStatus === 'cleared' ? '查看详情 →' : '系统演示 →',
      color: '#2b6cb0',
      interactive: true,
    },
    {
      id: 'tax',
      title: '税务申报',
      path: '/tax',
      badge: declarationFormGenerated ? '申报表已生成 ✓' : taxDataGenerated ? '申报数据已生成 ✓' : '本期待申报',
      badge2: declarationFormGenerated ? '查看申报表 →' : taxDataGenerated ? '生成申报表 →' : '查看 →',
      color: declarationFormGenerated ? '#276749' : taxDataGenerated ? '#2b6cb0' : '#718096',
      interactive: true,
    },
    {
      id: 'inventory',
      title: '库存明细台账',
      path: '/inventory',
      badge: '4个SKU',
      badge2: monthlyGenerated ? '月末明细已生成 ✓' : '系统演示 →',
      color: '#2b6cb0',
      interactive: true,
    },
    {
      id: 'invoice-forex',
      title: '发票收汇',
      path: '/invoice-forex',
      badge: invoiceConfirmed ? '已开票 ✓' : invoiceGenerated ? '已生成发票' : invoicePlanGenerated ? '发票计划已生成' : '待开票',
      badge2: '收汇 100% · ' + (invoiceConfirmed ? '发票已开' : '查看 →'),
      color: invoiceConfirmed ? '#276749' : invoiceGenerated ? '#2b6cb0' : '#2b6cb0',
      interactive: true,
    },
    {
      id: 'refund',
      title: '退税资料匹配',
      path: '/refund',
      badge: refundMatched ? `匹配 ${refundRate}%` : '待智能匹配',
      badge2: refundMatched ? (refundRate >= 100 ? '完全匹配 ✓' : '部分异常 ⚠') : '开始匹配 →',
      color: refundMatched ? (refundRate >= 100 ? '#276749' : '#c05621') : '#c05621',
      interactive: true,
    },
    {
      id: 'expense',
      title: '费用确认',
      path: '/expense',
      badge: '5项费用',
      badge2: '查看 →',
      color: '#b7791f',
      interactive: true,
    },
    {
      id: 'disposal',
      title: '核销滞销分销',
      path: '/disposal',
      badge: '1项异常',
      badge2: '查看 →',
      color: '#c53030',
      interactive: true,
    },
  ];

  const getCardStyle = (modInteractive: boolean) => ({
    border: `1px solid ${modInteractive ? '#bed9f7' : '#e2e8f0'}`,
    background: '#fff' as const,
    borderRadius: 12,
    padding: '24px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    boxShadow: modInteractive ? '0 1px 4px rgba(43,108,176,0.08)' : 'none',
    transform: 'none',
  });

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
          const isInteractive = mod.interactive;
          return (
            <div
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className="interactive-card"
              style={getCardStyle(isInteractive)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a202c' }}>
                  {mod.title}
                </h3>
                {isInteractive && (
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

              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 13, color: '#2d3748' }}>{mod.badge}</div>
              </div>

              <div style={{ fontSize: 13, color: '#2b6cb0', fontWeight: 500, marginTop: 4 }}>
                {mod.badge2}
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