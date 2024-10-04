'use client'

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Popup } from './styles/Popup';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  weight: ['700'], // Use bold weight
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

  const togglePopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 bg-darkBg text-foreground shadow-neon ${orbitron.className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home">
          <h1 className="text-2xl font-bold text-neonPink">SnapSolve</h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/posts" className="hover:text-neonBlue">
            Posts
          </Link>
          <Link href="/home" className="hover:text-neonBlue">
            Map
          </Link>
          <button onClick={togglePopup} className="neon-button flex items-center justify-center px-6 py-2">
            <MapPin className="mr-2 h-5 w-5" />
            Create Petition
          </button>
          <div className="flex items-center">
            <WalletClient />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={toggleMobileMenu} className="md:hidden focus:outline-none">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-darkBg px-6 py-4">
          <Link href="/posts" className="block py-2 hover:text-neonBlue">
            Posts
          </Link>
          <Link href="/home" className="block py-2 hover:text-neonBlue">
            Map
          </Link>
          <button onClick={togglePopup} className="neon-button w-full mt-2 flex items-center justify-center px-6 py-2">
            <MapPin className="mr-2 h-5 w-5" />
            Create Petition
          </button>
          <div className="mt-4">
            <WalletClient />
          </div>
        </nav>
      )}

      {/* Popup */}
      {isShowPopup && <Popup togglePopup={togglePopup} />}
    </header>
  );
};

export default Navbar;
