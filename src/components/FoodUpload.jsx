import { useState } from "react";
import { analyzeFood, saveFoodLog } from "../services/foodService";
import { useToast } from "../context/ToastContext";

export default function FoodUpload({ onSaved }) {
  const { toast } = useToast();
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    const analysis = await analyzeFood(file);
    setResult(analysis);
    saveFoodLog({ ...analysis, imageName: file.name });
    onSaved?.(analysis);
    setBusy(false);
    toast("Meal logged with estimated nutrition.");
  }

  return (
    <div>
      <label className="secondary-btn" style={{ display: "inline-block" }}>
        Upload or take a photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {preview && <img className="food-preview" src={preview} alt="Meal preview" />}
      {busy && <p className="loading-pulse">Estimating nutrition…</p>}
      {result && (
        <div>
          <p className="disclaimer">{result.disclaimer}</p>
          <div className="profile-grid">
            <div><small>Calories</small><strong>{result.calories}</strong></div>
            <div><small>Protein</small><strong>{result.protein} g</strong></div>
            <div><small>Carbs</small><strong>{result.carbohydrates} g</strong></div>
            <div><small>Fat</small><strong>{result.fat} g</strong></div>
          </div>
          <p><strong>Suggestion for your goal</strong><br />{result.suggestion}</p>
        </div>
      )}
    </div>
  );
}
