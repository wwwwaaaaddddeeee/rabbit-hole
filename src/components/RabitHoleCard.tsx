import { PixelEyes } from '@/components/PixelEyes'

export function RabitHoleCard({ className }: { className?: string }) {
  return (
    <div className={`relative aspect-square w-full ${className ?? ''}`}>
      <picture>
        <source srcSet="/r3-dm.svg" media="(prefers-color-scheme: dark)" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/r3-lm.svg"
          alt="rabit hole"
          width={350}
          height={350}
          className="block h-full w-full"
        />
      </picture>
      <svg
        aria-hidden="true"
        viewBox="0 0 350 350"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M188.39 270.286C181.863 269.425 169.007 270.011 161.939 269.889C162.041 279.021 161.825 289.111 162.098 298.101C164.697 298.127 186.261 298.834 187.732 298.459C188.404 294.609 188.262 287.594 188.258 283.428C188.255 279.144 188.43 274.504 188.39 270.286Z"
          fill="#E0E0E0"
        />
      </svg>
      <PixelEyes
        className="absolute inset-0"
        leftEye={{
          top: '59.7%',
          left: '30.2%',
          width: '8.8%',
          height: '18.6%',
        }}
        rightEye={{
          top: '59.9%',
          left: '61.0%',
          width: '9.7%',
          height: '18.2%',
        }}
      />
    </div>
  )
}
