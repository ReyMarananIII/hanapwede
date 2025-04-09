import { useState, useEffect } from "react";
import LoggedInHeader from "./LoggedInHeader";
import { useNavigate } from "react-router-dom";

const Preferences = ({ onPreferencesSaved }) => {
  const [tags, setTags] = useState([]); 
  const [selectedTags, setSelectedTags] = useState([]); 
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!authToken) {
      alert("User not logged in");
      return;
    }

    const fetchTags = async () => {
      try {
        const response = await fetch("http://194.163.40.84/api/tags/");
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchUserPreferences = async () => {
      try {
        const response = await fetch("http://194.163.40.84/api/preferences/", {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch preferences");

        const data = await response.json();
        setSelectedTags(data.map((pref) => pref.id)); 
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchTags();
    fetchUserPreferences();
  }, [authToken]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId); 
      } else if (prev.length < 5) {
        return [...prev, tagId]; 
      } else {
        alert("You can select up to 5 preferences only.");
        return prev; 
      }
    });
  };

  const handleSubmit = async () => {
    if (!authToken) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://194.163.40.84/api/save-preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({ tags: selectedTags }),
      });

      if (response.ok) {
        alert("Preferences saved successfully!");
        navigate("/job-seeker/dashboard")
        onPreferencesSaved();
      
      } else {
        console.error("Error saving preferences:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Select Your Specialties</h2>
          <p className="text-muted-foreground">
            Choose the areas you specialize in. This helps us recommend the most relevant opportunities.
          </p>
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
  Selected: {selectedTags.length} / 5
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              disabled={!selectedTags.includes(tag.id) && selectedTags.length >= 5}
              className={`
                px-4 py-3 rounded-lg border-2 text-left transition-all duration-200 ease-in-out
                ${selectedTags.includes(tag.id) 
                  ? "border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]" 
                  : selectedTags.length >= 5 
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "border-gray-200 bg-white hover:bg-gray-50"}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{tag.name}</span>
                {selectedTags.includes(tag.id) && (
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-[#4CAF50] text-white font-medium
              hover:bg-[#45a049] transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedTags.length === 0}
          >
            Save Preferences
          </button>
          <button
            onClick={() => setSelectedTags([])}
            className="px-6 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-medium
              hover:bg-gray-50 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
