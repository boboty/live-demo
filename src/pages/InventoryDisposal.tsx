import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildDisposalCases } from '../data/inventory';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import FishboneDiagram from '../components/FishboneDiagram/FishboneDiagram';
import type { FishboneBranch } from '../components/FishboneDiagram/FishboneDiagram';

const InventoryDisposal: React.FC = () => {
  const navigate = useNavigate();
  const [showPlan, setShowPlan] = React.useState(false);
  const cases = buildDisposalCases();

  // Overseas warehouse relation diagram
  const warehouseTop: FishboneBranch[] = [
    { id: 'w-writeoff', title: '核销', detail: '订单 + 物流运单号' },
  ];
  const warehouseBottom: FishboneBranch[] = [
    { id: 'w-slow', title: '滞销', detail: '处理价 / 报关价 / 视同内销价' },
    { id: 'w-dist', title: '分销', detail: '订单 + 物流 + 真实性 + 主体一致性' },
  ];

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">核销 · 滞销 · 分销</div>
      <div className="page-subtitle">海外仓库存健康监测与异常处置 · 核销关系图</div>

      {/* Fishbone / Branch diagram for overseas warehouse */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 20px 12px', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#2d3748' }}>
          海外仓货物关系图
        </h3>
        <div style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>
          海外仓货物不是只有库存数量，后续还需要核销、滞销处置和分销真实性验证
        </div>
        <FishboneDiagram
          topic="海外仓货物"
          topicSub="Overseas Warehouse"
          topBranches={warehouseTop}
          bottomBranches={warehouseBottom}
        />
      </div>

      {/* Flow visualization */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px 32px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {[
            { label: '库存监测', icon: '📡' },
            { label: '异常识别', icon: '🔍' },
            { label: '滞销判断', icon: '⚠️' },
            { label: '分销/处置', icon: '🔄' },
            { label: '核销完成', icon: '✅' },
          ].map((step, idx) => (
            <React.Fragment key={step.label}>
              <div style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{step.icon}</div>
                <div style={{ fontSize: 12, color: '#4a5568', fontWeight: 500 }}>{step.label}</div>
              </div>
              {idx < 4 && (
                <div style={{
                  flex: 1, height: 2, background: '#e2e8f0', margin: '0 4px',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', right: -4, top: -3, color: '#a0aec0', fontSize: 12,
                  }}>→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Case */}
      {cases.map((c, i) => (
        <div key={i} className="interactive-card" style={{
          background: '#fff', border: '1px solid #fed7d7', borderRadius: 12, padding: 24, marginBottom: 20,
          borderLeft: '4px solid #fc8181',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>
                {c.skuName}
                <span style={{ fontSize: 12, color: '#718096', marginLeft: 12 }}>{c.skuId}</span>
              </div>
              <div style={{ fontSize: 13, color: '#718096' }}>{c.warehouse}</div>
            </div>
            <StatusBadge status="error" label={c.risk} />
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 16, fontSize: 13, color: '#4a5568' }}>
            <div>库存：<strong>{c.stockQty}</strong> 件</div>
            <div>滞销天数：<strong>{c.daysNoSale}</strong> 天</div>
            <div>库存金额：<strong>¥{c.riskAmount.toLocaleString()}</strong></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#744210', background: '#fffbeb', borderRadius: 6, padding: '10px 14px', border: '1px solid #f6e05e' }}>
              🔍 诊断：该 SKU（商品编码）在英国海外仓连续 45 天无销售记录，库存周转率为 0，存在滞销风险。建议及时制定促销或分销方案，减少仓储成本。
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#718096' }}>建议：{c.suggestion}</span>
            <span style={{ fontSize: 13, color: '#718096' }}>|</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: c.status === '待处理' ? '#c05621' : '#276749' }}>
              状态：{c.status}
            </span>
          </div>

          {c.status === '待处理' && (
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setShowPlan(!showPlan)}
                className="interactive-btn"
                style={{
                  padding: '8px 20px',
                  background: '#fff',
                  color: '#2b6cb0',
                  border: '1px solid #2b6cb0',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {showPlan ? '收起处理方案' : '查看处理方案'}
              </button>

              {showPlan && (
                <div style={{ marginTop: 16, padding: 16, background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, lineHeight: 2 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#2d3748' }}>推荐处理方案</div>
                  <div>1️⃣ Amazon Outlet 限时促销 — 预计 30 天内可清仓 60%</div>
                  <div>2️⃣ 跨平台分销至 eBay UK / Shopify 独立站</div>
                  <div>3️⃣ 如 60 天仍未售出，建议退运至国内或本地捐赠核销</div>
                  <div style={{ marginTop: 8, color: '#718096' }}>
                    💡 以上方案需在系统中发起处置申请并经审批后执行
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20,
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          核销历史记录
        </h3>
        <div style={{ fontSize: 13, color: '#a0aec0' }}>
          暂无已核销记录。滞销品完成处置后，将在此展示核销明细。
        </div>
      </div>
    </div>
  );
};

export default InventoryDisposal;