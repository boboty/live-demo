import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentBatch } from '../data/company';
import { buildExportInvoice, buildForexRecords } from '../data/invoiceForex';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';

const InvoiceForex: React.FC = () => {
  const navigate = useNavigate();
  const { invoiceGenerated, invoiceConfirmed, generateInvoice, confirmInvoice } = useDemoStore();
  const [activeTab, setActiveTab] = useState<'invoice' | 'forex'>('invoice');
  const [configuring, setConfiguring] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const invoiceData = buildExportInvoice();
  const forexRecords = buildForexRecords();

  const totalForexUSD = forexRecords.reduce((s, r) => s + r.amount, 0);

  const [config, setConfig] = useState({
    buyerName: invoiceData.buyerName,
    buyerAddress: invoiceData.buyerAddress,
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setConfiguring(false);
      generateInvoice();
    }, 1000);
  };

  const forexColumns = [
    { key: 'date', label: '收款日期' },
    { key: 'bank', label: '银行' },
    { key: 'currency', label: '币种' },
    { key: 'amount', label: '金额', render: (v: number) => v.toLocaleString() },
    { key: 'amountCNY', label: '折人民币', render: (v: number) => `¥${v.toLocaleString()}` },
    { key: 'status', label: '状态', render: (v: string) => <StatusBadge status={v as any} label={v === 'matched' ? '已归集' : '待归集'} /> },
  ];

  // Generate invoice preview
  const renderInvoicePreview = () => (
    <div style={{ fontFamily: 'serif', padding: 32, background: '#fafafa', border: '1px solid #ddd', borderRadius: 8, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #333', paddingBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>增值税普通发票</h2>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>开票日期：{invoiceData.issueDate}</div>
      </div>

      <div style={{ fontSize: 12, marginBottom: 16, lineHeight: 1.8, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div><strong>购买方：</strong>{config.buyerName}</div>
          <div><strong>地址：</strong>{config.buyerAddress}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>销售方：</strong>深圳海拓跨境科技有限公司</div>
          <div><strong>纳税人识别号：</strong>91440300MA5HX9KJ2Q</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>商品名称</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>HS编码</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>数量</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>单位</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>单价</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>金额</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>税率</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.skuName}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.hsCode}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.qty}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{item.unit}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.unitPriceCNY.toFixed(2)}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.totalCNY.toFixed(2)}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>13%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 700, background: '#f7fafc' }}>
            <td colSpan={5} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>合计</td>
            <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{invoiceData.totalAmountCNY.toFixed(2)}</td>
            <td style={{ border: '1px solid #ccc', padding: 8 }}></td>
          </tr>
        </tfoot>
      </table>

      <div style={{ fontSize: 12, marginTop: 8 }}>
        <div><strong>价税合计：</strong>¥{invoiceData.totalAmountCNY.toFixed(2)}</div>
        <div><strong>关联报关单：</strong>{currentBatch.batchNo}</div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'right', fontSize: 11, color: '#999' }}>
        发票仅供演示，不具备法律效力
      </div>
    </div>
  );

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">发票收汇</div>
      <div className="page-subtitle">出口发票管理与收汇归集</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: '#2d3748' }}>报关单：{currentBatch.batchNo}</span>
        <span style={{ color: '#718096' }}>出口金额：¥{currentBatch.exportAmountCNY.toLocaleString()}</span>
        {invoiceGenerated && <StatusBadge status="completed" label="发票已生成" />}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
        {(['invoice', 'forex'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #2b6cb0' : '2px solid transparent',
              marginBottom: -2,
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#2b6cb0' : '#718096',
              cursor: 'pointer',
            }}
          >
            {tab === 'invoice' ? '📄 发票管理' : '💰 收汇管理'}
          </button>
        ))}
      </div>

      {activeTab === 'invoice' && (
        <div>
          {!configuring && !invoiceGenerated && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#2d3748' }}>待开票数据</h3>
              <div style={{ fontSize: 13, color: '#718096', marginBottom: 20 }}>
                基于报关单 {currentBatch.batchNo}，系统已准备开票数据，出口金额 ¥{currentBatch.exportAmountCNY.toLocaleString()}
              </div>
              <button
                onClick={() => setConfiguring(true)}
                style={{
                  padding: '10px 28px',
                  background: '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                生成出口发票
              </button>
            </div>
          )}

          {configuring && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, maxWidth: 500 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>发票配置</h3>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: '#4a5568', display: 'block', marginBottom: 4 }}>购买方</label>
                <input value={config.buyerName} onChange={(e) => setConfig({ ...config, buyerName: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: '#4a5568', display: 'block', marginBottom: 4 }}>地址</label>
                <input value={config.buyerAddress} onChange={(e) => setConfig({ ...config, buyerAddress: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13 }} />
              </div>
              <div style={{ marginBottom: 16, fontSize: 13, color: '#718096' }}>
                <div>关联报关单：{currentBatch.batchNo}</div>
                <div>出口金额：¥{currentBatch.exportAmountCNY.toLocaleString()}</div>
                <div>税率：13%</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfiguring(false)} style={{ padding: '8px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>取消</button>
                <button onClick={handleGenerate} disabled={generating} style={{ padding: '8px 20px', background: generating ? '#90cdf4' : '#2b6cb0', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: generating ? 'not-allowed' : 'pointer' }}>
                  {generating ? '生成中...' : '确认生成'}
                </button>
              </div>
            </div>
          )}

          {invoiceGenerated && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button
                  onClick={() => setPreviewing(!previewing)}
                  style={{
                    padding: '8px 20px',
                    background: previewing ? '#ebf8ff' : '#fff',
                    color: '#2b6cb0',
                    border: `1px solid ${previewing ? '#90cdf4' : '#e2e8f0'}`,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {previewing ? '收起预览' : '预览发票'}
                </button>
                {!invoiceConfirmed && (
                  <button
                    onClick={confirmInvoice}
                    style={{
                      padding: '8px 20px',
                      background: '#48bb78',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    确认开票
                  </button>
                )}
                {invoiceConfirmed && <StatusBadge status="confirmed" label="已开票" />}
              </div>

              {previewing && renderInvoicePreview()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'forex' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KPICard label="应收汇" value={`USD ${currentBatch.exportAmount.toLocaleString()}`} />
            <KPICard label="已收汇" value={`USD ${totalForexUSD.toFixed(2)}`} highlight color="#276749" />
            <KPICard label="未收汇" value="USD 0" color="#48bb78" />
            <KPICard label="归集率" value="100%" color="#276749" />
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              收汇流水
            </h3>
            <DataTable columns={forexColumns} data={forexRecords} expandRender={(row: any) => (
              <div style={{ fontSize: 13, lineHeight: 2 }}>
                <div><strong>关联报关单：</strong>{currentBatch.batchNo}</div>
                <div><strong>平台订单：</strong>Amazon UK 平台 168 笔</div>
                <div><strong>境外客户：</strong>HaiTop Technology UK Ltd.</div>
                <div><strong>银行流水号：</strong>BOC{row.date.replace(/-/g, '')}001</div>
                <div><strong>备注：</strong>9810 出口货款 - {currentBatch.batchNo}</div>
              </div>
            )} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForex;