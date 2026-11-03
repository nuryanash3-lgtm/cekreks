import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import knowledge from '@/data/cekreksKnowledge.json';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ 
                reply: "Maaf, konfigurasi API Key belum disetel. Silakan hubungi CS WhatsApp kami! [SHOW_WHATSAPP]" 
            }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
        }

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `Anda adalah CS Agent manusia yang ramah, santai, dan kasual untuk "Cekreks.id".
                                
                                BERIKUT ADALAH DATABASE / KNOWLEDGE BASE RESMI PERUSAHAAN YANG WAJIB ANDA JADIKAN ACUAN UTAMA:
                                ${JSON.stringify(knowledge, null, 2)}

                                Aturan Ketat: 
                                1. Jawab HANYA berdasarkan informasi di dalam database JSON di atas (harga paket studio, photobooth, wedding, alamat Cimahi, jam operasional, dll).
                                2. JANGAN pernah mengulang kata sapaan seperti "Halo!" atau "Selamat datang" di setiap pesan jika sudah disapa sebelumnya.
                                3. Jawab langsung pada inti pertanyaan dengan singkat, padat, dan natural seperti sedang *chatting* di WhatsApp (maksimal 2-3 kalimat).
                                4. Jangan gunakan format penomoran (1., 2.) atau simbol markdown yang berlebihan. Buat mengalir secara natural.
                                5. ATURAN TOMBOL WHATSAPP: 
                                   - Jika informasi yang ditanyakan user **ADA** di database JSON (misal tanya harga paket, alamat, fasilitas), jawab secara akurat **TANPA** memunculkan tombol WhatsApp.
                                   - JANGAN PERNAH menyertakan tag [SHOW_WHATSAPP] jika pertanyaannya bisa dijawab oleh data di JSON.
                                   - HANYA sertakan teks persis: [SHOW_WHATSAPP] di akhir kalimat jika pertanyaan user **BENAR-BENAR BUNTU**, tidak ada datanya sama sekali di JSON, atau meminta hal di luar kapasitas seperti booking jadwal, nego harga, pembayaran, dan custom khusus yang butuh admin manusia.
                                
                                Pertanyaan user: ${message}`
                            }
                        ]
                    }
                ],
            });

            const reply = response.text || "Maaf, silakan hubungi CS WhatsApp kami. [SHOW_WHATSAPP]";
            return NextResponse.json({ reply });

        } catch (apiError: any) {
            console.error('Detail Error Gemini API:', apiError);
            if (apiError.status === 503 || apiError.code === 503) {
                return NextResponse.json({
                    reply: "Wah, antrean AI Agent sedang sangat padat saat ini! 😊 Untuk respon cepat, silakan langsung hubungi CS WhatsApp kami ya! [SHOW_WHATSAPP]"
                });
            }
            throw apiError;
        }

    } catch (error) {
        console.error('Error Server / Route:', error);
        return NextResponse.json({ 
            reply: "Maaf, sistem sedang ada kendala teknis. Silakan hubungi CS WhatsApp kami untuk bantuan langsung ya! [SHOW_WHATSAPP]" 
        });
    }
}