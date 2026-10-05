import React, { useState, useEffect } from 'react';

// A larger pool of high-quality poster URLs for more variety.
const allPosterUrls = [
  'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJ9tj4R2E2h.jpg', // Demon Slayer
  'https://image.tmdb.org/t/p/w500/qBsEII33lFpLRl2w2g8L7nC21qs.jpg', // Dragon Ball Super
  'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg', // Your Name
  'https://image.tmdb.org/t/p/w500/v13BP5rA5S3sM2S2IvsbAOd2745.jpg', // Naruto
  'https://image.tmdb.org/t/p/w500/hFWLa6CvKkYgN389fFFfK6fAe82.jpg', // Jujutsu Kaisen
  'https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt848r5Ul0KjOR79.jpg', // One Piece
  'https://image.tmdb.org/t/p/w500/d3A9fht221T1JAbcO2T0a3EXaP7.jpg', // Attack on Titan
  'https://image.tmdb.org/t/p/w500/y5S3e1n93aae6QkI5s3sYQ10u32.jpg', // Bleach
  'https://image.tmdb.org/t/p/w500/fT2GNx7eA4iLIjffL4KACR2nB6o.jpg', // Spirited Away
  'https://image.tmdb.org/t/p/w500/3bsB4z2t200L6kMwrij5v3aGEs.jpg',  // My Hero Academia
  'https://image.tmdb.org/t/p/w500/oktctNkKYacxG0k39wV4iSTh610.jpg', // Chainsaw Man
  'https://image.tmdb.org/t/p/w500/f4aGynHS0SqMc3pbbg0L1n2A4jA.jpg'  // Spy x Family
];

// A fixed set of positions to ensure a balanced and aesthetic layout.
const posterPositions: React.CSSProperties[] = [
  { top: '5%', left: '10%', width: '15%' },
  { top: '50%', left: '5%', width: '12%' },
  { top: '15%', right: '8%', width: '18%' },
  { bottom: '10%', right: '12%', width: '16%' },
  { bottom: '5%', left: '25%', width: '14%' },
  { top: '60%', right: '30%', width: '13%' },
];

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface DisplayPoster {
  url: string;
  style: React.CSSProperties;
}

const AnimeBackground: React.FC = () => {
  const [displayPosters, setDisplayPosters] = useState<DisplayPoster[]>([]);

  useEffect(() => {
    // On component mount, shuffle the posters and select a subset to display.
    const shuffledUrls = shuffleArray(allPosterUrls);
    const selectedUrls = shuffledUrls.slice(0, posterPositions.length);

    const selectedPosters = selectedUrls.map((url, index) => ({
      url,
      style: {
        ...posterPositions[index],
        // Set a CSS custom property for rotation. This avoids overwriting the animation's transform.
        '--rotation': `${Math.random() * 20 - 10}deg`
      } as React.CSSProperties
    }));

    setDisplayPosters(selectedPosters);
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="background-poster-container" aria-hidden="true">
      {displayPosters.map((poster, index) => (
        <img
          key={index}
          src={poster.url}
          alt="" // Alt text is empty as these are decorative.
          className="background-poster rounded-lg shadow-2xl"
          style={poster.style}
        />
      ))}
    </div>
  );
};

export default AnimeBackground;