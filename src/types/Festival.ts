export type Festival = {
    idFestival?: number;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    isActive?: boolean;
    dateDebut: Date;
    dateFin: Date;
  };