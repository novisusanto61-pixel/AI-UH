import React, { useRef } from 'react';
import { UserInput, ExamData, Question } from '../types';
import { Download, Copy, FileText, CheckCircle2 } from 'lucide-react';

interface ExamPreviewProps {
  inputData: UserInput;
  examData: ExamData;
}

const ExamPreview: React.FC<ExamPreviewProps> = ({ inputData, examData }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copied'>('idle');

  const handleCopyToDocs = async () => {
    if (!contentRef.current) return;
    
    try {
      const range = document.createRange();
      range.selectNode(contentRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
      window.open('https://docs.new', '_blank');
      alert("Konten berhasil disalin! Silakan tekan Ctrl+V di tab Google Dokumen yang baru terbuka.");
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Gagal menyalin konten otomatis.');
    }
  };

  const handleDownloadWord = () => {
    if (!contentRef.current) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Ulangan Harian</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid black; padding: 5px; }
          .no-border td { border: none; }
          .header-text { text-align: center; font-weight: bold; font-size: 14pt; }
          .sub-header { text-align: center; font-size: 12pt; margin-bottom: 20px; }
          .option-list { margin-left: 20px; }
          .matching-table td { border: 1px solid #ccc; padding: 8px; }
        </style>
      </head>
      <body>`;
    
    const footer = "</body></html>";
    const sourceHTML = header + contentRef.current.innerHTML + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `UH_${inputData.subject}_${inputData.className}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const renderQuestionContent = (q: Question) => {
    switch (q.type) {
      case 'Pilihan Ganda':
        return (
          <div className="ml-2">
             <p className="mb-2">{q.text}</p>
             <div className="grid gap-1 option-list">
                {q.options?.map((opt, i) => (
                   <div key={i}>{opt}</div>
                ))}
             </div>
          </div>
        );
      
      case 'Isian Singkat':
        return (
          <div className="ml-2">
            <p className="mb-4 leading-loose">
              {q.text} {q.text.includes('...') ? '' : '...................................................'}
            </p>
          </div>
        );

      case 'Menjodohkan':
        return (
          <div className="ml-2">
            <p className="mb-3 italic">{q.text || 'Pasangkan pernyataan berikut dengan jawaban yang benar!'}</p>
            {q.matchingPairs && (
              <table className="w-full text-sm matching-table mb-4" style={{border: '1px solid #ddd'}}>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border border-gray-300 text-left">Pernyataan</th>
                    <th className="p-2 border border-gray-300 text-left">Jawaban/Pasangan</th>
                  </tr>
                </thead>
                <tbody>
                  {q.matchingPairs.map((pair, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border border-gray-300 w-1/2 align-top">
                        <span className="font-semibold mr-2">{String.fromCharCode(97 + idx)}</span>. {pair.premise}
                      </td>
                      <td className="p-2 border border-gray-300 w-1/2 align-top">
                         ( ..... ) &nbsp;&nbsp; {pair.response}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case 'Uraian':
      default:
        return (
          <div className="ml-2 w-full">
             <p className="mb-2">{q.text}</p>
             <div className="mt-2 h-20 border-b border-gray-300 border-dashed w-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100 sticky top-4 z-10 shadow-sm">
        <button
          onClick={handleCopyToDocs}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium shadow-sm"
        >
          {copyStatus === 'copied' ? <CheckCircle2 size={18} className="text-green-600"/> : <Copy size={18} />}
          {copyStatus === 'copied' ? 'Tersalin!' : 'Salin & Buka Google Doc'}
        </button>
        <button
          onClick={handleDownloadWord}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Download size={18} />
          Download (.doc)
        </button>
      </div>

      {/* Document Preview Area */}
      <div className="overflow-auto bg-gray-200 p-4 sm:p-8 rounded-xl border border-gray-300 shadow-inner">
        <div 
          ref={contentRef} 
          className="bg-white max-w-[210mm] mx-auto p-[20mm] shadow-lg text-black"
          style={{ fontFamily: '"Times New Roman", Times, serif', minHeight: '297mm' }}
        >
          {/* KOP SURAT */}
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h2 className="font-bold text-lg uppercase">{inputData.schoolName}</h2>
            <h1 className="font-bold text-xl uppercase mb-1">ULANGAN HARIAN (UH)</h1>
            <p className="text-sm">Tahun Pelajaran {inputData.academicYear}</p>
          </div>

          {/* IDENTITAS */}
          <table className="w-full mb-6 no-border text-sm" style={{ border: 'none' }}>
            <tbody>
              <tr>
                <td style={{border: 'none', width: '150px'}}>Mata Pelajaran</td>
                <td style={{border: 'none', width: '10px'}}>:</td>
                <td style={{border: 'none'}}>{inputData.subject}</td>
                <td style={{border: 'none', width: '100px'}}>Hari/Tanggal</td>
                <td style={{border: 'none', width: '10px'}}>:</td>
                <td style={{border: 'none'}}>....................</td>
              </tr>
              <tr>
                <td style={{border: 'none'}}>Kelas / Semester</td>
                <td style={{border: 'none'}}>:</td>
                <td style={{border: 'none'}}>{inputData.className} / {new Date().getMonth() > 6 ? 'Ganjil' : 'Genap'}</td>
                <td style={{border: 'none'}}>Waktu</td>
                <td style={{border: 'none'}}>:</td>
                <td style={{border: 'none'}}>....................</td>
              </tr>
              <tr>
                <td style={{border: 'none'}}>Materi Pokok</td>
                <td style={{border: 'none'}}>:</td>
                <td style={{border: 'none'}} colSpan={4}>{inputData.subjectMatter}</td>
              </tr>
            </tbody>
          </table>

          {/* KISI-KISI SOAL */}
          <div className="mb-8">
             <h3 className="font-bold text-center mb-3 text-base uppercase">A. KISI-KISI SOAL</h3>
             <table className="w-full text-xs border-collapse border border-black">
                <thead className="bg-gray-100">
                   <tr>
                      <th className="border border-black p-1 text-center">No</th>
                      <th className="border border-black p-1 text-center">Kompetensi Dasar / TP</th>
                      <th className="border border-black p-1 text-center">Materi</th>
                      <th className="border border-black p-1 text-center">Indikator Soal</th>
                      <th className="border border-black p-1 text-center">Level</th>
                      <th className="border border-black p-1 text-center">Bentuk Soal</th>
                      <th className="border border-black p-1 text-center">No Soal</th>
                   </tr>
                </thead>
                <tbody>
                   {examData.blueprints.map((item, idx) => (
                      <tr key={idx}>
                         <td className="border border-black p-1 text-center">{idx + 1}</td>
                         <td className="border border-black p-1">{item.competency}</td>
                         <td className="border border-black p-1">{item.material}</td>
                         <td className="border border-black p-1">{item.indicator}</td>
                         <td className="border border-black p-1 text-center">{item.level}</td>
                         <td className="border border-black p-1 text-center">{item.questionForm}</td>
                         <td className="border border-black p-1 text-center">{item.questionNumber}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* SOAL */}
          <div>
            <h3 className="font-bold text-center mb-3 text-base uppercase">B. SOAL ULANGAN HARIAN</h3>
            <div className="space-y-6 text-sm">
              {examData.questions.map((q, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <div className="flex gap-2">
                     <span className="font-bold">{q.number}.</span>
                     <div className="w-full">
                        {renderQuestionContent(q)}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TANDA TANGAN */}
          <div className="mt-16 flex justify-between break-inside-avoid text-sm">
            <div className="text-center w-64">
               <p className="mb-16">Mengetahui,<br/>Kepala Sekolah</p>
               <p className="font-bold underline">{inputData.principalName}</p>
               <p>NIP. {inputData.principalNip}</p>
            </div>
            <div className="text-center w-64">
               <p className="mb-16">Guru Mata Pelajaran</p>
               <p className="font-bold underline">{inputData.teacherName}</p>
               <p>NIP. {inputData.teacherNip}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExamPreview;