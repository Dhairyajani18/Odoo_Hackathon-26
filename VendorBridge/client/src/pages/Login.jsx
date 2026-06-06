import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Shield, Eye, EyeOff, Boxes } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Procurement Officer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all security fields.');
      return;
    }
    
    const success = login(email, password, role);
    if (success) {
      navigate('/');
    }
  };

  const roles = [
    { name: "Procurement Officer", desc: "Manage RFQs & Vendors" },
    { name: "Vendor", desc: "Submit Bids & Invoices" },
    { name: "Manager / Approver", desc: "Approve RFQs & POs" },
    { name: "Admin", desc: "Full System Audit" }
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
          <p className="text-xs text-slate-500 mt-1">Procurement & Vendor Management</p>
        </div>

        {/* Login Form Panel */}
        <div className="bg-white border border-violet-200/85 rounded-2xl p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-6 border-b border-violet-100 pb-3 flex items-center gap-2">
            <Lock size={14} className="text-violet-600" /> Sign In
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-lg text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Card Selection */}
            <div>
              <span className="label">Select Your Role</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {roles.map((r) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => setRole(r.name)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                      role === r.name
                        ? 'border-violet-600 bg-violet-50/40 text-slate-800 font-semibold shadow-sm'
                        : 'border-violet-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-slate-50/30'
                    }`}
                  >
                    <p className="text-xs font-semibold">{r.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                ))}
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
                  placeholder="name@vendorbridge.com"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); e.placeholder = "jldskj"
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center">
                <label className="label">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-violet-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-600">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field w-full pl-10 pr-10"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-600 hover:text-violet-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full mt-2 py-3 text-sm font-semibold">
              <Shield size={16} /> Sign In
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            New user?{' '}
            <Link to="/signup" className="text-violet-600 hover:underline font-semibold">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
