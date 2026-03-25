/**
 * ANSI escape code parser.
 *
 * Converts a string containing ANSI escape sequences into an array of
 * segments, each carrying the visible text together with style metadata
 * (color, bold, italic, underline, dim).
 */

export interface AnsiSegment {
  text: string;
  color?: string;
  bgColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  dim?: boolean;
}

// Standard 8-color palette (normal / bright)
const ANSI_COLORS: Record<number, string> = {
  30: '#000000',
  31: '#cc0000',
  32: '#00cc00',
  33: '#cccc00',
  34: '#0000cc',
  35: '#cc00cc',
  36: '#00cccc',
  37: '#cccccc',
  // Bright
  90: '#555555',
  91: '#ff5555',
  92: '#55ff55',
  93: '#ffff55',
  94: '#5555ff',
  95: '#ff55ff',
  96: '#55ffff',
  97: '#ffffff',
};

const ANSI_BG_COLORS: Record<number, string> = {
  40: '#000000',
  41: '#cc0000',
  42: '#00cc00',
  43: '#cccc00',
  44: '#0000cc',
  45: '#cc00cc',
  46: '#00cccc',
  47: '#cccccc',
  100: '#555555',
  101: '#ff5555',
  102: '#55ff55',
  103: '#ffff55',
  104: '#5555ff',
  105: '#ff55ff',
  106: '#55ffff',
  107: '#ffffff',
};

// Matches an ANSI CSI SGR sequence: ESC[ <params> m
const ANSI_REGEX = /\x1b\[([0-9;]*)m/g;

interface CurrentStyle {
  color?: string;
  bgColor?: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  dim: boolean;
}

const createDefaultStyle = (): CurrentStyle => ({
  bold: false,
  italic: false,
  underline: false,
  dim: false,
});

const applyCode = (style: CurrentStyle, code: number): void => {
  if (code === 0) {
    // Reset
    style.color = undefined;
    style.bgColor = undefined;
    style.bold = false;
    style.italic = false;
    style.underline = false;
    style.dim = false;
  } else if (code === 1) {
    style.bold = true;
  } else if (code === 2) {
    style.dim = true;
  } else if (code === 3) {
    style.italic = true;
  } else if (code === 4) {
    style.underline = true;
  } else if (code === 22) {
    style.bold = false;
    style.dim = false;
  } else if (code === 23) {
    style.italic = false;
  } else if (code === 24) {
    style.underline = false;
  } else if (code === 39) {
    style.color = undefined;
  } else if (code === 49) {
    style.bgColor = undefined;
  } else if (ANSI_COLORS[code]) {
    style.color = ANSI_COLORS[code];
  } else if (ANSI_BG_COLORS[code]) {
    style.bgColor = ANSI_BG_COLORS[code];
  }
};

/**
 * Parse a string with ANSI escape codes into styled segments.
 *
 * @param input - Raw string potentially containing ANSI escape codes.
 * @returns An array of `AnsiSegment` objects ready for rendering.
 */
export const parseAnsi = (input: string): AnsiSegment[] => {
  const segments: AnsiSegment[] = [];
  const style = createDefaultStyle();

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset lastIndex in case the regex was used before
  ANSI_REGEX.lastIndex = 0;

  while ((match = ANSI_REGEX.exec(input)) !== null) {
    // Push any text between previous match and current escape sequence
    if (match.index > lastIndex) {
      const text = input.slice(lastIndex, match.index);
      if (text) {
        segments.push({
          text,
          ...(style.color ? { color: style.color } : {}),
          ...(style.bgColor ? { bgColor: style.bgColor } : {}),
          ...(style.bold ? { bold: true } : {}),
          ...(style.italic ? { italic: true } : {}),
          ...(style.underline ? { underline: true } : {}),
          ...(style.dim ? { dim: true } : {}),
        });
      }
    }

    // Parse the SGR codes
    const params = match[1];
    if (params === '' || params === '0') {
      applyCode(style, 0);
    } else {
      const codes = params.split(';');
      for (const c of codes) {
        applyCode(style, Number.parseInt(c, 10));
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Trailing text after the last escape sequence
  if (lastIndex < input.length) {
    const text = input.slice(lastIndex);
    if (text) {
      segments.push({
        text,
        ...(style.color ? { color: style.color } : {}),
        ...(style.bgColor ? { bgColor: style.bgColor } : {}),
        ...(style.bold ? { bold: true } : {}),
        ...(style.italic ? { italic: true } : {}),
        ...(style.underline ? { underline: true } : {}),
        ...(style.dim ? { dim: true } : {}),
      });
    }
  }

  // If input had no ANSI codes at all, return a single plain segment
  if (segments.length === 0 && input.length > 0) {
    segments.push({ text: input });
  }

  return segments;
};
