import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { WhatsAppButton, ScrollToTop } from '@/components/layout/FloatingButtons';
import ScrollProgressBar from '@/components/layout/ScrollProgressBar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Scroll progress bar — animated via Framer Motion useScroll */}
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}
