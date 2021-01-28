import React from 'react';
import QuizBackground from '../src/components/QuizBackground';
import db from '../db.json';

export default function PaginaPerguntas() {
  return (
    <QuizBackground backgroundImage={db.bg}>
      Página a ser criada.
    </QuizBackground>
  );
}
