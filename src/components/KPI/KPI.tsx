import React from 'react';

interface KPIProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  color?: string;
}

const KPICard: React.FC<KPIProps> = ({ label, value, sub, highlight, color }) => {
  return (
    <div
      style={{
        background: highlight ? '#ebf8ff' : '#fff',
        border: `1px solid ${highlight ? '#bee3f8' : '#e2e8f0'}`,
        borderRadius: 8,
        padding: '16px 20px',
        textAlign: 'center',
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>{label}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: color || (highlight ? '#2b6cb0' : '#2d3748'),
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#a0aec0', marginTop: 2 }}>{sub}</div>}
    </div>
  );
};

export default KPICard;