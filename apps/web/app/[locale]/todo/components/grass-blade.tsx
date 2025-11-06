"use client";

import { useId, useMemo } from "react";

type Props = {
  width?: number | string;
  height?: number | string;
  durationSec?: number; // 1周期の長さ（ゆっくり=大きめ）
  windStrength?: number; // 0〜1 しなり量
  className?: string;
  colorBase?: string; // 根元の色
  colorTip?: string; // 先端の色
  svgProps?: React.SVGProps<SVGSVGElement>;
  layout?: "width" | "fill"; // width: width=100%, height=auto; fill: width=100%, height=100%
};

export default function GrassBladeSmooth({
  durationSec = 7,
  windStrength = 0.65,
  className,
  colorBase = "#6fd08a",
  colorTip = "#2e7d32",
  svgProps,
  layout = "width",
}: Props) {
  const gid = useId().replace(/:/g, "-");
  const gradId = `g-${gid}`;
  const beginOffset = useMemo(
    () => `-${(Math.random() * durationSec).toFixed(2)}s`,
    [durationSec]
  );

  // ---- 形状設計（滑らかな厚みプロファイル）----
  // 左右とも 3 つの cubic Bezier で徐々に細く → 先鋭な tip。
  // 根元 (±6,0) は不動。上下方向の節目は y=-50, -130, -145 付近。
  // ※ すべてのキーフレームで同一のコマンド列(M C C C C C Z)にしてモーフ互換。

  // 中立
  const d0 =
    "M -6 0 " +
    "C -6 -10, -5 -30, -4 -50 " + // 根元〜下部：ゆるく細く
    "C -3 -80, -2 -110, -1 -130 " + // 中部：徐々に細く
    "C  0 -138,  0 -142,  0 -145 " + // 先端
    "C  0 -142,  1 -138,  1 -130 " + // 先端→中部(右縁)
    "C  2 -110,  3  -80,  4  -50 " + // 中部→下部(右縁)
    "C  5  -30,  6  -10,  6    0 Z"; // 下部→根元(右縁)

  // しなり量
  const bend = 10 * windStrength; // 中部の横流れ
  const tip = 14 * windStrength; // 先端の横流れ
  const low = 4 * windStrength; // 下部（y≈-50）の微調整

  // 右へしなる（根元〜y=-10 近辺は固定、yが高いほど大きくオフセット）
  const dR =
    "M -6 0 " +
    `C -6 -10, -5 -30, ${-4 + low} -50 ` +
    `C ${-3 + bend * 0.6} -80, ${-2 + bend * 0.85} -110, ${-1 + bend * 0.95} -130 ` +
    `C ${0 + tip} -138, ${0 + tip} -142, ${0 + tip} -145 ` +
    `C ${0 + tip} -142, ${1 + bend * 0.95} -138, ${1 + bend * 0.95} -130 ` +
    `C ${2 + bend * 0.85} -110, ${3 + bend * 0.6} -80, ${4 + low} -50 ` +
    "C  5 -30,  6 -10,  6 0 Z";

  // 左へしなる（ミラー）
  const dL =
    "M -6 0 " +
    `C -6 -10, -5 -30, ${-4 - low} -50 ` +
    `C ${-3 - bend * 0.6} -80, ${-2 - bend * 0.85} -110, ${-1 - bend * 0.95} -130 ` +
    `C ${0 - tip} -138, ${0 - tip} -142, ${0 - tip} -145 ` +
    `C ${0 - tip} -142, ${1 - bend * 0.95} -138, ${1 - bend * 0.95} -130 ` +
    `C ${2 - bend * 0.85} -110, ${3 - bend * 0.6} -80, ${4 - low} -50 ` +
    "C  5 -30,  6 -10,  6 0 Z";

  return (
    <svg
      viewBox="0 0 100 150"
      width="100%"
      height={layout === "fill" ? "100%" : "auto"}
      style={{ display: "block", ...(svgProps?.style as React.CSSProperties) }}
      preserveAspectRatio={layout === "fill" ? "none" : "xMidYMax meet"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...svgProps}
    >
      <g transform="translate(50,150)">
        <path d={d0} fill={`url(#${gradId})`}>
          {/* 中立→右→中立→左→中立：同一コマンド列で滑らかモーフ */}
          <animate
            attributeName="d"
            values={`${dR};${dL};${dR}`}
            keyTimes="0;0.5;1"
            dur={`${durationSec}s`}
            begin={beginOffset}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="
              .42 0 .58 1;
              .42 0 .58 1
            "
          />
        </path>
      </g>

      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor={colorBase} />
          <stop offset="100%" stopColor={colorTip} />
        </linearGradient>
      </defs>
    </svg>
  );
}
