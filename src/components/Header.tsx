
import { useState, useEffect } from 'react';
import { LogIn, Plus, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  onAuthClick: () => void;
  onCreatePost: () => void;
}

export const Header = ({ onAuthClick, onCreatePost }: HeaderProps) => {
  const { user, logout, loading, initialize } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">BlogCommunity</h1>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">BlogCommunity</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Inicio
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Explorar
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Comunidad
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={onCreatePost}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Crear Post</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="hidden sm:inline text-gray-700 font-medium">
                      {userName}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900">{userName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <LogIn size={16} />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
