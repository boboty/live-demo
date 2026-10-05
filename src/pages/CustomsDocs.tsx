import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentBatch } from '../data/company';
import { buildCustomsItems } from '../data/customs';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';

const CustomsDocs: React.FC = () => {
  const navigate = useNavigate();
  const {
    customsStatus,
    docsGenerated, generateCustomsDocs, pushCustoms, simulateClearance,
  } = useDemoStore();

  const items = buildCustomsItems();
  const totalUSD = items.reduce((s, i) => s + i.totalUSD, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalBoxes = items.reduce((s, i) => s + i.boxCount, 0);
  const totalGW = items.reduce((s, i) => s + i.grossWeight, 0);
  const totalNW = items.reduce((s, i) => s + i.netWeight, 0);
  const totalVol = items.reduce((s, i) => s + i.volume, 0);

  const [animating, setAnimating] = useState(false);
  const [animText, setAnimText] = useState('');
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const docsList = [
    { key: 'sc', name: 'SC 销售合同' },
    { key: 'inv', name: 'Commercial Invoice' },
    { key: 'pl', name: 'Packing List' },
    { key: 'cd', name: '报关单草单' },
    { key: 'de', name: '报关申报要素' },
  ];

  const columns = [
    { key: 'skuId', label: 'SKU' },
    { key: 'skuName', label: '商品名称' },
    { key: 'hsCode', label: 'HS编码' },
    { key: 'qty', label: '数量' },
    { key: 'unit', label: '单位' },
    { key: 'boxCount', label: '箱数', width: 60 },
    { key: 'grossWeight', label: '毛重(kg)' },
    { key: 'netWeight', label: '净重(kg)' },
    { key: 'volume', label: '体积(m³)' },
    { key: 'unitPriceUSD', label: '单价(USD)' },
    { key: 'totalUSD', label: '总价(USD)' },
  ];

  const handleGenerateDocs = () => {
    setAnimating(true);
    setAnimText('正在生成单证资料...');
    setTimeout(() => setAnimText('正在生成 SC 销售合同...'), 300);
    setTimeout(() => setAnimText('正在生成 Commercial Invoice...'), 600);
    setTimeout(() => setAnimText('正在生成 Packing List...'), 900);
    setTimeout(() => setAnimText('正在生成 报关单草单...'), 1200);
    setTimeout(() => setAnimText('正在生成 报关申报要素...'), 1500);
    setTimeout(() => {
      setAnimating(false);
      generateCustomsDocs();
    }, 2000);
  };

  const handlePushCustoms = () => {
    setAnimating(true);
    setAnimText('正在推送至海关系统...');
    setTimeout(() => {
      setAnimating(false);
      pushCustoms();
      // Auto clear after push
      setTimeout(() => {
        simulateClearance();
        setShowResult(true);
      }, 1500);
    }, 1000);
  };

  const getDocContent = (key: string) => {
    switch (key) {
      case 'sc':
        return (
          <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>SALES CONTRACT</h2>
              <div style={{ fontSize: 12, color: '#666' }}>合同编号：SC-EX20261005001</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div><strong>卖方：</strong>深圳海拓跨境科技有限公司</div>
              <div><strong>买方：</strong>HaiTop Technology UK Ltd.</div>
              <div><strong>合同日期：</strong>2026-10-05</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>品名</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>数量</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>单价(USD)</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>总价(USD)</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.skuId}>
                    <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.skuNameEn}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.unitPriceUSD.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.totalUSD.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{ fontWeight: 700 }}>
                <td style={{ border: '1px solid #ccc', padding: 6 }}>合计</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalQty}</td>
                <td style={{ border: '1px solid #ccc', padding: 6 }}></td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalUSD.toFixed(2)}</td>
              </tr></tfoot>
            </table>
            <div><strong>金额大写：</strong>USD {totalUSD.toFixed(2)}</div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
              合同条款见附件。本单证仅供演示使用。
            </div>
          </div>
        );
      case 'inv':
        return (
          <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>COMMERCIAL INVOICE</h2>
              <div style={{ fontSize: 12, color: '#666' }}>发票号：INV-EX20261005001</div>
            </div>
            <div style={{ marginBottom: 16, fontSize: 12 }}>
              <div><strong>Exporter:</strong> Shenzhen HaiTop Cross-border Technology Co., Ltd.</div>
              <div><strong>Consignee:</strong> HaiTop Technology UK Ltd.</div>
              <div><strong>Date:</strong> 2026-10-05</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>HS Code</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Description</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Qty</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Unit Price</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Amount</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.skuId}>
                    <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.hsCode}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.skuNameEn}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>USD {item.unitPriceUSD.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>USD {item.totalUSD.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 12 }}><strong>Total Amount:</strong> USD {totalUSD.toFixed(2)}</div>
          </div>
        );
      case 'pl':
        return (
          <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>PACKING LIST</h2>
              <div style={{ fontSize: 12, color: '#666' }}>装箱单号：PL-EX20261005001</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>SKU</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>商品</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>箱数</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>数量</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>毛重(kg)</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>净重(kg)</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>体积(m³)</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.skuId}>
                    <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.skuId}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6 }}>{item.skuNameEn}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.boxCount}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.qty}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.grossWeight.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.netWeight.toFixed(2)}</td>
                    <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{item.volume.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{ fontWeight: 700 }}>
                <td style={{ border: '1px solid #ccc', padding: 6 }} colSpan={2}>合计</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalBoxes}</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalQty}</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalGW.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalNW.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalVol.toFixed(4)}</td>
              </tr></tfoot>
            </table>
            <div style={{ fontSize: 12, color: '#666' }}>
              总计：{totalBoxes} 箱 · 毛重 {totalGW.toFixed(2)} kg · 净重 {totalNW.toFixed(2)} kg · 体积 {totalVol.toFixed(4)} m³
            </div>
          </div>
        );
      case 'cd':
        return (
          <div style={{ fontFamily: 'monospace', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, textAlign: 'center' }}>出口货物报关单</h3>
            <div style={{ fontSize: 12, lineHeight: 2 }}>
              <div><strong>报关单编号：</strong>530120261000123456</div>
              <div><strong>出口口岸：</strong>蛇口海关 (5301)</div>
              <div><strong>备案号：</strong>4428A123456</div>
              <div><strong>出口日期：</strong>2026-10-05</div>
              <div><strong>经营单位：</strong>深圳海拓跨境科技有限公司 (4403169ABC)</div>
              <div><strong>境内货源地：</strong>深圳</div>
              <div><strong>监管方式：</strong>跨境电商出口海外仓 (9810)</div>
              <div><strong>运输方式：</strong>江海运输</div>
              <div><strong>指运港：</strong>英国 · 费利克斯托</div>
              <div><strong>成交方式：</strong>FOB</div>
              <div><strong>总价：</strong>USD {totalUSD.toFixed(2)}</div>
            </div>
          </div>
        );
      case 'de':
        return (
          <div style={{ padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>报关申报要素</h3>
            {items.map((item) => (
              <div key={item.skuId} style={{ marginBottom: 16, fontSize: 12, lineHeight: 1.8, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                <div><strong>商品编号：</strong>{item.hsCode}</div>
                <div><strong>商品名称：</strong>{item.skuName} | {item.skuNameEn}</div>
                <div><strong>品牌：</strong>{item.brand}</div>
                <div><strong>材质：</strong>{item.material}</div>
                <div><strong>用途：</strong>{item.purpose}</div>
                <div><strong>数量：</strong>{item.qty} {item.unit}</div>
              </div>
            ))}
          </div>
        );
      default:
        return <div>暂无预览</div>;
    }
  };

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>← 返回服务中心</button>
      <div className="page-title">报关单证生成</div>
      <div className="page-subtitle">从发货数据到海关结关，一站式完成报关资料制作与推送</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: '#2b6cb0', fontSize: 14 }}>{currentBatch.batchNo}</span>
        <StatusBadge status="cleared" label={currentBatch.mode} />
        <span style={{ color: '#718096', fontSize: 13 }}>{currentBatch.destinationName}</span>
        <span style={{ color: '#718096', fontSize: 13 }}>{currentBatch.skuCount} SKU</span>
        <span style={{ color: '#718096', fontSize: 13 }}>{currentBatch.orderCount} 订单</span>
        <span style={{ color: '#718096', fontSize: 13, fontWeight: 500 }}>USD {currentBatch.exportAmount.toLocaleString()}</span>
      </div>

      {/* Status Timeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 20px' }}>
        {['pending_docs', 'docs_generated', 'pushed', 'processing', 'cleared'].map((step, idx) => {
          const stepIdx = ['pending_docs', 'docs_generated', 'pushed', 'processing', 'cleared'].indexOf(customsStatus);
          const currentStep = ['pending_docs', 'docs_generated', 'pushed', 'processing', 'cleared'].indexOf(step);
          const isActive = currentStep <= stepIdx;
          const isCurrent = currentStep === stepIdx;
          const labels = ['发货数据', '生成单证', '推送报关', '海关处理', '已结关'];
          return (
            <React.Fragment key={step}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    background: isActive ? (isCurrent ? '#2b6cb0' : '#48bb78') : '#edf2f7',
                    color: isActive ? '#fff' : '#a0aec0',
                    border: isCurrent ? '3px solid #90cdf4' : 'none',
                  }}
                >
                  {isActive && stepIdx > currentStep ? '✓' : idx + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400, color: isActive ? (isCurrent ? '#2b6cb0' : '#48bb78') : '#a0aec0' }}>
                  {labels[idx]}
                </span>
              </div>
              {idx < 4 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: isActive && currentStep > idx ? '#48bb78' : '#e2e8f0',
                    margin: '0 8px',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main content area */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              商品明细
            </h3>
            <DataTable columns={columns} data={items} maxHeight="400px" />
          </div>
        </div>

        <div style={{ width: 280 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
              操作面板
            </h3>

            {customsStatus === 'pending_docs' && (
              <button
                onClick={handleGenerateDocs}
                disabled={animating}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {animating ? '生成中...' : '生成报关资料'}
              </button>
            )}

            {customsStatus === 'docs_generated' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: '#48bb78', fontWeight: 500, marginBottom: 4 }}>
                  ✓ 单证已生成
                </div>
                <button
                  onClick={handlePushCustoms}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    background: '#2b6cb0',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  确认并推送报关
                </button>
              </div>
            )}

            {(customsStatus === 'pushed' || customsStatus === 'processing') && (
              <div style={{ fontSize: 13, color: '#2b6cb0', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#2b6cb0', animation: 'pulse 1s infinite' }} />
                  海关处理中...
                </div>
              </div>
            )}

            {customsStatus === 'cleared' && (
              <div>
                <div style={{ fontSize: 13, color: '#48bb78', fontWeight: 600, marginBottom: 8 }}>
                  ✓ 已结关
                </div>
                <div style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>
                  海关编号：530120261000123456
                </div>
                <div style={{ fontSize: 12, color: '#718096' }}>
                  结关日期：2026-10-05 16:32
                </div>
              </div>
            )}

            {animating && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#2b6cb0', fontStyle: 'italic' }}>
                {animText}
              </div>
            )}
          </div>

          {/* KPIs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <KPICard label="总金额 (USD)" value={totalUSD.toFixed(2)} />
            <KPICard label="总毛重 (kg)" value={totalGW.toFixed(2)} />
            <KPICard label="总体积 (m³)" value={totalVol.toFixed(4)} />
          </div>
        </div>
      </div>

      {/* Documents section */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          单证资料
        </h3>
        {!docsGenerated ? (
          <div style={{ fontSize: 13, color: '#a0aec0', textAlign: 'center', padding: 24 }}>
            请先点击「生成报关资料」生成单证
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            {docsList.map((doc) => (
              <button
                key={doc.key}
                onClick={() => setPreviewDoc(previewDoc === doc.key ? null : doc.key)}
                style={{
                  padding: '10px 16px',
                  border: `1px solid ${previewDoc === doc.key ? '#2b6cb0' : '#e2e8f0'}`,
                  borderRadius: 6,
                  background: previewDoc === doc.key ? '#ebf8ff' : '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: previewDoc === doc.key ? '#2b6cb0' : '#4a5568',
                  fontWeight: 500,
                  transition: 'all 0.15s',
                }}
              >
                {doc.name} {previewDoc === doc.key ? '▲' : '▼'}
              </button>
            ))}
          </div>
        )}

        {previewDoc && (
          <div style={{ marginTop: 16 }}>
            {getDocContent(previewDoc)}
          </div>
        )}
      </div>

      {showResult && customsStatus === 'cleared' && (
        <div
          style={{
            marginTop: 20,
            background: '#f0fff4',
            border: '1px solid #c6f6d5',
            borderRadius: 8,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontWeight: 600, color: '#276749', marginBottom: 4 }}>✓ 报关流程已完成</div>
          <div style={{ fontSize: 13, color: '#4a5568' }}>
            海关编号：530120261000123456 | 结关时间：2026-10-05 16:32
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomsDocs;