"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pronunciación en inglés con la Web Speech API del navegador.
 * No requiere API key ni red.
 */

// Voces femeninas claras, en orden de preferencia (macOS/iOS, Chrome, Edge/Windows).
const PREFERRED_FEMALE = [
  "ava", "samantha", "allison", "susan", "zoe", "nicky",
  "google us english", "aria", "jenny", "michelle", "emma", "zira",
  "karen", "moira", "tessa", "serena", "kate", "fiona", "victoria",
];

// Voces masculinas o de efectos que suenan robóticas o poco entendibles.
const EXCLUDED = [
  "albert", "bad news", "bahh", "bells", "boing", "bubbles", "cellos",
  "good news", "jester", "organ", "superstar", "trinoids", "whisper",
  "wobble", "zarvox", "fred", "junior", "ralph", "kathy", "grandpa",
  "grandma", "rocko", "shelley", "sandy", "flo", "eddy", "reed",
  "alex", "daniel", "tom", "aaron", "arthur", "oliver", "gordon",
  "guy", "david", "mark", "george", "ryan", "christopher", "eric",
  "male",
];

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  if (!/^en/i.test(v.lang)) return -1;
  if (EXCLUDED.some((n) => new RegExp(`\\b${n}\\b`).test(name))) return -1;

  let score = 1;
  const idx = PREFERRED_FEMALE.findIndex((n) => name.includes(n));
  if (idx >= 0) score += 100 - idx;
  if (/female/.test(name)) score += 50;
  // Voces neuronales de Edge/Windows
  if (/natural|neural/.test(name)) score += 30;
  // En Chromium/Brave (macOS) las Premium/Enhanced aparecen en la lista pero suelen sonar mudas
  if (/premium|enhanced/.test(name)) score -= 60;
  // Las voces locales no dependen de red: arrancan al instante y fallan menos
  if (v.localService) score += 40;
  if (/en[-_]US/i.test(v.lang)) score += 10;
  return score;
}

/** Voces candidatas ordenadas de mejor a peor, sin las que ya fallaron. */
function rankVoices(
  voices: SpeechSynthesisVoice[],
  broken: Set<string>,
): SpeechSynthesisVoice[] {
  return voices
    .filter((v) => !broken.has(v.voiceURI))
    .map((v) => ({ v, s: scoreVoice(v) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.v);
}

const BROKEN_KEY = "chef-english:broken-voices:v2";
// Tiempo máximo para que una voz arranque antes de probar la siguiente
const START_TIMEOUT = 2500;

function loadBroken(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(BROKEN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveBroken(set: Set<string>) {
  try {
    localStorage.setItem(BROKEN_KEY, JSON.stringify([...set]));
  } catch {
    /* almacenamiento bloqueado */
  }
}

export function useSpeech() {
  const brokenRef = useRef<Set<string>>(loadBroken());
  // Voces que tardaron en arrancar en esta sesión; a la segunda vez se descartan
  const slowRef = useRef<Map<string, number>>(new Map());
  const warmedRef = useRef(false);
  // Referencia viva: Chrome descarta utterances sin referencia y no suenan
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    // Carga temprana de la lista de voces (Chrome la llena de forma asíncrona)
    const synth = window.speechSynthesis;
    const load = () => synth.getVoices();
    load();
    synth.addEventListener("voiceschanged", load);

    // El primer audio de la sesión tarda porque el navegador debe cargar la voz.
    // Con el primer toque en la página se dispara una frase muda para precargarla.
    const warm = () => {
      if (warmedRef.current || synth.speaking || synth.pending) return;
      warmedRef.current = true;
      const [voice] = rankVoices(synth.getVoices(), brokenRef.current);
      if (!voice) return;
      const u = new SpeechSynthesisUtterance("a");
      u.voice = voice;
      u.lang = voice.lang;
      u.volume = 0;
      u.rate = 2;
      try {
        synth.speak(u);
      } catch {
        /* sin efecto: el primer audio real cargará la voz */
      }
    };
    window.addEventListener("pointerdown", warm, { once: true, passive: true });

    return () => {
      synth.removeEventListener("voiceschanged", load);
      window.removeEventListener("pointerdown", warm);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const phrase = text.replace(/^to /, "");
    if (timerRef.current) clearTimeout(timerRef.current);

    const candidates: (SpeechSynthesisVoice | null)[] = [
      ...rankVoices(synth.getVoices(), brokenRef.current).slice(0, 3),
      null, // último recurso: voz por defecto del navegador
    ];

    const attempt = (i: number) => {
      if (i >= candidates.length) return;
      const voice = candidates[i];
      const utter = new SpeechSynthesisUtterance(phrase);
      utterRef.current = utter;
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang;
      } else {
        utter.lang = "en-US";
      }
      // Un poco más lento para que se entienda bien; tono natural sin distorsión.
      utter.rate = 0.85;
      utter.pitch = 1.05;
      utter.volume = 1;

      let started = false;
      const fail = (hardError: boolean) => {
        if (started || utterRef.current !== utter) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (voice) {
          if (hardError) {
            // Error del motor: la voz no sirve, se recuerda entre sesiones
            brokenRef.current.add(voice.voiceURI);
            saveBroken(brokenRef.current);
          } else {
            // Solo tardó en arrancar: se descarta recién a la segunda vez y solo en esta sesión
            const n = (slowRef.current.get(voice.voiceURI) ?? 0) + 1;
            slowRef.current.set(voice.voiceURI, n);
            if (n >= 2) brokenRef.current.add(voice.voiceURI);
          }
        }
        synth.cancel();
        // Chromium ignora un speak() inmediatamente después de cancel()
        timerRef.current = setTimeout(() => attempt(i + 1), 100);
      };
      utter.onstart = () => {
        started = true;
        if (timerRef.current) clearTimeout(timerRef.current);
      };
      utter.onerror = (e) => {
        // "interrupted"/"canceled" = el usuario pulsó otro audio, no es fallo de la voz
        if (e.error === "interrupted" || e.error === "canceled") return;
        fail(true);
      };
      synth.speak(utter);
      if (synth.paused) synth.resume();
      // Si la voz no arranca a tiempo (no descargada, sin red), probar la siguiente
      timerRef.current = setTimeout(() => fail(false), START_TIMEOUT);
    };

    try {
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Chrome ignora un speak() inmediatamente después de cancel()
        timerRef.current = setTimeout(() => attempt(0), 100);
      } else {
        attempt(0);
      }
    } catch {
      /* sin voz disponible: la app sigue siendo usable */
    }
  }, []);

  return { speak, supported };
}
