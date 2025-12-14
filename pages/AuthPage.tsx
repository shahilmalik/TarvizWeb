import React, { useState, useRef } from 'react';
import { User, Lock, Mail, Phone, MapPin, Building, ChevronRight, ArrowLeft, Unlock, Loader2, RefreshCw, KeyRound } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (role: 'client' | 'admin') => void;
  onNavigateHome: () => void;
}

// Configuration
const API_BASE_URL = 'http://localhost:8000/api/auth'; // Adjust if hosted elsewhere

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  // Views: login | signup | otp-signup | forgot-email | reset-final
  const [view, setView] = useState<'login' | 'signup' | 'otp-signup' | 'forgot-email' | 'reset-final'>('login');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State (Password held in state to send during verification)
  const [signupPassword, setSignupPassword] = useState('');
  const [formData, setFormData] = useState<UserProfile>({
    business: {
      name: '',
      address: '',
      gstin: '',
      hsn: '',
      email: '',
      phone: '',
      whatsappConsent: false
    },
    contactPerson: {
      salutation: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      whatsappConsent: false
    }
  });

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Shared Styles
  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6C5CE7] focus:ring-[#6C5CE7] outline-none transition-all text-slate-900";

  // --- API Helpers ---

  const apiCall = async (endpoint: string, method: 'POST', body: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        // Handle backend error format { success: false, errors: { field: ["msg"] } } or errors: ["msg"]
        let errorMsg = 'An error occurred';
        if (data.errors) {
            if (Array.isArray(data.errors)) {
                errorMsg = data.errors[0];
            } else if (typeof data.errors === 'object') {
                const firstKey = Object.keys(data.errors)[0];
                errorMsg = `${firstKey}: ${data.errors[firstKey][0]}`;
            }
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---

  const handleGuestBypass = () => {
    onLoginSuccess('client');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@tarviz.com') {
      // Hardcoded admin bypass for demo/testing if backend doesn't support admin role yet
      onLoginSuccess('admin');
      return;
    }

    const data = await apiCall('/signin/', 'POST', {
      email: loginEmail,
      password: loginPassword
    });

    if (data) {
      // Store tokens
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refresh);
      // Store basic user info
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess('client');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = await apiCall('/signup/', 'POST', {
      email: formData.contactPerson.email,
      user_name: formData.contactPerson.firstName,
      purpose: 'signup'
    });

    if (data) {
      setSuccessMsg(data.message);
      setView('otp-signup');
      setOtp(['', '', '', '', '', '']); // Reset OTP
    }
  };

  const handleVerifySignupOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    const data = await apiCall('/verify_signup_otp/', 'POST', {
      email: formData.contactPerson.email,
      otp: enteredOtp,
      password: signupPassword // Backend expects password here
    });

    if (data) {
      alert("Account created successfully! Please log in.");
      setView('login');
      setLoginEmail(formData.contactPerson.email);
    }
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await apiCall('/send_otp/', 'POST', {
      email: forgotEmail,
      purpose: 'reset'
    });

    if (data) {
      setSuccessMsg(data.message);
      setView('reset-final');
      setOtp(['', '', '', '', '', '']); // Reset OTP
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    const data = await apiCall('/reset_password/', 'POST', {
      email: forgotEmail,
      otp: enteredOtp,
      new_password: newPassword
    });

    if (data) {
      alert("Password reset successful. Please log in.");
      setView('login');
      setLoginEmail(forgotEmail);
    }
  };

  const handleResendOtp = async (purpose: 'signup' | 'reset') => {
    const email = purpose === 'signup' ? formData.contactPerson.email : forgotEmail;
    
    const data = await apiCall('/resend_otp/', 'POST', {
      email: email,
      purpose: purpose === 'reset' ? 'reset' : 'signup' // Backend might expect 'signup' as default or specific string
    });

    if (data) {
      setSuccessMsg("OTP resent successfully.");
    }
  };

  // --- Form Input Handlers ---

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      business: { ...prev.business, [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      contactPerson: { ...prev.contactPerson, [name]: type === 'checkbox' ? checked : value }
    }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --- Render Helpers ---

  const ErrorDisplay = () => error ? (
    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
       <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {error}
    </div>
  ) : null;

  const SuccessDisplay = () => successMsg ? (
    <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
       <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {successMsg}
    </div>
  ) : null;

  // ------------------------------------------------------------------
  // VIEW: LOGIN
  // ------------------------------------------------------------------
  if (view === 'login') {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center text-white p-12">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#6C5CE7] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse delay-700"></div>
           
           <div className="relative z-10 max-w-lg">
              <h1 className="text-5xl font-extrabold mb-6">Welcome Back to <br/><span className="text-[#FF6B6B]">Tarviz</span> <span className="text-[#6C5CE7]">Digimart</span></h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">Access your dashboard to manage campaigns, invoices, and your digital growth strategy.</p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-slate-50">
           <div className="w-full max-w-md mx-auto">
              <button onClick={onNavigateHome} className="flex items-center text-slate-500 hover:text-[#6C5CE7] mb-8 font-medium transition-colors">
                 <ArrowLeft size={16} className="mr-2" /> Back to Home
              </button>
              
              <div className="mb-10">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                 <p className="text-slate-500">New here? <button onClick={() => { setView('signup'); setError(null); }} className="text-[#6C5CE7] font-bold hover:underline">Create an account</button></p>
              </div>

              <ErrorDisplay />

              <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                       <input 
                         required
                         type="email" 
                         value={loginEmail} 
                         onChange={e => setLoginEmail(e.target.value)}
                         className={`pl-12 ${inputClass}`}
                         placeholder="you@company.com"
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                       <input 
                         required
                         type="password" 
                         value={loginPassword} 
                         onChange={e => setLoginPassword(e.target.value)}
                         className={`pl-12 ${inputClass}`}
                         placeholder="••••••••"
                       />
                    </div>
                 </div>
                 
                 <div className="flex justify-end">
                    <button type="button" onClick={() => { setView('forgot-email'); setError(null); }} className="text-sm font-medium text-slate-500 hover:text-[#FF6B6B]">Forgot password?</button>
                 </div>

                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                 >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                 </button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // VIEW: FORGOT PASSWORD (EMAIL)
  // ------------------------------------------------------------------
  if (view === 'forgot-email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full">
            <button onClick={() => setView('login')} className="flex items-center text-slate-500 hover:text-[#6C5CE7] mb-6 font-medium transition-colors">
                 <ArrowLeft size={16} className="mr-2" /> Back to Login
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Reset Password</h2>
            <p className="text-slate-500 mb-8">Enter your registered email address. We'll send you an OTP to reset your password.</p>
            
            <ErrorDisplay />

            <form onSubmit={handleSendResetOtp} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                   <input 
                     required
                     type="email" 
                     value={forgotEmail} 
                     onChange={e => setForgotEmail(e.target.value)}
                     className={inputClass}
                     placeholder="you@company.com"
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                </button>
            </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // VIEW: RESET PASSWORD (OTP + NEW PASS)
  // ------------------------------------------------------------------
  if (view === 'reset-final') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure your account</h2>
            <p className="text-slate-500 mb-8">Enter the code sent to <b>{forgotEmail}</b> and your new password.</p>
            
            <SuccessDisplay />
            <ErrorDisplay />

            <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code (OTP)</label>
                   <div className="flex justify-between gap-2">
                       {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => { otpRefs.current[idx] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-[#6C5CE7] focus:ring-2 focus:ring-violet-100 outline-none text-slate-800"
                          />
                       ))}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                   <div className="relative">
                       <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                       <input 
                         required
                         type="password" 
                         value={newPassword} 
                         onChange={e => setNewPassword(e.target.value)}
                         className={`pl-12 ${inputClass}`}
                         placeholder="New strong password"
                       />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.join('').length !== 6 || !newPassword}
                  className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                </button>
            </form>

            <button onClick={() => handleResendOtp('reset')} className="mt-6 w-full text-sm text-slate-500 hover:text-[#6C5CE7] font-medium flex items-center justify-center gap-2">
               <RefreshCw size={14} /> Resend OTP
            </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // VIEW: SIGNUP
  // ------------------------------------------------------------------
  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
           <div className="mb-8 flex items-center justify-between">
              <button onClick={() => setView('login')} className="flex items-center text-slate-500 hover:text-[#6C5CE7] font-medium transition-colors">
                 <ArrowLeft size={16} className="mr-2" /> Back to Login
              </button>
              <h2 className="text-2xl font-bold text-slate-900">Create Client Account</h2>
           </div>

           <ErrorDisplay />

           <form onSubmit={handleSignupSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                 
                 {/* Business Details */}
                 <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-violet-50 text-[#6C5CE7] rounded-lg"><Building size={24} /></div>
                       <h3 className="text-lg font-bold text-slate-800">Business Details</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                          <input required name="name" value={formData.business.name} onChange={handleBusinessChange} className={inputClass} placeholder="Tarviz Digimart" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Address (For Invoice)</label>
                          <textarea 
                             name="address" 
                             value={formData.business.address} 
                             onChange={handleBusinessChange} 
                             rows={3} 
                             className={`${inputClass} resize-none`} 
                             placeholder="Street, City, Zip" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">GSTIN</label>
                          <input 
                             name="gstin" 
                             value={formData.business.gstin} 
                             onChange={handleBusinessChange} 
                             className={inputClass} 
                             placeholder="22AAAAA0000A1Z5" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">HSN / SAC Code</label>
                          <input 
                            name="hsn"
                            value={formData.business.hsn}
                            onChange={handleBusinessChange}
                            className={inputClass}
                            placeholder="Service Accounting Code"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Business Email</label>
                             <input type="email" name="email" value={formData.business.email} onChange={handleBusinessChange} className={inputClass} />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Business Phone</label>
                             <input type="tel" name="phone" value={formData.business.phone} onChange={handleBusinessChange} className={inputClass} />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Contact Person Details */}
                 <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-orange-50 text-[#FF6B6B] rounded-lg"><User size={24} /></div>
                       <h3 className="text-lg font-bold text-slate-800">Contact Person</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="w-24">
                             <label className="block text-sm font-bold text-slate-700 mb-1">Salutation</label>
                             <select name="salutation" value={formData.contactPerson.salutation} onChange={handleContactChange} className={`${inputClass} bg-white`}>
                               <option>Mr</option><option>Ms</option><option>Mrs</option><option>Dr</option>
                             </select>
                          </div>
                          <div className="flex-1">
                             <label className="block text-sm font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
                             <input required name="firstName" value={formData.contactPerson.firstName} onChange={handleContactChange} className={inputClass} />
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input required name="lastName" value={formData.contactPerson.lastName} onChange={handleContactChange} className={inputClass} />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Email (Login ID) <span className="text-red-500">*</span></label>
                          <input required type="email" name="email" value={formData.contactPerson.email} onChange={handleContactChange} className={inputClass} />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Phone <span className="text-red-500">*</span></label>
                          <input required type="tel" name="phone" value={formData.contactPerson.phone} onChange={handleContactChange} className={inputClass} />
                       </div>
                       
                       {/* Password Field for Signup */}
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Create Password <span className="text-red-500">*</span></label>
                          <div className="relative">
                             <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
                             <input 
                               required
                               type="password"
                               value={signupPassword}
                               onChange={(e) => setSignupPassword(e.target.value)}
                               className={`${inputClass} pl-10`}
                               placeholder="Strong password"
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                 <button 
                    type="button"
                    onClick={handleGuestBypass}
                    className="text-slate-400 hover:text-[#6C5CE7] text-sm font-bold flex items-center gap-2 transition-colors"
                 >
                    <Unlock size={16} /> Guest Bypass
                 </button>
                 <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#FF6B6B] to-[#6C5CE7] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                 >
                    {isLoading ? <Loader2 className="animate-spin" /> : <><span className="whitespace-nowrap">Send OTP</span> <ChevronRight size={18} /></>}
                 </button>
              </div>
           </form>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // VIEW: OTP SIGNUP
  // ------------------------------------------------------------------
  if (view === 'otp-signup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
         <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-violet-100 text-[#6C5CE7] rounded-full flex items-center justify-center mx-auto mb-6">
               <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Account</h2>
            <p className="text-slate-500 mb-8">We've sent a code to <span className="font-bold text-slate-800">{formData.contactPerson.email}</span></p>

            <SuccessDisplay />
            <ErrorDisplay />

            <div className="flex justify-center gap-2 mb-8">
               {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-[#6C5CE7] focus:ring-2 focus:ring-violet-100 outline-none transition-all text-slate-800"
                  />
               ))}
            </div>

            <button 
               onClick={handleVerifySignupOtp}
               disabled={otp.join('').length !== 6 || isLoading}
               className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Create'}
            </button>

            <button onClick={() => handleResendOtp('signup')} className="mt-6 text-sm text-slate-500 hover:text-[#6C5CE7] font-medium flex items-center justify-center gap-1 w-full">
               <RefreshCw size={14} /> Resend OTP
            </button>
            <button onClick={() => setView('signup')} className="mt-2 text-sm text-slate-400 hover:text-slate-600">
               Change Email Address
            </button>
         </div>
      </div>
    );
  }

  return null;
};

export default AuthPage;