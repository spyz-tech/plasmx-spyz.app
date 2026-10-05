import React, { useState, useCallback, useEffect } from 'react';
import { Feature } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { findSimilarAnimeCharacter, transformImage } from './services/geminiService';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ShareIcon from './components/icons/ShareIcon';
import { CopyIcon, CheckIcon } from './components/icons/CopyIcon';
import AnimeBackground from './components/AnimeBackground';
import AnimeSuggestions from './components/AnimeSuggestions';
import ShareModal from './components/ShareModal';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.AnimeMate);
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [animeName, setAnimeName] = useState<string>('');
  const [matchStrictness, setMatchStrictness] = useState<'resemblance' | 'exact'>('resemblance');
  const [limitToAnimeSeries, setLimitToAnimeSeries] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [characterInfo, setCharacterInfo] = useState<{ name: string; series: string } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [quickLinkCopied, setQuickLinkCopied] = useState<boolean>(false);

  // Check URL query parameters on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const animeParam = params.get('anime');
      const seriesParam = params.get('series');
      if (animeParam) {
        setActiveFeature(Feature.ArtStyler);
        setAnimeName(animeParam);
      } else if (seriesParam) {
        setActiveFeature(Feature.AnimeMate);
        setLimitToAnimeSeries(seriesParam);
      }
    }
  }, []);

  const resetState = () => {
    setError(null);
    setGeneratedImageUrl(null);
    setCharacterInfo(null);
    setIsShareModalOpen(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetState();
      setSourceImageFile(file);
      setSourceImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!sourceImageFile) {
      setError('Please upload an image first.');
      return;
    }

    if (activeFeature === Feature.ArtStyler && !animeName.trim()) {
      setError('Please enter an anime name for the art style.');
      return;
    }

    resetState();
    setIsLoading(true);

    try {
      const base64Image = await fileToBase64(sourceImageFile);
      const mimeType = sourceImageFile.type;

      if (activeFeature === Feature.AnimeMate) {
        setLoadingMessage('Finding your anime twin...');
        const char = await findSimilarAnimeCharacter(base64Image, mimeType, matchStrictness, limitToAnimeSeries);

        if (char.character_name === 'No Match Found') {
            setError(`Could not find a suitable character in "${char.series_name}". Try another series or leave the field blank.`);
            setIsLoading(false);
            return;
        }

        setCharacterInfo({ name: char.character_name, series: char.series_name });

        setLoadingMessage('Transforming your image...');
        const prompt = `Transform the person in the provided image to look like ${char.character_name} from the anime series "${char.series_name}". Adopt that specific anime's art style while retaining the original person's key facial features. If the character has iconic accessories or features (like a specific uniform, scar, or headwear), include them in the transformation. The final image should be a high-quality, stylized portrait.`;
        const generatedImage = await transformImage(base64Image, mimeType, prompt);
        setGeneratedImageUrl(`data:image/png;base64,${generatedImage}`);

      } else if (activeFeature === Feature.ArtStyler) {
        setLoadingMessage(`Creating ${animeName} style portrait...`);
        const prompt = `Transform the person in the image into the art style of the anime "${animeName}". The transformation should be significant, adopting the line work, color palette, and character design philosophy of that series, while still being recognizable as the original person.`;
        const generatedImage = await transformImage(base64Image, mimeType, prompt);
        setGeneratedImageUrl(`data:image/png;base64,${generatedImage}`);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [sourceImageFile, activeFeature, animeName, matchStrictness, limitToAnimeSeries]);

  const renderFeatureControls = () => {
    if (activeFeature === Feature.AnimeMate) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-brush text-purple-300 mb-2">Match Strictness</label>
            <div className="flex bg-gray-700/80 rounded-lg p-1 border border-gray-600">
              <button
                type="button"
                onClick={() => setMatchStrictness('resemblance')}
                className={`w-1/2 py-2 text-sm rounded-md font-comic tracking-wide transition-colors ${matchStrictness === 'resemblance' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}
              >
                Strong Resemblance
              </button>
              <button
                type="button"
                onClick={() => setMatchStrictness('exact')}
                className={`w-1/2 py-2 text-sm rounded-md font-comic tracking-wide transition-colors ${matchStrictness === 'exact' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600'}`}
              >
                Exact Doppelganger
              </button>
            </div>
          </div>
          <div>
              <label htmlFor="anime-series" className="block text-sm font-brush text-purple-300 mb-2">
                Limit to Anime Series (Optional)
              </label>
              <input
                id="anime-series"
                type="text"
                value={limitToAnimeSeries}
                onChange={(e) => setLimitToAnimeSeries(e.target.value)}
                placeholder="e.g., Attack on Titan, Naruto, Bleach..."
                className="w-full bg-gray-700/80 border border-gray-600 text-white rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 font-comic-body"
              />
          </div>
        </div>
      );
    }
    if (activeFeature === Feature.ArtStyler) {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="anime-name" className="block text-sm font-brush text-purple-300 mb-2">
              Anime Art Style Name or Custom Style
            </label>
            <input
              id="anime-name"
              type="text"
              value={animeName}
              onChange={(e) => setAnimeName(e.target.value)}
              placeholder="e.g., Demon Slayer, Your Name, Jujutsu Kaisen..."
              className="w-full bg-gray-700/80 border border-gray-600 text-white rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 font-comic-body"
            />
          </div>
          <AnimeSuggestions selectedAnime={animeName} onSelect={setAnimeName} />
        </div>
      );
    }
    return null;
  };
  
  const handleQuickCopyLink = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setQuickLinkCopied(true);
      setTimeout(() => setQuickLinkCopied(false), 2500);
    } catch {
      setIsShareModalOpen(true);
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <Loader message={loadingMessage} />;
    }
    if (error) {
      return <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg text-red-300">{error}</div>;
    }
    if (!generatedImageUrl && !characterInfo) {
      return (
        <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg text-gray-400">
          Your masterpiece will appear here...
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {characterInfo && (
          <div className="text-center bg-gray-800 p-4 rounded-xl border border-purple-500/30 shadow-lg">
            <h3 className="text-2xl font-brush text-purple-300">Your Anime Mate is...</h3>
            <p className="text-4xl font-brush text-amber-300 mt-2">{characterInfo.name}</p>
            <p className="text-lg font-comic text-purple-200">from "{characterInfo.series}"</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center">
                <h4 className="font-brush text-lg text-gray-300 mb-2">Original</h4>
                {sourceImageUrl && <img src={sourceImageUrl} alt="Source" className="rounded-lg shadow-lg mx-auto w-full max-w-sm" />}
            </div>
            <div className="text-center">
                <h4 className="font-brush text-lg text-purple-300 mb-2">
                    {activeFeature === Feature.AnimeMate ? 'Your Anime Form' : 'Styled Portrait'}
                </h4>
                {generatedImageUrl ? (
                    <div className="relative group overflow-hidden rounded-lg shadow-lg mx-auto w-full max-w-sm">
                        <img src={generatedImageUrl} alt="Generated" className="rounded-lg shadow-lg mx-auto w-full max-w-sm" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                aria-label="Share Image"
                                title="Share"
                            >
                                <ShareIcon className="w-6 h-6" />
                            </button>
                            <a
                                href={generatedImageUrl}
                                download={`anime-style-${Date.now()}.png`}
                                className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                aria-label="Download Image"
                                title="Download"
                            >
                                <DownloadIcon className="w-6 h-6 text-white" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-sm h-auto aspect-square bg-gray-700 rounded-lg flex items-center justify-center mx-auto">
                        <p className="text-gray-400 font-comic-body">Image not generated.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Action Toolbar for Sharing & Downloading */}
        {generatedImageUrl && (
          <div className="bg-gray-900/90 border border-purple-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-sm font-semibold text-purple-200 font-comic">
                  Ready to share your look!
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Primary Share Button */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-purple-900/40 transition-all font-comic cursor-pointer"
                >
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Quick Copy Link Button */}
                <button
                  onClick={handleQuickCopyLink}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-sm font-comic transition-all cursor-pointer ${
                    quickLinkCopied
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-gray-800 hover:bg-gray-750 border-gray-700 text-gray-200 hover:text-white'
                  }`}
                  title="Copy link to clipboard"
                >
                  {quickLinkCopied ? (
                    <>
                      <CheckIcon className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-4 h-4 text-purple-300" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Direct Download Button */}
                <a
                  href={generatedImageUrl}
                  download={`anime-style-${Date.now()}.png`}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-200 hover:text-white text-sm font-comic rounded-lg transition-colors cursor-pointer"
                  title="Download Image"
                >
                  <DownloadIcon className="w-4 h-4 text-purple-300" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimeBackground />
      <main className="relative z-10 container mx-auto p-4 md:p-8 text-white">
        <div className="max-w-4xl mx-auto bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden border border-gray-700">
          <header className="p-6 text-center border-b border-gray-700">
            <h1 className="text-4xl md:text-5xl font-bold font-brush text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200">
              plasmx/spyz
            </h1>
            <p className="mt-2 text-purple-300 font-comic tracking-wider text-base md:text-lg">
              💥 FIND YOUR ANIME MATE & TRANSFORM YOUR ART STYLE 💥
            </p>
          </header>
          
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <div className="flex border-b-2 border-gray-700">
                <button
                  onClick={() => { resetState(); setActiveFeature(Feature.AnimeMate); }}
                  className={`flex-1 py-3 text-lg font-brush transition-colors duration-300 cursor-pointer ${activeFeature === Feature.AnimeMate ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Find Your Anime Mate
                </button>
                <button
                  onClick={() => {
                    resetState();
                    setActiveFeature(Feature.ArtStyler);
                    if (!animeName) setAnimeName('Demon Slayer');
                  }}
                  className={`flex-1 py-3 text-lg font-brush transition-colors duration-300 cursor-pointer ${activeFeature === Feature.ArtStyler ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
                >
                  Anime Art Styler
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls Section */}
              <div className="space-y-6">
                 <div>
                    <label htmlFor="image-upload" className="block text-lg font-brush text-purple-300 mb-2">
                        1. Upload Your Photo
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-900/40">
                        <div className="space-y-1 text-center">
                            {sourceImageUrl ? (
                                <img src={sourceImageUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md border-2 border-purple-500/50" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-gray-400 justify-center font-comic-body">
                                <label htmlFor="image-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-purple-500 px-2.5 py-1">
                                    <span>Upload a photo</span>
                                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="pl-1">or drag & drop</p>
                            </div>
                            <p className="text-xs text-gray-500 font-comic-body">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                    </div>
                 </div>

                 <div>
                    <h3 className="text-lg font-brush text-purple-300 mb-2">
                        2. Configure
                    </h3>
                    {renderFeatureControls()}
                 </div>

                 <button
                    onClick={handleSubmit}
                    disabled={isLoading || !sourceImageFile}
                    className="w-full flex items-center justify-center gap-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-comic text-xl tracking-wider py-4 px-4 rounded-xl transition-all duration-300 shadow-xl disabled:cursor-not-allowed cursor-pointer comic-box-shadow"
                 >
                    <SparklesIcon className="w-6 h-6"/>
                    {isLoading ? 'GENERATING ARTWORK...' : '⚡ START TRANSFORMATION ⚡'}
                 </button>
              </div>

              {/* Results Section */}
              <div className="mt-6 lg:mt-0">
                <h3 className="text-lg font-brush text-purple-300 mb-2 text-center">
                    3. Result
                </h3>
                {renderResults()}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Share Modal Dialog */}
      {generatedImageUrl && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          imageUrl={generatedImageUrl}
          characterInfo={characterInfo}
          activeFeature={activeFeature}
          animeName={animeName}
        />
      )}
    </>
  );
};

export default App;
