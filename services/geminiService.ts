import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, ExamData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const examSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Judul Ulangan Harian" },
    blueprints: {
      type: Type.ARRAY,
      description: "Kisi-kisi soal",
      items: {
        type: Type.OBJECT,
        properties: {
          no: { type: Type.INTEGER },
          competency: { type: Type.STRING, description: "Kompetensi Dasar / Capaian Pembelajaran" },
          material: { type: Type.STRING, description: "Materi" },
          indicator: { type: Type.STRING, description: "Indikator Soal" },
          level: { type: Type.STRING, description: "Level Kognitif (L1/L2/L3)" },
          questionForm: { type: Type.STRING, description: "Bentuk Soal" },
          questionNumber: { type: Type.INTEGER, description: "Nomor Soal" }
        }
      }
    },
    questions: {
      type: Type.ARRAY,
      description: "Daftar Soal",
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          type: { 
            type: Type.STRING, 
            enum: ["Pilihan Ganda", "Isian Singkat", "Uraian", "Menjodohkan"] 
          },
          text: { type: Type.STRING, description: "Pertanyaan soal" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Pilihan jawaban (wajib untuk Pilihan Ganda)" 
          },
          matchingPairs: {
            type: Type.ARRAY,
            description: "Pasangan soal menjodohkan (wajib untuk tipe Menjodohkan)",
            items: {
              type: Type.OBJECT,
              properties: {
                premise: { type: Type.STRING, description: "Pernyataan sebelah kiri" },
                response: { type: Type.STRING, description: "Jawaban sebelah kanan" }
              }
            }
          }
        }
      }
    }
  },
  required: ["title", "blueprints", "questions"]
};

export const generateExam = async (input: UserInput): Promise<ExamData> => {
  const prompt = `
    Bertindaklah sebagai Guru Ahli dan Pembuat Kurikulum Profesional.
    Buatkan Dokumen Perangkat Ulangan Harian (UH) lengkap dengan Kisi-kisi dan Soal.
    
    Data Input:
    - Jenjang: ${input.level}
    - Kelas: ${input.className}
    - Mata Pelajaran: ${input.subject}
    - Materi: ${input.subjectMatter}
    - Tujuan Pembelajaran: ${input.learningObjective}
    - Jenis Soal yang diminta: ${input.questionTypes.join(', ')}

    Instruksi Khusus:
    1. **BUATLAH MINIMAL 10 BUTIR SOAL** secara total.
    2. Proporsikan jumlah soal berdasarkan jenis soal yang diminta.
    3. Sesuaikan tingkat kesulitan bahasa dan kognitif dengan jenjang ${input.level}.
    4. Pastikan kisi-kisi sinkron dengan soal yang dibuat.
    
    Detail Format Soal:
    - Jika 'Menjodohkan': Berikan instruksi di 'text' dan isi 'matchingPairs' dengan pasangan yang benar.
    - Jika 'Isian Singkat': Pastikan pertanyaan jelas dengan satu jawaban pasti.
    - Jika 'Pilihan Ganda': Sediakan 4 opsi (A, B, C, D).
    
    Output harus JSON valid sesuai schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: examSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ExamData;
    } else {
      throw new Error("No data returned from AI");
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Gagal membuat soal. Silakan coba lagi.");
  }
};