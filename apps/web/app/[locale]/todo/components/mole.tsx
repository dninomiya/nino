"use client";

export function Mole({ sleep = false }: { sleep?: boolean }) {
  return (
    <svg
      className="w-14"
      viewBox="0 0 107 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes wiggle-legs {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            25% {
              transform: translateY(-1px) rotate(-1deg);
            }
            50% {
              transform: translateY(0) rotate(0deg);
            }
            75% {
              transform: translateY(-1px) rotate(1deg);
            }
          }
          @keyframes dig-front-legs {
            0% {
              transform: translateX(0) translateY(0) rotate(0deg);
            }
            25% {
              transform: translateX(1px) translateY(-1px) rotate(3deg);
            }
            50% {
              transform: translateX(2px) translateY(-2px) rotate(5deg);
            }
            75% {
              transform: translateX(1px) translateY(-1px) rotate(3deg);
            }
            100% {
              transform: translateX(0) translateY(0) rotate(0deg);
            }
          }
          @keyframes wiggle-head {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-0.5px) rotate(0.5deg);
            }
          }
          @keyframes sleep-body {
            0%, 100% {
              transform: translateY(0) scaleY(1);
            }
            50% {
              transform: translateY(1px) scaleY(1.02);
            }
          }
          #hind-legs {
            animation: ${sleep ? "none" : "wiggle-legs 0.3s ease-in-out infinite"};
            transform-origin: 37.6255px 39.1883px;
          }
          #front-legs {
            animation: ${sleep ? "none" : "dig-front-legs 0.6s ease-in-out infinite 0.3s"};
            transform-origin: 76.3755px 43.4383px;
          }
          #head {
            animation: ${sleep ? "none" : "wiggle-head 1.5s ease-in-out infinite"};
            transform-origin: 86.3755px 25.9383px;
          }
          #body {
            animation: ${sleep ? "sleep-body 2s ease-in-out infinite" : "none"};
            transform-origin: 43.6255px 27.4383px;
          }
        `}
      </style>
      <g id="mole">
        <path
          id="tail"
          d="M0.125515 35.6883C-1.07449 34.0883 6.62551 34.0216 10.6255 34.1883C14.1255 34.2492 13.6255 35.6883 12.6255 36.6883C11.6255 37.6883 1.62551 37.6883 0.125515 35.6883Z"
          fill="#2A2E25"
        />
        <path
          id="body"
          d="M11.6255 12.6883C-0.37448 37.0883 18.6255 42.5216 29.6255 42.1883V35.1883L39.1255 37.1883C48.2922 40.1883 68.4255 43.9883 75.6255 35.1883C82.8255 26.3883 72.6255 14.8549 66.6255 10.1883C53.6255 -2.31174 24.6255 -5.31173 11.6255 12.6883Z"
          fill="#2A2E25"
        />
        <path
          id="hind-legs"
          d="M33.6255 42.1883H28.6255C26.6255 40.0216 24.4255 35.3883 31.6255 34.1883C38.8255 32.9883 44.6255 40.3549 46.6255 44.1883L41.6255 42.1883V44.1883L33.6255 42.1883Z"
          fill="#77583B"
        />
        <g id="head">
          <path
            id="Vector 6"
            d="M79.1255 14.1883C75.9255 11.3883 69.4589 11.3549 66.6255 11.6883L68.6255 34.6883L83.1255 37.6883C88.1255 36.3549 97.7255 32.7883 96.1255 29.1883C94.1255 24.6883 83.1255 17.6883 79.1255 14.1883Z"
            fill="#2A2E25"
          />
          <path
            id="Vector 5"
            d="M102.126 38.6883C108.126 38.2883 105.292 36.5216 103.126 35.6883C98.0384 31.4217 94.6255 25.1883 88.6255 21.6883C90.151 24.1883 93.8255 29.5883 92.6255 31.1883C91.1255 33.1883 77.1255 35.3107 81.1255 37.7495C81.6091 37.746 82.1089 37.7258 82.6255 37.6883C91.0255 39.2883 99.1255 39.0216 102.126 38.6883Z"
            fill="#77583B"
          />
          <path
            id="Vector 7"
            d="M106.126 37.1883C106.126 36.3883 104.126 35.8549 103.126 35.6883L102.126 37.1883C102.292 37.6883 102.726 38.6883 103.126 38.6883C103.626 38.6883 106.126 38.1883 106.126 37.1883Z"
            fill="#2A2E25"
          />
        </g>
        <path
          id="front-legs"
          d="M74.6255 46.6883C74.6255 43.4883 69.2922 41.0216 66.6255 40.1883C66.6255 36.6883 70.1255 30.6883 74.6255 32.1883C78.2255 33.3883 79.1255 38.0216 79.1255 40.1883L78.1255 44.6883L75.6255 42.1883C75.2922 45.0216 74.6255 49.8883 74.6255 46.6883Z"
          fill="#77583B"
        />
      </g>
    </svg>
  );
}

export function Wall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 111 207"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 42C2.1 28.8 0 8.5 0 0H111V207C101.667 203.667 87.8 196.6 85 187C82.2 177.4 80.4565 172.752 79.5 165C77.2832 147.035 63.4 132.5 61 122.5C58 110 41 79.5 37 69C33 58.5 21 58.5 10.5 42Z"
        fill="currentColor"
      />
    </svg>
  );
}
