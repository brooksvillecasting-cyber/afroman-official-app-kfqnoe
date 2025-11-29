
import { useState, useEffect } from 'react';
import { getMovies, saveMovies, getMusicVideos, saveMusicVideos } from '@/utils/storage';
import { Movie, MusicVideo } from '@/types/Movie';
import { supabase } from '@/app/integrations/supabase/client';

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
};

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [musicVideos, setMusicVideos] = useState<MusicVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Try to load from Supabase first
      const { data: dbMovies, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbMovies && dbMovies.length > 0) {
        // Convert database format to app format
        const formattedMovies: Movie[] = dbMovies.map(movie => ({
          id: movie.id,
          title: movie.title,
          description: movie.description,
          videoUrl: movie.video_url,
          thumbnailUrl: movie.thumbnail_url,
          duration: movie.duration,
          uploadedAt: new Date(movie.uploaded_at),
          isNew: movie.is_new,
          isPremium: movie.is_premium,
        }));
        setMovies(formattedMovies);
        await saveMovies(formattedMovies);
      } else {
        // Fallback to local storage
        const moviesData = await getMovies();
        
        if (moviesData.length === 0) {
          // Initialize with sample movies (premium content)
          const sampleMovies: Movie[] = [
            {
              id: '1',
              title: 'Because I Got High - The Movie',
              description: 'The classic hit that started it all. Experience the story behind the Grammy-nominated song.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1574267432644-f610a4b6c7c8?w=800',
              duration: 180,
              uploadedAt: new Date(),
              isNew: true,
              isPremium: true,
            },
            {
              id: '2',
              title: 'Crazy Rap - Documentary',
              description: 'The controversial classic that made waves across the music industry.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
              duration: 240,
              uploadedAt: new Date(),
              isNew: true,
              isPremium: true,
            },
            {
              id: '3',
              title: 'Palmdale - The Journey',
              description: 'A journey through the streets of Palmdale with Afroman.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
              duration: 200,
              uploadedAt: new Date(),
              isNew: false,
              isPremium: true,
            },
            {
              id: '4',
              title: 'Premium Exclusive Content',
              description: 'Exclusive premium content available only to subscribers. Get access to behind-the-scenes footage and exclusive interviews.',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800',
              duration: 300,
              uploadedAt: new Date(),
              isNew: true,
              isPremium: true,
            },
          ];
          await saveMovies(sampleMovies);
          setMovies(sampleMovies);
        } else {
          setMovies(moviesData);
        }
      }

      // Load music videos from local storage
      const musicVideosData = await getMusicVideos();
      if (musicVideosData.length === 0) {
        // Initialize with only "Because I Got High" music video (free content)
        const sampleMusicVideos: MusicVideo[] = [
          {
            id: 'mv1',
            title: 'Because I Got High',
            artist: 'Afroman',
            youtubeId: 'WeYsTmIzjkw',
            thumbnailUrl: getYouTubeThumbnail('WeYsTmIzjkw'),
            duration: 195,
            addedAt: new Date(),
          },
        ];
        await saveMusicVideos(sampleMusicVideos);
        setMusicVideos(sampleMusicVideos);
      } else {
        setMusicVideos(musicVideosData);
      }
    } catch (error) {
      console.log('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie: Movie) => {
    try {
      const updatedMovies = [...movies, movie];
      await saveMovies(updatedMovies);
      setMovies(updatedMovies);
      console.log('Movie added successfully:', movie.title);
    } catch (error) {
      console.log('Error adding movie:', error);
      throw error;
    }
  };

  const deleteMovie = async (movieId: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);

      if (error) {
        console.log('Error deleting from database:', error);
      }

      // Delete from local storage
      const updatedMovies = movies.filter(m => m.id !== movieId);
      await saveMovies(updatedMovies);
      setMovies(updatedMovies);
      console.log('Movie deleted successfully:', movieId);
    } catch (error) {
      console.log('Error deleting movie:', error);
      throw error;
    }
  };

  const addMusicVideo = async (musicVideo: MusicVideo) => {
    try {
      // Ensure thumbnail URL is set from YouTube
      const videoWithThumbnail = {
        ...musicVideo,
        thumbnailUrl: getYouTubeThumbnail(musicVideo.youtubeId),
      };
      const updatedMusicVideos = [...musicVideos, videoWithThumbnail];
      await saveMusicVideos(updatedMusicVideos);
      setMusicVideos(updatedMusicVideos);
      console.log('Music video added successfully:', musicVideo.title);
    } catch (error) {
      console.log('Error adding music video:', error);
      throw error;
    }
  };

  const deleteMusicVideo = async (videoId: string) => {
    try {
      const updatedMusicVideos = musicVideos.filter(v => v.id !== videoId);
      await saveMusicVideos(updatedMusicVideos);
      setMusicVideos(updatedMusicVideos);
      console.log('Music video deleted successfully:', videoId);
    } catch (error) {
      console.log('Error deleting music video:', error);
      throw error;
    }
  };

  return { 
    movies, 
    musicVideos,
    loading, 
    addMovie, 
    deleteMovie,
    addMusicVideo,
    deleteMusicVideo,
    refreshMovies: loadContent 
  };
};
