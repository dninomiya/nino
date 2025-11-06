export function Leaf() {
  return (
    <div>
      <svg
        viewBox="0 0 100 150"
        width="240"
        height="360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="140" width="100" height="10" fill="#c8e6c9" />

        <g id="blade" transform="translate(50,140)">
          <path
            d="M 0 0
             C -4 -20, -2 -60, 0 -100
             C  2 -60,  4 -20, 0 0 Z"
            fill="url(#grad)"
            stroke="none"
          />

          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-6 0 0; 6 0 0; -6 0 0"
            dur="3.2s"
            repeatCount="indefinite"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines=".42 0 .58 1; .42 0 .58 1"
          />
        </g>

        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stop-color="#2e7d32" />
            <stop offset="60%" stop-color="#43a047" />
            <stop offset="100%" stop-color="#66bb6a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
