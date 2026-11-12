// Utilidades geométricas para las maquetas SVG decorativas (§4.6).

/**
 * Puntos de un hexágono de lados planos arriba y abajo (como `clip-hex`, §4.4), centrado en
 * (cx, cy) y con ancho `width`. Devuelve el valor del atributo `points`.
 */
export function hexPoints(cx: number, cy: number, width: number): string {
  const h = (width * Math.sqrt(3)) / 2;
  const pts: [number, number][] = [
    [cx - width / 4, cy - h / 2],
    [cx + width / 4, cy - h / 2],
    [cx + width / 2, cy],
    [cx + width / 4, cy + h / 2],
    [cx - width / 4, cy + h / 2],
    [cx - width / 2, cy],
  ];
  return pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

const round = (n: number): number => Math.round(n * 10) / 10;
