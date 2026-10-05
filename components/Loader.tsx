
import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-purple-300 font-brush tracking-wider text-xl drop-shadow">{message}</p>
      <p className="text-gray-400 mt-2 text-sm font-comic-body">AI is conjuring your anime transformation...</p>
    </div>
  );
};

export default Loader;
