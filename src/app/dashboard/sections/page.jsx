// app/admin/sections/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionList from "@/components/admin/SectionList";
import SectionForm from "@/components/admin/SectionForm";
import SectionStats from "@/components/admin/SectionStats";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [stats, setStats] = useState({});

  const fetchSections = async () => {
    try {
      setLoading(true);
      const url =
        filter === "ALL"
          ? "/api/sections?showExpired=true&admin=true"
          : `/api/sections?type=${encodeURIComponent(filter)}&showExpired=true&admin=true`;

      console.log("Fetching from URL:", url);

      const res = await fetch(url);
      const data = await res.json();
      console.log("Full API response:", data);

      if (data && data.success) {
        setSections(data.sections || []);
        calculateStats(data.sections || []);
      } else {
        console.error("API returned error:", data?.error);
        setSections([]);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [filter]);

  const calculateStats = (sectionsData) => {
    const active = sectionsData.filter((s) => s.isActive).length;
    const expired = sectionsData.filter((s) => s.expiryDate && new Date(s.expiryDate) < new Date()).length;
    const types = {};
    sectionsData.forEach((s) => {
      types[s.type] = (types[s.type] || 0) + 1;
    });

    setStats({ total: sectionsData.length, active, expired, types });
  };

  // ✅ FIXED: Removed the confirm() dialog since modal handles confirmation
  const handleDeleteSection = async (section) => {
    const sectionId = section?.id;
    
    console.log("Delete section:", sectionId);
    
    if (!sectionId) {
      toast.error("Error: No section ID found", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Use query parameter instead of dynamic route
      const res = await fetch(`/api/sections?id=${sectionId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      console.log("Delete response:", data);

      if (data.success) {
        await fetchSections();
        toast.success("Section deleted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to delete section: " + data.error, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Error deleting section: " + error.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleVisibility = async (section) => {
    const sectionId = section?.id;
    
    console.log("Toggle visibility:", sectionId);
    
    if (!sectionId) {
      toast.error("Error: No section ID found", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    
    try {
      // Use query parameter instead of dynamic route
      const res = await fetch(`/api/sections?id=${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleVisibility",
          value: !section.defaultVisible
        })
      });

      const data = await res.json();
      console.log("Toggle response:", data);

      if (data.success) {
        await fetchSections();
        toast.success(`Section ${!section.defaultVisible ? "shown" : "hidden"} successfully!`, {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to toggle visibility: " + data.error, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Error toggling visibility", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleSaveSection = async (sectionData) => {
    try {
      const isEditing = !!selectedSection;
      
      if (isEditing) {
        // Use query parameter for update
        const res = await fetch(`/api/sections?id=${selectedSection.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData)
        });
        
        const data = await res.json();
        
        if (data.success) {
          await fetchSections();
          setShowForm(false);
          setSelectedSection(null);
          toast.success("Section updated successfully!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to update section: " + data.error, {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } else {
        // Create new section
        const res = await fetch("/api/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData)
        });
        
        const data = await res.json();
        
        if (data.success) {
          await fetchSections();
          setShowForm(false);
          toast.success("Section created successfully!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to create section: " + data.error, {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("Error saving section: " + error.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleReorder = async (reorderedSections) => {
    const operations = reorderedSections.map((section, index) => ({
      action: "updateOrder",
      id: section.id,
      order: index
    }));

    console.log("Reorder operations:", operations);

    try {
      const res = await fetch("/api/sections/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operations })
      });

      const data = await res.json();

      if (data.success) {
        await fetchSections();
      } else {
        console.error("Reorder failed:", data.error);
        toast.error("Failed to reorder sections", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Error reordering sections", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--black)]">Smart Sections Manager</h1>
            <p className="text-[var(--muted)] mt-1">Manage dynamic content sections for your homepage</p>
          </div>
          <button
            onClick={() => {
              setSelectedSection(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[var(--black)] text-white rounded-xl hover:bg-[var(--accent)] transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Section
          </button>
        </div>

        <SectionStats stats={stats} />

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["ALL", "notification", "hiring", "promotion", "dashboard", "default"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === type ? "bg-[var(--black)] text-white" : "bg-white text-[var(--muted)] hover:bg-gray-100"
              }`}
            >
              {type === "ALL" ? "All Sections" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <SectionList
          sections={sections}
          loading={loading}
          onEdit={(section) => {
            setSelectedSection(section);
            setShowForm(true);
          }}
          onDelete={handleDeleteSection}
          onToggleVisibility={handleToggleVisibility}
          onReorder={handleReorder}
        />

        <AnimatePresence>
          {showForm && (
            <SectionForm
              section={selectedSection}
              onSave={handleSaveSection}
              onClose={() => {
                setShowForm(false);
                setSelectedSection(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}