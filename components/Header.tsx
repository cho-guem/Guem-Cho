import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-xl mb-4">
        <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase px-2">Powered by Gemini 2.5</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
        AI 헤어 디자이너
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        사진을 올리고 원하는 스타일을 입력하세요. AI가 당신의 새로운 모습을 찾아드립니다.
      </p>
    </header>
  );
};