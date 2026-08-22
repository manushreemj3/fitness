const CRISIS_PATTERNS = /suicide|kill myself|self.?harm|end it all|want to die/i;

export function detectCrisis(text) {
  return { crisis: CRISIS_PATTERNS.test(text) };
}

export function crisisSupportMessage() {
  return {
    title: "You're not alone",
    body: "If you're in crisis, please reach out for support — you deserve help right now.",
    resources: [
      { label: "988 Suicide & Crisis Lifeline (US)", href: "tel:988" },
      { label: "Crisis Text Line", href: "sms:741741" },
    ],
  };
}
