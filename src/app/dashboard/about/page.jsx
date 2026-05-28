"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AboutDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    hero: {
      recognizedYear: "",
      title: "",
      subtitle: "",
      description: "",
    },

    philosophy: {
      tagline: "",
      quote: "",
      description: "",
    },

    studio: {
      tagline: "",
      title: "",
      description: "",

      testimonial: {
        quote: "",
        author: "",
      },

      stats: [],
    },

    workScope: {
      sectors: {
        title: "",
        items: [],
      },

      approach: {
        title: "",
        items: [],
      },

      commitment: {
        title: "",
        description: "",
      },
    },

    founders: {
      title: "",
      subtitle: "",
      founders: [],
    },

    visibility: {
      philosophy: true,
      studio: true,
      founders: true,
    },
  });

  // Local state for array inputs to allow free typing
  const [tempArrayInputs, setTempArrayInputs] = useState({
    sectors: "",
    approach: "",
    achievements: {}
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    // Initialize temp inputs when form data loads
    if (formData.workScope?.sectors?.items) {
      setTempArrayInputs(prev => ({
        ...prev,
        sectors: formData.workScope.sectors.items.join(", ")
      }));
    }
    if (formData.workScope?.approach?.items) {
      setTempArrayInputs(prev => ({
        ...prev,
        approach: formData.workScope.approach.items.join(", ")
      }));
    }
  }, [formData.workScope?.sectors?.items, formData.workScope?.approach?.items]);

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/about");
      const result = await res.json();

      if (result.success) {
        // Ensure there is always a 'years' stat in studio.stats and keep it as the first item
        const dataCopy = { ...result.data };
        const statsArr = Array.isArray(dataCopy?.studio?.stats)
          ? [...dataCopy.studio.stats]
          : [];

        const yearIndex = statsArr.findIndex((s) =>
          /year/i.test(String(s.label || "")) || /year/i.test(String(s.value || ""))
        );

        if (yearIndex === -1) {
          // No year stat found - add a default Years stat at the front with fixed label
          statsArr.unshift({ value: "15+", label: "Years of Excellence" });
        } else if (yearIndex > 0) {
          // Move existing year stat to the front so it's treated as the required stat
          const [yearStat] = statsArr.splice(yearIndex, 1);
          // Enforce the fixed label for the primary stat
          yearStat.label = "Years of Excellence";
          statsArr.unshift(yearStat);
        } else if (yearIndex === 0) {
          // If the year-like stat already at index 0, ensure it has the fixed label
          statsArr[0].label = "Years of Excellence";
        }

        dataCopy.studio = {
          ...(dataCopy.studio || {}),
          stats: statsArr,
        };

        setFormData(dataCopy);
        toast.success('About page data loaded successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load about page data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value,
        },
      },
    }));
  };

  const handleVisibility = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [field]: value,
      },
    }));
  };

  const addFounder = () => {
    setFormData((prev) => ({
      ...prev,
      founders: {
        ...prev.founders,
        founders: [
          ...prev.founders.founders,
          {
            name: "",
            role: "",
            bio: "",
            image: "",
            achievements: [],
            social: {
              linkedin: "",
              email: "",
              twitter: "",
            },
          },
        ],
      },
    }));
    toast.info('New founder added');
  };

  const updateFounder = (index, field, value) => {
    const updated = [...formData.founders.founders];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      founders: {
        ...prev.founders,
        founders: updated,
      },
    }));
  };

  const updateFounderSocial = (index, socialField, value) => {
    const updated = [...formData.founders.founders];
    updated[index].social[socialField] = value;
    setFormData((prev) => ({
      ...prev,
      founders: {
        ...prev.founders,
        founders: updated,
      },
    }));
  };

  const updateFounderAchievements = (index, value) => {
    const updated = [...formData.founders.founders];
    // Store as string for editing, but convert to array for saving
    updated[index].achievementsTemp = value;
    setFormData((prev) => ({
      ...prev,
      founders: {
        ...prev.founders,
        founders: updated,
      },
    }));
  };

  const removeFounder = (index) => {
    const updated = formData.founders.founders.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      founders: {
        ...prev.founders,
        founders: updated,
      },
    }));
    toast.warning('Founder removed');
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Process array inputs before saving
      const processedData = { ...formData };
      
      // Process sectors
      if (tempArrayInputs.sectors) {
        processedData.workScope.sectors.items = tempArrayInputs.sectors
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== "");
      }
      
      // Process approach
      if (tempArrayInputs.approach) {
        processedData.workScope.approach.items = tempArrayInputs.approach
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== "");
      }
      
      // Process founder achievements
      if (processedData.founders?.founders) {
        processedData.founders.founders = processedData.founders.founders.map(founder => {
          if (founder.achievementsTemp !== undefined) {
            const achievements = founder.achievementsTemp
              .split(",")
              .map(item => item.trim())
              .filter(item => item !== "");
            return { ...founder, achievements, achievementsTemp: undefined };
          }
          return founder;
        });
      }
      // Ensure the primary Years stat has the fixed label before saving
      if (!Array.isArray(processedData.studio?.stats)) {
        processedData.studio = { ...(processedData.studio || {}), stats: [] };
      }

      if (processedData.studio.stats.length === 0) {
        processedData.studio.stats.unshift({ value: "15+", label: "Years of Excellence" });
      } else {
        // enforce label for first stat and default value if empty
        processedData.studio.stats[0].label = "Years of Excellence";
        if (!processedData.studio.stats[0].value) {
          processedData.studio.stats[0].value = "15+";
        }
      }

  // yearsExperience is managed in the model / API; dashboard no longer auto-populates it
      
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('About page updated successfully! 🎉');
        // Refresh data
        await fetchAbout();
      } else {
        toast.error('Failed to update about page');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] p-6 md:p-10">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        {/* TOP */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-black">
              About Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Manage About Page Content
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fetchAbout()}
              disabled={saving}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* VISIBILITY */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-6">
            Section Visibility
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility.philosophy}
                onChange={(e) => handleVisibility("philosophy", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Philosophy Section</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility.studio}
                onChange={(e) => handleVisibility("studio", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Studio Section</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility.founders}
                onChange={(e) => handleVisibility("founders", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Founders Section</span>
            </label>
          </div>
        </div>

        {/* HERO */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-6">
            Hero Section
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Recognized Year (e.g., 2020)"
              value={formData.hero.recognizedYear}
              onChange={(e) => handleChange("hero", "recognizedYear", e.target.value)}
              className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.hero.title}
              onChange={(e) => handleChange("hero", "title", e.target.value)}
              className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={formData.hero.subtitle}
              onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
              className="border p-4 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <textarea
              rows={5}
              placeholder="Description"
              value={formData.hero.description}
              onChange={(e) => handleChange("hero", "description", e.target.value)}
              className="border p-4 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
            />
          </div>
        </div>

        {/* PHILOSOPHY */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-6">
            Philosophy
          </h2>
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Tagline"
              value={formData.philosophy.tagline}
              onChange={(e) => handleChange("philosophy", "tagline", e.target.value)}
              className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <textarea
              rows={3}
              placeholder="Quote"
              value={formData.philosophy.quote}
              onChange={(e) => handleChange("philosophy", "quote", e.target.value)}
              className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
            />
            <textarea
              rows={5}
              placeholder="Description"
              value={formData.philosophy.description}
              onChange={(e) => handleChange("philosophy", "description", e.target.value)}
              className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
            />
          </div>
        </div>

        {/* WORK SCOPE */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-semibold mb-6">
            Work Scope
          </h2>
          <div className="space-y-10">
            {/* SECTORS */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-4">
                Sectors We Serve
              </h3>
              <input
                type="text"
                placeholder="Section Title"
                value={formData.workScope.sectors.title}
                onChange={(e) => handleNestedChange("workScope", "sectors", "title", e.target.value)}
                className="border p-4 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <textarea
                rows={4}
                placeholder="Enter sectors separated by commas (e.g., Technology, Healthcare, Finance)"
                value={tempArrayInputs.sectors}
                onChange={(e) => setTempArrayInputs(prev => ({ ...prev, sectors: e.target.value }))}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Tip: Separate each sector with a comma. Spaces are allowed.
              </p>
            </div>

            {/* APPROACH */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-4">
                Our Approach
              </h3>
              <input
                type="text"
                placeholder="Section Title"
                value={formData.workScope.approach.title}
                onChange={(e) => handleNestedChange("workScope", "approach", "title", e.target.value)}
                className="border p-4 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <textarea
                rows={4}
                placeholder="Enter approach items separated by commas (e.g., Innovation First, Client-Centric, Agile)"
                value={tempArrayInputs.approach}
                onChange={(e) => setTempArrayInputs(prev => ({ ...prev, approach: e.target.value }))}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Tip: Separate each approach with a comma. Spaces are allowed.
              </p>
            </div>

            {/* COMMITMENT */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Our Commitment
              </h3>
              <input
                type="text"
                placeholder="Section Title"
                value={formData.workScope.commitment.title}
                onChange={(e) => handleNestedChange("workScope", "commitment", "title", e.target.value)}
                className="border p-4 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <textarea
                rows={5}
                placeholder="Description of commitment"
                value={formData.workScope.commitment.description}
                onChange={(e) => handleNestedChange("workScope", "commitment", "description", e.target.value)}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              />
            </div>
          </div>
        </div>

        {/* STUDIO SECTION */}
        {formData.visibility.studio && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-6">
              Studio Section
            </h2>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Tagline"
                value={formData.studio.tagline}
                onChange={(e) => handleChange("studio", "tagline", e.target.value)}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.studio.title}
                onChange={(e) => handleChange("studio", "title", e.target.value)}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <textarea
                rows={5}
                placeholder="Description"
                value={formData.studio.description}
                onChange={(e) => handleChange("studio", "description", e.target.value)}
                className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              />
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Testimonial</h3>
                <textarea
                  rows={3}
                  placeholder="Testimonial Quote"
                  value={formData.studio.testimonial.quote}
                  onChange={(e) => handleNestedChange("studio", "testimonial", "quote", e.target.value)}
                  className="border p-4 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={formData.studio.testimonial.author}
                  onChange={(e) => handleNestedChange("studio", "testimonial", "author", e.target.value)}
                  className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* years of experience field removed as requested */}

              {/* STATS */}
<div className="border-t pt-6">

  <div className="flex items-center justify-between mb-6">

    <h3 className="font-semibold text-lg">
      Studio Stats
    </h3>

    <button
      type="button"
      onClick={() => {
        setFormData((prev) => ({
          ...prev,

          studio: {
            ...prev.studio,

            stats: [
              ...prev.studio.stats,

              {
                value: "",
                label: "",
              },
            ],
          },
        }));
      }}
      className="bg-black text-white px-4 py-2 rounded-xl text-sm"
    >
      Add Stat
    </button>

  </div>

          <div className="space-y-5">

  {formData?.studio?.stats?.map((stat, index) => {
    const isYearStat = index === 0; // we ensure the year stat is always at index 0

    return (
      <div key={index} className="border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-medium">Stat {index + 1}</h4>

          {isYearStat ? (
            // Fixed non-editable label for the primary years stat
            <span className="text-sm text-gray-700 font-medium">Years of Excellence</span>
          ) : (
            <button
              type="button"
              onClick={() => {
                const updated = formData.studio.stats.filter((_, i) => i !== index);
                setFormData((prev) => ({
                  ...prev,
                  studio: {
                    ...prev.studio,
                    stats: updated,
                  },
                }));
              }}
              className={`text-red-500 text-sm`}
            >
              Remove
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Value (Example: 50+)"
            value={stat.value}
            onChange={(e) => {
              const updated = [...formData.studio.stats];
              updated[index].value = e.target.value;

              setFormData((prev) => ({
                ...prev,
                studio: {
                  ...prev.studio,
                  stats: updated,
                },
              }));
            }}
            className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          {isYearStat ? (
            // Show fixed, non-editable label for the primary stat
            <input
              type="text"
              value={"Years of Excellence"}
              disabled
              className="border p-4 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          ) : (
            <input
              type="text"
              placeholder="Label (Example: Projects Delivered)"
              value={stat.label}
              onChange={(e) => {
                const updated = [...formData.studio.stats];
                updated[index].label = e.target.value;

                setFormData((prev) => ({
                  ...prev,
                  studio: {
                    ...prev.studio,
                    stats: updated,
                  },
                }));
              }}
              className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}

        </div>

      </div>
    );
  })}

  </div>

</div>
            </div>
          </div>
        )}

        {/* FOUNDERS */}
        {formData.visibility.founders && (
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Founders Section
                </h2>
                <p className="text-gray-500 mt-1">Manage founder profiles</p>
              </div>
              <button
                onClick={addFounder}
                className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                + Add Founder
              </button>
            </div>

            <div className="space-y-8">
              {formData.founders?.founders?.map((founder, index) => (
                <div key={index} className="border rounded-2xl p-6 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h3 className="text-xl font-semibold">
                      Founder #{index + 1}
                    </h3>
                    <button
                      onClick={() => removeFounder(index)}
                      className="text-red-500 hover:text-red-700 transition px-3 py-1 rounded-lg hover:bg-red-50"
                    >
                      Remove Founder
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Founder Name"
                      value={founder.name}
                      onChange={(e) => updateFounder(index, "name", e.target.value)}
                      className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Role / Title"
                      value={founder.role}
                      onChange={(e) => updateFounder(index, "role", e.target.value)}
                      className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />

                    {/* IMAGE */}
                    <div className="md:col-span-2">
                      <label className="block mb-3 font-medium text-gray-700">
                        Founder Image
                      </label>
                      <div className="flex items-center gap-4 flex-wrap">
                        {founder.image && (
                          <div className="relative">
                            <img
                              src={founder.image}
                              alt={founder.name}
                              className="w-28 h-28 rounded-xl object-cover border"
                            />
                            <button
                              onClick={() => updateFounder(index, "image", "")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        <label className="bg-gray-800 text-white px-5 py-3 rounded-xl cursor-pointer hover:bg-gray-900 transition">
                          {founder.image ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onloadend = async () => {
                                try {
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ image: reader.result }),
                                  });
                                  const data = await res.json();
                                  if (data.success) {
                                    updateFounder(index, "image", data.imageUrl);
                                    toast.success('Image uploaded successfully!');
                                  }
                                } catch (error) {
                                  console.log(error);
                                  toast.error('Failed to upload image');
                                }
                              };
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <textarea
                      rows={6}
                      placeholder="Founder Bio - Describe their background, expertise, and journey"
                      value={founder.bio}
                      onChange={(e) => updateFounder(index, "bio", e.target.value)}
                      className="border p-4 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
                    />

                    {/* SOCIAL LINKS */}
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={founder?.social?.linkedin || ""}
                      onChange={(e) => updateFounderSocial(index, "linkedin", e.target.value)}
                      className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={founder?.social?.email || ""}
                      onChange={(e) => updateFounderSocial(index, "email", e.target.value)}
                      className="border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Twitter/X URL"
                      value={founder?.social?.twitter || ""}
                      onChange={(e) => updateFounderSocial(index, "twitter", e.target.value)}
                      className="border p-4 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="Instagram URL"
                      value={founder?.social?.instagram || ""}
                      onChange={(e) => updateFounderSocial(index, "instagram", e.target.value)}
                      className="border p-4 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />

                    {/* ACHIEVEMENTS */}
                    <div className="md:col-span-2">
                      <label className="block mb-3 font-medium text-gray-700">
                        Key Achievements
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Enter achievements separated by commas (e.g., Founded in 2015, 50+ Awards, Global Recognition)"
                        value={founder.achievementsTemp !== undefined ? founder.achievementsTemp : founder.achievements?.join(", ") || ""}
                        onChange={(e) => updateFounderAchievements(index, e.target.value)}
                        className="border p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        💡 Tip: Separate each achievement with a comma. Spaces are allowed.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.founders?.founders?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                  <p className="text-gray-500 mb-4">No founders added yet</p>
                  <button
                    onClick={addFounder}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                  >
                    + Add Your First Founder
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}