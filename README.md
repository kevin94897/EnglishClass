# Mise en Place · Inglés de cocina

App de vocabulario de cocina en inglés para estudiantes hispanohablantes de nivel principiante (A1–A2).
Next.js 15 (App Router) + TypeScript, sin base de datos: el progreso vive en `localStorage`.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Estructura

```
app/
  layout.tsx        Fuentes, metadatos, viewport
  page.tsx          Monta el provider y la app
  globals.css       Tokens de color y todos los estilos
data/
  vocabulary.ts     76 términos + definición de mazos y vistas
lib/
  srs.ts            Leitner de 5 cajones, racha, persistencia
  speech.ts         Pronunciación con Web Speech API
  study-context.tsx Estado compartido (mazo, vista, progreso)
  utils.ts          shuffle, normalización de respuestas
components/
  StudyApp.tsx      Shell: encabezado, navegación, router de vistas
  Station.tsx       Barra de avance y racha
  Feedback.tsx      Estado vacío y fin de ronda
  views/            Cards, Quiz, Match, Write, Listen, Glossary
```

## Agregar vocabulario

Solo se edita `data/vocabulary.ts`. Cada término alimenta las seis vistas:

```ts
{ id: "sear", en: "to sear", es: "sellar", cat: "verbs", emoji: "🥩",
  exEn: "Sear the meat on high heat.", exEs: "Sella la carne a fuego alto." }
```

Para abrir una categoría nueva, agrégala al tipo `Category`, a `DECKS` y a `CATEGORY_LABEL`.

## Cómo funciona el repaso

Cada palabra tiene un cajón del 1 al 5. Acertar sube un cajón, fallar la devuelve al 1.
Las palabras en cajón 1 o 2 aparecen en el mazo **Por repasar**; a partir del cajón 4 cuentan
como dominadas en la barra de avance. Las rondas siempre ordenan primero lo menos dominado.

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. En vercel.com → **Add New → Project** → importa el repo.
3. Vercel detecta Next.js solo: no hay que configurar build command ni variables de entorno.
4. Cada push a `main` publica producción; cada PR genera un preview para probar con alumnos.

O desde la terminal:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # producción
```

## Siguientes pasos sugeridos

- Transcripción fonética por término (campo `ipa`).
- Modo "receta completa": leer instrucciones reales de un plato y responder preguntas.
- Cuentas de alumno con Supabase o Vercel Postgres — el `study-context` es el único archivo
  que habría que tocar para cambiar dónde se guarda el progreso.
- PWA para instalarla en el celular.
