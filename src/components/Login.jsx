import { useState } from "react";
import thoodhuvanImg from "../images/thoodhuvan.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      window.location.href = "/home";
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side - Image Section */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                  Welcome to Thoodhuvan
                </h2>
                <p className="text-blue-700 text-center mb-8">
                  Your secure collaboration platform for the Commercial Taxes Department
                </p>
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-blue-200">
                  {/* Replace this div with your actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    {/* <div className="text-white text-center p-6">
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-xl font-semibold">Thoodhuvan Platform</p>
                      <p className="text-sm mt-2">Secure • Efficient • Collaborative</p>
                    </div> */}
                    {/* If you have an actual image, replace the above div with: */
                    <img 
                      src={thoodhuvanImg}
                      alt="Thoodhuvan Platform" 
                      className="w-full h-full object-cover"
                    />
                    }
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
              
              {/* App Description */}
              <div className="mb-8 text-center">
               
                <h1 className="text-3xl font-bold text-blue-800 mb-3">
                  Thoodhuvan
                </h1>
                <p className="text-blue-700 mb-2">
                  <span className="font-semibold">Your All-in-One Collaboration Platform</span>
                </p>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
              </div>

             

              {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 text-center font-medium">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="
                      w-full
                      px-4 py-3
                      border border-blue-300
                      rounded-lg
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-transparent
                      transition
                      placeholder-blue-400
                    "
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full
                      px-4 py-3
                      border border-blue-300
                      rounded-lg
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-transparent
                      transition
                      placeholder-blue-400
                    "
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full
                    py-3.5
                    rounded-lg
                    text-white
                    font-semibold
                    transition-all
                    duration-200
                    transform
                    hover:scale-[1.02]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    focus:ring-offset-2
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login to Thoodhuvan"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-blue-100">
                <p className="text-xs text-center text-blue-500">
                  <span className="font-semibold">Commercial Taxes Department</span><br />
                  Government Platform • Secure Access Only • v2.0
                </p>
                <p className="text-xs text-center text-blue-400 mt-2">
                  Need help? Contact IT Support: support@ctd.gov
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;