/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import Head from 'next/head';

import QuizBackground from '../src/components/QuizBackground';
import db from '../db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Espere um pouco]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  questao,
  totalQuestoes,
  questaoIndex,
  onSubmit,
}) {
  const questaoId = `questao__${questaoIndex}`;
  return (
    <Widget>
      <Widget.Header>
        <h3>
          Pergunta
          {` ${questaoIndex + 1} `}
          de
          {` ${totalQuestoes}`}
        </h3>
      </Widget.Header>
      <img
        alt="descrição"
        style={{
          width: '100%',
          height: '120px',
          objectFit: 'cover',
        }}
        src={questao.image}
      />
      <Widget.Content>
        <h2>
          {questao.title}
        </h2>
        <p>
          {questao.description}
        </p>

        <form onSubmit={(evento) => {
          evento.preventDefault();
          onSubmit();
        }}
        >
          {questao.alternatives.map((alternativa, alternativaIndex) => {
            const alternativaId = `alternativa__${alternativaIndex}`;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativaId}
              >
                <input
                  // style={{
                  //   display: 'none',
                  // }}
                  id={alternativaId}
                  name={questaoId}
                  type="radio"
                />
                {alternativa}
              </Widget.Topic>
            );
          })}
          <Button type="submit">
            Confirmar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

const estadoTela = {
  QUIZ: 'QUIZ',
  CARREGANDO: 'CARREGANDO',
  RESULTADO: 'RESULTADO',
};

export default function PaginaPerguntas() {
  const [estadoTelaAtual, setEstadoTela] = React.useState(estadoTela.CARREGANDO);
  const [questaoAtual, setQuestaoAtual] = React.useState(0);
  const questaoIndex = questaoAtual;
  const questao = db.questions[questaoAtual];
  const totalQuestoes = db.questions.length;

  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setEstadoTela(estadoTela.QUIZ);
    }, 2 * 1000);
  // nasce === didMount
  }, []);

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount

  function lidarSubmeterQuiz() {
    const proximaQuestao = questaoIndex + 1;
    if (proximaQuestao < totalQuestoes) {
      setQuestaoAtual(proximaQuestao);
    } else {
      setEstadoTela(estadoTela.RESULTADO);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>{db.title}</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        {estadoTelaAtual === estadoTela.QUIZ && (
          <QuestionWidget
            questao={questao}
            totalQuestoes={totalQuestoes}
            questaoIndex={questaoAtual}
            onSubmit={lidarSubmeterQuiz}
          />
        )}
        {estadoTelaAtual === estadoTela.CARREGANDO && <LoadingWidget />}
        {estadoTelaAtual === estadoTela.RESULTADO && <div>acertou</div>}
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/lucaNeves" />
    </QuizBackground>
  );
}
