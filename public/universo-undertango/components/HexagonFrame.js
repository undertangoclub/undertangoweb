export default function HexagonFrame({ children }) {
  return (
    <div className="relative">
      <div className="hexagon-shape relative w-20 h-20 overflow-hidden transform">
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
      <style jsx>{`
        .hexagon-shape {
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
          background: rgba(0, 200, 255, 0.1);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
