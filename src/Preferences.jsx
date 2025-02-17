import { useState, useEffect } from "react";
import LoggedInHeader from "./LoggedInHeader";

const Preferences = ({ onPreferencesSaved }) => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

 
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tags/")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);


  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You must be logged in to post a job.");
        return;
      }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/save-preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({ tags: selectedTags }),
      });

      if (response.ok) {
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

      {/* Selected count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Selected: {selectedTags.length} / {tags.length}
      </div>

      {/* Tags grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`
                px-4 py-3 rounded-lg border-2 text-left
                transition-all duration-200 ease-in-out
                hover:border-[#4CAF50] hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-50
                ${
                  isSelected
                    ? "border-[#4CAF50] bg-[#E8F5E9] text-[#2E7D32]"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{tag.name}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Action buttons */}
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
          onClick={() => selectedTags.forEach((id) => toggleTag(id))}
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
