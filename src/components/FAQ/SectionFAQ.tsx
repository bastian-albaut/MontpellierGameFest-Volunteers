import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/FAQ/sectionFAQ.module.scss';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const SectionFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editFAQ, setEditFAQ] = useState<FAQ | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    // Remplacez cette fonction par votre appel API réel pour récupérer les FAQs
    const fetchFAQs = async (): Promise<FAQ[]> => {
      return [
        { id: 1, question: "Quelle est la question 1?", answer: "Réponse à la question 1." },
        { id: 2, question: "Quelle est la question 2?", answer: "Réponse à la question 2." },
      ];
    };
    fetchFAQs().then(data => setFaqs(data));
  }, []);

  const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion(e.target.value);
  };

  const handleNewAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewAnswer(e.target.value);
  };

  const handleAddFAQ = () => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    const newFAQ = { id: newId, question: newQuestion, answer: newAnswer };
    setFaqs([...faqs, newFAQ]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleEdit = (faqToEdit: FAQ) => {
    setEditFAQ(faqToEdit);
  };

  const handleCancel = () => {
    setEditFAQ(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'question' | 'answer') => {
    if (editFAQ) {
      setEditFAQ({ ...editFAQ, [field]: event.target.value });
    }
  };

  const handleSave = (id: number) => {
    if (editFAQ) {
      setFaqs(faqs.map(faq => faq.id === id ? { ...faq, question: editFAQ.question, answer: editFAQ.answer } : faq));
      setEditFAQ(null);
    }
  };

  const handleDelete = (idToDelete: number) => {
    setFaqs(faqs.filter(faq => faq.id !== idToDelete));
  };

  return (
    <div className={styles.faqContainer}>
      <div>
        <input
          type="text"
          placeholder="Entrez la nouvelle question"
          value={newQuestion}
          onChange={handleNewQuestionChange}
        />
        <textarea
          placeholder="Entrez la réponse"
          value={newAnswer}
          onChange={handleNewAnswerChange}
        />
        <button onClick={handleAddFAQ}>Ajouter une question</button>
      </div>

      {faqs.map((faq) => (
        <div key={faq.id} className={styles.faqItem}>
          {editFAQ && editFAQ.id === faq.id ? (
            <>
              <input
                type="text"
                value={editFAQ.question}
                onChange={(e) => handleChange(e, 'question')}
              />
              <textarea
                value={editFAQ.answer}
                onChange={(e) => handleChange(e, 'answer')}
              />
              <button onClick={() => handleSave(faq.id)}>Sauvegarder</button>
              <button onClick={handleCancel}>Annuler</button>
            </>
          ) : (
            <>
              <div className={styles.question}>{faq.question}</div>
              <div className={styles.answer}>{faq.answer}</div>
              <button onClick={() => handleEdit(faq)}>Modifier</button>
              <button onClick={() => handleDelete(faq.id)}>Supprimer</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionFAQ;
