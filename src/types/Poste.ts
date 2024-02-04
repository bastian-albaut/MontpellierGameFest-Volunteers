export interface Poste {
    idPoste: string;
    name: string;
    capacityPoste: number;
    idFestival: string;
    description: string;
    referents: Referent[];
    // Ajoutez d'autres champs nécessaires correspondant à la réponse de l'API pour un poste
  }
  
  export interface Referent {
    idReferent: string;
    firstName: string;
    lastName: string;
    // Ajoutez d'autres champs nécessaires correspondant à la réponse de l'API pour un référent
  }
  