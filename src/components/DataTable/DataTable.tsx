import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
  width?: number | string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  expandRender?: (row: any) => React.ReactNode;
  maxHeight?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick, expandRender, maxHeight }) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <div style={{ overflowX: 'auto', maxHeight: maxHeight || 'auto', overflowY: maxHeight ? 'auto' : 'visible', border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
            {expandRender && <th style={{ width: 32, padding: '8px 4px', textAlign: 'center', color: '#718096', fontWeight: 600 }}></th>}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#4a5568',
                  whiteSpace: 'nowrap',
                  width: col.width || 'auto',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <React.Fragment key={i}>
              <tr
                style={{
                  borderBottom: '1px solid #edf2f7',
                  background: i % 2 === 0 ? '#fff' : '#fafafa',
                  cursor: onRowClick || expandRender ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (expandRender) {
                    setExpandedRow(expandedRow === i ? null : i);
                  } else if (onRowClick) {
                    onRowClick(row);
                  }
                }}
              >
                {expandRender && (
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: '#a0aec0' }}>
                    {expandedRow === i ? '▼' : '▶'}
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '10px 12px', color: '#2d3748', whiteSpace: 'nowrap' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
              {expandRender && expandedRow === i && (
                <tr key={`exp-${i}`}>
                  <td colSpan={columns.length + 1} style={{ padding: '16px 24px', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {expandRender(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#a0aec0', fontSize: 14 }}>
          暂无数据
        </div>
      )}
    </div>
  );
};

export default DataTable;