"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Award, Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-white shadow-md" : "bg-white border-b"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-xl">StateOrigin</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium hover:text-purple-600 transition-colors ${
              pathname === "/" ? "text-purple-600" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium hover:text-purple-600 transition-colors ${
              pathname === "/about" ? "text-purple-600" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/how-to-apply"
            className={`text-sm font-medium hover:text-purple-600 transition-colors ${
              pathname === "/how-to-apply" ? "text-purple-600" : ""
            }`}
          >
            How to Apply
          </Link>
          <Link
            href="/verify"
            className={`text-sm font-medium hover:text-purple-600 transition-colors ${
              pathname === "/verify" ? "text-purple-600" : ""
            }`}
          >
            Verify Certificate
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium hover:text-purple-600 transition-colors ${
              pathname === "/contact" ? "text-purple-600" : ""
            }`}
          >
            Contact
          </Link>

          {/* Show dashboard link if logged in */}
          {isLoggedIn && (
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === (isAdmin ? "/admin" : "/dashboard")
                  ? "text-purple-600"
                  : ""
              }`}
            >
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Button
              asChild
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Link href="/api/auth/signout">Logout</Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
              >
                Login
              </Link>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === "/" ? "text-purple-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === "/about" ? "text-purple-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/how-to-apply"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === "/how-to-apply" ? "text-purple-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              How to Apply
            </Link>
            <Link
              href="/verify"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === "/verify" ? "text-purple-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Verify Certificate
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                pathname === "/contact" ? "text-purple-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Show dashboard link if logged in */}
            {isLoggedIn && (
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                  pathname === (isAdmin ? "/admin" : "/dashboard")
                    ? "text-purple-600"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            )}

            {isLoggedIn ? (
              <Button
                asChild
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full"
              >
                <Link
                  href="/api/auth/signout"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logout
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full"
                >
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
