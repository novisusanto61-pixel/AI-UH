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
          type: { type: Type.STRING, enum: ["Pilihan Ganda", "Uraian"] },
          text: { type: Type.STRING, description: "Pertanyaan soal" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Pilihan jawaban (hanya jika Pilihan Ganda, sertakan A, B, C, D di dalam string)" 
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

    Instruksi:
    1. Buat 5-10 butir soal (campuran Pilihan Ganda dan Uraian).
    2. Sesuaikan tingkat kesulitan bahasa dan kognitif dengan jenjang ${input.level}.
    3. Pastikan kisi-kisi sinkron dengan soal yang dibuat.
    4. Output harus JSON valid sesuai schema.
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