export interface Location {
  id: string;
  name: string;
  type:
    | "edificio"
    | "despacho"
    | "habitacion"
    | "almacen"
    | "vehiculo"
    | "otro";

  parentId?: string;

  qrCode: string;
  barcode: string;

  description?: string;
  imageUrl?: string;

  createdAt: string;
}