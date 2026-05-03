// components/admin/SectionList.jsx
"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Bell,
  Briefcase,
  PartyPopper,
  LayoutDashboard,
  FileText,
  AlertCircle,
  Calendar,
  Clock,
  Hash,
  Tag,
  ChevronRight,
  Loader2
} from "lucide-react";

const SectionList = ({ sections, loading, onEdit, onDelete, onToggleVisibility, onReorder }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (section) => {
    setDeleteConfirm(section);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setIsDeleting(true);
    try {
      // Call onDelete without any additional confirmation
      await onDelete(deleteConfirm);
      // Close the modal after successful deletion
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting section:', error);
      // Error toast is already shown in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getTypeConfig = (type) => {
    const configs = {
      notification: { bg: "bg-blue-50", text: "text-blue-700", icon: Bell, label: "Notification" },
      hiring: { bg: "bg-emerald-50", text: "text-emerald-700", icon: Briefcase, label: "Hiring" },
      promotion: { bg: "bg-purple-50", text: "text-purple-700", icon: PartyPopper, label: "Promotion" },
      dashboard: { bg: "bg-orange-50", text: "text-orange-700", icon: LayoutDashboard, label: "Dashboard" },
      default: { bg: "bg-gray-50", text: "text-gray-700", icon: FileText, label: "Default" }
    };
    return configs[type] || configs.default;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle, label: "High" },
      medium: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock, label: "Medium" },
      low: { bg: "bg-gray-50", text: "text-gray-700", icon: ChevronRight, label: "Low" }
    };
    return configs[priority];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
        <div className="text-7xl mb-4 animate-bounce">📦</div>
        <h3 className="text-xl font-semibold text-[var(--black)] mb-2">No sections found</h3>
        <p className="text-[var(--muted)] mb-6">Create your first section to get started</p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openSectionForm'))}
          className="px-6 py-3 bg-[var(--black)] text-white rounded-xl hover:bg-[var(--accent)] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
        >
          <span>+</span>
          Create New Section
        </button>
      </div>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const reordered = Array.from(sections);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    
    onReorder(reordered);
    toast.success("Section reordered successfully!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => {
                const TypeIcon = getTypeConfig(section.type).icon;
                const PriorityIcon = getPriorityConfig(section.priority).icon;
                const typeStyle = getTypeConfig(section.type);
                const priorityStyle = getPriorityConfig(section.priority);
                
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                          snapshot.isDragging ? "shadow-2xl ring-2 ring-[var(--accent)] scale-105" : ""
                        }`}
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            {/* Left Section - Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>

                                {/* Title */}
                                <h3 className="text-base sm:text-lg font-semibold text-[var(--black)] truncate">
                                  {section.title}
                                </h3>

                                {/* Type Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                                  <TypeIcon className="w-3.5 h-3.5" />
                                  <span className="capitalize">{typeStyle.label}</span>
                                </span>

                                {/* Priority Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                                  <PriorityIcon className="w-3.5 h-3.5" />
                                  <span className="capitalize">{priorityStyle.label}</span>
                                </span>

                                {/* Status Badges */}
                                {!section.isActive && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Inactive</span>
                                  </span>
                                )}

                                {section.expiryDate && new Date(section.expiryDate) < new Date() && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Expired</span>
                                  </span>
                                )}

                                {/* Visibility Badge - Mobile */}
                                <div className="sm:hidden">
                                  <button
                                    onClick={() => onToggleVisibility(section)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                      section.defaultVisible
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    {section.defaultVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    {section.defaultVisible ? "Visible" : "Hidden"}
                                  </button>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {section.description}
                              </p>

                              {/* Badges */}
                              {section.badges && section.badges.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {section.badges.slice(0, 3).map((badge, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                                      <Hash className="w-3 h-3" />
                                      {badge}
                                    </span>
                                  ))}
                                  {section.badges.length > 3 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                      <Tag className="w-3 h-3" />
                                      +{section.badges.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                <span className="inline-flex items-center gap-1">
                                  <Hash className="w-3 h-3" />
                                  ID: {section.id?.slice(0, 12)}...
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(section.createdAt).toLocaleDateString()}
                                </span>
                                {section.expiryDate && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Expires: {new Date(section.expiryDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right Section - Actions */}
                            <div className="flex sm:flex-col gap-2 sm:ml-4">
                              {/* Visibility Toggle - Desktop */}
                              <button
                                onClick={() => onToggleVisibility(section)}
                                className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                  section.defaultVisible
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                title={section.defaultVisible ? "Hide from site" : "Show on site"}
                              >
                                {section.defaultVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => onEdit(section)}
                                className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105"
                                title="Edit section"
                              >
                                <Edit className="w-5 h-5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteClick(section)}
                                className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all duration-200 transform hover:scale-105"
                                title="Delete section"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--black)]">Delete Section?</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">"{deleteConfirm.title}"</span> will be permanently deleted.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Section
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionList;