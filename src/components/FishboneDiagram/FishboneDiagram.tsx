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
  const allBranches = [...topBranches, ...bottomBranches];
  const totalVisual = Math.max(topBranches.length + bottomBranches.length, 4);

  // ViewBox: fixed width 840, dynamic height based on how many rows
  // Each branch gets about 560px of horizontal spread
  const hSpread = 540;
  const stepX = hSpread / (totalVisual + 1);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 860,
        margin: '0 auto',
        padding: '8px 0',
        userSelect: 'none',
      }}
    >
      <svg
        viewBox="0 0 840 200"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      >
        {/* ===== Main backbone ===== */}
        <line
          x1={80} y1={100} x2={810} y2={100}
          stroke="#4a5568" strokeWidth={2.5} strokeLinecap="round"
        />

        {/* ===== Arrow head at right end ===== */}
        <polygon
          points="810,93 828,100 810,107"
          fill="#4a5568"
        />

        {/* ===== Topic node (left side, on the backbone) ===== */}
        <g>
          {/* Fish head shape */}
          <ellipse
            cx={48} cy={100} rx={42} ry={28}
            fill="#276749" stroke="#22543d" strokeWidth={1.5}
          />
          {/* Rightward extension to bridge to backbone */}
          <rect
            x={48} y={86} width={32} height={28} rx={4}
            fill="#276749"
          />
          <text
            x={48} y={100} textAnchor="middle"
            fill="#fff" fontSize={14} fontWeight={700}
          >
            {topic}
          </text>
          {topicSub && (
            <text
              x={48} y={116} textAnchor="middle"
              fill="rgba(255,255,255,0.85)" fontSize={10}
            >
              {topicSub}
            </text>
          )}
        </g>

        {/* ===== Diagonal spines for top branches ===== */}
        {topBranches.map((branch, i) => {
          const cx = 110 + stepX * (i + 0.5);
          const isHovered = hoveredId === branch.id;
          // Spine from backbone (100) up-left to node
          // Backbone connection point
          const bx = cx;
          const by = 100;
          // Spine end (where the branch content sits)
          const sx = cx - 28;
          const sy = 48;

          return (
            <g key={branch.id}>
              {/* Diagonal spine line */}
              <line
                x1={bx} y1={by}
                x2={sx} y2={sy + 10}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2.5 : 1.8}
                strokeLinecap="round"
              />
              {/* Small horizontal fin at the spine tip */}
              <line
                x1={sx - 16} y1={sy + 10}
                x2={sx + 16} y2={sy + 10}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeLinecap="round"
              />
              {/* Content box */}
              <rect
                x={sx - 44} y={sy - 2} width={96} height={36} rx={8} ry={8}
                fill={isHovered ? '#f0fff4' : '#fff'}
                stroke={isHovered ? '#276749' : '#e2e8f0'}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={sx + 4} y={sy + 14} textAnchor="middle"
                fill={isHovered ? '#22543d' : '#2d3748'}
                fontSize={11} fontWeight={600}
              >
                {branch.title.length > 10 ? branch.title.slice(0, 9) + '…' : branch.title}
              </text>
              {branch.detail && (
                <text
                  x={sx + 4} y={sy + 24} textAnchor="middle"
                  fill={isHovered ? '#276749' : '#718096'}
                  fontSize={8}
                >
                  {branch.detail.length > 16 ? branch.detail.slice(0, 15) + '…' : branch.detail}
                </text>
              )}
              {/* Interactive area */}
              <rect
                x={sx - 52} y={sy - 6} width={108} height={44} rx={10}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHoveredId(branch.id); branch.onHover?.(); }}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}

        {/* ===== Diagonal spines for bottom branches ===== */}
        {bottomBranches.map((branch, i) => {
          const cx = 110 + stepX * (topBranches.length + i + 0.5);
          const isHovered = hoveredId === branch.id;
          const bx = cx;
          const by = 100;
          const sx = cx + 28;
          const sy = 145;

          return (
            <g key={branch.id}>
              {/* Diagonal spine line */}
              <line
                x1={bx} y1={by}
                x2={sx} y2={sy - 10}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2.5 : 1.8}
                strokeLinecap="round"
              />
              {/* Small horizontal fin */}
              <line
                x1={sx - 16} y1={sy - 10}
                x2={sx + 16} y2={sy - 10}
                stroke={isHovered ? '#276749' : '#a0aec0'}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeLinecap="round"
              />
              {/* Content box */}
              <rect
                x={sx - 52} y={sy - 16} width={96} height={36} rx={8} ry={8}
                fill={isHovered ? '#f0fff4' : '#fff'}
                stroke={isHovered ? '#276749' : '#e2e8f0'}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={sx - 4} y={sy} textAnchor="middle"
                fill={isHovered ? '#22543d' : '#2d3748'}
                fontSize={11} fontWeight={600}
              >
                {branch.title.length > 10 ? branch.title.slice(0, 9) + '…' : branch.title}
              </text>
              {branch.detail && (
                <text
                  x={sx - 4} y={sy + 10} textAnchor="middle"
                  fill={isHovered ? '#276749' : '#718096'}
                  fontSize={8}
                >
                  {branch.detail.length > 16 ? branch.detail.slice(0, 15) + '…' : branch.detail}
                </text>
              )}
              <rect
                x={sx - 60} y={sy - 20} width={108} height={44} rx={10}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHoveredId(branch.id); branch.onHover?.(); }}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Detail popup on hover */}
      {hoveredId && (() => {
        const b = allBranches.find((br) => br.id === hoveredId);
        if (!b?.detail) return null;
        return (
          <div
            style={{
              marginTop: 6,
              padding: '8px 14px',
              background: '#f0fff4',
              border: '1px solid #c6f6d5',
              borderRadius: 8,
              fontSize: 12,
              color: '#276749',
              textAlign: 'center',
            }}
          >
            {b.detail}
          </div>
        );
      })()}
    </div>
  );
};

export default FishboneDiagram;