import { useMemo, useState } from "react";
import { EXERCISES, EXERCISE_FILTERS } from "../data/exercises";
import { useLanguage } from "../context/LanguageContext";

const labelMap = {
  Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced",
  Strength: "strength", Cardio: "cardio", Mobility: "mobility", Flexibility: "flexibility", Core: "core", Plyometric: "plyometric", Balance: "balance",
  Bodyweight: "bodyweight", Dumbbells: "dumbbells", Barbell: "barbell", Cable: "cable", Machine: "machine", "Resistance band": "band", Kettlebell: "kettlebell", Bench: "bench", "Pull-up bar": "pullup", "Cardio machine": "cardioMachine", Other: "otherEquipment",
};

const icons = { Chest: "🫀", Back: "🪽", Shoulders: "🏹", Biceps: "💪", Triceps: "🦾", Quadriceps: "🦵", Hamstrings: "🦿", Glutes: "🍑", Calves: "🦶", Core: "🎯", "Lower Back": "🔩", Hips: "🧘", "Full Body": "🔥" };
const typeIcons = { Strength: "🏋️", Cardio: "❤️", Mobility: "🧘", Flexibility: "🤸", Core: "🎯", Plyometric: "⚡", Balance: "⚖️" };

function localized(value, t) { return t(labelMap[value] || value.toLowerCase().replace(/[^a-z]+/g, ""), value); }

export default function ExerciseLibrary() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("name");
  const [openId, setOpenId] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("fitbuddy_exercise_favorites") || "[]"));
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      localStorage.setItem("fitbuddy_exercise_favorites", JSON.stringify(next));
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = EXERCISES.filter((exercise) => {
      const searchable = [exercise.name, exercise.muscle, exercise.equipment, exercise.type, exercise.difficulty].join(" ").toLowerCase();
      return (!q || searchable.includes(q)) && (!muscle || exercise.muscle === muscle) && (!equipment || exercise.equipment === equipment) && (!difficulty || exercise.difficulty === difficulty) && (!type || exercise.type === type) && (!showFavorites || favorites.includes(exercise.id));
    });
    return [...filtered].sort((a, b) => sort === "difficulty" ? ["Beginner", "Intermediate", "Advanced"].indexOf(a.difficulty) - ["Beginner", "Intermediate", "Advanced"].indexOf(b.difficulty) : sort === "muscle" ? a.muscle.localeCompare(b.muscle) : a.name.localeCompare(b.name));
  }, [query, muscle, equipment, difficulty, type, sort, showFavorites, favorites]);

  const activeFilters = [
    muscle && ["muscle", localized(muscle, t)],
    equipment && ["equipment", localized(equipment, t)],
    difficulty && ["difficulty", localized(difficulty, t)],
    type && ["type", localized(type, t)],
    showFavorites && ["favorites", `★ ${t("favorites", "Favorites")}`],
  ].filter(Boolean);

  const clearFilters = () => { setQuery(""); setMuscle(""); setEquipment(""); setDifficulty(""); setType(""); setShowFavorites(false); setOpenId(null); };

  return (
    <div className="exercise-library-page">
      <section className="exercise-hero">
        <div className="exercise-hero-copy">
          <span className="eyebrow">FITBUDDY • TRAIN SMART</span>
          <h1>{t("exerciseLibrary", "Exercise Library")}</h1>
          <p>{t("exerciseLibrarySubtitle", "Find the right movement, learn the form, and build your next workout.")}</p>
          <div className="exercise-hero-stats">
            <span><strong>{EXERCISES.length}</strong> exercises</span>
            <span><strong>{EXERCISE_FILTERS.muscles.length}</strong> muscle groups</span>
            <span><strong>{EXERCISE_FILTERS.equipment.length}</strong> equipment types</span>
          </div>
        </div>
        <div className="exercise-hero-icon">🏋️</div>
      </section>

      <section className="exercise-toolbar">
        <label className="exercise-search-large">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchExercises", "Search exercises, muscles, equipment...")} />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </label>
        <button type="button" className={`favorite-toggle ${showFavorites ? "active" : ""}`} onClick={() => setShowFavorites((v) => !v)}>★ {t("favorites", "Favorites")} <b>{favorites.length}</b></button>
      </section>

      <div className="exercise-filter-row">
        <label className="exercise-select"><small>{t("muscle", "Muscle")}</small><select value={muscle} onChange={(e) => setMuscle(e.target.value)}><option value="">{t("all", "All muscles")}</option>{EXERCISE_FILTERS.muscles.map((x) => <option key={x} value={x}>{localized(x, t)}</option>)}</select></label>
        <label className="exercise-select"><small>{t("equipment", "Equipment")}</small><select value={equipment} onChange={(e) => setEquipment(e.target.value)}><option value="">{t("all", "All equipment")}</option>{EXERCISE_FILTERS.equipment.map((x) => <option key={x} value={x}>{localized(x, t)}</option>)}</select></label>
        <label className="exercise-select"><small>{t("difficulty", "Difficulty")}</small><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="">{t("all", "All levels")}</option>{EXERCISE_FILTERS.difficulties.map((x) => <option key={x} value={x}>{localized(x, t)}</option>)}</select></label>
        <label className="exercise-select"><small>{t("exerciseType", "Type")}</small><select value={type} onChange={(e) => setType(e.target.value)}><option value="">{t("all", "All types")}</option>{EXERCISE_FILTERS.types.map((x) => <option key={x} value={x}>{localized(x, t)}</option>)}</select></label>
        <label className="exercise-select sort-select"><small>Sort</small><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="name">A–Z</option><option value="muscle">Muscle</option><option value="difficulty">Difficulty</option></select></label>
      </div>

      <div className="exercise-results-bar">
        <div><strong>{results.length}</strong> {t("exercisesFound", "exercises found")}{activeFilters.length > 0 && <div className="active-filter-chips">{activeFilters.map(([key, value]) => <span key={key}>{value}</span>)}</div>}</div>
        {(activeFilters.length || query) > 0 && <button className="text-button" onClick={clearFilters}>{t("clearFilters", "Clear all")}</button>}
      </div>

      {results.length === 0 ? (
        <div className="exercise-empty"><div>🔎</div><h3>{t("noExercises", "No exercises found")}</h3><p>Try a different search or remove one of the filters.</p><button className="primary-btn" onClick={clearFilters}>{t("clearFilters", "Clear filters")}</button></div>
      ) : (
        <div className="exercise-library-grid improved">
          {results.map((exercise) => {
            const open = openId === exercise.id;
            const favorite = favorites.includes(exercise.id);
            return (
              <article className={`exercise-library-card improved-card ${open ? "open" : ""}`} key={exercise.id}>
                <div className="exercise-card-cover">
                  <div className="exercise-big-icon">{icons[exercise.muscle] || "🏋️"}</div>
                  <span className={`difficulty-pill ${exercise.difficulty.toLowerCase()}`}>{localized(exercise.difficulty, t)}</span>
                  <button className={`exercise-favorite ${favorite ? "active" : ""}`} onClick={() => toggleFavorite(exercise.id)} aria-label="Favorite exercise">{favorite ? "★" : "☆"}</button>
                </div>
                <div className="exercise-card-content">
                  <div className="exercise-card-title improved-title"><div><h3>{exercise.name}</h3><p>{exercise.muscle}</p></div></div>
                  <div className="exercise-meta-grid"><span>{typeIcons[exercise.type] || "🏋️"} {localized(exercise.type, t)}</span><span>⚙️ {localized(exercise.equipment, t)}</span></div>
                  <button className="exercise-details-btn" onClick={() => setOpenId(open ? null : exercise.id)}>{open ? "Hide details ↑" : "View exercise details →"}</button>
                  {open && <div className="exercise-details-panel"><div><strong>Primary muscle</strong><span>{exercise.muscle}</span></div><div><strong>How to perform</strong><p>{exercise.description}</p></div><div><strong>FitBuddy tip</strong><p>{exercise.tip}</p></div></div>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
