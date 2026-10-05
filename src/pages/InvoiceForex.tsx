import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentBatch } from '../data/company';
import { buildExportInvoice, buildForexRecords } from '../data/invoiceForex';
import { buildPurchaseInvoices, buildInvoicePlan } from '../data/purchaseInvoice';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';
import FishboneDiagram from '../components/FishboneDiagram/FishboneDiagram';
import type { FishboneBranch } from '../components/FishboneDiagram/FishboneDiagram';
import { toChineseAmount } from '../data/chineseAmount';

type Tab = 'plan' | 'export' | 'purchase' | 'forex';

const InvoiceForex: React.FC = () => {
  const navigate = useNavigate();
  const {
    invoicePlanGenerated, invoiceGenerated, invoiceConfirmed,
    generateInvoicePlan, generateInvoice, confirmInvoice,
  } = useDemoStore();
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [configuring, setConfiguring] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planGenerating, setPlanGenerating] = useState(false);
  const [previewPurchase, setPreviewPurchase] = useState<string | null>(null);

  const invoiceData = buildExportInvoice();
  const forexRecords = buildForexRecords();
  const invoicePlan = buildInvoicePlan();
  const purchaseInvoices = buildPurchaseInvoices();

  const totalForexUSD = forexRecords.reduce((s, r) => s + r.amount, 0);

  const [config] = useState({
    buyerName: invoiceData.buyerName,
    buyerAddress: invoiceData.buyerAddress,
  });

  const handleGeneratePlan = () => {
    setPlanGenerating(true);
    setTimeout(() => {
      setPlanGenerating(false);
      generateInvoicePlan();
    }, 800);
  };

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
    { key: 'amount', label: '金额（USD）', render: (v: number) => v.toLocaleString() },
    { key: 'amountCNY', label: '折人民币', render: (v: number) => `¥${v.toLocaleString()}` },
    { key: 'status', label: '状态', render: (v: string) => <StatusBadge status={v as any} label={v === 'matched' ? '已归集' : '待归集'} /> },
  ];

  const purchaseColumns = [
    { key: 'invoiceNo', label: '发票号码' },
    { key: 'supplierName', label: '销方名称' },
    { key: 'skuName', label: '商品' },
    { key: 'totalAmount', label: '开票金额', render: (v: number, row: any) => row.matchStatus === 'missing' ? <span style={{ color: '#e53e3e' }}>—（缺票）</span> : `¥${v.toFixed(2)}` },
    { key: 'taxAmount', label: '税额', render: (v: number, row: any) => row.matchStatus === 'missing' ? '—' : `¥${v.toFixed(2)}` },
    { key: 'issueDate', label: '开票日期' },
    { key: 'matchStatus', label: '匹配状态', render: (v: string) =>
      v === 'matched' ? <StatusBadge status="completed" label="已匹配" /> :
      v === 'missing' ? <StatusBadge status="error" label="缺票" /> :
      <StatusBadge status="pending" label="待匹配" />,
    },
  ];

  const planColumns = [
    { key: 'field', label: '项目' },
    { key: 'value', label: '内容' },
  ];

  const planData = [
    { field: '业务批次', value: invoicePlan.batchNo },
    { field: '报关金额', value: `¥${invoicePlan.customsAmountCNY.toLocaleString()}` },
    { field: '应开出口发票', value: `¥${invoicePlan.shouldIssueExportInvoice.toLocaleString()}` },
    { field: '已开出口发票', value: invoiceGenerated ? `¥${invoicePlan.shouldIssueExportInvoice.toLocaleString()}` : '¥0.00' },
    { field: '应取得进项发票', value: `¥${invoicePlan.expectedPurchaseTotal.toLocaleString()}` },
    { field: '已匹配进项', value: `¥${invoicePlan.matchedPurchase.toLocaleString()}` },
    { field: '待补进项', value: invoicePlan.pendingPurchaseSKU || '已完成' },
    { field: '状态', value: <StatusBadge
      status={invoicePlan.status === 'completed' ? 'completed' : invoicePlan.status === 'partial' ? 'warning' : 'pending'}
      label={invoicePlan.status === 'completed' ? '已完成' : invoicePlan.status === 'partial' ? '部分匹配' : '待开票'}
    /> },
  ];

  // Fishbone for forex: how forex relates to customs declaration facts
  const forexFishboneTop2: FishboneBranch[] = [
    { id: 'fx-customs', title: '报关单', detail: '530120261000123456' },
    { id: 'fx-price', title: '报关价格', detail: 'USD 13,402.90 / ¥92,480.00' },
  ];

  const forexFishboneBottom2: FishboneBranch[] = [
    { id: 'fx-rate', title: '汇率比对', detail: '6.8991' },
    { id: 'fx-amount', title: '金额一致', detail: '100% 匹配' },
    { id: 'fx-time', title: '时间一致', detail: '2026年10月' },
    { id: 'fx-auto', title: '自动归集', detail: '系统自动匹配' },
    { id: 'fx-diff', title: '差额提示', detail: '无差异' },
    { id: 'fx-adjust', title: '手动调整', detail: '无需操作' },
  ];

  const renderInvoicePreview = () => (
    <div style={{ fontFamily: 'serif', padding: 32, background: '#fafafa', border: '1px solid #ddd', borderRadius: 8, maxWidth: 700, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #333', paddingBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>出口发票（Export Invoice）</h2>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>开票日期：{invoiceData.issueDate}</div>
        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>发票号：{invoiceData.invoiceNo}</div>
      </div>

      <div style={{ fontSize: 12, marginBottom: 16, lineHeight: 1.8, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div><strong>购买方（Buyer）：</strong>{config.buyerName}</div>
          <div><strong>地址（Address）：</strong>{config.buyerAddress}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>销售方（Seller）：</strong>深圳海拓跨境科技有限公司</div>
          <div><strong>纳税人识别号（Tax ID）：</strong>91440300MA5HX9KJ2Q</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>商品名称</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>HS编码</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>数量</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>单位</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>单价（Unit Price）</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>金额（Amount）</th>
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
            <td colSpan={5} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>合计（Total）</td>
            <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{invoiceData.totalAmountCNY.toFixed(2)}</td>
            <td style={{ border: '1px solid #ccc', padding: 8 }}></td>
          </tr>
        </tfoot>
      </table>

      <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.8 }}>
        <div><strong>价税合计（Amount in Words）：</strong>¥{invoiceData.totalAmountCNY.toFixed(2)}</div>
        <div><strong>中文大写：</strong>{toChineseAmount(invoiceData.totalAmountCNY)}</div>
        <div><strong>关联报关单（Customs No.）：</strong>{currentBatch.batchNo}</div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'right', fontSize: 11, color: '#999' }}>
        本发票仅供演示，不具备法律效力
      </div>
    </div>
  );

  const renderInvoiceContent = () => (
    <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 300 }}>
      <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid #333', paddingBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>商业发票（Commercial Invoice）</h2>
        <div style={{ fontSize: 11, color: '#666' }}>发票号：{invoiceData.invoiceNo}</div>
      </div>
      <div style={{ fontSize: 11, marginBottom: 12, lineHeight: 1.8 }}>
        <div><strong>卖方（Seller）：</strong>深圳海拓跨境科技有限公司</div>
        <div><strong>买方（Buyer）：</strong>{config.buyerName}</div>
        <div><strong>地址（Address）：</strong>{config.buyerAddress}</div>
        <div><strong>日期（Date）：</strong>{invoiceData.issueDate}</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: 12 }}>
        <thead><tr style={{ background: '#edf2f7' }}>
          <th style={{ border: '1px solid #ccc', padding: 6 }}>商品（Description）</th>
          <th style={{ border: '1px solid #ccc', padding: 6 }}>数量（Qty）</th>
          <th style={{ border: '1px solid #ccc', padding: 6 }}>单价（Unit Price）</th>
          <th style={{ border: '1px solid #ccc', padding: 6 }}>金额（Amount）</th>
        </tr></thead>
        <tbody>
          {invoiceData.items.map((item) => (
            <tr key={item.skuId}>
              <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.skuName}</td>
              <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.qty}</td>
              <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.unitPriceCNY.toFixed(2)}</td>
              <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.totalCNY.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, lineHeight: 1.8 }}>
        <div><strong>合计（Total）：</strong>¥{invoiceData.totalAmountCNY.toFixed(2)}</div>
        <div><strong>大写（Amount in Words）：</strong>{toChineseAmount(invoiceData.totalAmountCNY)}</div>
      </div>
    </div>
  );

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">发票收汇</div>
      <div className="page-subtitle">发票计划 · 出口发票 · 进项发票 · 收汇归集</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: '#2d3748' }}>报关单：{currentBatch.batchNo}</span>
        <span style={{ color: '#718096' }}>出口金额：¥{currentBatch.exportAmountCNY.toLocaleString()}</span>
        {invoiceGenerated && <StatusBadge status="completed" label="发票已生成" />}
        {invoiceConfirmed && <StatusBadge status="confirmed" label="已确认" />}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
        {[
          { key: 'plan' as const, label: '📋 发票计划' },
          { key: 'export' as const, label: '📄 出口发票' },
          { key: 'purchase' as const, label: '📑 进项发票' },
          { key: 'forex' as const, label: '💰 收汇' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="tab-btn"
            style={{
              padding: '10px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #2b6cb0' : '2px solid transparent',
              marginBottom: -2,
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#2b6cb0' : '#718096',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== 发票计划 Tab ===== */}
      {activeTab === 'plan' && (
        <div>
          {!invoicePlanGenerated ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#2d3748' }}>发票计划</h3>
              <div style={{ fontSize: 13, color: '#718096', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
                系统将基于报关单和采购数据生成发票计划，展示应开出口发票、进项发票匹配情况。
              </div>
              <button
                onClick={handleGeneratePlan}
                disabled={planGenerating}
                className="interactive-btn"
                style={{
                  padding: '10px 28px',
                  background: planGenerating ? '#90cdf4' : '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {planGenerating ? '生成中...' : '生成发票计划'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
                    发票计划（Invoice Plan）
                  </h3>
                  {!invoiceGenerated && (
                    <button
                      onClick={() => { setActiveTab('export'); setConfiguring(true); }}
                      className="interactive-btn"
                      style={{
                        padding: '8px 20px',
                        background: '#48bb78',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      生成出口发票
                    </button>
                  )}
                </div>
                <DataTable columns={planColumns} data={planData} />
              </div>

              {!invoiceGenerated && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button
                    onClick={() => { setActiveTab('export'); setConfiguring(true); }}
                    className="interactive-btn"
                    style={{
                      padding: '12px 32px',
                      background: '#2b6cb0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    下一步：生成出口发票 →
                  </button>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#718096' }}>
                    根据发票计划数据生成出口发票
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== 出口发票 Tab ===== */}
      {activeTab === 'export' && (
        <div>
          {!configuring && !invoiceGenerated && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#2d3748' }}>待开票数据</h3>
              <div style={{ fontSize: 13, color: '#718096', marginBottom: 20 }}>
                基于报关单 {currentBatch.batchNo}，系统已准备开票数据，出口金额 ¥{currentBatch.exportAmountCNY.toLocaleString()}
              </div>
              <button
                onClick={() => setConfiguring(true)}
                className="interactive-btn"
                style={{
                  padding: '10px 28px',
                  background: '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                生成出口发票
              </button>
            </div>
          )}

          {configuring && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, maxWidth: 500 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>发票配置</h3>
              <div style={{ marginBottom: 16, fontSize: 13, color: '#718096', lineHeight: 1.8 }}>
                <div>关联报关单：{currentBatch.batchNo}</div>
                <div>出口金额：¥{currentBatch.exportAmountCNY.toLocaleString()}</div>
                <div>税率：13%</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfiguring(false)} style={{ padding: '8px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>取消</button>
                <button onClick={handleGenerate} disabled={generating} className="interactive-btn" style={{ padding: '8px 20px', background: generating ? '#90cdf4' : '#2b6cb0', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500 }}>
                  {generating ? '生成中...' : '确认生成'}
                </button>
              </div>
            </div>
          )}

          {invoiceGenerated && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setPreviewing(!previewing)}
                  className="interactive-btn"
                  style={{
                    padding: '8px 20px',
                    background: previewing ? '#ebf8ff' : '#fff',
                    color: '#2b6cb0',
                    border: `1px solid ${previewing ? '#90cdf4' : '#e2e8f0'}`,
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {previewing ? '收起预览' : '预览出口发票'}
                </button>
                {!invoiceConfirmed && (
                  <button
                    onClick={confirmInvoice}
                    className="interactive-btn"
                    style={{
                      padding: '8px 20px',
                      background: '#48bb78',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    确认开票
                  </button>
                )}
                {invoiceConfirmed && <StatusBadge status="confirmed" label="已开票" />}
              </div>

              {previewing && (
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1 }}>{renderInvoicePreview()}</div>
                  <div style={{ width: 380 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2d3748', marginBottom: 8 }}>商业发票（Commercial Invoice）</div>
                    {renderInvoiceContent()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== 进项发票 Tab ===== */}
      {activeTab === 'purchase' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KPICard label="进项发票总数" value={`${purchaseInvoices.filter(p => p.matchStatus !== 'missing').length}/4`} />
            <KPICard label="已匹配" value={purchaseInvoices.filter(p => p.matchStatus === 'matched').length.toString()} color="#276749" />
            <KPICard label="缺票" value={purchaseInvoices.filter(p => p.matchStatus === 'missing').length.toString()} color="#e53e3e" />
            <KPICard label="进项匹配率" value={`${Math.round((purchaseInvoices.filter(p => p.matchStatus === 'matched').length / 4) * 100)}%`} highlight />
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              进项发票列表
            </h3>
            <DataTable
              columns={purchaseColumns}
              data={purchaseInvoices}
              onRowClick={(row) => setPreviewPurchase(previewPurchase === row.invoiceNo ? null : row.invoiceNo)}
            />
          </div>

          {purchaseInvoices.filter(p => p.matchStatus === 'missing').length > 0 && (
            <div style={{ marginTop: 16, background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#c53030' }}>
              ⚠ 注意：SKU1003（便携式户外电源 200W）的进项发票缺失，将影响退税匹配。请及时补录。
            </div>
          )}

          {/* Purchase invoice detail drawer — invoice-style preview */}
          {previewPurchase && (() => {
            const inv = purchaseInvoices.find(p => p.invoiceNo === previewPurchase);
            if (!inv || inv.matchStatus === 'missing') return null;
            return (
              <div style={{
                fontFamily: 'serif',
                marginTop: 16, padding: 28,
                background: '#fafafa', border: '1px solid #ddd', borderRadius: 8,
                maxWidth: 620,
              }}>
                <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid #333', paddingBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>
                    增值税专用发票（进项）
                  </h3>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>发票号码：{inv.invoiceNo}</div>
                </div>
                <div style={{ fontSize: 12, marginBottom: 14, lineHeight: 1.8, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div><strong>购方（Buyer）：</strong>深圳海拓跨境科技有限公司</div>
                    <div><strong>纳税人识别号：</strong>91440300MA5HX9KJ2Q</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div><strong>销方（Supplier）：</strong>{inv.supplierName}</div>
                    <div><strong>开票日期（Date）：</strong>{inv.issueDate}</div>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 14 }}>
                  <thead>
                    <tr style={{ background: '#edf2f7' }}>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>商品名称</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>数量</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>单位</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>单价（不含税）</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>金额</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>税率</th>
                      <th style={{ border: '1px solid #ccc', padding: 6 }}>税额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: 6 }}>{inv.skuName}</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>1</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'center' }}>批</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{inv.amount.toFixed(2)}</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{inv.amount.toFixed(2)}</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'center' }}>13%</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{inv.taxAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr style={{ fontWeight: 700, background: '#f7fafc' }}>
                      <td colSpan={4} style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>价税合计（Total）</td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{inv.totalAmount.toFixed(2)}</td>
                      <td style={{ border: '1px solid #ccc', padding: 6 }}></td>
                      <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{inv.taxAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{ fontSize: 11, color: '#999', textAlign: 'right' }}>
                  匹配状态：<StatusBadge status="completed" label="已匹配" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ===== 收汇 Tab ===== */}
      {activeTab === 'forex' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <KPICard label="应收汇" value={`USD ${currentBatch.exportAmount.toLocaleString()}`} />
            <KPICard label="已收汇" value={`USD ${totalForexUSD.toFixed(2)}`} highlight color="#276749" />
            <KPICard label="未收汇" value="USD 0" color="#48bb78" />
            <KPICard label="归集率" value="100%" color="#276749" />
          </div>

          {/* Fishbone: Forex-Customs relationship */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 20px 12px', marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#2d3748' }}>
              收汇与报关事实关联图（鱼骨图）
            </h3>
            <div style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>
              一笔收汇如何与报关事实建立关联
            </div>
            <FishboneDiagram
              topic="收汇"
              topicSub="Forex"
              topBranches={forexFishboneTop2}
              bottomBranches={forexFishboneBottom2}
            />
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
                <div><strong>备注：</strong>9810 出口货款</div>
              </div>
            )} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForex;