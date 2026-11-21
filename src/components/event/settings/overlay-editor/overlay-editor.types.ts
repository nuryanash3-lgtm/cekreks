export type ElementType = 'photo' | 'image' | 'text' | 'shape' | 'qrcode';

export type ShapeType = 'rect' | 'circle' | 'ketupat';

export type DimensionUnit = 'px' | 'in' | 'cm';

export type PaperSizeOption = '4x6' | '2x6' | '5x7' | 'A4';

export type OrientationOption = 'vertical' | 'horizontal';

export type ResizeHandlePosition = 'nw' | 'ne' | 'sw' | 'se';

export type AlignmentType =
  | 'top'
  | 'middle-v'
  | 'bottom'
  | 'distribute-v'
  | 'left'
  | 'center-h'
  | 'right'
  | 'center-both';

export interface CanvasElement {
  id: string;
  layerNumber: number;
  badgeColor?: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  locked: boolean;
  strokeColor: string;
  strokeWidth: number;
  dropShadow: boolean;
  shadowColor: string;
  shadowAngle: number;
  shadowDist: number;
  shadowBlur: number;
  // Photo slot specific
  slotIndex?: number;
  // Image specific
  src?: string;
  // Text specific
  text?: string;
  fontSize?: number;
  color?: string;
  // Shape specific
  shapeType?: ShapeType;
  fillColor?: string;
}

export interface EditorSnapshot {
  elements: CanvasElement[];
  bgColor: string;
  canvasWidth: number;
  canvasHeight: number;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
}

export interface ToastItem {
  id: string;
  message: string;
}

export interface SavedTemplatePayload {
  name: string;
  bgColor: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
  app?: string;
  version?: string;
  paperSize?: PaperSizeOption;
  dpi?: number;
}