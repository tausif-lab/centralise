import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    collegeId: "",
    user1Id: "",
    password: "",
    confirmPassword: "",
    branch: "",
    role: "",
    facultyInchargeType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic validation
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration Successful! Redirecting to login...');
      // Store token if needed
      localStorage.setItem('token', data.token);
      // Redirect to login page
      window.location.href = '/login'; // or use React Router: navigate('/login')
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again.');
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Registration Form
        </h2>

        {/* Full Name */}
        <div>
          <label className="block font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* College ID */}
        <div>
          <label className="block font-medium text-gray-700">College ID</label>
          <input
            type="text"
            name="collegeId"
            value={formData.collegeId}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* User ID */}
        <div>
          <label className="block font-medium text-gray-700">User ID</label>
          <input
            type="text"
            name="user1Id"
            value={formData.user1Id}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
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
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block font-medium text-gray-700">Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ET">ET</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
          </select>
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

        {/* Faculty Incharge Type (Conditional) */}
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
              <option value="Sports">Sports</option>
              <option value="Workshops">Workshops</option>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
