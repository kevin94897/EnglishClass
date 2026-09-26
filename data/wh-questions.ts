import type { Term } from "./vocabulary";

/**
 * Temario: WH questions (preguntas con What, Where, When, Who, Why, Which,
 * Whose, How…). Nivel principiante.
 *
 * `blank` indica qué palabra se oculta en el modo Completar; si falta, se
 * oculta el término completo (`en`). En las preguntas útiles se oculta solo
 * la palabra interrogativa para practicar cuál corresponde.
 */
export const WH_TERMS: Term[] = [
  // ---------- palabras interrogativas ----------
  { id: "what", en: "What", es: "Qué / Cuál", cat: "wh", emoji: "❓", exEn: "What is your name?", exEs: "¿Cuál es tu nombre?" },
  { id: "where", en: "Where", es: "Dónde", cat: "wh", emoji: "📍", exEn: "Where are you from?", exEs: "¿De dónde eres?" },
  { id: "when", en: "When", es: "Cuándo", cat: "wh", emoji: "📅", exEn: "When is the meeting?", exEs: "¿Cuándo es la reunión?" },
  { id: "who", en: "Who", es: "Quién", cat: "wh", emoji: "🧑", exEn: "Who is your teacher?", exEs: "¿Quién es tu profesor?" },
  { id: "why", en: "Why", es: "Por qué", cat: "wh", emoji: "🤔", exEn: "Why are you late?", exEs: "¿Por qué llegas tarde?" },
  { id: "which", en: "Which", es: "Cuál (entre opciones)", cat: "wh", emoji: "🎨", exEn: "Which color do you like?", exEs: "¿Cuál color te gusta?" },
  { id: "whose", en: "Whose", es: "De quién", cat: "wh", emoji: "📱", exEn: "Whose phone is this?", exEs: "¿De quién es este teléfono?" },
  { id: "how", en: "How", es: "Cómo", cat: "wh", emoji: "🙂", exEn: "How are you today?", exEs: "¿Cómo estás hoy?" },
  { id: "whom", en: "Whom", es: "A quién (formal)", cat: "wh", emoji: "☎️", exEn: "Whom did you call?", exEs: "¿A quién llamaste?" },

  // ---------- combinaciones ----------
  { id: "howmany", en: "How many", es: "Cuántos / Cuántas (contable)", cat: "combos", emoji: "🥚", exEn: "How many eggs do we need?", exEs: "¿Cuántos huevos necesitamos?" },
  { id: "howmuch", en: "How much", es: "Cuánto (incontable, precio)", cat: "combos", emoji: "💵", exEn: "How much is this shirt?", exEs: "¿Cuánto cuesta esta camisa?" },
  { id: "howold", en: "How old", es: "Cuántos años", cat: "combos", emoji: "🎂", exEn: "How old is your sister?", exEs: "¿Cuántos años tiene tu hermana?" },
  { id: "howlong", en: "How long", es: "Cuánto tiempo", cat: "combos", emoji: "⏳", exEn: "How long is the movie?", exEs: "¿Cuánto dura la película?" },
  { id: "howoften", en: "How often", es: "Con qué frecuencia", cat: "combos", emoji: "🔁", exEn: "How often do you exercise?", exEs: "¿Con qué frecuencia haces ejercicio?" },
  { id: "howfar", en: "How far", es: "A qué distancia", cat: "combos", emoji: "🚉", exEn: "How far is the station?", exEs: "¿A qué distancia está la estación?" },
  { id: "whattime", en: "What time", es: "A qué hora / Qué hora", cat: "combos", emoji: "⏰", exEn: "What time does the class start?", exEs: "¿A qué hora empieza la clase?" },
  { id: "whatkind", en: "What kind", es: "Qué tipo", cat: "combos", emoji: "🎵", exEn: "What kind of music do you like?", exEs: "¿Qué tipo de música te gusta?" },
  { id: "whichone", en: "Which one", es: "Cuál (de estos)", cat: "combos", emoji: "👉", exEn: "Which one is yours?", exEs: "¿Cuál es el tuyo?" },

  // ---------- preguntas útiles (pregunta + respuesta) ----------
  { id: "q-name", en: "What is your name?", es: "¿Cómo te llamas?", cat: "questions", emoji: "🪪", blank: "What", exEn: "What is your name? — My name is Ana.", exEs: "¿Cómo te llamas? — Me llamo Ana." },
  { id: "q-from", en: "Where are you from?", es: "¿De dónde eres?", cat: "questions", emoji: "🌎", blank: "Where", exEn: "Where are you from? — I'm from Peru.", exEs: "¿De dónde eres? — Soy de Perú." },
  { id: "q-live", en: "Where do you live?", es: "¿Dónde vives?", cat: "questions", emoji: "🏠", blank: "Where", exEn: "Where do you live? — I live in Lima.", exEs: "¿Dónde vives? — Vivo en Lima." },
  { id: "q-birthday", en: "When is your birthday?", es: "¿Cuándo es tu cumpleaños?", cat: "questions", emoji: "🎉", blank: "When", exEn: "When is your birthday? — It's in May.", exEs: "¿Cuándo es tu cumpleaños? — Es en mayo." },
  { id: "q-teacher", en: "Who is your teacher?", es: "¿Quién es tu profesor?", cat: "questions", emoji: "🧑‍🏫", blank: "Who", exEn: "Who is your teacher? — Mr. López is my teacher.", exEs: "¿Quién es tu profesor? — El señor López es mi profesor." },
  { id: "q-late", en: "Why are you late?", es: "¿Por qué llegas tarde?", cat: "questions", emoji: "🚌", blank: "Why", exEn: "Why are you late? — Because the bus was late.", exEs: "¿Por qué llegas tarde? — Porque el bus se retrasó." },
  { id: "q-which", en: "Which one do you want?", es: "¿Cuál quieres?", cat: "questions", emoji: "🔵", blank: "Which", exEn: "Which one do you want? — I want the blue one.", exEs: "¿Cuál quieres? — Quiero el azul." },
  { id: "q-whose", en: "Whose bag is this?", es: "¿De quién es esta mochila?", cat: "questions", emoji: "🎒", blank: "Whose", exEn: "Whose bag is this? — It's mine.", exEs: "¿De quién es esta mochila? — Es mía." },
  { id: "q-howareyou", en: "How are you?", es: "¿Cómo estás?", cat: "questions", emoji: "👋", blank: "How", exEn: "How are you? — I'm fine, thank you.", exEs: "¿Cómo estás? — Estoy bien, gracias." },
  { id: "q-old", en: "How old are you?", es: "¿Cuántos años tienes?", cat: "questions", emoji: "🎂", blank: "How old", exEn: "How old are you? — I'm twenty years old.", exEs: "¿Cuántos años tienes? — Tengo veinte años." },
  { id: "q-much", en: "How much is it?", es: "¿Cuánto cuesta?", cat: "questions", emoji: "💲", blank: "How much", exEn: "How much is it? — It's ten dollars.", exEs: "¿Cuánto cuesta? — Cuesta diez dólares." },
  { id: "q-many", en: "How many brothers do you have?", es: "¿Cuántos hermanos tienes?", cat: "questions", emoji: "👨‍👦", blank: "How many", exEn: "How many brothers do you have? — I have two brothers.", exEs: "¿Cuántos hermanos tienes? — Tengo dos hermanos." },
  { id: "q-time", en: "What time is it?", es: "¿Qué hora es?", cat: "questions", emoji: "🕒", blank: "What time", exEn: "What time is it? — It's three o'clock.", exEs: "¿Qué hora es? — Son las tres." },
  { id: "q-do", en: "What do you do?", es: "¿A qué te dedicas?", cat: "questions", emoji: "👩‍🍳", blank: "What", exEn: "What do you do? — I'm a cook.", exEs: "¿A qué te dedicas? — Soy cocinera." },
  { id: "q-spell", en: "How do you spell it?", es: "¿Cómo se escribe?", cat: "questions", emoji: "🔤", blank: "How", exEn: "How do you spell it? — A-N-A.", exEs: "¿Cómo se escribe? — A-N-A." },
  { id: "q-start", en: "When does the class start?", es: "¿Cuándo empieza la clase?", cat: "questions", emoji: "🕗", blank: "When", exEn: "When does the class start? — It starts at eight.", exEs: "¿Cuándo empieza la clase? — Empieza a las ocho." },
  { id: "q-calling", en: "Who is calling?", es: "¿Quién llama?", cat: "questions", emoji: "📞", blank: "Who", exEn: "Who is calling? — It's your mom.", exEs: "¿Quién llama? — Es tu mamá." },
  { id: "q-open", en: "Why is the door open?", es: "¿Por qué está abierta la puerta?", cat: "questions", emoji: "🚪", blank: "Why", exEn: "Why is the door open? — Because it's hot.", exEs: "¿Por qué está abierta la puerta? — Porque hace calor." },
  { id: "q-take", en: "How long does it take?", es: "¿Cuánto tiempo toma?", cat: "questions", emoji: "⏱️", blank: "How long", exEn: "How long does it take? — About ten minutes.", exEs: "¿Cuánto tiempo toma? — Unos diez minutos." },
  { id: "q-color", en: "Which color do you prefer?", es: "¿Qué color prefieres?", cat: "questions", emoji: "🎨", blank: "Which", exEn: "Which color do you prefer? — I prefer green.", exEs: "¿Qué color prefieres? — Prefiero el verde." },
  { id: "q-mean", en: "What does this word mean?", es: "¿Qué significa esta palabra?", cat: "questions", emoji: "📖", blank: "What", exEn: "What does this word mean? — It means 'cocina'.", exEs: "¿Qué significa esta palabra? — Significa 'cocina'." },
  { id: "q-bathroom", en: "Where is the bathroom?", es: "¿Dónde está el baño?", cat: "questions", emoji: "🚻", blank: "Where", exEn: "Where is the bathroom? — It's on the left.", exEs: "¿Dónde está el baño? — Está a la izquierda." },
  { id: "q-often", en: "How often do you study?", es: "¿Con qué frecuencia estudias?", cat: "questions", emoji: "📚", blank: "How often", exEn: "How often do you study? — Every day.", exEs: "¿Con qué frecuencia estudias? — Todos los días." },
  { id: "q-far", en: "How far is the beach?", es: "¿Qué tan lejos está la playa?", cat: "questions", emoji: "🏖️", blank: "How far", exEn: "How far is the beach? — It's two kilometers away.", exEs: "¿Qué tan lejos está la playa? — Está a dos kilómetros." },
  { id: "q-with", en: "Who do you live with?", es: "¿Con quién vives?", cat: "questions", emoji: "👪", blank: "Who", exEn: "Who do you live with? — I live with my parents.", exEs: "¿Con quién vives? — Vivo con mis padres." },
  { id: "q-favorite", en: "What is your favorite food?", es: "¿Cuál es tu comida favorita?", cat: "questions", emoji: "🐟", blank: "What", exEn: "What is your favorite food? — Ceviche!", exEs: "¿Cuál es tu comida favorita? — ¡El ceviche!" },
  { id: "q-weather", en: "What is the weather like?", es: "¿Cómo está el clima?", cat: "questions", emoji: "☀️", blank: "What", exEn: "What is the weather like? — It's sunny.", exEs: "¿Cómo está el clima? — Está soleado." },
  { id: "q-kind", en: "What kind of music do you like?", es: "¿Qué tipo de música te gusta?", cat: "questions", emoji: "🎶", blank: "What kind", exEn: "What kind of music do you like? — I like salsa.", exEs: "¿Qué tipo de música te gusta? — Me gusta la salsa." },
  { id: "q-going", en: "Where are you going?", es: "¿A dónde vas?", cat: "questions", emoji: "🚶", blank: "Where", exEn: "Where are you going? — I'm going to work.", exEs: "¿A dónde vas? — Voy al trabajo." },
  { id: "q-finish", en: "When do you finish work?", es: "¿Cuándo terminas de trabajar?", cat: "questions", emoji: "🏁", blank: "When", exEn: "When do you finish work? — At six.", exEs: "¿Cuándo terminas de trabajar? — A las seis." },
];

export const WH_CATEGORIES = [
  { id: "wh", label: "Palabras WH" },
  { id: "combos", label: "Combinaciones" },
  { id: "questions", label: "Preguntas útiles" },
];
