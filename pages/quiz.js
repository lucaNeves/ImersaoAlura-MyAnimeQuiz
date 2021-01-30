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
import AlternativesForm from '../src/components/AlternativeForm';

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

function ResultWidget({ resultados }) {
  return (
    <Widget>
      <Widget.Header>
        <h1>Seus Resultados</h1>
      </Widget.Header>
      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {resultados.filter((acerto) => acerto).length}
          {' '}
          pergunta(s)
        </p>
        <ul>
          {resultados.map((result, index) => (
            <li key={`result__${result}`}>
              #
              {index + 1}
              {' '}
              Resultado:
              {' '}
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  questao,
  totalQuestoes,
  questaoIndex,
  onSubmit,
  addResultado,
}) {
  const [alternativaSelecionada, setAlternativaSelecionada] = React.useState(undefined);
  const [isQuestaoSubmit, setIsQuestaoSubmit] = React.useState(false);
  const questaoId = `questao__${questaoIndex}`;
  const isCorrect = alternativaSelecionada === questao.answer;
  const alternativaFoiEscolhida = alternativaSelecionada !== undefined;
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

        <AlternativesForm
          onSubmit={(evento) => {
            evento.preventDefault();
            setIsQuestaoSubmit(true);
            setTimeout(() => {
              setIsQuestaoSubmit(false);
              setAlternativaSelecionada(undefined);
              onSubmit();
              addResultado(isCorrect);
            }, 2.5 * 1000);
          }}
        >
          {questao.alternatives.map((alternativa, alternativaIndex) => {
            const alternativaId = `alternativa__${alternativaIndex}`;
            const alternativaStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = alternativaSelecionada === alternativaIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativaId}
                htmlFor={alternativaId}
                data-selected={isSelected}
                data-status={isQuestaoSubmit && alternativaStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativaId}
                  name={questaoId}
                  onChange={() => setAlternativaSelecionada(alternativaIndex)}
                  type="radio"
                />
                {alternativa}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={!alternativaFoiEscolhida}>
            Confirmar
          </Button>
          {isQuestaoSubmit && isCorrect && <p>Acertou!</p>}
          {isQuestaoSubmit && !isCorrect && <p>Errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const estadosTela = {
  QUIZ: 'QUIZ',
  CARREGANDO: 'CARREGANDO',
  RESULTADO: 'RESULTADO',
};

export default function PaginaPerguntas() {
  const [estadoTelaAtual, setEstadoTela] = React.useState(estadosTela.CARREGANDO);
  const [resultados, setResultados] = React.useState([]);
  const [questaoAtual, setQuestaoAtual] = React.useState(0);
  const questaoIndex = questaoAtual;
  const questao = db.questions[questaoAtual];
  const totalQuestoes = db.questions.length;

  function addResultado(resultado) {
    setResultados([
      ...resultados,
      resultado,
    ]);
  }

  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setEstadoTela(estadosTela.QUIZ);
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
      setEstadoTela(estadosTela.RESULTADO);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>{db.title}</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        {estadoTelaAtual === estadosTela.QUIZ && (
          <QuestionWidget
            questao={questao}
            totalQuestoes={totalQuestoes}
            questaoIndex={questaoAtual}
            onSubmit={lidarSubmeterQuiz}
            addResultado={addResultado}
          />
        )}
        {estadoTelaAtual === estadosTela.CARREGANDO && <LoadingWidget />}
        {estadoTelaAtual === estadosTela.RESULTADO && <ResultWidget resultados={resultados} />}
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/lucaNeves" />
    </QuizBackground>
  );
}
