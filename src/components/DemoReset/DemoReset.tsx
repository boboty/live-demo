import React from 'react';
import { useDemoStore } from '../../store/demoStore';

const DemoReset: React.FC = () => {
  const resetAll = useDemoStore((s) => s.resetAll);

  const handleReset = () => {
    if (window.confirm('确认重置所有演示数据？所有操作进度将恢复为初始状态。')) {
      resetAll();
    }
  };

  return (
    <button
      onClick={handleReset}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 50,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '10px 16px',
        fontSize: 13,
        color: '#718096',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
      title="重置演示数据到初始状态"
    >
      🔄 重置演示数据
    </button>
  );
};

export default DemoReset;