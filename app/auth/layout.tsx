export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full p-6 bg-white rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}