import * as React from 'react';

export const LogoExIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 250 22" {...props}>
    <g>
      <path fill="#00a575" d="M0 0v21.76l11.08-10.88L0 0z" />
      <path fill="#000" d="M23.58 0v21.76L12.5 10.88 23.58 0z" />
    </g>
    <g>
      <text
        fill="#30303D"
        fontFamily="PF Din Text Cond Pro"
        fontSize="16"
        fontWeight="bold"
        letterSpacing=".381"
        transform="translate(35 -1)"
      >
        <tspan x="0" y="10">
          Реестр заявлений
        </tspan>
      </text>
      <text
        fill="#9698A7"
        fontFamily="PF Din Text Cond Pro"
        fontSize="12"
        fontWeight="500"
        transform="translate(35 -1)"
      >
        <tspan x="0" y="24">
          на выдачу кредитов
        </tspan>
      </text>
    </g>
  </svg>
);
