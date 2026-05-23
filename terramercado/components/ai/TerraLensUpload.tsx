"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImageIcon,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface LensRecomendacion {
  producto_id?: string;
  descripcion: string;
}

interface LensResult {
  identificacion: string;
  probabilidad: number;
  diagnostico: string;
  recomendaciones: LensRecomendacion[];
  alertas: string[];
}

interface TerraLensUploadProps {
  userContext?: {
    cultivo?: string;
    ubicacion?: string;
    ciclo?: string;
  };
}

const CICLO_OPTIONS = [
  { value: "siembra", label: "Siembra" },
  { value: "desarrollo_vegetativo", label: "Desarrollo vegetativo" },
  { value: "floracion", label: "Floración" },
  { value: "fructificacion", label: "Fructificación" },
  { value: "cosecha", label: "Cosecha" },
  { value: "post_cosecha", label: "Post-cosecha" },
];

export function TerraLensUpload({ userContext }: TerraLensUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cultivo, setCultivo] = useState(userContext?.cultivo ?? "");
  const [ciclo, setCiclo] = useState(userContext?.ciclo ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LensResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
    if (!ACCEPTED.includes(file.type)) {
      setError("Solo se aceptan imágenes JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }
    setError(null);
    setResult(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = await fileToBase64(imageFile);
      const res = await fetch("/api/ia/agro-lens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagenBase64: base64,
          mimeType: imageFile.type,
          cultivoActivo: cultivo || undefined,
          ubicacion: userContext?.ubicacion || undefined,
          ciclo: ciclo || undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as LensResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!imagePreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-10 px-4 ${
            dragging
              ? "border-[#1e4d8c] bg-[#dbeafe] dark:bg-[rgba(30,77,140,0.2)]"
              : "border-[#93c5fd] dark:border-[rgba(96,165,245,0.3)] hover:border-[#1e4d8c] hover:bg-[#eff6ff] dark:hover:bg-[rgba(30,77,140,0.1)]"
          }`}
        >
          <ImageIcon className="h-10 w-10 text-[#60a5f5]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#1e293b] dark:text-[#eff6ff]">
              Arrastra una foto o haz clic para seleccionar
            </p>
            <p className="text-xs text-[#94a3b8] mt-1">JPG, PNG, WebP — máx. 5 MB</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1e4d8c] dark:text-[#60a5f5]">
            <Upload className="h-3.5 w-3.5" />
            Subir imagen
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-64 object-contain bg-[#f8fafc] dark:bg-[#1a3a6a]"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Quitar imagen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Context inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-[#475569] dark:text-[#94a3b8]">
            Cultivo
          </Label>
          <Input
            value={cultivo}
            onChange={(e) => setCultivo(e.target.value)}
            placeholder="ej. Maíz, Tomate…"
            className="bg-white dark:bg-[#1a3a6a] border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-[#475569] dark:text-[#94a3b8]">
            Ciclo productivo
          </Label>
          <Select value={ciclo} onValueChange={(v) => setCiclo(v ?? "")}>
            <SelectTrigger className="bg-white dark:bg-[#1a3a6a] border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] text-sm">
              <SelectValue placeholder="Seleccionar ciclo" />
            </SelectTrigger>
            <SelectContent>
              {CICLO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Analyze button */}
      <Button
        onClick={() => void handleAnalyze()}
        disabled={!imageFile || loading}
        className="w-full bg-[#1e4d8c] hover:bg-[#1a3a6a] text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Analizando imagen con IA…
          </>
        ) : (
          "Analizar con Terra-Lens"
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className="space-y-4 rounded-xl border border-[#dbeafe] dark:border-[rgba(96,165,245,0.2)] p-4 bg-white dark:bg-[#1a3a6a]/40">
          {/* Identification */}
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-[#eff6ff]">
                {result.identificacion}
              </p>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Confianza:{" "}
                <span className="terra-score text-[#f59e0b] font-semibold">
                  {(result.probabilidad * 100).toFixed(0)}%
                </span>
              </p>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-1">
              Diagnóstico
            </p>
            <p className="text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
              {result.diagnostico}
            </p>
          </div>

          {/* Recommendations */}
          {result.recomendaciones.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">
                Recomendaciones
              </p>
              <ul className="space-y-2">
                {result.recomendaciones.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#475569] dark:text-[#cbd5e1]">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1e4d8c] shrink-0" />
                    <span>
                      {rec.descripcion}
                      {rec.producto_id && (
                        <Link
                          href={`/producto/${rec.producto_id}`}
                          className="ml-1 text-[#1e4d8c] dark:text-[#60a5f5] underline underline-offset-2 text-xs"
                        >
                          Ver producto
                        </Link>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alerts */}
          {result.alertas.length > 0 && (
            <div className="space-y-2">
              {result.alertas.map((alerta, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{alerta}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URI prefix, keep only base64 content
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
