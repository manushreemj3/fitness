import { useMemo, useState } from "react";
import { EXERCISES, EXERCISE_FILTERS } from "../data/exercises";
import { useLanguage } from "../context/LanguageContext";

const labelKey = (value) => value.toLowerCase().replace(/[^a-z]+/g, "");

function localizedValue(value, t) {
  const map = {
    Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced",
    Strength: "strength", Cardio: "cardio", Mobility: "mobility", Flexibility: "flexibility", Core: "core", Plyometric: "plyometric", Balance: "balance",
    Bodyweight: "bodyweight", Dumbbells: "dumbbells", Barbell: "barbell", Cable: "cable", Machine: "machine", "Resistance band": "band", Kettlebell: "kettlebell", Bench: "bench", "Pull-up bar": "pullup", "Cardio machine": "cardioMachine", Other: "otherEquipment",
  };
  return t(map[value] || labelKey(value), value);
}

export default function ExerciseLibrary() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [openId, setOpenId] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((exercise) => {
      const matchesQuery = !q || [exercise.name, exercise.muscle, exercise.equipment, exercise.type].some((value) => value.toLowerCase().includes(q));
      return matchesQuery &&
        (!muscle || exercise.muscle === muscle) &&
        (!equipment || exercise.equipment === equipment) &&
        (!difficulty || exercise.difficulty === difficulty) &&
        (!type || exercise.type === type);
    });
  }, [query, muscle, equipment, difficulty, type]);

  const clearFilters = () => {
    setQuery(""); setMuscle(""); setEquipment(""); setDifficulty(""); setType(""); setOpenId(null);
  };

  return (
    <div className="exercise-library-page">
      <div className="mode-header">
        <div>
          <span className="eyebrow">FITBUDDY</span>
          <h2>{t("exerciseLibrary")}</h2>
          <p>{t("exerciseLibrarySubtitle")}</p>
        </div>
        <div className="exercise-count-badge">🏋️ {results.length} {t("exercisesFound")}</div>
      </div>

      <div className="exercise-filters">
        <label className="exercise-search">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchExercises")} />
        </label>
        <label className="field filter-field"><span>{t("muscle")}</span><select value={muscle} onChange={(e) => setMuscle(e.target.value)}><option value="">{t("all")}</option>{EXERCISE_FILTERS.muscles.map((item) => <option key={item} value={item}>{localizedValue(item, t)}</option>)}</select></label>
        <label className="field filter-field"><span>{t("equipment")}</span><select value={equipment} onChange={(e) => setEquipment(e.target.value)}><option value="">{t("all")}</option>{EXERCISE_FILTERS.equipment.map((item) => <option key={item} value={item}>{localizedValue(item, t)}</option>)}</select></label>
        <label className="field filter-field"><span>{t("difficulty")}</span><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="">{t("all")}</option>{EXERCISE_FILTERS.difficulties.map((item) => <option key={item} value={item}>{localizedValue(item, t)}</option>)}</select></label>
        <label className="field filter-field"><span>{t("exerciseType")}</span><select value={type} onChange={(e) => setType(e.target.value)}><option value="">{t("all")}</option>{EXERCISE_FILTERS.types.map((item) => <option key={item} value={item}>{localizedValue(item, t)}</option>)}</select></label>
        <button type="button" className="ghost-btn filter-clear" onClick={clearFilters}>{t("clearFilters")}</button>
      </div>

      {results.length === 0 ? (
        <div className="empty-state-card"><div className="empty-icon">🔎</div><h3>{t("noExercises")}</h3><button className="secondary-btn" onClick={clearFilters}>{t("clearFilters")}</button></div>
      ) : (
        <div className="exercise-library-grid">
          {results.map((exercise) => {
            const open = openId === exercise.id;
            return (
              <article className={`exercise-library-card ${open ? "open" : ""}`} key={exercise.id}>
                <div className="exercise-card-top">
                  <div className="exercise-avatar">💪</div>
                  <div className="exercise-card-title"><h3>{exercise.name}</h3><p>{exercise.muscle}</p></div>
                  <span className={`difficulty-pill ${exercise.difficulty.toLowerCase()}`}>{localizedValue(exercise.difficulty, t)}</span>
                </div>
                <div className="exercise-tags"><span>{localizedValue(exercise.type, t)}</span><span>{localizedValue(exercise.equipment, t)}</span></div>
                <button className="exercise-instructions-btn" onClick={() => setOpenId(open ? null : exercise.id)}>
                  {open ? t("hideInstructions") : t("viewInstructions")}
                </button>
                {open && (
                  <div className="exercise-instructions">
                    <p><strong>{t("primaryMuscle")}:</strong> {exercise.muscle}</p>
                    <p><strong>{t("howTo")}:</strong> {exercise.description}</p>
                    <p><strong>{t("tip")}:</strong> {exercise.tip}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
