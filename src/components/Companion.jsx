import botImg from "../assets/bot.png";
import bowImg from "../assets/bow.png";
import capImg from "../assets/cap.png";
import glassesImg from "../assets/glasses.png";
import headphonesImg from "../assets/headphones.png";
import tieImg from "../assets/tie.png";

const ACCESSORY_IMAGES = {
  none: botImg,
  bow: bowImg,
  cap: capImg,
  glasses: glassesImg,
  headphones: headphonesImg,
  tie: tieImg,
};

export default function Companion({
  color = "lavender",
  accessory = "none",
  size = "md",
}) {
  const selectedAccessory = (accessory || "none").toLowerCase();
  const companionImg = ACCESSORY_IMAGES[selectedAccessory] || ACCESSORY_IMAGES.none;

  return (
    <div className={`companion-stage size-${size} color-${color}`} aria-label="FitBuddy companion">
      <div className="companion-graphic">
        <div className="fitbuddy-bot" aria-hidden="true">
          <img src={companionImg} alt="" className="bot-img" draggable={false} />
        </div>
      </div>
    </div>
  );
}
