import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Loader2, Eye, EyeOff, User } from 'lucide-react';
import Scene3DBackground from './components/Scene3DBackground';
import Hero3DDevice from './components/Hero3DDevice';
import { buildApiUrl } from './utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Le nom complet doit contenir au moins 2 caractères';
    }

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'L\'email est invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!role || role === "") {
      newErrors.role = 'Veuillez sélectionner un rôle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await axios.post(buildApiUrl('/auth/register'), {
        fullName,
        email,
        password,
        role
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // After successful registration, navigate to login page
      navigate('/login');
      
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'L\'inscription a échoué. Veuillez réessayer.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-950" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* 3D Scene Background */}
      <Scene3DBackground />

      {/* Grid Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-20 z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main Content Container - Hero Device + Register Card */}
      <div className="relative z-10 w-full max-w-7xl mx-4 flex items-center justify-center gap-4 lg:gap-8 py-4">
        {/* Hero 3D Device - Hidden on mobile, visible on tablet+ */}
        <div className="hidden lg:block">
          <Hero3DDevice position="left" />
        </div>

        {/* Glassmorphism Register Card */}
        <div className="w-full max-w-md">
          <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-400/50 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-400/50 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-blue-400/50 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-400/50 rounded-br-2xl"></div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl border border-purple-400/20 pointer-events-none" 
                 style={{
                   boxShadow: 'inset 0 0 20px rgba(147, 51, 234, 0.1), 0 0 40px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.1)'
                 }}>
            </div>
            
            {/* Content wrapper */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Créer un compte</h1>
                <p className="text-gray-300 text-xs md:text-sm">Rejoignez-nous et commencez votre expérience d'achat</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}

                {/* Full Name Input */}
                <div>
                  <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullname(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border ${
                        errors.fullName ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Entrez votre nom complet"
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border ${
                        errors.email ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Entrez votre email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 bg-slate-900/50 border ${
                        errors.password ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      placeholder="Créez un mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Role Select */}
                <div>
                  <label htmlFor="role" className="block text-white text-sm font-medium mb-2">
                    Rôle
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`w-full pl-4 pr-10 py-3 bg-slate-900/50 border ${
                        errors.role ? 'border-red-500' : 'border-white/20'
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer`}
                      required
                    >
                      <option value="" className="bg-slate-900 text-gray-400">Sélectionner un rôle</option>
                      <option value="client" className="bg-slate-900 text-white">Client</option>
                      <option value="seller" className="bg-slate-900 text-white">Vendeur</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">{errors.role}</p>
                  )}
                </div>

                {/* Create Account Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-500 hover:to-blue-500 hover:brightness-110 transition-all duration-200 shadow-lg shadow-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    'Créer un compte'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">ou</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button 
                  type="button"
                  className="w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  S'inscrire avec Google
                </button>
                
                <button 
                  type="button"
                  className="w-full bg-white text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  S'inscrire avec Facebook
                </button>
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm">
                  Vous avez déjà un compte ?{' '}
                  <Link 
                    to="/login" 
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero 3D Device - Right side on larger screens */}
        <div className="hidden xl:block">
          <Hero3DDevice position="right" />
        </div>
      </div>
    </div>
  );
};

export default Register;
