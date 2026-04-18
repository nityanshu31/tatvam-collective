// app/dashboard/projects/components/ProjectStats.jsx
export default function ProjectStats({ projects }) {
  const stats = {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    residential: projects.filter(p => p.type === 'Residential').length,
    commercial: projects.filter(p => p.type === 'Commercial').length
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <StatCard label="Total Projects" value={stats.total} />
      <StatCard label="Featured" value={stats.featured} />
      <StatCard label="Residential" value={stats.residential} />
      <StatCard label="Commercial" value={stats.commercial} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}