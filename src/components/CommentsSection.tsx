
import { useState } from 'react';
import { Send, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePostStore } from '@/store/postStore';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { comments, addComment } = usePostStore();

  const postComments = comments[postId] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newComment.trim()) return;
    
    setError('');
    setLoading(true);
    
    try {
      const result = await addComment(postId, newComment);
      
      if (result.error) {
        setError(result.error);
      } else {
        setNewComment('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="border-t bg-gray-50">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="p-4 border-b">
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-xs">{error}</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Escribe tu comentario..."
                rows={2}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                disabled={loading}
                maxLength={1000}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Send size={14} />
                  <span>{loading ? 'Enviando...' : 'Comentar'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm border-b">
          Inicia sesión para comentar
        </div>
      )}

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        {postComments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-2xl mb-2">💬</div>
            <p>No hay comentarios aún</p>
            <p className="text-xs">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {comment.author_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
