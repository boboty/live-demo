import React from 'react';
import { useNavigate } from 'react-router-dom';
import { company, currentBatch } from '../data/company';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import KPICard from '../components/KPI/KPI';

const TaxDeclaration: React.FC = () => {
  const navigate = useNavigate();
  const { taxDataGenerated, generateTaxData } = useDemoStore();
  const [generating, setGenerating] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  // Derive refund from batch amount
  const estimatedRefund = Math.round(currentBatch.exportAmountCNY * 0.13);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      generateTaxData();
    }, 1500);
  };

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">税务申报</div>
      <div className="page-subtitle">出口退税申报数据生成与校验</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: '#2d3748' }}>{company.exportPeriod}</span>
        <StatusBadge status={taxDataGenerated ? 'completed' : 'pending'} label={taxDataGenerated ? '申报数据已生成' : '待申报'} />
        <span style={{ color: '#718096', fontSize: 13 }}>业务批次：{currentBatch.batchNo}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPICard label="出口销售额" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" highlight />
        <KPICard label="出口笔数" value="1" sub="9810 批次" />
        <KPICard label="商品数量" value="4" sub="SKU" />
        <KPICard label="已开出口发票" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" />
        <KPICard label="收汇金额" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" color="#276749" />
        <KPICard label="数据校验" value={taxDataGenerated ? '通过' : '待校验'} color={taxDataGenerated ? '#276749' : '#b7791f'} />
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          出口退税申报处理流程
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {['海关结关数据', '出口收入归集', '税务口径检查', '申报数据生成', '申报表'].map((step, idx) => (
            <React.Fragment key={step}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  background: idx < 4 ? (idx === 3 && taxDataGenerated ? '#48bb78' : '#2b6cb0') : (taxDataGenerated ? '#48bb78' : '#edf2f7'),
                  color: (idx < 4 || taxDataGenerated) ? '#fff' : '#a0aec0',
                }}>
                  {idx < 4 ? (idx === 3 && taxDataGenerated ? '✓' : idx + 1) : (taxDataGenerated ? '✓' : '5')}
                </div>
                <span style={{ fontSize: 12, fontWeight: idx === 4 && taxDataGenerated ? 600 : 400, color: idx === 4 && taxDataGenerated ? '#48bb78' : (idx < 4 ? '#2b6cb0' : '#a0aec0'), whiteSpace: 'nowrap' }}>
                  {step}
                </span>
              </div>
              {idx < 4 && <div style={{ flex: 1, height: 2, background: idx < 3 || taxDataGenerated ? '#48bb78' : '#e2e8f0', margin: '0 4px' }} />}
            </React.Fragment>
          ))}
        </div>

        {!taxDataGenerated ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: '12px 32px',
                background: generating ? '#90cdf4' : '#2b6cb0',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {generating ? (
                <span>
                  <span style={{ display: 'inline-block', animation: 'pulse 1s infinite' }}>⏳</span> 正在生成申报数据...
                </span>
              ) : '生成申报数据'}
            </button>
            <div style={{ marginTop: 12, fontSize: 12, color: '#718096' }}>
              将基于结关数据和收汇信息自动生成出口退税申报表
            </div>
          </div>
        ) : (
          <div>
            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#276749', marginBottom: 8 }}>✓ 数据校验完成，申报表已生成</div>
              <div style={{ fontSize: 13, color: '#4a5568' }}>
                申报所属期：202610 | 申报批次：001 | 应退税额：¥{estimatedRefund.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 24px',
                background: '#fff',
                color: '#2b6cb0',
                border: '1px solid #2b6cb0',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {showForm ? '收起申报表' : '预览申报表'}
            </button>

            {showForm && (
              <div style={{ marginTop: 16, padding: 20, background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>
                <h4 style={{ margin: '0 0 16px', fontSize: 14 }}>出口货物退（免）税申报表</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#edf2f7' }}>
                      <th style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'left' }}>项目</th>
                      <th style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'right' }}>金额 (RMB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>出口销售额</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'right' }}>{currentBatch.exportAmountCNY.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>免抵退税额</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'right' }}>{estimatedRefund.toLocaleString()}.00</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>应退税额</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'right', fontWeight: 700, color: '#276749' }}>{estimatedRefund.toLocaleString()}.00</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>免抵税额</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: 8, textAlign: 'right' }}>0.00</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: 12, fontSize: 11, color: '#a0aec0' }}>
                  注：本预览仅供演示参考，实际申报以电子税务局为准。
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxDeclaration;