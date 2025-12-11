import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { LoadingState, HairstylePreset } from './types';
import { changeHairstyle } from './services/geminiService';

// Predefined hairstyles for quick selection
const PRESETS: HairstylePreset[] = [
  { id: 'blonde-bob', label: '금발 단발', description: 'Blonde bob cut, sleek and modern', icon: '👱‍♀️' },
  { id: 'long-wavy-brunette', label: '갈색 긴 웨이브', description: 'Long brunette wavy hair, natural look', icon: '👩🏽' },
  { id: 'short-pixie', label: '숏컷 픽시', description: 'Short pixie cut, stylish and edgy', icon: '💇‍♀️' },
  { id: 'red-curly', label: '붉은색 펌', description: 'Red curly hair, voluminous', icon: '👩‍🦰' },
  { id: 'silver-undercut', label: '실버 언더컷', description: 'Silver grey hair with an undercut, modern style', icon: '🦳' },
  { id: 'k-pop-blue', label: 'K-POP 블루', description: 'Bright blue hair, K-pop idol style', icon: '🎤' },
  { id: 'middle-aged-man', label: '중년 남성 컷', description: 'Classic middle-aged man haircut, short neat side part, sophisticated look', icon: '👨' },
];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!originalImage) return;
    if (!prompt.trim()) {
      setError('원하는 헤어스타일을 입력하거나 선택해주세요.');
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultImage = await changeHairstyle(originalImage, prompt);
      setGeneratedImage(resultImage);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError('이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setLoadingState(LoadingState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls & Input */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                사진 업로드
              </h2>
              <ImageUploader 
                onImageSelected={(img) => {
                  setOriginalImage(img);
                  setGeneratedImage(null); 
                  setError(null);
                }} 
                selectedImage={originalImage} 
              />
            </div>

            <div className={`bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm transition-opacity duration-300 ${!originalImage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                스타일 선택
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">프리셋 선택</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setPrompt(preset.description)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col items-center gap-2 text-sm
                        ${prompt === preset.description 
                          ? 'border-indigo-500 bg-indigo-500/20 text-white' 
                          : 'border-slate-600 bg-slate-800 hover:border-slate-500 text-slate-300'
                        }
                      `}
                    >
                      <span className="text-2xl">{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-400 mb-2">직접 입력 (구체적일수록 좋아요)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="예: 어깨 길이의 검은색 생머리, 앞머리 있음"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-28"
                />
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={loadingState === LoadingState.LOADING}
                  disabled={!originalImage || !prompt}
                  className="w-full text-lg"
                >
                  변신하기 ✨
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="space-y-8">
             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm h-full min-h-[500px] flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                결과 확인
              </h2>

              <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden relative">
                {loadingState === LoadingState.LOADING ? (
                   <div className="flex flex-col items-center justify-center text-center p-8">
                     <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p className="text-indigo-400 font-medium animate-pulse">AI가 열심히 스타일링 중입니다...</p>
                     <p className="text-slate-500 text-sm mt-2">약 5-10초 정도 소요됩니다.</p>
                   </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full group">
                    <img 
                      src={generatedImage} 
                      alt="Generated Hairstyle" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-4">
                      <a 
                        href={generatedImage} 
                        download="new-hairstyle.png"
                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                      >
                        다운로드
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-500">
                    <p className="text-6xl mb-4">✨</p>
                    <p>왼쪽에서 사진을 올리고<br/>스타일을 선택하면 결과가 여기에 표시됩니다.</p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="mt-6 flex justify-end">
                   <Button variant="outline" onClick={handleReset}>
                     처음부터 다시하기
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;