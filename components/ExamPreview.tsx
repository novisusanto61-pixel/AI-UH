import React, { useRef } from 'react';
import { UserInput, ExamData } from '../types';
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
      // We need to select the text range to copy it properly with formatting
      const range = document.createRange();
      range.selectNode(contentRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      
      // Execute copy
      document.execCommand('copy');
      
      // Clear selection
      window.getSelection()?.removeAllRanges();
      
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
      
      // Open Google Docs
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
            <div className="space-y-4 text-sm">
              {examData.questions.map((q, idx) => (
                <div key={idx} className="mb-4 break-inside-avoid">
                  <div className="flex gap-2">
                     <span className="font-bold">{q.number}.</span>
                     <div className="w-full">
                        <p className="mb-2">{q.text}</p>
                        {q.type === 'Pilihan Ganda' && q.options && (
                           <div className="ml-2 grid gap-1">
                              {q.options.map((opt, i) => (
                                 <div key={i}>{opt}</div>
                              ))}
                           </div>
                        )}
                        {q.type === 'Uraian' && (
                           <div className="mt-2 h-16 border-b border-gray-300 border-dashed w-full"></div>
                        )}
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