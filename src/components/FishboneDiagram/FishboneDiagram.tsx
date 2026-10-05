import React, { useState } from 'react';

export interface FishboneBranch {
  id: string;
  title: string;
  detail?: string;
  onHover?: () => void;
}

export interface FishboneConfig {
  /** Central topic – the "head" of the fish */
  topic: string;
  /** Optional subtitle below the topic */
  topicSub?: string;
  /** Branches / fish-spines on the top side */
  topBranches?: FishboneBranch[];
  /** Branches / fish-spines on the bottom side */
  bottomBranches?: FishboneBranch[];
}

const FishboneDiagram: React.FC<FishboneConfig> = ({
  topic,
  topicSub,
  topBranches = [],
  bottomBranches = [],
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 860,
        margin: '0 auto',
        padding: '12px 0',
        userSelect: 'none',
      }}
    >
      <svg
        viewBox="0 0 820 200"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      >
        {/* Main backbone */}
        <line
          x1={60} y1={100} x2={800} y2={100}
          stroke="#4a5568" strokeWidth={2.5} strokeLinecap="round"
        />

        {/* Arrow head at right end */}
        <polygon
          points="800,92 820,100 800,108"
          fill="#4a5568"
        />

        {/* Topic node (left side) */}
        <rect
          x={12} y={72} width={96} height={56} rx={28} ry={28}
          fill="#276749" stroke="#22543d" strokeWidth={1.5}
        />
        <text
          x={60} y={96} textAnchor="middle"
          fill="#fff" fontSize={13} fontWeight={700}
        >
          {topic}
        </text>
        {topicSub && (
          <text
            x={60} y={114} textAnchor="middle"
            fill="rgba(255,255,255,0.85)" fontSize={10}
          >
            {topicSub}
          </text>
        )}

        {/* Top branches */}
        {topBranches.map((branch, i) => {
          const total = topBranches.length;
          const spacing = 600 / (total + 1);
          const cx = 120 + spacing * (i + 1);
          const cy = 70;
          const boneEndY = 90;
          const isHovered = hoveredId === branch.id;

          return (
            <g key={branch.id}>
              {/* Diagonal spine */}
              <line
                x1={cx} y1={cy + 6} x2={cx} y2={boneEndY}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2.5 : 1.8}
                strokeLinecap="round"
              />
              {/* Small horizontal connector to backbone */}
              <line
                x1={cx} y1={boneEndY} x2={cx} y2={100}
                stroke={isHovered ? '#276749' : '#cbd5e0'}
                strokeWidth={1.5}
              />
              {/* Content box */}
              <rect
                x={cx - 48} y={cy - 24} width={96} height={44} rx={8} ry={8}
                fill={isHovered ? '#f0fff4' : '#fff'}
                stroke={isHovered ? '#276749' : '#e2e8f0'}
                strokeWidth={isHovered ? 2 : 1}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={cx} y={cy - 4} textAnchor="middle"
                fill={isHovered ? '#22543d' : '#2d3748'}
                fontSize={12} fontWeight={600}
              >
                {branch.title.length > 10 ? branch.title.slice(0, 9) + '…' : branch.title}
              </text>
              {branch.detail && (
                <text
                  x={cx} y={cy + 12} textAnchor="middle"
                  fill={isHovered ? '#276749' : '#718096'}
                  fontSize={9}
                >
                  {branch.detail.length > 14 ? branch.detail.slice(0, 13) + '…' : branch.detail}
                </text>
              )}
              {/* Invisible wider click/hover area */}
              <rect
                x={cx - 52} y={cy - 28} width={104} height={52} rx={10}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHoveredId(branch.id); branch.onHover?.(); }}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}

        {/* Bottom branches */}
        {bottomBranches.map((branch, i) => {
          const total = bottomBranches.length;
          const spacing = 600 / (total + 1);
          const cx = 120 + spacing * (i + 1);
          const cy = 130;
          const boneStartY = 110;
          const isHovered = hoveredId === branch.id;

          return (
            <g key={branch.id}>
              {/* Diagonal spine */}
              <line
                x1={cx} y1={cy - 6} x2={cx} y2={boneStartY}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2.5 : 1.8}
                strokeLinecap="round"
              />
              {/* Small horizontal connector to backbone */}
              <line
                x1={cx} y1={boneStartY} x2={cx} y2={100}
                stroke={isHovered ? '#276749' : '#cbd5e0'}
                strokeWidth={1.5}
              />
              {/* Content box */}
              <rect
                x={cx - 48} y={cy - 20} width={96} height={44} rx={8} ry={8}
                fill={isHovered ? '#f0fff4' : '#fff'}
                stroke={isHovered ? '#276749' : '#e2e8f0'}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={cx} y={cy} textAnchor="middle"
                fill={isHovered ? '#22543d' : '#2d3748'}
                fontSize={12} fontWeight={600}
              >
                {branch.title.length > 10 ? branch.title.slice(0, 9) + '…' : branch.title}
              </text>
              {branch.detail && (
                <text
                  x={cx} y={cy + 16} textAnchor="middle"
                  fill={isHovered ? '#276749' : '#718096'}
                  fontSize={9}
                >
                  {branch.detail.length > 14 ? branch.detail.slice(0, 13) + '…' : branch.detail}
                </text>
              )}
              <rect
                x={cx - 52} y={cy - 24} width={104} height={52} rx={10}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHoveredId(branch.id); branch.onHover?.(); }}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Inline detail popup when hovering */}
      {hoveredId && (
        <div
          style={{
            marginTop: 8,
            padding: '10px 16px',
            background: '#f0fff4',
            border: '1px solid #c6f6d5',
            borderRadius: 8,
            fontSize: 12,
            color: '#276749',
            textAlign: 'center',
          }}
        >
          {[...topBranches, ...bottomBranches].find((b) => b.id === hoveredId)?.detail}
        </div>
      )}
    </div>
  );
};

export default FishboneDiagram;