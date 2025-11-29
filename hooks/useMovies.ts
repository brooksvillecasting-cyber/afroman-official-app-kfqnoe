
import { useState, useEffect } from 'react';
import { getMovies, saveMovies } from '@/utils/storage';
import { Movie } from '@/types/Movie';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const moviesData = await getMovies();
      if (moviesData.length === 0) {
        // Initialize with sample movies
        const sampleMovies: Movie[] = [
          {
            id: '1',
            title: 'Because I Got High',
            description: 'The classic hit that started it all. Experience the story behind the Grammy-nominated song.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1574267432644-f610a4b6c7c8?w=800',
            duration: 180,
            uploadedAt: new Date(),
            isNew: true,
          },
          {
            id: '2',
            title: 'Crazy Rap',
            description: 'The controversial classic that made waves across the music industry.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
            duration: 240,
            uploadedAt: new Date(),
            isNew: true,
          },
          {
            id: '3',
            title: 'Palmdale',
            description: 'A journey through the streets of Palmdale with Afroman.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
            duration: 200,
            uploadedAt: new Date(),
            isNew: false,
          },
        ];
        await saveMovies(sampleMovies);
        setMovies(sampleMovies);
      } else {
        setMovies(moviesData);
      }
    } catch (error) {
      console.log('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie: Movie) => {
    const updatedMovies = [...movies, movie];
    await saveMovies(updatedMovies);
    setMovies(updatedMovies);
  };

  const deleteMovie = async (movieId: string) => {
    const updatedMovies = movies.filter(m => m.id !== movieId);
    await saveMovies(updatedMovies);
    setMovies(updatedMovies);
  };

  return { movies, loading, addMovie, deleteMovie, refreshMovies: loadMovies };
};
