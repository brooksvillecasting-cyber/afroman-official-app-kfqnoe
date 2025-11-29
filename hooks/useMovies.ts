
import { useState, useEffect } from 'react';
import { getMovies, saveMovies, getMusicVideos, saveMusicVideos } from '@/utils/storage';
import { Movie, MusicVideo } from '@/types/Movie';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [musicVideos, setMusicVideos] = useState<MusicVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const moviesData = await getMovies();
      const musicVideosData = await getMusicVideos();
      
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
        ];
        await saveMovies(sampleMovies);
        setMovies(sampleMovies);
      } else {
        setMovies(moviesData);
      }

      if (musicVideosData.length === 0) {
        // Initialize with sample music videos (free content)
        const sampleMusicVideos: MusicVideo[] = [
          {
            id: 'mv1',
            title: 'Because I Got High',
            artist: 'Afroman',
            youtubeId: 'WeYsTmIzjkw',
            thumbnailUrl: 'https://img.youtube.com/vi/WeYsTmIzjkw/maxresdefault.jpg',
            duration: 195,
            addedAt: new Date(),
          },
          {
            id: 'mv2',
            title: 'Crazy Rap',
            artist: 'Afroman',
            youtubeId: 'WXzFCS72QIA',
            thumbnailUrl: 'https://img.youtube.com/vi/WXzFCS72QIA/maxresdefault.jpg',
            duration: 240,
            addedAt: new Date(),
          },
          {
            id: 'mv3',
            title: 'Palmdale',
            artist: 'Afroman',
            youtubeId: 'YvPHKVeWlLU',
            thumbnailUrl: 'https://img.youtube.com/vi/YvPHKVeWlLU/maxresdefault.jpg',
            duration: 210,
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
    const updatedMovies = [...movies, movie];
    await saveMovies(updatedMovies);
    setMovies(updatedMovies);
  };

  const deleteMovie = async (movieId: string) => {
    const updatedMovies = movies.filter(m => m.id !== movieId);
    await saveMovies(updatedMovies);
    setMovies(updatedMovies);
  };

  const addMusicVideo = async (musicVideo: MusicVideo) => {
    const updatedMusicVideos = [...musicVideos, musicVideo];
    await saveMusicVideos(updatedMusicVideos);
    setMusicVideos(updatedMusicVideos);
  };

  const deleteMusicVideo = async (videoId: string) => {
    const updatedMusicVideos = musicVideos.filter(v => v.id !== videoId);
    await saveMusicVideos(updatedMusicVideos);
    setMusicVideos(updatedMusicVideos);
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
