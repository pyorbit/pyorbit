"use client";

import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  Code2,
  Flame,
  ListChecks,
  Play,
  RotateCcw,
  Search,
  Target,
  Terminal,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

type Lesson = {
  id: string;
  module: string;
  title: string;
  level: "Старт" | "База" | "Практика";
  minutes: number;
  summary: string;
  goals: string[];
  theory: string;
  starterCode: string;
  expectedOutput: string;
  requiredSnippets: string[];
};

type LessonTab = "theory" | "practice" | "goals";

const lessons: Lesson[] = [
  {
    id: "variables",
    module: "Основы",
    title: "Переменные и вывод",
    level: "Старт",
    minutes: 12,
    summary: "Собери первое маленькое состояние программы: имя, возраст и вывод.",
    goals: ["Создать переменные", "Использовать print", "Собрать строку с f-string"],
    theory:
      "Переменная хранит значение под понятным именем. В Python не нужно указывать тип заранее: интерпретатор сам понимает, что в переменной лежит строка, число или другой объект.",
    starterCode:
      'name = "Аня"\nage = 14\n\n# Выведи: Аня изучает Python, ей 14\nprint()',
    expectedOutput: "Аня изучает Python, ей 14",
    requiredSnippets: ["name", "age", "print", "f"],
  },
  {
    id: "conditions",
    module: "Логика",
    title: "Условия if",
    level: "База",
    minutes: 16,
    summary: "Научи программу принимать простое решение по количеству баллов.",
    goals: ["Сравнить числа", "Написать if/else", "Вывести разные ответы"],
    theory:
      "Условие позволяет программе выбрать ветку выполнения. Блок после if запускается, когда выражение истинно. Блок else нужен для запасного сценария.",
    starterCode:
      'score = 82\n\n# Если score больше или равно 70, выведи "Зачет", иначе "Повторить"\n',
    expectedOutput: "Зачет",
    requiredSnippets: ["if", "else", "score", "print"],
  },
  {
    id: "loops",
    module: "Автоматизация",
    title: "Цикл for",
    level: "Практика",
    minutes: 18,
    summary: "Посчитай сумму покупок без ручного сложения каждой позиции.",
    goals: ["Пройти по списку", "Накопить сумму", "Вывести итог"],
    theory:
      "Цикл for повторяет один и тот же блок кода для каждого элемента коллекции. Это основной инструмент, когда количество действий зависит от данных.",
    starterCode:
      "prices = [120, 80, 300]\ntotal = 0\n\n# Посчитай сумму цен циклом и выведи total\n",
    expectedOutput: "500",
    requiredSnippets: ["for", "in", "total", "print"],
  },
  {
    id: "functions",
    module: "Архитектура",
    title: "Функции",
    level: "Практика",
    minutes: 22,
    summary: "Вынеси повторяемую логику в функцию с понятным названием.",
    goals: ["Объявить функцию", "Вернуть значение", "Вызвать функцию"],
    theory:
      "Функция превращает несколько строк кода в переиспользуемое действие. Хорошая функция делает одну понятную вещь и возвращает результат через return.",
    starterCode:
      '# Напиши функцию discount(price), которая возвращает цену со скидкой 10%\n# Для 1000 нужно вывести 900\n',
    expectedOutput: "900",
    requiredSnippets: ["def", "return", "discount", "print"],
  },
];

const starterCompleted = new Set(["variables"]);

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function Home() {
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [activeTab, setActiveTab] = useState<LessonTab>("theory");
  const [searchQuery, setSearchQuery] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(starterCompleted);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson.starterCode])),
  );
  const [result, setResult] = useState<{
    lessonId: string;
    status: "idle" | "success" | "warning";
    message: string;
  }>({
    lessonId: lessons[0].id,
    status: "idle",
    message: "Готово к проверке",
  });

  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0],
    [activeLessonId],
  );

  const activeAnswer = answers[activeLesson.id] ?? activeLesson.starterCode;
  const progress = Math.round((completed.size / lessons.length) * 100);
  const remainingMinutes = lessons
    .filter((lesson) => !completed.has(lesson.id))
    .reduce((sum, lesson) => sum + lesson.minutes, 0);

  const filteredLessons = useMemo(() => {
    const query = normalize(searchQuery);

    if (!query) {
      return lessons;
    }

    return lessons.filter((lesson) =>
      normalize(`${lesson.module} ${lesson.title} ${lesson.summary}`).includes(
        query,
      ),
    );
  }, [searchQuery]);

  const groupedLessons = useMemo(
    () =>
      filteredLessons.reduce<Record<string, Lesson[]>>((groups, lesson) => {
        groups[lesson.module] = [...(groups[lesson.module] ?? []), lesson];
        return groups;
      }, {}),
    [filteredLessons],
  );

  function updateAnswer(value: string) {
    setAnswers((current) => ({ ...current, [activeLesson.id]: value }));
    setResult({
      lessonId: activeLesson.id,
      status: "idle",
      message: "Готово к проверке",
    });
  }

  function resetLesson() {
    setAnswers((current) => ({
      ...current,
      [activeLesson.id]: activeLesson.starterCode,
    }));
    setResult({
      lessonId: activeLesson.id,
      status: "idle",
      message: "Черновик сброшен",
    });
  }

  function checkAnswer() {
    const answer = normalize(activeAnswer);
    const hasRequiredSyntax = activeLesson.requiredSnippets.every((snippet) =>
      answer.includes(snippet.toLowerCase()),
    );
    const hasExpectedOutput = answer.includes(
      normalize(activeLesson.expectedOutput),
    );

    if (hasRequiredSyntax && hasExpectedOutput) {
      setCompleted((current) => new Set(current).add(activeLesson.id));
      setResult({
        lessonId: activeLesson.id,
        status: "success",
        message: "Задание принято. Можно переходить дальше.",
      });
      return;
    }

    setResult({
      lessonId: activeLesson.id,
      status: "warning",
      message:
        "Проверь синтаксис и убедись, что в коде есть ожидаемый вывод.",
    });
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Учебная навигация">
        <div className="brand">
          <div className="brand-mark">
            <Code2 size={24} strokeWidth={2.4} />
          </div>
          <div>
            <p className="eyebrow">PyOrbit</p>
            <h1>Python с практикой</h1>
          </div>
        </div>

        <label className="search">
          <Search size={18} />
          <input
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Найти урок"
            type="search"
            value={searchQuery}
          />
        </label>

        <nav className="lesson-nav">
          {Object.entries(groupedLessons).map(([module, moduleLessons]) => (
            <section className="lesson-group" key={module}>
              <p>{module}</p>
              {moduleLessons.map((lesson) => {
                const isActive = lesson.id === activeLesson.id;
                const isDone = completed.has(lesson.id);

                return (
                  <button
                    className={isActive ? "lesson-link active" : "lesson-link"}
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setActiveTab("theory");
                      setResult({
                        lessonId: lesson.id,
                        status: "idle",
                        message: "Готово к проверке",
                      });
                    }}
                    type="button"
                  >
                    {isDone ? (
                      <CheckCircle2 className="done-icon" size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                    <span>{lesson.title}</span>
                  </button>
                );
              })}
            </section>
          ))}
          {filteredLessons.length === 0 ? (
            <p className="empty-state">Уроки не найдены</p>
          ) : null}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Персональная траектория</p>
            <h2>От первых переменных до собственных функций</h2>
          </div>
          <div className="streak">
            <Flame size={18} />
            <span>4 дня подряд</span>
          </div>
        </header>

        <section className="stats-grid" aria-label="Прогресс обучения">
          <div className="metric">
            <Trophy size={20} />
            <span>{progress}%</span>
            <p>пройдено</p>
          </div>
          <div className="metric">
            <ListChecks size={20} />
            <span>
              {completed.size}/{lessons.length}
            </span>
            <p>уроков</p>
          </div>
          <div className="metric">
            <Clock3 size={20} />
            <span>{remainingMinutes} мин</span>
            <p>осталось</p>
          </div>
        </section>

        <section className="lesson-layout">
          <article className="lesson-panel">
            <div className="lesson-heading">
              <div>
                <span className="level-pill">{activeLesson.level}</span>
                <h3>{activeLesson.title}</h3>
                <p>{activeLesson.summary}</p>
              </div>
              <div className="duration">
                <Clock3 size={18} />
                {activeLesson.minutes} мин
              </div>
            </div>

            <div className="tabs" role="tablist" aria-label="Разделы урока">
              <button
                aria-selected={activeTab === "theory"}
                className={activeTab === "theory" ? "tab active" : "tab"}
                onClick={() => setActiveTab("theory")}
                role="tab"
                type="button"
              >
                <BookOpen size={16} />
                Теория
              </button>
              <button
                aria-selected={activeTab === "practice"}
                className={activeTab === "practice" ? "tab active" : "tab"}
                onClick={() => setActiveTab("practice")}
                role="tab"
                type="button"
              >
                <Terminal size={16} />
                Практика
              </button>
              <button
                aria-selected={activeTab === "goals"}
                className={activeTab === "goals" ? "tab active" : "tab"}
                onClick={() => setActiveTab("goals")}
                role="tab"
                type="button"
              >
                <Target size={16} />
                Цель
              </button>
            </div>

            {activeTab === "theory" ? (
              <p className="theory">{activeLesson.theory}</p>
            ) : null}

            {activeTab === "practice" ? (
              <div className="snippet-list">
                {activeLesson.requiredSnippets.map((snippet) => (
                  <code className="snippet" key={snippet}>
                    {snippet}
                  </code>
                ))}
              </div>
            ) : null}

            {activeTab === "goals" ? (
              <div className="goal-list">
                {activeLesson.goals.map((goal) => (
                  <div className="goal" key={goal}>
                    <CheckCircle2 size={17} />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          <article className="practice-panel">
            <div className="practice-header">
              <div>
                <p className="eyebrow">Практика</p>
                <h3>Напиши решение</h3>
              </div>
              <div className="expected">
                <span>Ожидаемый вывод</span>
                <code>{activeLesson.expectedOutput}</code>
              </div>
            </div>

            <textarea
              aria-label="Редактор кода"
              className="code-editor"
              onChange={(event) => updateAnswer(event.target.value)}
              spellCheck={false}
              value={activeAnswer}
            />

            <div className="practice-actions">
              <button className="secondary-action" onClick={resetLesson} type="button">
                <RotateCcw size={17} />
                Сбросить
              </button>
              <button className="primary-action" onClick={checkAnswer} type="button">
                <Play size={18} fill="currentColor" />
                Проверить
              </button>
            </div>

            <div
              className={`result ${result.status}`}
              role="status"
              aria-live="polite"
            >
              {result.status === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <Terminal size={18} />
              )}
              <span>
                {result.lessonId === activeLesson.id
                  ? result.message
                  : "Готово к проверке"}
              </span>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
