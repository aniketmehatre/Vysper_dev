export interface OcrResult {
  text: string;
  confidence: number;
  processingTimeMs: number;
  boundingBoxes: OcrBoundingBox[];
}

export interface OcrBoundingBox {
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
