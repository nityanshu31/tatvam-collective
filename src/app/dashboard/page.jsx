export default function DashboardPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')" }}
      />
      
      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/50" />
      
      {/* Fixed Content Layer - no scrolling */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* Big Welcome Message */}
        <div className="space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight drop-shadow-2xl">
            Welcome Back
          </h1>
          
          {/* Subtitle with architectural context */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Manage your architectural website and monitor client inquiries seamlessly.
          </p>
          
          {/* Optional decorative line */}
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}