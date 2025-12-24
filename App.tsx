import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ExamPreview from './components/ExamPreview';
import { UserInput, ExamData } from './types';
import { generateExam } from './services/geminiService';
import { BookOpen, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data); // Store input for header rendering in preview
    
    try {
      const result = await generateExam(data);
      setExamData(result);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membuat soal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">UH Generator</h1>
              <p className="text-xs text-gray-500 font-medium">Ulangan Harian Otomatis Berbasis AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form (Sticky on Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
             <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
             <div className="mt-4 text-center text-xs text-gray-400">
               <p>Pastikan semua data terisi dengan benar untuk hasil terbaik.</p>
             </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!examData && !isLoading && !error && (
               <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center h-full min-h-[400px] flex flex-col justify-center items-center text-gray-400">
                  <BookOpen size={48} className="mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold text-gray-500">Belum ada soal yang dibuat</h3>
                  <p className="text-sm mt-2 max-w-sm mx-auto">
                    Isi formulir di samping (atau di atas pada mobile) dan klik tombol "Buat Soal" untuk menghasilkan dokumen Ulangan Harian.
                  </p>
               </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center h-[500px] flex flex-col justify-center items-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                 <h3 className="text-xl font-bold text-gray-700">Sedang menyusun soal...</h3>
                 <p className="text-gray-500 mt-2">AI sedang menganalisis tujuan pembelajaran dan membuat kisi-kisi.</p>
                 <p className="text-gray-400 text-sm mt-4 italic">Estimasi waktu: 5-10 detik</p>
              </div>
            )}

            {examData && userInput && (
              <ExamPreview inputData={userInput} examData={examData} />
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} UH Generator. Dibuat untuk membantu guru Indonesia.
        </div>
      </footer>
    </div>
  );
};

export default App;