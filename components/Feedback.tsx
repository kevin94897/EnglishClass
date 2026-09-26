"use client";

export function Empty({ message }: { message: string }) {
  return (
    <div className="panel center">
      <h3>Nada por aquí todavía</h3>
      <p>{message}</p>
    </div>
  );
}

export function RoundEnd({
  title,
  message,
  onRestart,
  label = "Otra ronda",
}: {
  title: string;
  message: string;
  onRestart: () => void;
  label?: string;
}) {
  return (
    <div className="panel center">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="row mt">
        <button className="btn yes" onClick={onRestart}>
          {label}
        </button>
      </div>
    </div>
  );
}
