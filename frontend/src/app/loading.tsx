export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center animate-heartbeat">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M3 9.5L7 4l3.5 5L14 2l4 7.5H21a9 9 0 11-18 0h0z" fillRule="evenodd" clipRule="evenodd"/>
              <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10" stroke="white" strokeWidth="0" fill="none"/>
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-2xl bg-primary-400/30 animate-pulse-ring" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-primary-700 font-heading font-semibold text-lg">CareBridge</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
