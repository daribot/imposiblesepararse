
import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Comment } from '@/types';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
}

export const CommentsSection = ({ postId, comments }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: user.name,
      createdAt: new Date(),
      postId
    };
    
    setLocalComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatDate = (date: Date) => {
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
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows={2}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                >
                  <Send size={14} />
                  <span>Comentar</span>
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
        {localComments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-2xl mb-2">💬</div>
            <p>No hay comentarios aún</p>
            <p className="text-xs">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {localComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {comment.content}
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
