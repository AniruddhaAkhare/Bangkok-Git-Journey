import { useEffect, useState, memo } from 'react';

const Snowflake = memo(({ id, style }: { id: number; style: React.CSSProperties }) => (
  <div
    className="absolute pointer-events-none mix-blend-screen select-none"
    style={{
      ...style,
      fontSize: style.width, // Use the generated size as the font size
      width: 'auto',
      height: 'auto',
      filter: 'drop-shadow(0 0 8px rgba(64,112,255,0.8))',
    }}
  >
    ❄️
  </div>
));

export function GlowingSnow() {
  const [snowflakes, setSnowflakes] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);

  useEffect(() => {
    // Generate static random values for snowflakes only once on client to prevent hydration errors
    const generated = Array.from({ length: 8 }).map((_, i) => {
      const size = Math.random() * 10 + 8; // 10px to 26px
      const left = Math.random() * 100; // 0% to 100%
      const animationDuration = Math.random() * 10 + 10; // 10s to 20s
      const animationDelay = Math.random() * -20; // Random start time
      const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8

      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `-10px`,
          opacity,
          animation: `snow-fall ${animationDuration}s linear infinite`,
          animationDelay: `${animationDelay}s`,
        },
      };
    });
    setSnowflakes(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <Snowflake key={flake.id} {...flake} />
      ))}
      <style>{`
        @keyframes snow-fall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          50% {
            transform: translateY(50vh) translateX(20px);
          }
          100% {
            transform: translateY(110vh) translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
}
