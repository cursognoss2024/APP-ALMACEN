export interface ItemLocation {
  locationId: string;
  quantity: number;
}

export interface Item {
  id: string;

  name: string;

  noc?: string;

  serialNumber?: string;

  state: string;

  qrCode: string;

  barcode: string;

  observations?: string;

  imageUrl?: string;

  locations: ItemLocation[];

  createdAt: string;
}