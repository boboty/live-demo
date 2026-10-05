import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { qualificationItems } from '../data/qualification';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import Drawer from '../components/Drawer/Drawer';

const Qualification: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<(typeof qualificationItems)[0] | null>(null);

  const completedCount = qualificationItems.filter((i) => i.status === 'completed').length;
  const totalCount = qualificationItems.length;
  const readiness = Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      <button className="back-link" onClick={() => navigate('/')}>
        ← 返回服务中心
      </button>
      <div className="page-title">出口业务资质备案</div>
      <div className="page-subtitle">完成全部 7 项备案即可启动 9810 出口业务</div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#2b6cb0' }}>
            {readiness}%
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#2d3748' }}>出口业务准备度</div>
            <div style={{ fontSize: 13, color: '#718096' }}>
              {completedCount} / {totalCount} 项已完成
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 8,
                background: '#edf2f7',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${readiness}%`,
                  background: 'linear-gradient(90deg, #48bb78, #38a169)',
                  borderRadius: 4,
                  transition: 'width 0.5s',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {qualificationItems.map((item, i) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: i < qualificationItems.length - 1 ? '1px solid #edf2f7' : 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f7fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ width: 32, fontSize: 16 }}>
              {item.status === 'completed' ? '✅' : '⭕'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#2d3748' }}>{item.name}</div>
              <div style={{ fontSize: 12, color: '#a0aec0' }}>{item.institution}</div>
            </div>
            <StatusBadge status={item.status} />
            <div style={{ marginLeft: 12, color: '#a0aec0', fontSize: 16 }}>›</div>
          </div>
        ))}
      </div>

      <Drawer
        open={!!selected}
        title={selected?.name || ''}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.8 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>办理机构</div>
              <div>{selected.institution}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>办理状态</div>
              <StatusBadge status={selected.status} />
            </div>
            {selected.submitDate && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>提交日期</div>
                <div>{selected.submitDate}</div>
              </div>
            )}
            {selected.completedDate && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>完成日期</div>
                <div>{selected.completedDate}</div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>所需材料</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {selected.requiredMaterials.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
            {selected.remark && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>备注</div>
                <div style={{ color: '#718096' }}>{selected.remark}</div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Qualification;