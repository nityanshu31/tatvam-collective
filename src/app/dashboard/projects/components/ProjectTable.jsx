// app/dashboard/projects/components/ProjectTable.jsx
export default function ProjectTable({ projects, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Image</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Title</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Location</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Type</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Year</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Featured</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                No projects found. Click "Add Project" to create one.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                <td className="px-6 py-4 text-gray-600">{project.location}</td>
                <td className="px-6 py-4 text-gray-600">{project.type}</td>
                <td className="px-6 py-4 text-gray-600">{project.year}</td>
                <td className="px-6 py-4">
                  {project.featured ? (
                    <span className="text-lg">⭐</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        console.log('Delete clicked from table:', project._id, project.title); // Debug log
                        onDelete(project._id, project.title);
                      }}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}