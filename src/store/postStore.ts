
import { create } from 'zustand';
import { Post } from '@/types';

interface PostState {
  posts: Post[];
  loading: boolean;
  createPost: (postData: { title: string; content: string; author: string }) => void;
  fetchPosts: () => void;
}

// Mock data inicial
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Bienvenidos a nuestra comunidad',
    content: 'Este es el primer post de nuestra comunidad. Aquí podremos compartir ideas, experiencias y conocimientos. ¡Esperamos que disfruten de esta plataforma!',
    author: 'Admin',
    createdAt: new Date('2024-01-15T10:30:00'),
    likes: 12,
    comments: [
      {
        id: '1',
        content: '¡Qué emocionante! Muchas gracias por crear esta comunidad.',
        author: 'María García',
        createdAt: new Date('2024-01-15T11:00:00'),
        postId: '1'
      },
      {
        id: '2',
        content: 'Estoy ansioso por ver qué tipo de contenido compartiremos aquí.',
        author: 'Carlos López',
        createdAt: new Date('2024-01-15T11:30:00'),
        postId: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Tips para escribir mejores posts',
    content: 'Escribir un buen post requiere claridad, estructura y pasión. Aquí algunos consejos: 1) Usa un título atractivo, 2) Estructura tu contenido en párrafos, 3) Incluye ejemplos, 4) Termina con una pregunta para generar conversación.',
    author: 'Ana Martínez',
    createdAt: new Date('2024-01-14T15:45:00'),
    likes: 8,
    comments: [
      {
        id: '3',
        content: 'Excelentes consejos, los aplicaré en mi próximo post.',
        author: 'Roberto Silva',
        createdAt: new Date('2024-01-14T16:00:00'),
        postId: '2'
      }
    ]
  },
  {
    id: '3',
    title: 'La importancia de la comunidad en el aprendizaje',
    content: 'Aprender en comunidad nos permite crecer más rápido. Cuando compartimos conocimiento y experiencias, todos salimos beneficiados. Las preguntas de otros nos hacen reflexionar y las respuestas que damos consolidan nuestro propio aprendizaje.',
    author: 'Luis Rodríguez',
    createdAt: new Date('2024-01-13T09:20:00'),
    likes: 15,
    comments: []
  }
];

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: true,
  
  fetchPosts: () => {
    set({ loading: true });
    // Simulación de carga de datos
    setTimeout(() => {
      set({ 
        posts: mockPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        loading: false 
      });
    }, 1000);
  },
  
  createPost: (postData) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title: postData.title,
      content: postData.content,
      author: postData.author,
      createdAt: new Date(),
      likes: 0,
      comments: []
    };
    
    const currentPosts = get().posts;
    set({ 
      posts: [newPost, ...currentPosts]
    });
  }
}));
