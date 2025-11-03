import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
const Login = () => {
  const navigate = useNavigate(); // Add this hook
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    facultyInchargeType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for students
    if (!formData.email || !formData.password || !formData.role) {
      alert("Please fill all required fields");
      return;
    }

    // Validation for Faculty Incharge
    if (formData.role === "FacultyIncharge" && !formData.facultyInchargeType) {
      alert("Please select Faculty Incharge area");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
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
        
        alert('Login Successful!');
        
        // Navigate based on role
        if (data.user.role === 'student') {
          navigate(`/StudentDashboard?collegeId=${data.user.collegeId}&userId=${data.user.id}&branch=${data.user.branch}`);
        } else if (data.user.role === 'FacultyIncharge') {
          navigate(`/teacher-dashboard?collegeId=${data.user.collegeId}&userId=${data.user.id}&facultyInchargeType=${data.user.facultyInchargeType}`);
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login
        </h2>

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
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
