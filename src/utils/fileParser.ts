export async function readFileAsTextOrBase64(file: File): Promise<{
  text?: string;
  base64?: string;
  mimeType: string;
}> {
  const mimeType = file.type || 'application/octet-stream';

  if (file.type === 'application/pdf') {
    // Read as Base64 for Gemini inlineData
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g. data:application/pdf;base64,)
        const base64 = result.split(',')[1] || result;
        resolve({
          base64,
          mimeType: 'application/pdf',
          text: `[PDF Document: ${file.name}, ${(file.size / 1024).toFixed(1)} KB]`,
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Otherwise read as text (txt, md, json, etc.)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      resolve({
        text,
        mimeType: file.type || 'text/plain',
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
