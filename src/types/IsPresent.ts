export type IsPresent = {
    idFestival: number;
    idUser: string;
    date: string; // Utiliser string pour la date peut être pratique pour les interactions API
    jeuxIdGame?: number | null; 
  };
  