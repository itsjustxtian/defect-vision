export interface ScanResult {
  _id?: string;
  id: string;
  email?: string;
  count_objects: number;
  output_image: string;
  image_name: string;
  timestamp: string; // ✅ stays string
  predictions: {
    image: {
      width: number;
      height: number;
    };
    predictions: {
      width: number;
      height: number;
      x: number;
      y: number;
      confidence: number;
      class_id: number;
      class: string;
      detection_id: string;
      parent_id: string;
    }[];
  };
}
