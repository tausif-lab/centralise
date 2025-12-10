import { API_BASE_URL } from "../config";
import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    facultyInchargeType: "",
  });

  const [message, setMessage] = useState({ type: null, text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: "" });

    // Validation for required fields
    if (!formData.email || !formData.password || !formData.role) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      setIsLoading(false);
      return;
    }

    // Validation for Faculty Incharge
    if (formData.role === "FacultyIncharge" && !formData.facultyInchargeType) {
      setMessage({ type: "error", text: "Please select Faculty Incharge area" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage({ 
          type: "success", 
          text: 'Login Successful! Redirecting...' 
        });
        
        // Redirect based on redirectUrl from backend
        setTimeout(() => {
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
          } else if (data.user.role === 'admin') {
            window.location.href = '/admin-dashboard';
          } else if (data.user.role === 'student') {
            window.location.href = `/dashboard/${data.user.user1Id}`;
          } else if (data.user.role === 'FacultyIncharge') {
            window.location.href = `/teacher-dashboard?collegeId=${data.user.collegeId}&userId=${data.user.user1Id}&facultyInchargeType=${data.user.facultyInchargeType}`;
          }
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        type: "error", 
        text: 'An error occurred during login. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login
        </h2>

        {/* Message Display */}
        {message.text && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="FacultyIncharge">Faculty Incharge</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Faculty Incharge For (Conditional) */}
        {formData.role === "FacultyIncharge" && (
          <div>
            <label className="block font-medium text-gray-700">
              Faculty Incharge For
            </label>
            <select
              name="facultyInchargeType"
              value={formData.facultyInchargeType}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Area</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Workshops">Workshops</option>
              <option value="Sports">Sports</option>
              <option value="Extracurricular Activity">
                Extracurricular Activity
              </option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-2 rounded-lg transition duration-300 font-medium ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
