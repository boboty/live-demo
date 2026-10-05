/**
 * Convert a numeric amount (up to 100,000) to Chinese uppercase financial string.
 * e.g. 92480 → 玖万贰仟肆佰捌拾元整
 */
export function toChineseAmount(n: number): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // units for each position: 万仟佰拾元角分
  const units = ['', '拾', '佰', '仟', '万'];

  // Work in integer fen (分)
  const fen = Math.round(n * 100);
  if (fen === 0) return '零元整';

  const yi = Math.floor(fen / 100000000);
  const rest1 = fen % 100000000;
  const wan = Math.floor(rest1 / 1000000);   // 1万元 = 1,000,000分
  const rest2 = rest1 % 1000000;
  const yuan = Math.floor(rest2 / 100);
  const jiao = Math.floor((rest2 % 100) / 10);
  const fenOnly = rest2 % 10;

  const parts: string[] = [];

  // 万 section (including 亿)
  if (yi > 0) {
    parts.push(readSection(yi, digits, units));
    parts.push('亿');
  }

  if (wan > 0) {
    if (yi > 0 && wan < 1000) parts.push('零');
    parts.push(readSection(wan, digits, units));
    parts.push('万');
  } else if (yi > 0 && yuan > 0) {
    parts.push('零');
  }

  if (yuan > 0) {
    parts.push(readSection(yuan, digits, units));
    parts.push('元');
  } else if ((wan > 0 || yi > 0) && (jiao > 0 || fenOnly > 0)) {
    parts.push('零');
  } else if (wan === 0 && yi === 0 && yuan === 0) {
    // nothing before 角分
  }

  if (jiao === 0 && fenOnly === 0) {
    parts.push('整');
  } else {
    if (jiao > 0) {
      parts.push(digits[jiao]);
      parts.push('角');
    } else if (yuan > 0 || wan > 0 || yi > 0) {
      parts.push('零');
    }
    if (fenOnly > 0) {
      parts.push(digits[fenOnly]);
      parts.push('分');
    }
  }

  return parts.join('');
}

function readSection(num: number, digits: string[], units: string[]): string {
  // num is at most 4 digits (0-9999)
  if (num === 0) return '';
  const s = num.toString();
  const parts: string[] = [];
  let lastZero = false;
  for (let i = 0; i < s.length; i++) {
    const d = parseInt(s[i]);
    const pos = s.length - 1 - i;
    if (d === 0) {
      lastZero = true;
    } else {
      if (lastZero) {
        parts.push('零');
        lastZero = false;
      }
      parts.push(digits[d]);
      if (pos > 0) {
        parts.push(units[pos]);
      }
    }
  }
  return parts.join('');
}