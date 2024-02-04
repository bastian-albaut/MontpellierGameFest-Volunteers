// Assurez-vous que ces imports sont en haut de votre fichier
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionPoste from './SectionPoste';
import { Poste } from '../../types/Poste'; // Ce fichier doit définir le type Poste

const ListeDesPostes = () => {
  const [postes, setPostes] = useState<Poste[]>([]); // Assurez-vous que vous avez défini le type pour les postes
  const [selectedPosteId, setSelectedPosteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostes = async () => {
      try {
        const response = await axios.get('/postes'); // Assurez-vous que cette URL est correcte
        setPostes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des postes', error);
      }
    };

    fetchPostes();
  }, []);

  const handlePosteClick = (idPoste: string) => {
    setSelectedPosteId(idPoste);
  };

  return (
    <div>
      {postes.map((poste) => (
        <div key={poste.id} onClick={() => handlePosteClick(poste.id)}>
          {poste.name}
        </div>
      ))}
      {selectedPosteId && <SectionPoste idPoste={selectedPosteId} />}
    </div>
  );
};

export default ListeDesPostes;
