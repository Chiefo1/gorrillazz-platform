"use client";

export default function GL({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="p-10">{children}</div>
    </div>
  );
}
