import { useMemo, useState } from "react";
import { EXERCISES, EXERCISE_FILTERS } from "../data/exercises";
import { useLanguage } from "../context/LanguageContext";

const labelMap = {
  Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced",
  Strength: "strength", Cardio: "cardio", Mobility: "mobility", Flexibility: "flexibility", Core: "core", Plyometric: "plyometric", Balance: "balance",
  Bodyweight: "bodyweight", Dumbbells: "dumbbells", Barbell: "barbell", Cable: "cable", Machine: "machine", "Resistance band": "band", Kettlebell: "kettlebell", Bench: "bench", "Pull-up bar": "pullup", "Cardio machine": "cardioMachine", Other: "otherEquipment",
};

function Icon({ name, size = 24 }) {
  const paths = {
    chest: (
      <>
        <path d="M5 8c2-2 4-2 7 0 3-2 5-2 7 0" />
        <path d="M7 9v7M17 9v7M7 13h10" />
      </>
    ),
    back: (
      <>
        <path d="M9 4c0 3-1 4-2 6v8h10v-8c-1-2-2-3-2-6" />
        <path d="M9 8h6M10 12h4M9 16h6" />
      </>
    ),
    shoulders: (
      <>
        <path d="M8 5 4 8l2 5 3-2v8h6v-8l3 2 2-5-4-3" />
      </>
    ),
    arms: (
      <>
        <path d="M8 6c-1 3-3 4-4 7l3 2 3-5" />
        <path d="M16 6c1 3 3 4 4 7l-3 2-3-5" />
      </>
    ),
    legs: (
      <>
        <path d="M9 5v7l-2 8M15 5v7l2 8" />
        <path d="M9 12h6" />
      </>
    ),
    core: (
      <>
        <rect x="7" y="5" width="10" height="14" rx="3" />
        <path d="M7 9h10M7 14h10" />
      </>
    ),
    fullBody: (
      <>
        <circle cx="12" cy="4" r="2.5" />
        <path d="M12 7v6M8 9l4 3 4-3M9 19l3-6 3 6" />
      </>
    ),
    strength: (
      <>
        <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
      </>
    ),
    cardio: (
      <>
        <path d="M4 13h4l2-5 3 9 2-4h5" />
      </>
    ),
    mobility: (
      <>
        <path d="M6 18c4-8 8-8 12-12" />
        <path d="M14 6h4v4" />
        <path d="M10 18H6v-4" />
      </>
    ),
    flexibility: (
      <>
        <path d="M6 17c3-7 6-9 12-11" />
        <path d="M6 17h5M18 6v5" />
      </>
    ),
    plyometric: (
      <>
        <path d="M12 3v5M8 5l4 3 4-3M7 14l5-6 5 6M9 20l3-6 3 6" />
      </>
    ),
    balance: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="M12 7v7M12 10l-5 3M12 10l5 3M12 14l-5 5M12 14l5 5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.fullBody}
    </svg>
  );
}

const muscleIcons = {
  Chest: "chest",
  Back: "back",
  Shoulders: "shoulders",
  Biceps: "arms",
  Triceps: "arms",
  Quadriceps: "legs",
  Hamstrings: "legs",
  Glutes: "legs",
  Calves: "legs",
  Core: "core",
  "Lower Back": "back",
  Hips: "legs",
  "Full Body": "fullBody",
};

const typeIcons = {
  Strength: "strength",
  Cardio: "cardio",
  Mobility: "mobility",
  Flexibility: "flexibility",
  Core: "core",
  Plyometric: "plyometric",
  Balance: "balance",
};



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
    showFavorites && ["favorites", ` ${t("favorites", "Favorites")}`],
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
        <div className="exercise-hero-icon"></div>
      </section>

      <section className="exercise-toolbar">
        <label className="exercise-search-large">
          <span></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchExercises", "Search exercises, muscles, equipment...")} />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </label>
        <button type="button" className={`favorite-toggle ${showFavorites ? "active" : ""}`} onClick={() => setShowFavorites((v) => !v)}> {t("favorites", "Favorites")} <b>{favorites.length}</b></button>
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
        <div className="exercise-empty"><div></div><h3>{t("noExercises", "No exercises found")}</h3><p>Try a different search or remove one of the filters.</p><button className="primary-btn" onClick={clearFilters}>{t("clearFilters", "Clear filters")}</button></div>
      ) : (
        <div className="exercise-library-grid improved">
          {results.map((exercise) => {
            const open = openId === exercise.id;
            const favorite = favorites.includes(exercise.id);
            return (
              <article className={`exercise-library-card improved-card ${open ? "open" : ""}`} key={exercise.id}>
                <div className="exercise-card-cover">
                  <div className="exercise-big-icon">
  <Icon name={muscleIcons[exercise.muscle]} size={42} />
</div>
                  <span className={`difficulty-pill ${exercise.difficulty.toLowerCase()}`}>{localized(exercise.difficulty, t)}</span>
                  <button
  type="button"
  className={`exercise-favorite ${favorite ? "active" : ""}`}
  onClick={() => toggleFavorite(exercise.id)}
  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
  title={favorite ? "Remove from favorites" : "Add to favorites"}
>
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={favorite ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
</button>
                </div>
                <div className="exercise-card-content">
                  <div className="exercise-card-title improved-title"><div><h3>{exercise.name}</h3><p>{exercise.muscle}</p></div></div>
                  <div className="exercise-meta-grid"><span className="exercise-meta-item">
  <Icon name="strength" size={16} />
  {localized(exercise.equipment, t)}
</span><span> {localized(exercise.equipment, t)}</span></div>
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
