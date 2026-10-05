import React from 'react';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'processing' | 'error' | 'warning' | 'cleared' | 'confirmed' | 'generated' | 'pushed' | 'matched' | 'partial_anomaly';
  label?: string;
}

const statusConfig: Record<string, { color: string; bg: string; defaultLabel: string }> = {
  completed: { color: '#276749', bg: '#f0fff4', defaultLabel: '已完成' },
  pending: { color: '#b7791f', bg: '#fffff0', defaultLabel: '待办理' },
  processing: { color: '#2b6cb0', bg: '#ebf8ff', defaultLabel: '处理中' },
  error: { color: '#c53030', bg: '#fff5f5', defaultLabel: '异常' },
  warning: { color: '#c05621', bg: '#fffbeb', defaultLabel: '待确认' },
  cleared: { color: '#276749', bg: '#f0fff4', defaultLabel: '已结关' },
  confirmed: { color: '#276749', bg: '#f0fff4', defaultLabel: '已确认' },
  generated: { color: '#2b6cb0', bg: '#ebf8ff', defaultLabel: '已生成' },
  pushed: { color: '#2b6cb0', bg: '#ebf8ff', defaultLabel: '已推送' },
  matched: { color: '#276749', bg: '#f0fff4', defaultLabel: '已匹配' },
  partial_anomaly: { color: '#c05621', bg: '#fffbeb', defaultLabel: '部分异常' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = statusConfig[status] || { color: '#718096', bg: '#f7fafc', defaultLabel: status };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}22`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: config.color, display: 'inline-block' }} />
      {label || config.defaultLabel}
    </span>
  );
};

export default StatusBadge;