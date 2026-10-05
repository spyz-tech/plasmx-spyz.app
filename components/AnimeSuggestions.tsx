import React, { useState } from 'react';

export interface AnimeStylePoster {
  name: string;
  series: string;
  tagline: string;
  styleDescription: string;
  posterUrl: string;
  tags: string[];
}

export const ANIME_POSTERS: AnimeStylePoster[] = [
  {
    name: 'Demon Slayer',
    series: 'Kimetsu no Yaiba',
    tagline: 'Ufotable breathing ink & vibrant elemental flourishes',
    styleDescription: 'Bold black contour lines with Ukiyo-e woodblock wave/fire aesthetics, vibrant gradient eyes, and ornate traditional haori patterns.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/xUfRZu2mi8jH6SzQEJ9tj4R2E2h.jpg',
    tags: ['Ukiyo-e', 'Breathing Ink', 'High Contrast'],
  },
  {
    name: 'Jujutsu Kaisen',
    series: 'Jujutsu Kaisen',
    tagline: 'MAPPA gritty cursed energy & slick modern lines',
    styleDescription: 'Sharp angular ink strokes, intense shadow gradients, deep purple and dark blues with electric cursed energy lighting.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/hFWLa6CvKkYgN389fFFfK6fAe82.jpg',
    tags: ['MAPPA', 'Sharp Ink', 'Cursed Energy'],
  },
  {
    name: 'Your Name',
    series: 'Kimi no Na wa',
    tagline: 'Makoto Shinkai ethereal skies & hyper-detailed lighting',
    styleDescription: 'Lush photorealistic background illumination, pastel twilight sunset gradients, soft lens flares, and expressive emotional eyes.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/q719jXXEzOoYaps6babgKnONONX.jpg',
    tags: ['Makoto Shinkai', 'Ethereal Light', 'Cinematic'],
  },
  {
    name: 'Attack on Titan',
    series: 'Shingeki no Kyojin',
    tagline: 'Wit / MAPPA heavy outlines & dramatic visceral shading',
    styleDescription: 'Extremely thick, gritty cross-hatch ink outlines, cinematic sepia and emerald battle tones with intense dramatic facial shading.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/d3A9fht221T1JAbcO2T0a3EXaP7.jpg',
    tags: ['Dark Fantasy', 'Heavy Outlines', 'Visceral'],
  },
  {
    name: 'One Piece',
    series: 'One Piece (Wano Arc)',
    tagline: 'Toei modern festival colors & fluid calligraphy curves',
    styleDescription: 'Expressive comic exaggeration, energetic calligraphy strokes, saturated primary colors, and bold heroic poses.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/e3NBGiAifW9Xt848r5Ul0KjOR79.jpg',
    tags: ['Dynamic Shonen', 'Calligraphy', 'Vibrant'],
  },
  {
    name: 'Dragon Ball Super',
    series: 'Dragon Ball Super: Broly',
    tagline: 'Naohiro Shintani fluid 90s linework & radiant ki aura',
    styleDescription: 'Softer modern vintage lines, radiant ki aura glows, high-energy muscular definition, and bold comic cel-shading.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qBsEII33lFpLRl2w2g8L7nC21qs.jpg',
    tags: ['Cel-Shaded', 'Ki Aura', 'Classic Shonen'],
  },
  {
    name: 'Naruto',
    series: 'Naruto Shippuden',
    tagline: 'Studio Pierrot classic ninja scroll & earthy tones',
    styleDescription: 'Iconic Kishimoto manga ink hatching, dynamic speed lines, headband metal reflections, and warm earthy battle tones.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/v13BP5rA5S3sM2S2IvsbAOd2745.jpg',
    tags: ['Ninja Ink', 'Manga Hatching', 'Pierrot'],
  },
  {
    name: 'Bleach',
    series: 'Thousand-Year Blood War',
    tagline: 'Tite Kubo high-fashion streetwear & razor-sharp contrast',
    styleDescription: 'Ultra-stylized black ink silhouettes, high-fashion angles, stark monochromatic starkness with neon spiritual weapon flashes.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/y5S3e1n93aae6QkI5s3sYQ10u32.jpg',
    tags: ['Razor Sharp', 'High Fashion', 'Monochrome'],
  },
  {
    name: 'Chainsaw Man',
    series: 'Chainsaw Man',
    tagline: 'Cinematic grindhouse indie grain & raw energetic brushes',
    styleDescription: 'Raw, unpolished brush strokes with film grain, desaturated gritty urban realism, and chaotic visceral splash effects.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/oktctNkKYacxG0k39wV4iSTh610.jpg',
    tags: ['Grindhouse', 'Raw Brush', 'Film Grain'],
  },
  {
    name: 'Spirited Away',
    series: 'Studio Ghibli',
    tagline: 'Hayao Miyazaki hand-painted watercolor & whimsical charm',
    styleDescription: 'Gentle organic hand-drawn outlines, hand-painted gouache/watercolor textures, warm nostalgic palette with timeless charm.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/fT2GNx7eA4iLIjffL4KACR2nB6o.jpg',
    tags: ['Ghibli', 'Watercolor', 'Hand-drawn'],
  },
  {
    name: 'Spy x Family',
    series: 'Spy x Family',
    tagline: 'CloverWorks/Wit mid-century retro comic & crisp pastel pop',
    styleDescription: 'Clean retro 60s illustration aesthetic, subtle pastel halftones, humorous comic expressions, and crisp charming silhouettes.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/f4aGynHS0SqMc3pbbg0L1n2A4jA.jpg',
    tags: ['Retro Comic', 'Pastel Pop', 'Clean Linework'],
  },
  {
    name: 'My Hero Academia',
    series: 'Boku no Hero Academia',
    tagline: 'American comic book typography meets modern Japanese manga',
    styleDescription: 'Western comic ben-day dots, heavy impact shadows, onomatopoeia sound effect linework, and vibrant superhero neon.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/3bsB4z2t200L6kMwrij5v3aGEs.jpg',
    tags: ['Comic Ben-Day', 'Superhero Pop', 'Sound Effects'],
  },
];

interface AnimeSuggestionsProps {
  selectedAnime?: string;
  onSelect: (animeName: string) => void;
}

const AnimeSuggestions: React.FC<AnimeSuggestionsProps> = ({ selectedAnime = '', onSelect }) => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Find currently active poster based on selectedAnime string
  const activePoster =
    ANIME_POSTERS.find(
      (p) =>
        p.name.toLowerCase() === selectedAnime.toLowerCase() ||
        p.series.toLowerCase().includes(selectedAnime.toLowerCase()) ||
        selectedAnime.toLowerCase().includes(p.name.toLowerCase())
    ) || ANIME_POSTERS[0]; // default to Demon Slayer if empty or custom

  return (
    <div className="space-y-4">
      {/* FULL POSTER SPOTLIGHT CARD */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-950/40 to-gray-900 border-2 border-purple-500/50 rounded-2xl p-4 shadow-xl shadow-purple-950/50 relative overflow-hidden">
        {/* Brush stroke comic badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-comic text-xs uppercase px-2.5 py-1 rounded tracking-wide shadow">
              ⚡ Loaded Style Poster
            </span>
            <span className="text-xs text-purple-300 font-comic-body hidden sm:inline">
              Complete reference artwork
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPosterModalOpen(true)}
            className="text-xs font-brush text-purple-400 hover:text-purple-200 underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>🔍 View Full Poster</span>
          </button>
        </div>

        {/* Poster & Style Details in 2-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Full vertical poster image (aspect 2/3) */}
          <div className="sm:col-span-5 flex justify-center">
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="relative group cursor-pointer w-full max-w-[200px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-purple-400/60 shadow-2xl shadow-purple-950/80 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={activePoster.posterUrl}
                alt={`${activePoster.name} Full Poster`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <span className="self-end bg-purple-700/80 text-white text-[10px] font-comic px-1.5 py-0.5 rounded">
                  CLICK TO EXPAND
                </span>
                <p className="text-white text-xs font-brush text-center">{activePoster.name}</p>
              </div>
            </div>
          </div>

          {/* Details & description */}
          <div className="sm:col-span-7 space-y-2.5">
            <div>
              <h4 className="text-2xl font-brush text-purple-200 drop-shadow">
                {activePoster.name}
              </h4>
              <p className="text-xs font-comic text-purple-400 tracking-wider">
                {activePoster.series.toUpperCase()}
              </p>
            </div>

            <p className="text-xs text-amber-300 font-comic-body italic border-l-2 border-amber-400 pl-2">
              "{activePoster.tagline}"
            </p>

            <p className="text-xs text-gray-300 font-comic-body leading-relaxed bg-black/40 p-2.5 rounded-lg border border-gray-800">
              {activePoster.styleDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activePoster.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-comic bg-purple-900/60 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POSTER GALLERY SHELF */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-brush text-purple-300">
            🎨 Choose From Full Anime Posters ({ANIME_POSTERS.length})
          </label>
          <span className="text-[11px] text-gray-400 font-comic-body">
            Click poster to load style
          </span>
        </div>

        {/* Scrollable / grid shelf of full vertical posters */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
          {ANIME_POSTERS.map((anime) => {
            const isSelected =
              activePoster.name.toLowerCase() === anime.name.toLowerCase() ||
              selectedAnime.toLowerCase() === anime.name.toLowerCase();

            return (
              <button
                key={anime.name}
                type="button"
                onClick={() => onSelect(anime.name)}
                className={`relative group rounded-xl overflow-hidden transition-all duration-200 text-left cursor-pointer flex flex-col ${
                  isSelected
                    ? 'ring-3 ring-purple-400 border-2 border-white shadow-lg shadow-purple-600/50 scale-[1.03]'
                    : 'border-2 border-gray-700/80 hover:border-purple-400/80 opacity-80 hover:opacity-100 hover:-translate-y-1'
                }`}
                title={`Load full ${anime.name} poster style`}
              >
                {/* Full poster image maintaining aspect 2/3 */}
                <div className="w-full aspect-[2/3] relative overflow-hidden bg-gray-950">
                  <img
                    src={anime.posterUrl}
                    alt={`${anime.name} Poster`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md">
                      ✓
                    </div>
                  )}
                </div>

                {/* Poster Caption */}
                <div className="p-1.5 bg-gray-900/95 border-t border-gray-800">
                  <p className="text-white text-[11px] font-brush truncate text-center">
                    {anime.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL POSTER LIGHTBOX MODAL */}
      {isPosterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-gray-900 border-2 border-purple-500 rounded-2xl p-4 shadow-2xl shadow-purple-900/80 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-brush text-purple-200">{activePoster.name}</h3>
                <p className="text-xs font-comic text-gray-400">Full Poster Reference Artwork</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg bg-gray-800 hover:bg-gray-700"
              >
                ✕
              </button>
            </div>

            {/* High-res poster container */}
            <div className="mt-3 flex justify-center">
              <img
                src={activePoster.posterUrl}
                alt={`${activePoster.name} Full Size Poster`}
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-2xl border border-purple-400/40"
              />
            </div>

            {/* Modal footer with style advice */}
            <div className="mt-3 text-center">
              <p className="text-xs text-purple-300 font-comic-body">
                {activePoster.styleDescription}
              </p>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="mt-3 px-6 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-comic text-sm rounded-lg"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeSuggestions;
