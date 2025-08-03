export interface apiStory {
  id: number;
  name: string;
  description: string;
  locations?: apiLocation[];
}

export interface apiLocation {
  id: number;
  name: string;
  description: string;
}

export interface apiZone {}
