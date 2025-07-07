
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { AuthModal } from '@/components/AuthModal';
import { CreatePostModal } from '@/components/CreatePostModal';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuthStore();
  const { posts, loading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header onAuthClick={() => setShowAuthModal(true)} onCreatePost={handleCreatePost} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onAuthClick={() => setShowAuthModal(true)} onCreatePost={handleCreatePost} />
      
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Comparte tus ideas con la 
            <span className="text-blue-600"> comunidad</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Un espacio donde las ideas cobran vida. Conecta, aprende y comparte conocimiento con otros apasionados.
          </p>
          <button
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            ✨ Crear tu primer post
          </button>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">📰 Últimas Charlas</h2>
          <span className="text-gray-500">{posts.length} posts</span>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              ¡Sé el primero en compartir!
            </h3>
            <p className="text-gray-500 mb-6">
              No hay posts aún. ¿Por qué no empiezas la conversación?
            </p>
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Crear el primer post
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <CreatePostModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default Index;
