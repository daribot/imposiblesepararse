
import { useState, useEffect } from 'react';
import { User, Calendar, MessageCircle, Heart } from 'lucide-react';
import { Post } from '@/store/postStore';
import { CommentsSection } from './CommentsSection';
import { usePostStore } from '@/store/postStore';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { toggleLike, fetchComments, comments } = usePostStore();

  const postComments = comments[post.id] || [];

  const handleLike = async () => {
    if (!isLiked) {
      await toggleLike(post.id);
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments(post.id);
    }
    setShowComments(!showComments);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Sanitize content for display
  const sanitizedTitle = post.title.replace(/<[^>]*>/g, '');
  const sanitizedContent = post.content.replace(/<[^>]*>/g, '');

  return (
    <article className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author_name}</h4>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar size={12} />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
          {sanitizedTitle}
        </h3>
        
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {sanitizedContent}
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <button
            onClick={handleToggleComments}
            className="flex items-center space-x-2 px-3 py-1 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <MessageCircle size={16} />
            <span className="text-sm font-medium">{postComments.length}</span>
          </button>
        </div>
        
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          Leer más
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentsSection postId={post.id} />
      )}
    </article>
  );
};
