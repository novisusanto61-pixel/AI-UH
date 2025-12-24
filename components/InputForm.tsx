import React, { useState, useEffect } from 'react';
import { UserInput } from '../types';
import { Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    schoolName: '',
    level: 'SD',
    className: '1',
    academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    subject: '',
    learningObjective: '',
    subjectMatter: '',
    teacherName: '',
    teacherNip: '',
    principalName: '',
    principalNip: ''
  });

  const [classOptions, setClassOptions] = useState<string[]>([]);

  useEffect(() => {
    let options: string[] = [];
    if (formData.level === 'SD') {
      options = ['1', '2', '3', '4', '5', '6'];
    } else if (formData.level === 'SMP') {
      options = ['7', '8', '9'];
    } else {
      options = ['10', '11', '12'];
    }
    setClassOptions(options);
    setFormData(prev => ({ ...prev, className: options[0] }));
  }, [formData.level]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📝 Form Data Ulangan Harian
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Section 1: Data Sekolah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Satuan Pendidikan</label>
            <input
              required
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Contoh: SD Negeri 1 Merdeka"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pelajaran</label>
            <input
              required
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="2024/2025"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Section 2: Kelas & Mapel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {classOptions.map(opt => (
                <option key={opt} value={opt}>Kelas {opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <input
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Matematika"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Section 3: Materi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Pembelajaran</label>
          <textarea
            required
            name="learningObjective"
            value={formData.learningObjective}
            onChange={handleChange}
            rows={2}
            placeholder="Peserta didik mampu..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Materi Pelajaran</label>
          <input
            required
            name="subjectMatter"
            value={formData.subjectMatter}
            onChange={handleChange}
            placeholder="Pecahan Sederhana"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Section 4: Penandatangan */}
        <div className="pt-4 border-t border-gray-200">
           <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Data Penandatangan</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-xs font-bold text-gray-500 mb-2">Kepala Sekolah</p>
                 <input
                    required
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleChange}
                    placeholder="Nama Kepala Sekolah"
                    className="w-full px-3 py-2 border rounded mb-2 text-sm"
                 />
                 <input
                    required
                    name="principalNip"
                    value={formData.principalNip}
                    onChange={handleChange}
                    placeholder="NIP Kepala Sekolah"
                    className="w-full px-3 py-2 border rounded text-sm"
                 />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-xs font-bold text-gray-500 mb-2">Guru Mata Pelajaran</p>
                 <input
                    required
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleChange}
                    placeholder="Nama Guru"
                    className="w-full px-3 py-2 border rounded mb-2 text-sm"
                 />
                 <input
                    required
                    name="teacherNip"
                    value={formData.teacherNip}
                    onChange={handleChange}
                    placeholder="NIP Guru"
                    className="w-full px-3 py-2 border rounded text-sm"
                 />
              </div>
           </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Sedang Membuat Soal...
            </span>
          ) : (
            'Buat Soal & Kisi-kisi'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;