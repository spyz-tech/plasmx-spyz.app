import React, { useState, useEffect } from 'react';
import { Feature } from '../types';
import ShareIcon from './icons/ShareIcon';
import { CopyIcon, CheckIcon } from './icons/CopyIcon';
import DownloadIcon from './icons/DownloadIcon';
import {
  TwitterXIcon,
  WhatsAppIcon,
  RedditIcon,
  TelegramIcon,
  FacebookIcon,
} from './icons/SocialIcons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  characterInfo: { name: string; series: string } | null;
  activeFeature: Feature;
  animeName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  characterInfo,
  activeFeature,
  animeName,
}) => {
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [copyImageSuccess, setCopyImageSuccess] = useState(false);
  const [copyTextSuccess, setCopyTextSuccess] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Determine share text and title
  const shareTitle =
    activeFeature === Feature.AnimeMate && characterInfo
      ? `My Anime Twin: ${characterInfo.name} from "${characterInfo.series}"!`
      : activeFeature === Feature.ArtStyler && animeName
      ? `My Anime Portrait in ${animeName} Style!`
      : 'My Anime Transformation via plasmx/spyz!';

  const shareText =
    activeFeature === Feature.AnimeMate && characterInfo
      ? `I found my anime twin: ${characterInfo.name} from "${characterInfo.series}" using plasmx/spyz! 🎭✨ Find yours here:`
      : activeFeature === Feature.ArtStyler && animeName
      ? `Transformed my photo into "${animeName}" anime style using plasmx/spyz! 🎨✨ Check it out:`
      : `Check out my anime AI transformation created with plasmx/spyz! ✨`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Check native share support on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert base64 data URL to Blob
  const getBlobFromImageUrl = async (): Promise<Blob> => {
    const res = await fetch(imageUrl);
    return await res.blob();
  };

  // Copy Link Handler
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyLinkSuccess(true);
      setStatusMessage('Link copied to clipboard!');
      setTimeout(() => {
        setCopyLinkSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
      setStatusMessage('Failed to copy link. Please manually copy it.');
    }
  };

  // Copy Image directly to Clipboard
  const handleCopyImage = async () => {
    try {
      setStatusMessage('Copying image...');
      const blob = await getBlobFromImageUrl();
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopyImageSuccess(true);
        setStatusMessage('Image copied to clipboard! You can paste it anywhere.');
        setTimeout(() => {
          setCopyImageSuccess(false);
          setStatusMessage(null);
        }, 3000);
      } else {
        throw new Error('ClipboardItem not supported in this browser');
      }
    } catch (err) {
      console.error('Failed to copy image', err);
      setStatusMessage('Image copying not supported in this browser. Use Download instead.');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Copy Caption / text
  const handleCopyText = async () => {
    try {
      const fullText = `${shareText} ${shareUrl}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyTextSuccess(true);
      setStatusMessage('Caption copied to clipboard!');
      setTimeout(() => {
        setCopyTextSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Device Native Share (with image file if supported)
  const handleNativeShare = async () => {
    try {
      setStatusMessage('Preparing share...');
      const blob = await getBlobFromImageUrl();
      const file = new File([blob], 'anime-portrait.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
          files: [file],
        });
        setStatusMessage(null);
      } else {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n${shareUrl}`,
          url: shareUrl,
        });
        setStatusMessage(null);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        setStatusMessage('Could not open share menu.');
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage(null);
      }
    }
  };

  // Social Share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${shareUrl}`
  )}`;

  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(shareTitle)}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-900/40 border border-purple-500/30 rounded-lg text-purple-300">
              <ShareIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-xl font-brush font-bold text-white tracking-wide">
                Share Anime Creation
              </h3>
              <p className="text-xs text-purple-300 font-comic-body">Share your anime portrait or copy link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close share dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status Toast banner if any */}
        {statusMessage && (
          <div className="mt-4 p-2.5 text-xs text-center rounded-lg bg-purple-950/80 border border-purple-500 text-purple-200 animate-pulse font-comic font-medium">
            {statusMessage}
          </div>
        )}

        {/* Preview Card */}
        <div className="mt-4 p-3 rounded-xl bg-gray-800/80 border border-gray-700/80 flex items-center gap-3">
          <img
            src={imageUrl}
            alt="Anime Preview"
            className="w-16 h-16 object-cover rounded-lg border border-purple-400/40 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-brush text-white truncate">
              {characterInfo ? characterInfo.name : animeName ? `${animeName} Style` : 'Anime Portrait'}
            </h4>
            <p className="text-xs text-purple-300 font-comic-body truncate">
              {characterInfo ? `from "${characterInfo.series}"` : 'plasmx/spyz transformation'}
            </p>
            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50 font-comic">
              {activeFeature === Feature.AnimeMate ? 'Anime Doppelganger' : 'Art Styled'}
            </span>
          </div>
        </div>

        {/* Native Share button (if browser supports it) */}
        {canNativeShare && (
          <div className="mt-4">
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-900/30 transition-all font-comic text-sm cursor-pointer"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share via Device (Apps, AirDrop, etc.)</span>
            </button>
          </div>
        )}

        {/* Social Media Share Section */}
        <div className="mt-5">
          <label className="block text-xs font-brush text-purple-300 tracking-wider mb-2.5">
            Share to Social Media
          </label>
          <div className="grid grid-cols-5 gap-2">
            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/90 hover:bg-black border border-gray-700 hover:border-gray-500 text-gray-200 transition-colors group cursor-pointer"
              title="Share on X"
            >
              <TwitterXIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              <span className="text-[11px] mt-1.5 font-comic">X</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/90 hover:bg-emerald-950/60 border border-gray-700 hover:border-emerald-500/50 text-gray-200 transition-colors group cursor-pointer"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] mt-1.5 font-comic">WhatsApp</span>
            </a>

            {/* Reddit */}
            <a
              href={redditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/90 hover:bg-orange-950/60 border border-gray-700 hover:border-orange-500/50 text-gray-200 transition-colors group cursor-pointer"
              title="Share on Reddit"
            >
              <RedditIcon className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] mt-1.5 font-comic">Reddit</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/90 hover:bg-sky-950/60 border border-gray-700 hover:border-sky-500/50 text-gray-200 transition-colors group cursor-pointer"
              title="Share on Telegram"
            >
              <TelegramIcon className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] mt-1.5 font-comic">Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800/90 hover:bg-blue-950/60 border border-gray-700 hover:border-blue-500/50 text-gray-200 transition-colors group cursor-pointer"
              title="Share on Facebook"
            >
              <FacebookIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] mt-1.5 font-comic">Facebook</span>
            </a>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mt-5">
          <label className="block text-xs font-brush text-purple-300 tracking-wider mb-2">
            Copy Page Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono truncate select-all">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-comic rounded-lg transition-all cursor-pointer ${
                copyLinkSuccess
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copyLinkSuccess ? (
                <>
                  <CheckIcon className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions (Copy Image, Copy Caption, Download) */}
        <div className="mt-5 pt-4 border-t border-gray-800 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCopyImage}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-comic transition-colors cursor-pointer ${
              copyImageSuccess
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200'
            }`}
          >
            {copyImageSuccess ? (
              <>
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Image Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 text-purple-400" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <a
            href={imageUrl}
            download={`anime-style-${Date.now()}.png`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-xs font-comic transition-colors"
          >
            <DownloadIcon className="w-4 h-4 text-purple-400" />
            <span>Download PNG</span>
          </a>
        </div>

        {/* Copy Caption button */}
        <div className="mt-2 text-center">
          <button
            onClick={handleCopyText}
            className="text-xs text-purple-400 hover:text-purple-300 underline font-comic-body transition-colors cursor-pointer"
          >
            {copyTextSuccess ? '✓ Caption copied!' : 'Copy caption & hashtags for Instagram / TikTok'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
