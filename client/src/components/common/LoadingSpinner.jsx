import { GiPalmTree } from 'react-icons/gi';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1e]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full border-4 border-green-500/20 border-t-green-500 mb-4"
      />
      <div className="flex items-center gap-2 text-slate-400">
        <GiPalmTree className="text-green-400 text-xl" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-52 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 shimmer rounded" />
        <div className="h-4 w-1/2 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-5/6 shimmer rounded" />
        <div className="h-10 w-full shimmer rounded-xl" />
      </div>
    </div>
  );
}
