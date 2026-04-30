// app/admin/sections/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionList from "@/components/admin/SectionList";
import SectionForm from "@/components/admin/SectionForm";
import SectionStats from "@/components/admin/SectionStats";

export default function SectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchSections();
  }, [filter]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const url = filter === "ALL" 
        ? "/api/sections?showExpired=true"
        : `/api/sections?type=${filter}&showExpired=true`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setSections(data.sections);
        calculateStats(data.sections);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sectionsData) => {
    const active = sectionsData.filter(s => s.isActive).length;
    const expired = sectionsData.filter(s => s.expiryDate && new Date(s.expiryDate) < new Date()).length;
    const types = {};
    sectionsData.forEach(s => {
      types[s.type] = (types[s.type] || 0) + 1;
    });
    
    setStats({ total: sectionsData.length, active, expired, types });
  };

  const handleSaveSection = async (sectionData) => {
    try {
      const url = selectedSection 
        ? `/api/sections/${selectedSection.id}`
        : "/api/sections";
      
      const method = selectedSection ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchSections();
        setShowForm(false);
        setSelectedSection(null);
      }
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    
    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchSections();
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleToggleVisibility = async (sectionId, currentVisibility) => {
    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleVisibility",
          value: !currentVisibility
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchSections();
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleReorder = async (reorderedSections) => {
    // Update order in bulk
    const operations = reorderedSections.map((section, index) => ({
      action: "updateOrder",
      id: section.id,
      order: index
    }));
    
    try {
      const res = await fetch("/api/sections/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operations })
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchSections();
      }
    } catch (error) {
      console.error("Error reordering sections:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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

        {/* Stats Overview */}
        <SectionStats stats={stats} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["ALL", "notification", "hiring", "promotion", "dashboard"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === type
                  ? "bg-[var(--black)] text-white"
                  : "bg-white text-[var(--muted)] hover:bg-gray-100"
              }`}
            >
              {type === "ALL" ? "All Sections" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Sections List */}
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

        {/* Modal Form */}
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