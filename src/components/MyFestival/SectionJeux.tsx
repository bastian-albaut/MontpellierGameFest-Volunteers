// Dans SectionPosteMyFestival.tsx

import React, { useState, useEffect } from 'react';
import { getPosteById } from '../../api'; // Ajustez selon votre API
import { Poste } from '../../types/Poste';

interface SectionPosteMyFestivalProps {
  idPoste: string;
}

const SectionPosteMyFestival: React.FC<SectionPosteMyFestivalProps> = ({ idPoste }) => {
    const [poste, setPoste] = useState<Poste | null>(null);
    
    useEffect(() => {
        const fetchPoste = async () => {
          try {
            const response = await getPosteById(idPoste);
            console.log("Détails du poste reçus:", response.data); // Ajoutez ceci pour afficher les données dans la console
            setPoste(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des détails du poste', error);
          }
        };
      
        fetchPoste();
      }, [idPoste]);
      

if (!poste) {
  return <div>Chargement...</div>; // Ou un autre élément de placeholder
}

return (
    <div className="SectionPosteMyFestivalContainer">
      {/* Affichez les détails de votre poste ici */}
      <h1 className="posteTitle">{poste.name}</h1>
      {/* ... autres éléments */}
    </div>
  );
};

export default SectionPosteMyFestival;
