const PDF_SIGNATURE = "%PDF";

const BASE64_KEYS = [
  "content",
  "data",
  "file",
  "pdf",
  "base64",
  "statement",
  "fileContent",
  "document",
  "body",
  "fileData",
  "result",
];

const isPdfBytes = (bytes: Uint8Array): boolean => {
  if (bytes.length < 4) return false;
  const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  return header === PDF_SIGNATURE;
};

const base64ToBytes = (base64: string): Uint8Array => {
  const cleaned = base64.replace(/^data:[^;]+;base64,/, "").trim();
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const bytesToPdfBlob = (bytes: Uint8Array): Blob =>
  new Blob([bytes], { type: "application/pdf" });

const extractBase64FromJson = (value: unknown, depth = 0): string | null => {
  if (depth > 3 || value == null) return null;

  if (typeof value === "string") {
    return value.length > 0 ? value : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = extractBase64FromJson(item, depth + 1);
      if (nested) return nested;
    }
    return null;
  }

  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;

  for (const key of BASE64_KEYS) {
    const field = obj[key];
    if (typeof field === "string" && field.length > 0) {
      return field;
    }
  }

  for (const field of Object.values(obj)) {
    const nested = extractBase64FromJson(field, depth + 1);
    if (nested) return nested;
  }

  return null;
};

const extractErrorMessage = (value: unknown): string | null => {
  if (!value || typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;
  const message = obj.message ?? obj.error ?? obj.errorMessage ?? obj.detail;

  return typeof message === "string" && message.trim() ? message : null;
};

export const parseStatementPdfResponse = async (data: Blob): Promise<Blob> => {
  if (!data || data.size === 0) {
    throw new Error("Пустой ответ от сервера");
  }

  const buffer = await data.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (isPdfBytes(bytes)) {
    return bytesToPdfBlob(bytes);
  }

  const text = new TextDecoder().decode(bytes).trim();
  if (text.startsWith(PDF_SIGNATURE)) {
    return new Blob([text], { type: "application/pdf" });
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    const base64 = extractBase64FromJson(parsed);

    if (base64) {
      const pdfBytes = base64ToBytes(base64);
      if (!isPdfBytes(pdfBytes)) {
        throw new Error("Получен некорректный файл выписки");
      }
      return bytesToPdfBlob(pdfBytes);
    }

    const errorMessage = extractErrorMessage(parsed);
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Не удалось получить выписку");
    }
    throw error;
  }

  throw new Error("Не удалось получить выписку");
};
