import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 to-primary-700 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-primary-300 animate-heartbeat" />
        </div>
        <h1 className="font-heading font-extrabold text-8xl mb-4 opacity-30">404</h1>
        <h2 className="font-heading font-bold text-2xl mb-3">Page Not Found</h2>
        <p className="text-primary-200 mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist. Perhaps you were looking for one of these?
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Go Home
          </Link>
          <Link href="/contact" className="border border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
