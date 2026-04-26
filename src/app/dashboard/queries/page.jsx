"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Mail, User, Calendar, MessageSquare, FolderKanban, 
  ChevronDown, Search, Filter, Eye, CheckCircle, 
  Clock, Archive, Download, RefreshCw,
  ChevronLeft, ChevronRight,
  AlertCircle, Inbox, Send
} from "lucide-react";

export default function ContactQueriesPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // table or cards

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Get unique project types
  const projectTypes = useMemo(() => {
    return [...new Set(contacts.map(c => c.projectType))];
  }, [contacts]);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = searchTerm === "" || 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedProjectType === "" || contact.projectType === selectedProjectType;
      
      return matchesSearch && matchesType;
    });
    
    return filtered;
  }, [contacts, searchTerm, selectedProjectType]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProjectType]);

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Project Type", "Message", "Date"];
    const csvData = filteredContacts.map(c => [
      c.name,
      c.email,
      c.projectType,
      c.message.replace(/,/g, ' ').replace(/\n/g, ' '),
      new Date(c.createdAt).toLocaleString()
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-queries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-[var(--white)] to-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Premium Header Section */}
          <div className="mb-8 lg:mb-10">
            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-[var(--accent)] rounded-full"></div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--black)]">
                    Contact Queries
                  </h1>
                </div>
                <p className="text-[var(--muted)] text-sm sm:text-base pl-4">
                  Manage and respond to customer inquiries efficiently
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={fetchContacts}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <Inbox className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <span className="text-2xl font-bold text-[var(--black)]">{contacts.length}</span>
                </div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Queries</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <Search className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <span className="text-2xl font-bold text-[var(--black)]">{filteredContacts.length}</span>
                </div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Filtered Results</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <FolderKanban className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <span className="text-2xl font-bold text-[var(--black)]">{projectTypes.length}</span>
                </div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Project Types</p>
              </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all text-sm"
                  />
                </div>
                
                {/* Project Type Filter */}
                <div className="relative min-w-[200px]">
                  <select
                    value={selectedProjectType}
                    onChange={(e) => setSelectedProjectType(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] focus:bg-white transition-all text-sm cursor-pointer w-full"
                  >
                    <option value="">All Project Types</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      viewMode === "table" 
                        ? "bg-white shadow-sm text-[var(--black)]" 
                        : "text-[var(--muted)] hover:text-[var(--black)]"
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      viewMode === "cards" 
                        ? "bg-white shadow-sm text-[var(--black)]" 
                        : "text-[var(--muted)] hover:text-[var(--black)]"
                    }`}
                  >
                    Card View
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchTerm || selectedProjectType) && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-[var(--muted)]">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm("")} className="hover:text-[var(--accent)] ml-1">×</button>
                    </span>
                  )}
                  {selectedProjectType && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                      Type: {selectedProjectType}
                      <button onClick={() => setSelectedProjectType("")} className="hover:text-[var(--accent)] ml-1">×</button>
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedProjectType("");
                    }}
                    className="text-xs text-[var(--accent)] hover:underline ml-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[var(--accent)] opacity-50" />
                </div>
              </div>
              <p className="text-[var(--muted)] mt-4">Loading your queries...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
              <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                <MessageSquare className="w-12 h-12 text-[var(--muted)] opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--black)] mb-2">No inquiries found</h3>
              <p className="text-[var(--muted)] max-w-md mx-auto">
                {searchTerm || selectedProjectType
                  ? "Try adjusting your filters to see more results" 
                  : "Your contact form submissions will appear here"}
              </p>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === "table" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Contact Information</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Project Type</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Message</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Date</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentContacts.map((item, index) => (
                          <tr 
                            key={item._id} 
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200 group cursor-pointer"
                            onClick={() => setExpandedQuery(item)}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-[var(--black)]">{item.name}</p>
                                <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  {item.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--black)] text-[var(--white)] whitespace-nowrap">
                                <FolderKanban className="w-3 h-3" />
                                {item.projectType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-[var(--muted)] line-clamp-2 max-w-md">
                                {item.message}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-[var(--muted)]">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-[var(--muted)]">
                                  {new Date(item.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setExpandedQuery(item)}
                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-[var(--accent)] hover:text-white rounded-lg transition-all duration-200"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                      <p className="text-sm text-[var(--muted)]">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContacts.length)} of {filteredContacts.length}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm transition-all ${
                                  currentPage === pageNum
                                    ? "bg-[var(--accent)] text-white"
                                    : "hover:bg-gray-100 text-[var(--muted)]"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cards View */}
              {viewMode === "cards" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {currentContacts.map((item) => (
                      <div
                        key={item._id}
                        className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => setExpandedQuery(item)}
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-[var(--muted)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[var(--black)] group-hover:text-[var(--accent)] transition-colors truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-[var(--muted)] truncate">{item.email}</p>
                          </div>
                        </div>

                        {/* Badge and Date */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--black)] text-[var(--white)]">
                            <FolderKanban className="w-3 h-3" />
                            {item.projectType}
                          </span>
                          <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Message Preview */}
                        <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-4">
                          {item.message}
                        </p>

                        {/* View Button */}
                        <button className="w-full mt-2 px-4 py-2 text-sm bg-gray-50 hover:bg-[var(--accent)] hover:text-white rounded-xl transition-all duration-200">
                          View Full Message
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination for cards view */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-[var(--muted)]">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Modal for detailed view */}
          {expandedQuery && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200"
              onClick={() => setExpandedQuery(null)}
            >
              <div 
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-[var(--accent)]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--black)]">{expandedQuery.name}</h3>
                        <p className="text-[var(--muted)] text-sm mt-1">{expandedQuery.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedQuery(null)}
                      className="text-[var(--muted)] hover:text-[var(--black)] transition-colors text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(85vh - 120px)" }}>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="w-4 h-4 text-[var(--muted)]" />
                      <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Project Type</span>
                    </div>
                    <p className="text-[var(--black)] font-medium">{expandedQuery.projectType}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-[var(--muted)]" />
                      <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Message</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-[var(--black)] leading-relaxed whitespace-pre-line">
                        {expandedQuery.message}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[var(--muted)]" />
                      <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Submitted</span>
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      {new Date(expandedQuery.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}