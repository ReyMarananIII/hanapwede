import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Initialize navigation

  useEffect(() => {
    

    const fetchPreferences = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/preferences/", {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);



  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Preferences</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <ul className="list-disc pl-5">
            {preferences.length > 0 ? (
              preferences.map((pref, index) => (
                <li key={index} className="text-gray-700">
                  {pref.name}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No preferences found.</p>
            )}
          </ul>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/job-seeker/preferences")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default PreferencesPage;
