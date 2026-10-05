import React from 'react';
import { useNavigate } from 'react-router-dom';
import { company, currentBatch } from '../data/company';
import { useDemoStore } from '../store/demoStore';
import { buildTaxDeclarationForm } from '../data/taxDeclaration';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import KPICard from '../components/KPI/KPI';

const TaxDeclaration: React.FC = () => {
  const navigate = useNavigate();
  const { taxDataGenerated, declarationFormGenerated, generateTaxData, generateDeclarationForm } = useDemoStore();
  const [generating, setGenerating] = React.useState(false);
  const [formGenerating, setFormGenerating] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const estimatedRefund = Math.round(currentBatch.exportAmountCNY * 0.13);
  const declarationForm = buildTaxDeclarationForm();

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      generateTaxData();
    }, 1500);
  };

  const handleGenerateForm = () => {
    setFormGenerating(true);
    setTimeout(() => {
      setFormGenerating(false);
      generateDeclarationForm();
      setShowForm(true);
    }, 1200);
  };

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">税务申报</div>
      <div className="page-subtitle">出口退税申报数据生成与校验 · 正式申报表预览</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: '#2d3748' }}>{company.exportPeriod}</span>
        <StatusBadge status={taxDataGenerated ? 'completed' : 'pending'} label={taxDataGenerated ? '申报数据已生成' : '待申报'} />
        <span style={{ color: '#718096', fontSize: 13 }}>业务批次：{currentBatch.batchNo}</span>
        {declarationFormGenerated && <StatusBadge status="completed" label="申报表已生成" />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPICard label="出口销售额" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" highlight />
        <KPICard label="出口笔数" value="1" sub="9810 批次" />
        <KPICard label="商品数量" value="4" sub="SKU（商品编码）" />
        <KPICard label="已开出口发票" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" />
        <KPICard label="收汇金额" value={currentBatch.exportAmountCNY.toLocaleString()} sub="RMB" color="#276749" />
        <KPICard label="数据校验" value={taxDataGenerated ? '通过' : '待校验'} color={taxDataGenerated ? '#276749' : '#b7791f'} />
      </div>

      {/* Combined flow section */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          出口退税申报处理流程
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {['海关结关数据', '出口收入归集', '税务口径检查', '申报数据生成', '申报表'].map((step, idx) => {
            const done = idx < 4 ? (idx === 3 && taxDataGenerated) : declarationFormGenerated;
            const active = idx < 4 ? (idx < 3 || taxDataGenerated) : (taxDataGenerated && !declarationFormGenerated);
            return (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600,
                    background: done ? '#48bb78' : (active ? '#2b6cb0' : '#edf2f7'),
                    color: done || active ? '#fff' : '#a0aec0',
                  }}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: done ? 600 : 400, color: done ? '#48bb78' : (active ? '#2b6cb0' : '#a0aec0'), whiteSpace: 'nowrap' }}>
                    {step}
                  </span>
                </div>
                {idx < 4 && <div style={{ flex: 1, height: 2, background: done || (idx < 3 && taxDataGenerated) ? '#48bb78' : '#e2e8f0', margin: '0 4px' }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1: Generate Tax Data */}
        {!taxDataGenerated && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="interactive-btn"
              style={{
                padding: '12px 32px',
                background: generating ? '#90cdf4' : '#2b6cb0',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {generating ? '⏳ 正在生成申报数据...' : '生成申报数据'}
            </button>
            <div style={{ marginTop: 12, fontSize: 12, color: '#718096' }}>
              基于结关数据和收汇信息自动生成出口退税申报数据
            </div>
          </div>
        )}

        {/* Step 2: Generate Declaration Form */}
        {taxDataGenerated && !declarationFormGenerated && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 600, color: '#276749', marginBottom: 8 }}>✓ 数据校验完成</div>
              <div style={{ fontSize: 13, color: '#4a5568' }}>
                所属期：{company.exportPeriod} | 应退税额：¥{estimatedRefund.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleGenerateForm}
              disabled={formGenerating}
              className="interactive-btn"
              style={{
                padding: '12px 32px',
                background: formGenerating ? '#90cdf4' : '#2b6cb0',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {formGenerating ? '⏳ 正在生成申报表...' : '生成申报表'}
            </button>
            <div style={{ marginTop: 12, fontSize: 12, color: '#718096' }}>
              生成正式税务申报表，包含完整申报数据与校验信息
            </div>
          </div>
        )}

        {/* Step 3: Declaration Form Generated */}
        {declarationFormGenerated && (
          <div>
            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#276749', marginBottom: 8 }}>✓ 申报表已生成</div>
              <div style={{ fontSize: 13, color: '#4a5568' }}>
                申报所属期：{declarationForm.taxPeriod} | 申报批次：{declarationForm.batchNo} | 应退税额：¥{declarationForm.refundableTax.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setShowForm(!showForm)}
                className="interactive-btn"
                style={{
                  padding: '10px 24px',
                  background: showForm ? '#ebf8ff' : '#fff',
                  color: '#2b6cb0',
                  border: `1px solid ${showForm ? '#90cdf4' : '#2b6cb0'}`,
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {showForm ? '收起申报表' : '预览申报表'}
              </button>
            </div>

            {showForm && (
              <div style={{
                background: '#fff',
                border: '2px solid #2b6cb0',
                borderRadius: 12,
                padding: '28px 32px',
                fontSize: 13,
                boxShadow: '0 4px 16px rgba(43,108,176,0.1)',
                maxWidth: 720,
                margin: '0 auto',
              }}>
                {/* Official document header */}
                <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '3px solid #1a365d', paddingBottom: 16 }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#1a365d', letterSpacing: 2 }}>
                    出口货物退（免）税申报表
                  </h2>
                  <div style={{ fontSize: 11, color: '#718096', letterSpacing: 1 }}>
                    Export Goods Tax Refund (Exemption) Declaration Form
                  </div>
                </div>

                {/* Taxpayer info row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px 24px',
                  marginBottom: 20,
                  padding: 16,
                  background: '#f7fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  lineHeight: 2,
                }}>
                  <div><strong>纳税人名称（Taxpayer）：</strong>{declarationForm.taxpayerName}</div>
                  <div><strong>统一社会信用代码（Credit Code）：</strong>{declarationForm.creditCode}</div>
                  <div><strong>所属期（Tax Period）：</strong>{declarationForm.taxPeriod}</div>
                  <div><strong>申报批次（Batch No.）：</strong>{declarationForm.batchNo}</div>
                  <div><strong>申报编号（Declaration No.）：</strong>{declarationForm.declarationNo}</div>
                  <div><strong>申报日期（Date）：</strong>{declarationForm.declarationDate}</div>
                </div>

                {/* Main financial data */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#1a365d', color: '#fff' }}>
                      <th style={{ border: '1px solid #1a365d', padding: '10px 12px', textAlign: 'left', width: '60%' }}>
                        项目（Item）
                      </th>
                      <th style={{ border: '1px solid #1a365d', padding: '10px 12px', textAlign: 'right', width: '40%' }}>
                        金额（Amount, CNY）
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px' }}>出口销售额（Export Sales）</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{declarationForm.exportSalesAmount.toFixed(2)}</td>
                    </tr>
                    <tr style={{ background: '#f7fafc' }}>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px' }}>免退税销售额（Tax-Free Export Sales）</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px', textAlign: 'right' }}>{declarationForm.taxFreeExportSales.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px' }}>出口发票金额（Export Invoice Amount）</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px', textAlign: 'right' }}>{declarationForm.exportInvoiceAmount.toFixed(2)}</td>
                    </tr>
                    <tr style={{ background: '#f7fafc' }}>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px' }}>收汇金额（Forex Amount）</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px', textAlign: 'right', color: '#276749' }}>{declarationForm.forexAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px' }}>进项发票金额（Purchase Invoice Amount）</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '10px 12px', textAlign: 'right' }}>{declarationForm.purchaseInvoiceAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#ebf8ff' }}>
                      <td style={{ border: '2px solid #2b6cb0', padding: '12px', fontWeight: 700, fontSize: 14, color: '#2b6cb0' }}>
                        可退税额（Refundable Tax）
                      </td>
                      <td style={{ border: '2px solid #2b6cb0', padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: 14, color: '#276749' }}>
                        ¥{declarationForm.refundableTax.toLocaleString()}.00
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Purchase invoice details */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#2d3748' }}>
                    进项发票明细（Purchase Invoice Details）
                  </h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#edf2f7' }}>
                        <th style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'left' }}>发票号码</th>
                        <th style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'left' }}>销方</th>
                        <th style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'right' }}>金额</th>
                        <th style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'center' }}>匹配状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {declarationForm.purchaseInvoices.map((inv) => (
                        <tr key={inv.invoiceNo}>
                          <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px' }}>{inv.invoiceNo}</td>
                          <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px' }}>{inv.supplierName}</td>
                          <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'right' }}>{inv.matchStatus === 'missing' ? '—' : `¥${inv.totalAmount.toFixed(2)}`}</td>
                          <td style={{ border: '1px solid #e2e8f0', padding: '6px 8px', textAlign: 'center' }}>
                            {inv.matchStatus === 'matched' ? <span style={{ color: '#276749' }}>✓ 已匹配</span> :
                             inv.matchStatus === 'missing' ? <span style={{ color: '#e53e3e' }}>✗ 缺票</span> : '待匹配'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Status section */}
                <div style={{
                  display: 'flex',
                  gap: 16,
                  padding: 12,
                  background: '#f7fafc',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  marginBottom: 16,
                }}>
                  <div>
                    <span style={{ color: '#718096' }}>单证匹配状态：</span>
                    <StatusBadge
                      status={declarationForm.docMatchStatus === 'complete' ? 'completed' : 'partial_anomaly'}
                      label={declarationForm.docMatchStatus === 'complete' ? '完全匹配' : '部分异常'}
                    />
                  </div>
                  <div>
                    <span style={{ color: '#718096' }}>数据校验状态：</span>
                    <StatusBadge
                      status={declarationForm.dataValidation === 'passed' ? 'completed' : 'error'}
                      label={declarationForm.dataValidation === 'passed' ? '通过' : '失败'}
                    />
                  </div>
                </div>

                {/* China Customs / Tax authority footer */}
                <div style={{
                  marginTop: 16,
                  padding: '12px 0 0',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: '#a0aec0',
                }}>
                  <div>税务机关受理章</div>
                  <div>本申报表由蜂税通系统自动生成（演示版）</div>
                  <div>页号：1/1</div>
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