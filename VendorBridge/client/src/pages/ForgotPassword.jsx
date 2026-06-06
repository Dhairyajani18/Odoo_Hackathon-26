import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ChevronLeft, Boxes, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please provide your operator email address.');
      return;
    }
    
    setSuccess(true);
  };

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
          <p className="text-xs text-slate-500 mt-1">Password Recovery</p>
        </div>

        {/* Form Panel */}
        <div className="bg-white border border-violet-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-6 border-b border-violet-100 pb-3 flex items-center gap-2">
            <KeyRound size={14} className="text-violet-600" /> Reset Password
          </h2>

          {success ? (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center text-emerald-600">
                <CheckCircle2 size={40} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-800 uppercase">Recovery Email Sent</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  A verification link has been sent to <span className="text-slate-700 font-mono font-semibold">{email}</span>. 
                  Please check your inbox to reset your password.
                </p>
              </div>
              <Link to="/login" className="btn-primary py-2.5 text-xs inline-flex items-center gap-1.5 justify-center w-full">
                <ChevronLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Enter your registered email address below. We will send a secure recovery link to reset your password.
              </p>

              {error && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {/* Email Input */}
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary w-full py-3 text-sm font-semibold">
                Send Recovery Link
              </button>

              {/* Navigation Back */}
              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-violet-600 hover:text-violet-700 inline-flex items-center gap-1">
                  <ChevronLeft size={14} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
