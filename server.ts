import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Expose JSON body parsing with higher limit for base64 images
app.use(express.json({ limit: "50mb" }));

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("MENSAGEM: GEMINI_API_KEY não foi configurada nas variáveis de ambiente. Usando dados simulados.");
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// 2. Real OCR Screenshot and Ride Evaluation using Gemini API
app.post("/api/analyze-ride", async (req, res) => {
  const { image, mimeType, settings } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: "Parâmetros 'image' (base64) e 'mimeType' são obrigatórios." });
  }

  const driverMinKm = settings?.minPricePerKm || 2.0;
  const driverMinHour = settings?.minHourlyEarnings || 30.0;
  const blockedRegionsList = settings?.blockedRegions || [];

  // If AI is not configured, fall back to an smart simulation based on basic image or parameters
  if (!ai) {
    console.log("Gemini API not configured, returning highly detailed mock analysis...");
    // Let's mock a beautiful ride analysis
    const randomApp = Math.random() > 0.5 ? "Uber" : "99";
    const val = parseFloat((15 + Math.random() * 35).toFixed(2));
    const dist = parseFloat((4 + Math.random() * 12).toFixed(1));
    const timeMin = Math.round(dist * 2 + Math.random() * 5);
    const pickup = "Rua Augusta, 1020 - Consolação, São Paulo";
    const dest = "Av. Paulista, 2100 - Bela Vista, São Paulo";
    
    return res.json({
      success: true,
      data: {
        app: randomApp,
        category: randomApp === "Uber" ? "UberX" : "99Pop",
        value: val,
        distance: dist,
        timeMinutes: timeMin,
        pickupAddress: pickup,
        destinationAddress: dest,
        aiAnalysis: "Simulação de Análise: Esta corrida gera um excelente retorno por km. Como a chave API do Gemini não foi cadastrada nos Segredos, os dados mostrados aqui são simulados pelo aplicativo para demonstração."
      }
    });
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: image,
      },
    };

    const promptText = `
Você é uma inteligência artificial especialista em maximizar lucros de motoristas de Uber e 99 no Brasil.
Analise com extrema precisão esta captura de tela do aplicativo de motorista (Uber ou 99).
Sua missão é extrair as seguintes informações cruciais sobre a oferta de corrida:
- Aplicativo (Uber ou 99)
- Categoria da corrida (UberX, Comfort, Uber Black, 99Pop, 99Comfort, etc)
- Valor oferecido em Reais (R$)
- Distância total da corrida em quilômetros (km), incluindo o trajeto de busca se aparecer. Se houver separação, some o deslocamento até o passageiro com a viagem em si para obter a distância total.
- Tempo total estimado em minutos, incluindo o trajeto de busca. Some os minutos se houver segmentação.
- Endereço de partida (pickup address) resumido.
- Endereço de destino (destination address) resumido. Se for corrida livre/sem destino, coloque vazio "".

Compare os dados obtidos com as metas do motorista:
- Preço mínimo desejado por km: R$ ${driverMinKm}/km.
- Meta de ganho por hora: R$ ${driverMinHour}/hora.
- Regiões indesejadas (bloqueadas): [${blockedRegionsList.join(", ")}]. Se os endereços contiverem ou lembrarem essas regiões, sinalize risco na análise.

Forneça sua análise justificando se o motorista deve aceitar ou recusar, detalhando a lucratividade estimada por hora e por km. Faça a resposta em português brasileiro amigável, direto ao ponto e motivador.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            app: { type: Type.STRING, description: "Apenas 'Uber' ou '99'" },
            category: { type: Type.STRING, description: "Ex: UberX, Comfort, Black, 99Pop, 99Pop-Promo" },
            value: { type: Type.NUMBER, description: "Valor total em reais, somente número decimal" },
            distance: { type: Type.NUMBER, description: "Distância total em km, somente número decimal" },
            timeMinutes: { type: Type.NUMBER, description: "Tempo estimado em minutos, número inteiro" },
            pickupAddress: { type: Type.STRING, description: "Endereço de partida legível simplificado" },
            destinationAddress: { type: Type.STRING, description: "Endereço de destino legível simplificado ou vazio" },
            aiAnalysis: { type: Type.STRING, description: "Justificativa direta em português sobre aceitar ou recusar com cálculos amigáveis." }
          },
          required: ["app", "category", "value", "distance", "timeMinutes", "pickupAddress", "destinationAddress", "aiAnalysis"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText.trim());

    res.json({
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Erro ao analisar imagem com Gemini:", error);
    res.status(500).json({ 
      error: "Falha na análise da imagem pelo Gemini API", 
      details: error.message || String(error)
    });
  }
});

// Configure Vite and Asset fallback serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DriverMax Server] Rodando na porta ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Falha ao inicializar o servidor de desenvolvimento:", err);
});
