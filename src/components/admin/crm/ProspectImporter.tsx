"use client";

import { ChangeEvent, useMemo, useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, FileUp, Upload } from "lucide-react";
import {
  importProspects,
  type ProspectImportResult,
  type ProspectImportRow,
} from "@/app/admin/crm/prospecting-actions";

const aliases: Record<string, keyof ProspectImportRow> = {
  ciudad: "city",
  city: "city",
  company: "company",
  correo: "email",
  email: "email",
  empresa: "company",
  instagram: "instagram",
  interes: "interest",
  interest: "interest",
  mensaje: "message",
  message: "message",
  name: "name",
  nombre: "name",
  origen: "source",
  phone: "phone",
  source: "source",
  telefono: "phone",
};

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(text: string) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error("El CSV debe contener encabezados y al menos una fila.");
  }

  const delimiter =
    (lines[0].match(/;/g)?.length || 0) >
    (lines[0].match(/,/g)?.length || 0)
      ? ";"
      : ",";
  const headers = parseLine(lines[0], delimiter).map(
    (header) => aliases[normalizeHeader(header)],
  );

  if (!headers.includes("name")) {
    throw new Error('Falta la columna obligatoria "nombre".');
  }

  return lines.slice(1).map((line) => {
    const cells = parseLine(line, delimiter);
    return headers.reduce<ProspectImportRow>((row, key, index) => {
      if (key) row[key] = cells[index] || "";
      return row;
    }, {});
  });
}

export function ProspectImporter({ isDemo }: { isDemo: boolean }) {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ProspectImportRow[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ProspectImportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const incompleteRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          !row.name || (!row.email && !row.phone && !row.instagram),
      ).length,
    [rows],
  );

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResult(null);
    setError("");
    setRows([]);

    if (!file) return;

    try {
      const parsedRows = parseCsv(await file.text());
      setFileName(file.name);
      setRows(parsedRows);
    } catch (caught) {
      setFileName(file.name);
      setError(
        caught instanceof Error ? caught.message : "No se pudo leer el archivo.",
      );
    }
  }

  function submitImport() {
    startTransition(async () => {
      try {
        setError("");
        const nextResult = await importProspects(rows);
        setResult(nextResult);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "No se pudo completar la importación.",
        );
      }
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-brand-emerald" />
            <h2 className="font-black">Importar desde CSV</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-white/40">
            Admite coma o punto y coma. Revisa la vista previa antes de guardar.
          </p>
        </div>
        {rows.length > 0 && (
          <span className="rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-black text-brand-emerald">
            {rows.length} filas
          </span>
        )}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-950/50 px-5 py-8 text-center hover:border-brand-emerald/40">
        <Upload className="mb-3 h-7 w-7 text-white/35" />
        <span className="text-sm font-bold">
          {fileName || "Seleccionar archivo CSV"}
        </span>
        <span className="mt-1 text-xs text-white/30">Máximo 500 prospectos</span>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="sr-only"
        />
      </label>

      {error && (
        <div className="mt-4 flex gap-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-white/35">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Ciudad</th>
                  <th className="p-3">Interés</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((row, index) => (
                  <tr key={`${row.name}-${index}`} className="border-t border-white/5">
                    <td className="p-3 font-bold">{row.name || "Falta nombre"}</td>
                    <td className="p-3 text-white/50">{row.company || "—"}</td>
                    <td className="p-3 text-white/50">
                      {row.email || row.phone || row.instagram || "Falta contacto"}
                    </td>
                    <td className="p-3 text-white/50">{row.city || "—"}</td>
                    <td className="p-3 text-white/50">
                      {row.interest || "Por calificar"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {incompleteRows > 0 && (
            <p className="mt-3 text-xs text-amber-300">
              {incompleteRows} filas incompletas serán omitidas.
            </p>
          )}

          <button
            type="button"
            onClick={submitImport}
            disabled={isDemo || isPending || rows.length === 0}
            className="mt-5 w-full rounded-xl bg-brand-emerald px-4 py-3 text-sm font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDemo
              ? "Importación disponible con base real"
              : isPending
                ? "Importando..."
                : `Importar ${rows.length} prospectos`}
          </button>
        </>
      )}

      {result && (
        <div className="mt-5 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/10 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-brand-emerald">
            <CheckCircle2 className="h-4 w-4" />
            {result.created} prospectos incorporados
          </div>
          <p className="mt-1 text-xs text-white/45">
            {result.skipped} omitidos por datos incompletos o duplicados.
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-amber-200">
              {result.errors.map((message) => (
                <li key={message}>• {message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
