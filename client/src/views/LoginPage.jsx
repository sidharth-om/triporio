import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { GiPalmTree } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      router.push(result.user.role === 'admin' ? '/admin' : '/destinations');
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
          <h2 className="font-display text-3xl text-white font-bold mb-3">Plan your perfect Kerala adventure</h2>
          <p className="text-slate-300">Login to access personalized trip planning, wishlist, and WhatsApp booking with Triporio.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <GiPalmTree className="text-white text-xl" />
            </div>
            <span className="font-display text-white font-bold text-lg">Triporio</span>
          </div>

          <h1 className="font-display text-3xl text-white font-bold mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in to continue planning your Kerala trip with Triporio</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-dark !pl-10"
                  id="login-email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-dark !pl-10 !pr-10"
                  id="login-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {loading ? 'Signing in...' : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          {/* Demo credentials hint */}
          {/* <div className="mt-6 p-4 glass rounded-xl text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Admin Demo:</p>
            <p>Email: admin@triporio.com</p>
            <p>Password: admin123456</p>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
}
