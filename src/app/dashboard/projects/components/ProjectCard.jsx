// app/dashboard/projects/components/ProjectCard.jsx
export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex gap-4">
        <img
          src={project.image}
          alt={project.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600">{project.location}</p>
          <p className="text-xs text-gray-500 mt-1">
            {project.type} • {project.year}
          </p>
          {project.featured && (
            <span className="inline-block mt-1 text-xs bg-yellow-100 px-2 py-0.5 rounded">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => {
            console.log('Delete clicked:', project._id, project.title); // Debug log
            onDelete(project._id, project.title);
          }}
          className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}