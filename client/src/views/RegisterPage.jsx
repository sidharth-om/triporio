import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { GiPalmTree } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import toast from 'react-hot-toast';

const RESEND_COOLDOWN = 60; // seconds

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  // Auto-focus first OTP box when OTP step opens
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // --- Step 1: Send OTP ---
  const onSubmit = async (data) => {
    setSendingOtp(true);
    try {
      const res = await authService.sendOtp(data);
      if (res.data.success) {
        setPendingEmail(data.email);
        setPendingName(data.name);
        setCooldown(RESEND_COOLDOWN);
        setStep('otp');
        toast.success('OTP sent! Check your inbox 📬');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // --- Resend OTP ---
  const handleResend = async () => {
    if (cooldown > 0) return;
    setSendingOtp(true);
    try {
      await authService.sendOtp({ email: pendingEmail });
      setOtpDigits(['', '', '', '', '', '']);
      setCooldown(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
      toast.success('New OTP sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // --- OTP input handling ---
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    // Auto-focus next box
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

  // --- Step 2: Verify OTP ---
  const handleVerify = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await authService.verifyOtp({ email: pendingEmail, otp });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success(`Welcome to Triporio, ${user.name}! 🌴`);
        router.push('/destinations');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      // Shake the inputs
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (otpDigits.every(d => d !== '') && step === 'otp') {
      handleVerify();
    }
  }, [otpDigits]);

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Bakel_Fort_Beach_Kasaragod7.jpg"
          alt="Kerala Wildlife"
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
          <h2 className="font-display text-3xl text-white font-bold mb-3">Your Kerala adventure begins here</h2>
          <p className="text-slate-300">Join thousands of travelers who've discovered the magic of Kerala with Triporio.</p>
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

            {/* ===== STEP 1: REGISTRATION FORM ===== */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-3xl text-white font-bold mb-2">Create your account</h1>
                <p className="text-slate-400 mb-8">Join and start planning your Kerala trip with Triporio</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                        placeholder="Your full name"
                        className="input-dark !pl-10"
                        id="reg-name"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                        type="email"
                        placeholder="you@example.com"
                        className="input-dark !pl-10"
                        id="reg-email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('phone', { required: 'Phone is required', minLength: { value: 10, message: 'Enter valid phone' } })}
                        type="tel"
                        placeholder="+91 9876543210"
                        className="input-dark !pl-10"
                        id="reg-phone"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                        type={showPass ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="input-dark !pl-10 !pr-10"
                        id="reg-password"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        {showPass ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={sendingOtp}
                    id="reg-submit"
                    className="btn-primary w-full justify-center py-3.5 text-base mt-2"
                  >
                    {sendingOtp ? 'Sending OTP...' : <>Continue <FiArrowRight /></>}
                  </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-green-400 font-semibold hover:underline">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* ===== STEP 2: OTP VERIFICATION ===== */}
            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Email icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 flex items-center justify-center mb-6">
                  <FiMail className="text-green-400 text-3xl" />
                </div>

                <h1 className="font-display text-3xl text-white font-bold mb-2">Check your email</h1>
                <p className="text-slate-400 mb-2">
                  We sent a 6-digit code to
                </p>
                <p className="text-green-400 font-semibold mb-8 text-sm break-all">{pendingEmail}</p>

                {/* OTP Digit Inputs */}
                <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-[#0a0f1e] text-white outline-none transition-all duration-200"
                      style={{
                        borderColor: digit ? '#22c55e' : 'rgba(255,255,255,0.12)',
                        boxShadow: digit ? '0 0 0 1px #22c55e33' : 'none',
                      }}
                      id={`otp-${i}`}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={verifyingOtp || otpDigits.some(d => d === '')}
                  className="btn-primary w-full justify-center py-3.5 text-base mb-4"
                  id="otp-verify"
                >
                  {verifyingOtp ? 'Verifying...' : <><FiCheckCircle /> Verify & Create Account</>}
                </button>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-500 text-sm">Didn't receive it?</span>
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || sendingOtp}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ color: cooldown > 0 ? '#64748b' : '#4ade80' }}
                    id="otp-resend"
                  >
                    <FiRefreshCw className={sendingOtp ? 'animate-spin' : ''} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                  </button>
                </div>

                {/* Back link */}
                <button
                  onClick={() => { setStep('form'); setOtpDigits(['', '', '', '', '', '']); }}
                  className="w-full text-center text-slate-500 text-sm mt-6 hover:text-slate-300 transition-colors"
                >
                  ← Back to registration
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
