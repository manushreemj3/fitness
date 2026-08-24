const rows = [
  ["Barbell Back Squat","Quadriceps","Barbell","Intermediate","Strength"],["Front Squat","Quadriceps","Barbell","Advanced","Strength"],["Goblet Squat","Quadriceps","Kettlebell","Beginner","Strength"],["Bodyweight Squat","Quadriceps","Bodyweight","Beginner","Strength"],["Split Squat","Quadriceps","Bodyweight","Beginner","Strength"],["Bulgarian Split Squat","Quadriceps","Dumbbells","Intermediate","Strength"],["Reverse Lunge","Quadriceps","Bodyweight","Beginner","Strength"],["Walking Lunge","Quadriceps","Bodyweight","Beginner","Strength"],["Dumbbell Lunge","Quadriceps","Dumbbells","Intermediate","Strength"],["Step-Up","Quadriceps","Bench","Beginner","Strength"],["Leg Press","Quadriceps","Machine","Beginner","Strength"],["Hack Squat","Quadriceps","Machine","Intermediate","Strength"],
  ["Barbell Romanian Deadlift","Hamstrings","Barbell","Intermediate","Strength"],["Dumbbell Romanian Deadlift","Hamstrings","Dumbbells","Beginner","Strength"],["Good Morning","Hamstrings","Barbell","Intermediate","Strength"],["Nordic Hamstring Curl","Hamstrings","Bodyweight","Advanced","Strength"],["Lying Leg Curl","Hamstrings","Machine","Beginner","Strength"],["Seated Leg Curl","Hamstrings","Machine","Beginner","Strength"],["Single-Leg RDL","Hamstrings","Dumbbells","Intermediate","Balance"],["Glute-Ham Raise","Hamstrings","Bodyweight","Advanced","Strength"],
  ["Barbell Hip Thrust","Glutes","Barbell","Intermediate","Strength"],["Dumbbell Hip Thrust","Glutes","Dumbbells","Beginner","Strength"],["Glute Bridge","Glutes","Bodyweight","Beginner","Strength"],["Single-Leg Glute Bridge","Glutes","Bodyweight","Intermediate","Strength"],["Cable Pull-Through","Glutes","Cable","Beginner","Strength"],["Kettlebell Swing","Glutes","Kettlebell","Intermediate","Plyometric"],["Curtsy Lunge","Glutes","Bodyweight","Beginner","Strength"],["Cable Kickback","Glutes","Cable","Beginner","Strength"],["Hip Abduction","Glutes","Machine","Beginner","Strength"],["Frog Pumps","Glutes","Bodyweight","Beginner","Strength"],
  ["Barbell Bench Press","Chest","Barbell","Intermediate","Strength"],["Dumbbell Bench Press","Chest","Dumbbells","Beginner","Strength"],["Incline Barbell Bench Press","Chest","Barbell","Intermediate","Strength"],["Incline Dumbbell Press","Chest","Dumbbells","Beginner","Strength"],["Decline Bench Press","Chest","Barbell","Intermediate","Strength"],["Push-Up","Chest","Bodyweight","Beginner","Strength"],["Wide Push-Up","Chest","Bodyweight","Beginner","Strength"],["Diamond Push-Up","Chest","Bodyweight","Intermediate","Strength"],["Chest Fly","Chest","Machine","Beginner","Strength"],["Cable Crossover","Chest","Cable","Beginner","Strength"],["Dumbbell Pullover","Chest","Dumbbells","Intermediate","Strength"],["Pec Deck","Chest","Machine","Beginner","Strength"],
  ["Pull-Up","Back","Pull-up bar","Intermediate","Strength"],["Chin-Up","Back","Pull-up bar","Intermediate","Strength"],["Lat Pulldown","Back","Cable","Beginner","Strength"],["Single-Arm Dumbbell Row","Back","Dumbbells","Beginner","Strength"],["Barbell Bent-Over Row","Back","Barbell","Intermediate","Strength"],["Seated Cable Row","Back","Cable","Beginner","Strength"],["Chest-Supported Row","Back","Machine","Beginner","Strength"],["T-Bar Row","Back","Barbell","Intermediate","Strength"],["Straight-Arm Pulldown","Back","Cable","Beginner","Strength"],["Inverted Row","Back","Bodyweight","Beginner","Strength"],["Back Extension","Lower Back","Machine","Beginner","Strength"],["Superman","Lower Back","Bodyweight","Beginner","Strength"],
  ["Overhead Press","Shoulders","Barbell","Intermediate","Strength"],["Dumbbell Shoulder Press","Shoulders","Dumbbells","Beginner","Strength"],["Arnold Press","Shoulders","Dumbbells","Intermediate","Strength"],["Dumbbell Lateral Raise","Shoulders","Dumbbells","Beginner","Strength"],["Cable Lateral Raise","Shoulders","Cable","Beginner","Strength"],["Front Raise","Shoulders","Dumbbells","Beginner","Strength"],["Rear Delt Fly","Shoulders","Dumbbells","Beginner","Strength"],["Face Pull","Shoulders","Cable","Beginner","Strength"],["Landmine Press","Shoulders","Barbell","Intermediate","Strength"],["Pike Push-Up","Shoulders","Bodyweight","Intermediate","Strength"],
  ["Barbell Curl","Biceps","Barbell","Beginner","Strength"],["Dumbbell Curl","Biceps","Dumbbells","Beginner","Strength"],["Hammer Curl","Biceps","Dumbbells","Beginner","Strength"],["Incline Dumbbell Curl","Biceps","Dumbbells","Intermediate","Strength"],["Preacher Curl","Biceps","Machine","Beginner","Strength"],["Cable Curl","Biceps","Cable","Beginner","Strength"],["Concentration Curl","Biceps","Dumbbells","Beginner","Strength"],["Reverse Curl","Biceps","Barbell","Intermediate","Strength"],
  ["Triceps Pushdown","Triceps","Cable","Beginner","Strength"],["Overhead Triceps Extension","Triceps","Dumbbells","Beginner","Strength"],["Skull Crusher","Triceps","Barbell","Intermediate","Strength"],["Close-Grip Bench Press","Triceps","Barbell","Intermediate","Strength"],["Bench Dip","Triceps","Bench","Beginner","Strength"],["Diamond Push-Up","Triceps","Bodyweight","Intermediate","Strength"],["Cable Kickback","Triceps","Cable","Beginner","Strength"],["Dumbbell Kickback","Triceps","Dumbbells","Beginner","Strength"],
  ["Standing Calf Raise","Calves","Machine","Beginner","Strength"],["Seated Calf Raise","Calves","Machine","Beginner","Strength"],["Single-Leg Calf Raise","Calves","Bodyweight","Beginner","Strength"],["Donkey Calf Raise","Calves","Machine","Intermediate","Strength"],["Tibialis Raise","Calves","Bodyweight","Beginner","Strength"],
  ["Plank","Core","Bodyweight","Beginner","Core"],["Side Plank","Core","Bodyweight","Beginner","Core"],["Dead Bug","Core","Bodyweight","Beginner","Core"],["Bird Dog","Core","Bodyweight","Beginner","Balance"],["Hollow Body Hold","Core","Bodyweight","Intermediate","Core"],["Hanging Knee Raise","Core","Pull-up bar","Intermediate","Core"],["Hanging Leg Raise","Core","Pull-up bar","Advanced","Core"],["Cable Crunch","Core","Cable","Beginner","Core"],["Ab Wheel Rollout","Core","Other","Advanced","Core"],["Russian Twist","Core","Bodyweight","Beginner","Core"],["Bicycle Crunch","Core","Bodyweight","Beginner","Core"],["Mountain Climber","Core","Bodyweight","Beginner","Plyometric"],
  ["Jumping Jack","Full Body","Bodyweight","Beginner","Cardio"],["Burpee","Full Body","Bodyweight","Intermediate","Plyometric"],["High Knees","Full Body","Bodyweight","Beginner","Cardio"],["Jump Squat","Full Body","Bodyweight","Intermediate","Plyometric"],["Bear Crawl","Full Body","Bodyweight","Intermediate","Mobility"],["Turkish Get-Up","Full Body","Kettlebell","Advanced","Balance"],["Dumbbell Thruster","Full Body","Dumbbells","Intermediate","Plyometric"],["Kettlebell Clean","Full Body","Kettlebell","Intermediate","Strength"],["Kettlebell Snatch","Full Body","Kettlebell","Advanced","Plyometric"],["Battle Rope Waves","Full Body","Other","Intermediate","Cardio"],
  ["Treadmill Walk","Full Body","Cardio machine","Beginner","Cardio"],["Treadmill Run","Full Body","Cardio machine","Beginner","Cardio"],["Stationary Bike","Full Body","Cardio machine","Beginner","Cardio"],["Rowing Machine","Full Body","Cardio machine","Beginner","Cardio"],["Elliptical","Full Body","Cardio machine","Beginner","Cardio"],["Stair Climber","Full Body","Cardio machine","Intermediate","Cardio"],["Jump Rope","Full Body","Other","Beginner","Cardio"],
  ["Cat-Cow","Full Body","Bodyweight","Beginner","Mobility"],["World's Greatest Stretch","Full Body","Bodyweight","Beginner","Mobility"],["Hip Flexor Stretch","Hips","Bodyweight","Beginner","Flexibility"],["Hamstring Stretch","Hamstrings","Bodyweight","Beginner","Flexibility"],["Quad Stretch","Quadriceps","Bodyweight","Beginner","Flexibility"],["Child's Pose","Back","Bodyweight","Beginner","Flexibility"],["Cobra Stretch","Core","Bodyweight","Beginner","Flexibility"],["Thoracic Rotation","Back","Bodyweight","Beginner","Mobility"],["Shoulder Circles","Shoulders","Bodyweight","Beginner","Mobility"],["Ankle Rocks","Calves","Bodyweight","Beginner","Mobility"],
];

const descriptions = {
  Strength: "Controlled repetitions with a stable tempo and full range of motion.",
  Cardio: "Keep a sustainable pace and adjust intensity to your current fitness level.",
  Mobility: "Move slowly through a comfortable range and avoid forcing the joint.",
  Flexibility: "Use gentle, steady breathing and stop before sharp discomfort.",
  Core: "Brace your trunk and keep the movement controlled rather than rushing reps.",
  Plyometric: "Land softly, keep good alignment, and stop when power or form drops.",
  Balance: "Use a stable surface and progress gradually as your control improves.",
};

const tips = {
  Beginner: "Start light, learn the movement, and leave a few comfortable reps in reserve.",
  Intermediate: "Choose a load that lets you keep consistent technique across every set.",
  Advanced: "Use a challenging load only when your technique stays consistent and controlled.",
};

export const EXERCISES = rows.map(([name, muscle, equipment, difficulty, type], index) => ({
  id: `ex-${String(index + 1).padStart(3, "0")}`,
  name,
  muscle,
  equipment,
  difficulty,
  type,
  description: descriptions[type],
  tip: tips[difficulty],
}));

export const EXERCISE_FILTERS = {
  muscles: [...new Set(EXERCISES.map((item) => item.muscle))].sort(),
  equipment: [...new Set(EXERCISES.map((item) => item.equipment))].sort(),
  difficulties: ["Beginner", "Intermediate", "Advanced"],
  types: ["Strength", "Cardio", "Mobility", "Flexibility", "Core", "Plyometric", "Balance"],
};
