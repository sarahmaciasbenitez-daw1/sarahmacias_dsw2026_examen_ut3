export interface Citation {
  documentId: string;
  title: string;
}

export interface Answer {
  answer: string;
  citations: Citation[];
}

// Respuesta simulada fija: más adelante se sustituirá por la lógica real.
export function answerQuestion(): Answer {
  return {
    answer: 'Esta es una respuesta simulada a tu pregunta.',
    citations: [
      {
        documentId: '11111111-1111-4111-8111-111111111111',
        title: 'Guía pública del centro',
      },
      {
        documentId: '22222222-2222-4222-8222-222222222222',
        title: 'Normas de convivencia',
      },
    ],
  };
}