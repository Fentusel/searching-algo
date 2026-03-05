import { useState, useEffect } from "react";

function App() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setHistory(saved);
    }, []);

    const fetchUser = async (e) => {
        if (e) e.preventDefault();
        if (!username.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error("User not found");

            const data = await response.json();
            setUser(data);

            const newHistory = [username, ...history.filter(h => h !== username)].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem("searchHistory", JSON.stringify(newHistory));

        } catch (err) {
            setError(err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#010409] text-white flex flex-col items-center pt-20 px-4">
            <h1 className="text-4xl font-bold mb-8 text-purple-500">
                GitHub Profile Finder
            </h1>
            <form onSubmit={fetchUser} className="flex gap-2 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Enter GitHub username..."
                    className="flex-1 px-4 py-2 rounded bg-[#0d1117] border border-gray-700 focus:border-blue-500 outline-none transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-800 px-6 py-2 rounded font-semibold hover:bg-gray-700 disabled:opacity-50 transition-all"
                >
                    {loading ? "..." : "Search"}
                </button>
            </form>
            {history.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                    {history.map((name) => (
                        <button
                            key={name}
                            onClick={() => { setUsername(name); }}
                            className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 text-gray-400"
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 mt-6 animate-pulse">{error}</p>}

            {user && (
                <div className="bg-[#0D1117] mt-8 p-8 rounded-xl border border-gray-800 w-full max-w-sm shadow-2xl">
                    <img
                        src={user.avatar_url}
                        alt="avatar"
                        className="w-24 h-24 rounded-full mx-auto border-2 border-blue-500 p-1"
                    />
                    <h2 className="text-2xl mt-4 font-bold text-center">{user.name || user.login}</h2>
                    <p className="text-blue-400 text-center mb-4">@{user.login}</p>

                    {user.bio && <p className="text-gray-300 text-sm text-center italic">"{user.bio}"</p>}

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800 text-center">
                        <div>
                            <p className="font-bold text-lg">{user.followers}</p>
                            <p className="text-xs text-gray-500 uppercase">Followers</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user.following}</p>
                            <p className="text-xs text-gray-500 uppercase">Following</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{user.public_repos}</p>
                            <p className="text-xs text-gray-500 uppercase">Repos</p>
                        </div>
                    </div>
                    <a
                        href={user.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-6 text-center bg-gray-800 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        View Full Profile
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;