// app/dashboard/projects/page.jsx (updated section)
"use client";

import { useState, useEffect } from "react";
import ProjectStats from "./components/ProjectStats";
import ProjectCard from "./components/ProjectCard";
import ProjectTable from "./components/ProjectTable";
import ProjectForm from "./components/ProjectForm";
import DeleteConfirmDialog from "./components/DeleteConfirmDialogue"; // Import dialog
import { toast } from "react-toastify";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: ""
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?limit=100');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (projectId, projectTitle) => {
    setDeleteDialog({
      isOpen: true,
      projectId,
      projectTitle
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/projects/${deleteDialog.projectId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        
        toast.success("Project deleted Successfully")
        fetchProjects();
        setDeleteDialog({ isOpen: false, projectId: null, projectTitle: "" });
      } else {
        throw new Error(data.error || "Delete failed");
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
    toast.success(
      editingProject ? 'Project updated successfully!' : 'Project created successfully!'
    );
  };

 

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Projects Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Manage your portfolio projects
                </p>
              </div>
              
              <button
                onClick={handleAdd}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-sm sm:text-base rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ProjectStats projects={projects} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <ProjectTable
                  projects={projects}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>
            </>
          )}
        </div>

        {/* Project Form Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => !deleting && setDeleteDialog({ isOpen: false, projectId: null, projectTitle: "" })}
          onConfirm={handleDeleteConfirm}
          projectTitle={deleteDialog.projectTitle}
          loading={deleting}
        />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}