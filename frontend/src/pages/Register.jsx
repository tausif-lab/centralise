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

  const [message, setMessage] = useState({ type: null, text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If role changes to admin, clear branch
    if (name === "role" && value === "admin") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        branch: "", // Clear branch when admin is selected
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: "" });

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setIsLoading(false);
      return;
    }

    // Branch is not required for admin
    if (formData.role !== "admin" && !formData.branch) {
      setMessage({ type: "error", text: "Branch is required for non-admin users!" });
      setIsLoading(false);
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
        setMessage({ 
          type: "success", 
          text: 'Registration Successful! Redirecting...' 
        });
        
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === 'admin') {
            window.location.href = '/admin-dashboard';
          } else {
            window.location.href = `/dashboard/${data.user.user1Id}`;
          }
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ 
        type: "error", 
        text: 'An error occurred during registration. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if branch should be disabled
  const isBranchDisabled = formData.role === "admin";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Registration Form
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

        {/* Branch (Disabled for Admin) */}
        <div>
          <label className="block font-medium text-gray-700">
            Branch
            {!isBranchDisabled && <span className="text-red-500">*</span>}
            {isBranchDisabled && <span className="text-gray-500 text-sm ml-2">(Not required for Admin)</span>}
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            disabled={isBranchDisabled}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 ${
              isBranchDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            required={!isBranchDisabled}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ET">ET</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
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
          disabled={isLoading}
          className={`w-full text-white py-2 rounded-lg transition duration-300 font-medium ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
