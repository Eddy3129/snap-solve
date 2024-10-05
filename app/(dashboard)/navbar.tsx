'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pencil, Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Popup } from '@/components/styles/Popup';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface NavbarProps {
  onSearch: (query: string) => void;
  onLocateUser: () => void;
}

const WalletClient = dynamic(() => import('@/components/wallet/WalletClient'), { ssr: false });

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLocateUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false);
  const pathname = usePathname(); // Using usePathname to get current path

  const togglePopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`navbar sticky top-0 z-50 ${orbitron.className}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-2">
    <Image
      src="/favicon.ico" // Path to your favicon.ico in the public folder
      alt="SnapSolve Logo"
      width={32} // Adjust the size as needed
      height={32}
    />
    <h1 className="text-2xl font-bold text-neonPink">SnapSolve</h1>
  </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/posts"
            id="nav-posts"
            className={`nav-link ${pathname === '/posts' ? 'active-link' : ''}`}
          >
            Posts
          </Link>
          <Link
            href="/home"
            id="nav-map"
            className={`nav-link ${pathname === '/home' ? 'active-link' : ''}`}
          >
            Map
          </Link>
          <button
            onClick={togglePopup}
            className="neon-button flex items-center justify-center"
          >
            <Pencil className="mr-2 h-5 w-5" />
            Create Petition
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="md:hidden focus:outline-none">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-black px-6 py-4">
          <Link
            href="/posts"
            id="nav-posts-mobile"
            className={`block py-2 nav-link ${pathname === '/posts' ? 'active-link' : ''}`}
          >
            Posts
          </Link>
          <Link
            href="/home"
            id="nav-map-mobile"
            className={`block py-2 nav-link ${pathname === '/home' ? 'active-link' : ''}`}
          >
            Map
          </Link>
          <button
            onClick={togglePopup}
            className="neon-button w-full mt-2 flex items-center justify-center"
          >
            <Pencil className="mr-2 h-5 w-5" />
            Create Petition
          </button>
        </nav>
      )}
      {/* Popup */}
      {isShowPopup && <Popup togglePopup={togglePopup} />}
    </header>
  );
};

export default Navbar;
