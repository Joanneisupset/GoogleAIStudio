
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    
    try {
      const base64Data = image.split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Failed to edit image. Try a simpler prompt.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/90 p-6 rounded-3xl border-2 border-brown-200 shadow-xl max-w-2xl w-full">
      <h3 className="text-2xl font-game text-brown-800 mb-4">🖼️ 证据处理中心 (Image Lab)</h3>
      <p className="text-sm text-brown-600 mb-4 italic">上传一张线索照片，告诉侦探喵如何处理它（例如：'加上复古滤镜', '把背景变模糊'）</p>
      
      <div className="flex flex-col space-y-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          ref={fileInputRef}
        />
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-brown-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brown-700 transition-all"
          >
            {image ? '重新上传' : '上传照片'}
          </button>
          {image && <p className="text-xs text-green-600 font-bold">照片已就绪 ✓</p>}
        </div>

        {image && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold mb-1">原始照片:</p>
              <img src={image} className="w-full h-48 object-cover rounded-lg border border-brown-100" />
            </div>
            {resultImage && (
              <div className="flex-1">
                <p className="text-xs font-bold mb-1">处理结果:</p>
                <img src={resultImage} className="w-full h-48 object-cover rounded-lg border-2 border-pink-400" />
              </div>
            )}
          </div>
        )}

        {image && (
          <div className="space-y-2">
            <input 
              className="w-full p-3 border-2 border-brown-100 rounded-xl outline-none focus:border-pink-300 transition-colors"
              placeholder="例如: 添加复古胶片感滤镜..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={processImage}
              disabled={isProcessing || !prompt}
              className="w-full bg-pink-500 text-white font-game py-3 rounded-xl shadow-lg hover:bg-pink-600 transition-all disabled:opacity-50"
            >
              {isProcessing ? '正在运用侦探魔法...' : '开始处理线索'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
