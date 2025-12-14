import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to get dynamic client
const getGenAI = () => {
    const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY || '';
    if (!apiKey) {
        throw new Error("API Key bulunamadı. Lütfen Ayarlar sayfasından Gemini API anahtarınızı girin.");
    }
    return new GoogleGenerativeAI(apiKey);
};

export const getChatResponse = async (
    message: string,
    history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
    // List of models to try in order (Updated based on ListModels)
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError: any = null;

    const genAI = getGenAI();
    const systemInstruction = "Sen Vural Enerji'nin yardımsever yapay zeka asistanısın. Güneş panelleri, invertörler, yenilenebilir enerji ve Vural Enerji ürünleri hakkında soruları yanıtlarsın. Kibar, profesyonel ve bilgilisin. Türkçe cevap ver. Kısa ve öz cevaplar ver.";

    for (const modelName of modelsToTry) {
        console.log(`Trying Gemini model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemInstruction
            });

            const chat = model.startChat({
                history: history,
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();

        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to next model
        }
    }

    // If we get here, all models failed.
    console.error("All Gemini models failed. Last error:", lastError);

    let errorMessage = "Bağlantı hatası oluştu.";

    if (lastError?.message) {
        if (lastError.message.includes("API key")) {
            errorMessage = "API Anahtarı hatası: Lütfen anahtarın doğru olduğundan emin olun.";
        } else if (lastError.message.includes("403")) {
            errorMessage = "Erişim Reddedildi (403): API Anahtarı geçersiz veya yetkisiz.";
        } else if (lastError.message.includes("404")) {
            errorMessage = "Model Bulunamadı (404): Kullanılabilir bir model bulunamadı.";
        } else if (lastError.message.includes("429")) {
            errorMessage = "Kota Aşıldı (429): Çok fazla istek gönderildi.";
        } else {
            errorMessage = `Hata: ${lastError.message}`;
        }
    }

    return `${errorMessage} (Lütfen Ayarlar sayfasından API anahtarınızı kontrol edin.)`;
};

export const analyzeVideo = async (videoUrl: string, prompt: string = "Bu videoyu analiz et ve ana konuları listele."): Promise<string> => {
    try {
        // Fallback for demo using text prompt
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const result = await model.generateContent(`Video Analizi İsteği (Simülasyon): ${prompt}. (Not: Gerçek video yüklemesi için backend entegrasyonu gereklidir.)`);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Video Error:", error);
        return "Video analizinde bir hata oluştu.";
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    // Deprecated in favor of speakText for client-side TTS
    return null;
};

export const speakText = (text: string) => {
    if (!window.speechSynthesis) {
        console.error("Browser does not support TTS");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR'; // Set language to Turkish
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch

    // Try to find a Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const turkishVoice = voices.find(voice => voice.lang.includes('tr'));
    if (turkishVoice) {
        utterance.voice = turkishVoice;
    }

    window.speechSynthesis.speak(utterance);
};


// Helper to play base64 audio
export const playAudio = (base64String: string) => {
    try {
        const audio = new Audio("data:audio/mp3;base64," + base64String);
        audio.play();
    } catch (e) {
        console.error("Audio play error", e);
    }
};
