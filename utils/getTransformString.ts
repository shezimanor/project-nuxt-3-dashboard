export default function getTransformString(
  transformString: string = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)',
  isVertical: boolean = false
) {
  // 公式: value = sin2X
  const regex = new RegExp(`(translate3d\\(\\s*\\d+px,\\s*\\d+px,\\s*)\\d+px`);
  // root2: 根號 2
  const root2 = Math.sqrt(2);
  const spacing = isVertical ? 256 : 160;
  let match = isVertical
    ? transformString.match(/rotateX\((-?\d+\.?\d*)deg\)/)
    : transformString.match(/rotateY\((-?\d+\.?\d*)deg\)/);
  // n: 位移基本單位
  const n = -((spacing * 2) / root2 - spacing);
  // 取得角度
  let degrees = match ? Math.abs(parseFloat(match[1])) : 0;
  // 轉成弧度，且直接 x 2
  const radians = degrees * (Math.PI / 180) * 2;
  const sinValue = Math.abs(Math.sin(radians));
  const translateZ = sinValue * n;
  const newTransformString = transformString.replace(
    regex,
    `$1${translateZ.toFixed(2)}px`
  );
  return newTransformString;
}
