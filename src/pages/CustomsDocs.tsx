import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentBatch } from '../data/company';
import { buildCustomsItems } from '../data/customs';
import { useDemoStore } from '../store/demoStore';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import DataTable from '../components/DataTable/DataTable';
import KPICard from '../components/KPI/KPI';

interface DocPreview {
  key: string;
  name: string;
  nameEn: string;
}

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

  const docsList: DocPreview[] = [
    { key: 'sc', name: '销售合同', nameEn: 'Sales Contract' },
    { key: 'inv', name: '商业发票', nameEn: 'Commercial Invoice' },
    { key: 'pl', name: '装箱单', nameEn: 'Packing List' },
    { key: 'cd', name: '报关单', nameEn: 'Customs Declaration' },
    { key: 'de', name: '申报要素', nameEn: 'Declaration Elements' },
  ];

  const columns = [
    { key: 'skuId', label: 'SKU（商品编码）' },
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
    setAnimText('正在生成报关五联单...');
    setTimeout(() => setAnimText('正在生成 Sales Contract（销售合同）...'), 300);
    setTimeout(() => setAnimText('正在生成 Commercial Invoice（商业发票）...'), 600);
    setTimeout(() => setAnimText('正在生成 Packing List（装箱单）...'), 900);
    setTimeout(() => setAnimText('正在生成 Customs Declaration（报关单）...'), 1200);
    setTimeout(() => setAnimText('正在生成 Declaration Elements（申报要素）...'), 1500);
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Sales Contract（销售合同）</h2>
              <div style={{ fontSize: 12, color: '#666' }}>合同编号：SC-EX20261005001</div>
            </div>
            <div style={{ marginBottom: 16, fontSize: 12 }}>
              <div><strong>卖方（Seller）：</strong>深圳海拓跨境科技有限公司</div>
              <div><strong>买方（Buyer）：</strong>HaiTop Technology UK Ltd.</div>
              <div><strong>合同日期（Date）：</strong>2026-10-05</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>品名（Description）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>数量（Qty）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>单价（Unit Price, USD）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>总价（Amount, USD）</th>
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
                <td style={{ border: '1px solid #ccc', padding: 6 }}>合计（Total）</td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalQty}</td>
                <td style={{ border: '1px solid #ccc', padding: 6 }}></td>
                <td style={{ border: '1px solid #ccc', padding: 6, textAlign: 'right' }}>{totalUSD.toFixed(2)}</td>
              </tr></tfoot>
            </table>
            <div style={{ fontSize: 12 }}><strong>金额大写（Amount in Words）：</strong>USD {totalUSD.toFixed(2)}</div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
              本单证仅供演示使用。
            </div>
          </div>
        );
      case 'inv':
        return (
          <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Commercial Invoice（商业发票）</h2>
              <div style={{ fontSize: 12, color: '#666' }}>发票号：INV-EX20261005001</div>
            </div>
            <div style={{ marginBottom: 16, fontSize: 12 }}>
              <div><strong>出口商（Exporter）：</strong> Shenzhen HaiTop Cross-border Technology Co., Ltd.</div>
              <div><strong>收货人（Consignee）：</strong> HaiTop Technology UK Ltd.</div>
              <div><strong>日期（Date）：</strong> 2026-10-05</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>HS编码（HS Code）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>品名（Description）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>数量（Qty）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>单价（Unit Price, USD）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>金额（Amount, USD）</th>
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
            <div style={{ fontSize: 12 }}>
              <strong>总金额（Total Amount）：</strong> USD {totalUSD.toFixed(2)}
            </div>
          </div>
        );
      case 'pl':
        return (
          <div style={{ fontFamily: 'serif', padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Packing List（装箱单）</h2>
              <div style={{ fontSize: 12, color: '#666' }}>装箱单号：PL-EX20261005001</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
              <thead><tr style={{ background: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>SKU（商品编码）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>商品（Description）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>箱数（Boxes）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>数量（Qty）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>毛重（Gross, kg）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>净重（Net, kg）</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>体积（Volume, m³）</th>
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
                <td style={{ border: '1px solid #ccc', padding: 6 }} colSpan={2}>合计（Total）</td>
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
            <h3 style={{ margin: '0 0 16px', fontSize: 15, textAlign: 'center' }}>
              出口货物报关单（Customs Declaration）
            </h3>
            <div style={{ fontSize: 12, lineHeight: 2 }}>
              <div><strong>报关单编号（Customs No.）：</strong>530120261000123456</div>
              <div><strong>出口口岸（Port）：</strong>蛇口海关 (5301)</div>
              <div><strong>备案号（Record No.）：</strong>4428A123456</div>
              <div><strong>出口日期（Export Date）：</strong>2026-10-05</div>
              <div><strong>经营单位（Operator）：</strong>深圳海拓跨境科技有限公司 (4403169ABC)</div>
              <div><strong>境内货源地（Origin）：</strong>深圳</div>
              <div><strong>监管方式（Supervision Mode）：</strong>跨境电商出口海外仓（9810）</div>
              <div><strong>运输方式（Transport）：</strong>江海运输（Sea Transport）</div>
              <div><strong>指运港（Destination Port）：</strong>英国 · 费利克斯托（Felixstowe, UK）</div>
              <div><strong>成交方式（Trade Term）：</strong>FOB</div>
              <div><strong>总价（Total）：</strong>USD {totalUSD.toFixed(2)}</div>
            </div>
          </div>
        );
      case 'de':
        return (
          <div style={{ padding: 20, background: '#fafafa', border: '1px solid #ddd', borderRadius: 4, minHeight: 400 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>
              报关申报要素（Declaration Elements）
            </h3>
            {items.map((item) => (
              <div key={item.skuId} style={{ marginBottom: 16, fontSize: 12, lineHeight: 1.8, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                <div><strong>商品编号（HS Code）：</strong>{item.hsCode}</div>
                <div><strong>商品名称（Description）：</strong>{item.skuName} | {item.skuNameEn}</div>
                <div><strong>品牌（Brand）：</strong>{item.brand}</div>
                <div><strong>材质（Material）：</strong>{item.material}</div>
                <div><strong>用途（Purpose）：</strong>{item.purpose}</div>
                <div><strong>数量（Qty）：</strong>{item.qty} {item.unit}</div>
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
      <div className="page-subtitle">从发货数据到海关结关，生成报关五联单并推送报关</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: '#2b6cb0', fontSize: 14 }}>{currentBatch.batchNo}</span>
        <StatusBadge status="cleared" label={currentBatch.modeName} />
        <span style={{ color: '#718096', fontSize: 13 }}>{currentBatch.destinationName}</span>
        <span style={{ color: '#718096', fontSize: 13 }}>{currentBatch.skuCount} SKU（商品编码）</span>
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
          const labels = ['发货数据', '生成五联单', '推送报关', '海关处理', '已结关'];
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
                className="interactive-btn"
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: '#2b6cb0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {animating ? '生成中...' : '生成报关五联单'}
              </button>
            )}

            {customsStatus === 'docs_generated' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 13, color: '#48bb78', fontWeight: 500, marginBottom: 4 }}>
                  ✓ 五联单已生成
                </div>
                <button
                  onClick={handlePushCustoms}
                  className="interactive-btn"
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    background: '#2b6cb0',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
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
            <KPICard label="总金额（Total, USD）" value={totalUSD.toFixed(2)} />
            <KPICard label="总毛重（Gross, kg）" value={totalGW.toFixed(2)} />
            <KPICard label="总体积（Volume, m³）" value={totalVol.toFixed(4)} />
          </div>
        </div>
      </div>

      {/* Documents section - 五联单 */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#2d3748' }}>
          报关五联单
        </h3>
        <div style={{ fontSize: 12, color: '#718096', marginBottom: 16 }}>
          五联单包括：销售合同（Sales Contract）、商业发票（Commercial Invoice）、装箱单（Packing List）、报关单（Customs Declaration）、申报要素（Declaration Elements）
        </div>
        {!docsGenerated ? (
          <div style={{ fontSize: 13, color: '#a0aec0', textAlign: 'center', padding: 24 }}>
            请先点击「生成报关五联单」生成单证
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {docsList.map((doc) => (
                <button
                  key={doc.key}
                  onClick={() => setPreviewDoc(previewDoc === doc.key ? null : doc.key)}
                  className="interactive-doc-card"
                  style={{
                    padding: '12px 18px',
                    border: `1px solid ${previewDoc === doc.key ? '#2b6cb0' : '#e2e8f0'}`,
                    borderRadius: 8,
                    background: previewDoc === doc.key ? '#ebf8ff' : '#fff',
                    fontSize: 13,
                    color: previewDoc === doc.key ? '#2b6cb0' : '#4a5568',
                    fontWeight: 500,
                    minWidth: 140,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{doc.nameEn}</div>
                </button>
              ))}
            </div>
            {previewDoc && (
              <div style={{ marginTop: 16 }}>
                {getDocContent(previewDoc)}
              </div>
            )}
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