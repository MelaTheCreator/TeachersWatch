export const ratingCategories = {
  betragen: {
    label: "Betragen",
    fields: [
      { key: "sozialverhalten", label: "Sozialverhalten / Miteinander" },
      { key: "unterrichtsverhalten", label: "Verhalten im Unterricht" },
      { key: "pflichtbewusstsein", label: "Pflichtbewusstsein" },
      { key: "schulordnung", label: "Einhaltung der Schulordnung" },
    ],
  },

  arbeitsverhalten: {
    label: "Arbeitsverhalten",
    fields: [
      { key: "sorgfalt", label: "Sorgfalt bei Aufgaben" },
      { key: "konzentration", label: "Konzentration" },
      { key: "selbststaendigkeit", label: "Selbstständigkeit" },
      { key: "organisation", label: "Arbeitsorganisation" },
      { key: "ausdauer", label: "Ausdauer" },
    ],
  },

  sozialverhalten: {
    label: "Sozialverhalten",
    fields: [
      { key: "hilfsbereitschaft", label: "Hilfsbereitschaft" },
      { key: "teamfaehigkeit", label: "Teamfähigkeit" },
      { key: "konfliktverhalten", label: "Konfliktverhalten" },
      { key: "ruecksicht", label: "Rücksichtnahme" },
      { key: "lehrerumgang", label: "Umgang mit Lehrkräften" },
    ],
  },

  lernverhalten: {
    label: "Lernverhalten",
    fields: [
      { key: "motivation", label: "Motivation" },
      { key: "interesse", label: "Interesse am Unterricht" },
      { key: "initiative", label: "Eigeninitiative" },
      { key: "anstrengung", label: "Anstrengungsbereitschaft" },
      { key: "fehlerumgang", label: "Umgang mit Fehlern" },
    ],
  },
} as const;

export type RatingCategoryKey = keyof typeof ratingCategories;
