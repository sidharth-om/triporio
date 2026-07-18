'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GiPalmTree } from 'react-icons/gi';
import { authService } from '../services';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'reset'
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Step 1: Send OTP
  const onSendOtp = async (data) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email: data.email });
      if (res.data.success) {
        setPendingEmail(data.email);
        toast.success(res.data.message);
        setStep('reset');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // Step 3: Verify and Reset
  const onResetPassword = async (data) => {
    const otp = otpDigits.join('');
    if (otp.length < 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword({
        email: pendingEmail,
        otp,
        newPassword: data.newPassword
      });
      if (res.data.success) {
        toast.success('Password reset successfully! Please log in.');
        router.push('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200"
          alt="Triporio - Kerala Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/70 to-[#0a0f1e]/20" />
        <div className="absolute bottom-16 left-10 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <GiPalmTree className="text-white text-2xl" />
            </div>
            <span className="font-display text-white font-bold text-xl">Triporio</span>
          </div>
          <h2 className="font-display text-3xl text-white font-bold mb-3">Secure Account Recovery</h2>
          <p className="text-slate-300">Quickly regain access to your Triporio account and continue planning your Kerala journey.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <GiPalmTree className="text-white text-xl" />
            </div>
            <span className="font-display text-white font-bold">Triporio</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ===== STEP 1: ENTER EMAIL ===== */}
            {step === 'email' && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-3xl text-white font-bold mb-2">Forgot Password</h1>
                <p className="text-slate-400 mb-8">Enter your registered email address to receive a password reset code.</p>

                <form onSubmit={handleSubmit(onSendOtp)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                        type="email"
                        placeholder="you@example.com"
                        className="input-dark !pl-10"
                        id="forgot-email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base"
                  >
                    {loading ? 'Sending Code...' : <>Send Reset Code <FiArrowRight /></>}
                  </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-8">
                  Remember your password?{' '}
                  <Link href="/login" className="text-green-400 font-semibold hover:underline">
                    Back to Login
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ===== STEP 2: RESET PASSWORD ===== */}
            {step === 'reset' && (
              <motion.div
                key="reset-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                  <FiMail className="text-2xl" />
                </div>
                
                <h1 className="font-display text-3xl text-white font-bold mb-2">Check your email</h1>
                <p className="text-slate-400 mb-8">
                  We sent a 6-digit reset code to <strong className="text-white">{pendingEmail}</strong>
                </p>

                <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
                  {/* OTP Input Boxes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Reset Code</label>
                    <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={el => inputRefs.current[index] = el}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('newPassword', { required: 'New password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Create new password"
                        className="input-dark !pl-10 !pr-10"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base"
                  >
                    {loading ? 'Resetting...' : <>Reset Password <FiCheckCircle /></>}
                  </button>
                </form>

                <div className="text-center mt-8">
                  <button onClick={() => setStep('email')} className="text-slate-400 text-sm hover:text-white transition-colors">
                    Use a different email address
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
