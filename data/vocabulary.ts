export type Category = "verbs" | "tools" | "food" | "phrases";

export type Term = {
  id: string;
  en: string;
  es: string;
  /** Id de categoría dentro de su temario (ver data/topics.ts). */
  cat: string;
  emoji: string;
  exEn: string;
  exEs: string;
  /** Palabra que se oculta en el modo Completar; por defecto, `en`. */
  blank?: string;
};

/**
 * Vocabulario nivel principiante (A1–A2).
 * Para ampliar la app basta con agregar objetos aquí: todas las vistas
 * se alimentan de este arreglo.
 */
export const VOCAB: Term[] = [
  // ---------- verbos ----------
  { id: "cook", en: "to cook", es: "cocinar", cat: "verbs", emoji: "👨‍🍳", exEn: "I cook rice every day.", exEs: "Cocino arroz todos los días." },
  { id: "chop", en: "to chop", es: "picar / cortar en trozos", cat: "verbs", emoji: "🔪", exEn: "Chop the onion, please.", exEs: "Pica la cebolla, por favor." },
  { id: "cut", en: "to cut", es: "cortar", cat: "verbs", emoji: "✂️", exEn: "Cut the bread in six pieces.", exEs: "Corta el pan en seis pedazos." },
  { id: "slice", en: "to slice", es: "cortar en rodajas", cat: "verbs", emoji: "🍅", exEn: "Slice the tomato for the salad.", exEs: "Corta el tomate en rodajas para la ensalada." },
  { id: "peel", en: "to peel", es: "pelar", cat: "verbs", emoji: "🥔", exEn: "Peel two potatoes.", exEs: "Pela dos papas." },
  { id: "mix", en: "to mix", es: "mezclar", cat: "verbs", emoji: "🥣", exEn: "Mix the flour and the eggs.", exEs: "Mezcla la harina y los huevos." },
  { id: "stir", en: "to stir", es: "remover / revolver", cat: "verbs", emoji: "🥄", exEn: "Stir the soup slowly.", exEs: "Remueve la sopa despacio." },
  { id: "pour", en: "to pour", es: "verter / servir (líquido)", cat: "verbs", emoji: "🫗", exEn: "Pour the milk into the bowl.", exEs: "Vierte la leche en el tazón." },
  { id: "boil", en: "to boil", es: "hervir", cat: "verbs", emoji: "💧", exEn: "Boil the water first.", exEs: "Hierve el agua primero." },
  { id: "fry", en: "to fry", es: "freír", cat: "verbs", emoji: "🍳", exEn: "Fry the eggs in butter.", exEs: "Fríe los huevos en mantequilla." },
  { id: "bake", en: "to bake", es: "hornear", cat: "verbs", emoji: "🥖", exEn: "We bake bread every morning.", exEs: "Horneamos pan cada mañana." },
  { id: "roast", en: "to roast", es: "asar (al horno)", cat: "verbs", emoji: "🍗", exEn: "Roast the chicken for one hour.", exEs: "Asa el pollo por una hora." },
  { id: "grill", en: "to grill", es: "asar a la parrilla", cat: "verbs", emoji: "🔥", exEn: "Grill the fish for five minutes.", exEs: "Asa el pescado a la parrilla cinco minutos." },
  { id: "heat", en: "to heat", es: "calentar", cat: "verbs", emoji: "♨️", exEn: "Heat the oil in the pan.", exEs: "Calienta el aceite en la sartén." },
  { id: "melt", en: "to melt", es: "derretir", cat: "verbs", emoji: "🧈", exEn: "Melt the butter slowly.", exEs: "Derrite la mantequilla despacio." },
  { id: "wash", en: "to wash", es: "lavar", cat: "verbs", emoji: "🚰", exEn: "Wash the vegetables.", exEs: "Lava las verduras." },
  { id: "dry", en: "to dry", es: "secar", cat: "verbs", emoji: "🧻", exEn: "Dry the plates with a towel.", exEs: "Seca los platos con un paño." },
  { id: "taste", en: "to taste", es: "probar", cat: "verbs", emoji: "👅", exEn: "Taste the sauce before you serve it.", exEs: "Prueba la salsa antes de servirla." },
  { id: "serve", en: "to serve", es: "servir", cat: "verbs", emoji: "🍽️", exEn: "Serve the soup very hot.", exEs: "Sirve la sopa bien caliente." },
  { id: "add", en: "to add", es: "agregar / añadir", cat: "verbs", emoji: "➕", exEn: "Add a little salt.", exEs: "Agrega un poco de sal." },
  { id: "season", en: "to season", es: "sazonar / condimentar", cat: "verbs", emoji: "🧂", exEn: "Season the meat with salt and pepper.", exEs: "Sazona la carne con sal y pimienta." },
  { id: "weigh", en: "to weigh", es: "pesar", cat: "verbs", emoji: "⚖️", exEn: "Weigh 200 grams of flour.", exEs: "Pesa 200 gramos de harina." },
  { id: "cover", en: "to cover", es: "tapar / cubrir", cat: "verbs", emoji: "🫙", exEn: "Cover the pot for ten minutes.", exEs: "Tapa la olla por diez minutos." },
  { id: "clean", en: "to clean", es: "limpiar", cat: "verbs", emoji: "🧽", exEn: "Clean the table after service.", exEs: "Limpia la mesa después del servicio." },

  // ---------- utensilios ----------
  { id: "pan", en: "pan", es: "sartén", cat: "tools", emoji: "🍳", exEn: "The pan is very hot.", exEs: "La sartén está muy caliente." },
  { id: "pot", en: "pot", es: "olla", cat: "tools", emoji: "🍲", exEn: "There is water in the pot.", exEs: "Hay agua en la olla." },
  { id: "knife", en: "knife", es: "cuchillo", cat: "tools", emoji: "🔪", exEn: "This knife is sharp.", exEs: "Este cuchillo está afilado." },
  { id: "board", en: "cutting board", es: "tabla de cortar", cat: "tools", emoji: "🪵", exEn: "Use a clean cutting board.", exEs: "Usa una tabla de cortar limpia." },
  { id: "spoon", en: "spoon", es: "cuchara", cat: "tools", emoji: "🥄", exEn: "Give me a big spoon.", exEs: "Dame una cuchara grande." },
  { id: "fork", en: "fork", es: "tenedor", cat: "tools", emoji: "🍴", exEn: "The fork is on the table.", exEs: "El tenedor está en la mesa." },
  { id: "plate", en: "plate", es: "plato", cat: "tools", emoji: "🍽️", exEn: "Put the fish on the plate.", exEs: "Pon el pescado en el plato." },
  { id: "bowl", en: "bowl", es: "tazón / bol", cat: "tools", emoji: "🥣", exEn: "Mix everything in a bowl.", exEs: "Mezcla todo en un tazón." },
  { id: "oven", en: "oven", es: "horno", cat: "tools", emoji: "🔥", exEn: "The oven is at 180 degrees.", exEs: "El horno está a 180 grados." },
  { id: "stove", en: "stove", es: "cocina / estufa", cat: "tools", emoji: "🍳", exEn: "Turn off the stove.", exEs: "Apaga la cocina." },
  { id: "fridge", en: "fridge", es: "refrigeradora", cat: "tools", emoji: "🧊", exEn: "The milk is in the fridge.", exEs: "La leche está en la refrigeradora." },
  { id: "whisk", en: "whisk", es: "batidor", cat: "tools", emoji: "🌀", exEn: "Use a whisk for the eggs.", exEs: "Usa un batidor para los huevos." },
  { id: "ladle", en: "ladle", es: "cucharón", cat: "tools", emoji: "🥄", exEn: "Serve the soup with a ladle.", exEs: "Sirve la sopa con un cucharón." },
  { id: "tray", en: "tray", es: "bandeja", cat: "tools", emoji: "🍱", exEn: "Put the bread on the tray.", exEs: "Pon el pan en la bandeja." },
  { id: "apron", en: "apron", es: "mandil / delantal", cat: "tools", emoji: "🦺", exEn: "My apron is dirty.", exEs: "Mi mandil está sucio." },
  { id: "towel", en: "kitchen towel", es: "paño de cocina", cat: "tools", emoji: "🧻", exEn: "I need a clean kitchen towel.", exEs: "Necesito un paño de cocina limpio." },
  { id: "tongs", en: "tongs", es: "pinzas", cat: "tools", emoji: "🥢", exEn: "Turn the meat with the tongs.", exEs: "Voltea la carne con las pinzas." },
  { id: "strainer", en: "strainer", es: "colador", cat: "tools", emoji: "🕸️", exEn: "Wash the rice in a strainer.", exEs: "Lava el arroz en un colador." },
  { id: "cup", en: "measuring cup", es: "taza medidora", cat: "tools", emoji: "🥛", exEn: "One measuring cup of water.", exEs: "Una taza medidora de agua." },
  { id: "sink", en: "sink", es: "lavadero", cat: "tools", emoji: "🚰", exEn: "The dishes are in the sink.", exEs: "Los platos están en el lavadero." },

  // ---------- ingredientes ----------
  { id: "salt", en: "salt", es: "sal", cat: "food", emoji: "🧂", exEn: "This soup needs more salt.", exEs: "Esta sopa necesita más sal." },
  { id: "pepper", en: "pepper", es: "pimienta", cat: "food", emoji: "⚫", exEn: "Add black pepper at the end.", exEs: "Agrega pimienta negra al final." },
  { id: "oil", en: "oil", es: "aceite", cat: "food", emoji: "🫒", exEn: "We use olive oil here.", exEs: "Aquí usamos aceite de oliva." },
  { id: "butter", en: "butter", es: "mantequilla", cat: "food", emoji: "🧈", exEn: "The butter is very cold.", exEs: "La mantequilla está muy fría." },
  { id: "flour", en: "flour", es: "harina", cat: "food", emoji: "🌾", exEn: "We need one kilo of flour.", exEs: "Necesitamos un kilo de harina." },
  { id: "sugar", en: "sugar", es: "azúcar", cat: "food", emoji: "🍬", exEn: "Two spoons of sugar, please.", exEs: "Dos cucharadas de azúcar, por favor." },
  { id: "egg", en: "egg", es: "huevo", cat: "food", emoji: "🥚", exEn: "I need three eggs.", exEs: "Necesito tres huevos." },
  { id: "milk", en: "milk", es: "leche", cat: "food", emoji: "🥛", exEn: "There is no milk today.", exEs: "Hoy no hay leche." },
  { id: "water", en: "water", es: "agua", cat: "food", emoji: "💧", exEn: "The water is boiling.", exEs: "El agua está hirviendo." },
  { id: "rice", en: "rice", es: "arroz", cat: "food", emoji: "🍚", exEn: "The rice is ready.", exEs: "El arroz está listo." },
  { id: "chicken", en: "chicken", es: "pollo", cat: "food", emoji: "🍗", exEn: "The chicken is in the oven.", exEs: "El pollo está en el horno." },
  { id: "beef", en: "beef", es: "carne de res", cat: "food", emoji: "🥩", exEn: "This beef is very good.", exEs: "Esta carne de res es muy buena." },
  { id: "fish", en: "fish", es: "pescado", cat: "food", emoji: "🐟", exEn: "The fish is fresh today.", exEs: "El pescado está fresco hoy." },
  { id: "onion", en: "onion", es: "cebolla", cat: "food", emoji: "🧅", exEn: "Cut the onion very small.", exEs: "Corta la cebolla muy pequeña." },
  { id: "garlic", en: "garlic", es: "ajo", cat: "food", emoji: "🧄", exEn: "Add two cloves of garlic.", exEs: "Agrega dos dientes de ajo." },
  { id: "tomato", en: "tomato", es: "tomate", cat: "food", emoji: "🍅", exEn: "Wash the tomatoes.", exEs: "Lava los tomates." },
  { id: "potato", en: "potato", es: "papa", cat: "food", emoji: "🥔", exEn: "Boil the potatoes.", exEs: "Hierve las papas." },
  { id: "carrot", en: "carrot", es: "zanahoria", cat: "food", emoji: "🥕", exEn: "Peel four carrots.", exEs: "Pela cuatro zanahorias." },
  { id: "cheese", en: "cheese", es: "queso", cat: "food", emoji: "🧀", exEn: "Put cheese on the pasta.", exEs: "Pon queso en la pasta." },
  { id: "bread", en: "bread", es: "pan", cat: "food", emoji: "🍞", exEn: "The bread is still warm.", exEs: "El pan todavía está tibio." },

  // ---------- frases ----------
  { id: "yeschef", en: "Yes, chef!", es: "¡Sí, chef!", cat: "phrases", emoji: "🫡", exEn: "— Clean your station. — Yes, chef!", exEs: "— Limpia tu estación. — ¡Sí, chef!" },
  { id: "behind", en: "Behind you!", es: "¡Detrás de ti!", cat: "phrases", emoji: "⚠️", exEn: "Behind you! I have a hot pan.", exEs: "¡Detrás de ti! Llevo una sartén caliente." },
  { id: "hot", en: "Careful, it's hot!", es: "¡Cuidado, está caliente!", cat: "phrases", emoji: "🔥", exEn: "Careful, it's hot! Don't touch the plate.", exEs: "¡Cuidado, está caliente! No toques el plato." },
  { id: "orderup", en: "Order up!", es: "¡Pedido listo!", cat: "phrases", emoji: "🔔", exEn: "Order up! Table two.", exEs: "¡Pedido listo! Mesa dos." },
  { id: "ready", en: "The order is ready.", es: "El pedido está listo.", cat: "phrases", emoji: "✅", exEn: "The order is ready for table four.", exEs: "El pedido está listo para la mesa cuatro." },
  { id: "salty", en: "It's too salty.", es: "Está muy salado.", cat: "phrases", emoji: "🧂", exEn: "Taste it — it's too salty.", exEs: "Pruébalo: está muy salado." },
  { id: "washhands", en: "Wash your hands.", es: "Lávate las manos.", cat: "phrases", emoji: "🧼", exEn: "Wash your hands before you start.", exEs: "Lávate las manos antes de empezar." },
  { id: "needmore", en: "I need more onions.", es: "Necesito más cebollas.", cat: "phrases", emoji: "🧅", exEn: "Chef, I need more onions.", exEs: "Chef, necesito más cebollas." },
  { id: "help", en: "Can you help me?", es: "¿Me puedes ayudar?", cat: "phrases", emoji: "🙋", exEn: "Can you help me with the plates?", exEs: "¿Me puedes ayudar con los platos?" },
  { id: "turnoff", en: "Turn off the oven.", es: "Apaga el horno.", cat: "phrases", emoji: "🎛️", exEn: "Turn off the oven, please.", exEs: "Apaga el horno, por favor." },
  { id: "howlong", en: "How long does it take?", es: "¿Cuánto tiempo toma?", cat: "phrases", emoji: "⏱️", exEn: "How long does it take to bake?", exEs: "¿Cuánto tiempo toma hornearlo?" },
  { id: "onemore", en: "One more, please.", es: "Uno más, por favor.", cat: "phrases", emoji: "☝️", exEn: "One more plate, please.", exEs: "Un plato más, por favor." },
];

/** "all", "review" o el id de una categoría del temario activo. */
export type DeckId = string;

export type ViewId = "cards" | "quiz" | "cloze" | "match" | "write" | "listen" | "glossary";

export const VIEWS: { id: ViewId; label: string }[] = [
  { id: "cards", label: "Tarjetas" },
  { id: "quiz", label: "Quiz" },
  { id: "cloze", label: "Completar" },
  { id: "match", label: "Parejas" },
  { id: "write", label: "Escribir" },
  { id: "listen", label: "Escuchar" },
  { id: "glossary", label: "Glosario" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  verbs: "Verbos",
  tools: "Utensilios",
  food: "Ingredientes",
  phrases: "Frases",
};
