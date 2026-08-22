import Companion from "../Companion";
import DialogueBubble from "./DialogueBubble";
import TopicChips from "./TopicChips";

export default function MentalScene({
  user,
  message,
  onSelectTopic,
  disabled,
}) {
  const companion = user?.companion || {};
  const botName = companion.name || "FitBuddy";

  return (
    <div className="mental-room-stage">
      <div className="mental-room-overlay" />

      {/* Floating Dialogue Speech Bubble directly above companion's head */}
      <DialogueBubble message={message} botName={botName} />

      {/* Companion sitting on the purple sofa */}
      <div className="couch-bot-container">
        <Companion
          color={companion.color || "lavender"}
          accessory={companion.accessory || "none"}
          size="md"
        />
      </div>

      {/* Topic Chips Container ("Things you can talk to me about") */}
      <TopicChips onSelectTopic={onSelectTopic} disabled={disabled} />
    </div>
  );
}
