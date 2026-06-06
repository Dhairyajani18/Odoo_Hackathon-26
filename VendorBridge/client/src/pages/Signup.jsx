import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Shield, Eye, EyeOff, Boxes } from 'lucide-react';

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Procurement Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All metadata fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password tokens do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password key must be at least 6 characters.');
      return;
    }

    const success = signup(name, email, password, role);
    if (success) {
      navigate('/');
    }
  };

  const roles = [
    "Procurement Officer",
    "Vendor",
    "Manager / Approver"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Cool Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-sm text-white mb-3">
            <Boxes size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            VendorBridge
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create your account</p>
        </div>

        {/* Signup Form Panel */}
        <div className="bg-white border border-violet-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-6 border-b border-violet-100 pb-3 flex items-center gap-2">
            <User size={14} className="text-violet-600" /> Sign Up
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-lg text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-600">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="input-field w-full pl-10"
                  placeholder="Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-600">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="input-field w-full pl-10"
                  placeholder="sarah@vendorbridge.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Role Card Selection */}
            <div>
              <span className="label">Select Your Role</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-lg border text-center cursor-pointer transition-all duration-200 ${
                      role === r
                        ? 'border-violet-600 bg-violet-50/40 text-slate-800 text-xs font-semibold shadow-sm'
                        : 'border-violet-200 bg-white text-slate-600 text-xs hover:border-violet-300 hover:bg-slate-50/30'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-600">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field w-full pl-10"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-600">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field w-full pl-10"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full mt-2 py-3 text-sm font-semibold">
              <Shield size={16} /> Sign Up
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
