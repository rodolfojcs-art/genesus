"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resolveDisputeAction } from "./actions";

interface DisputeResolveFormProps {
  disputeId: string;
}

export function DisputeResolveForm({ disputeId }: DisputeResolveFormProps) {
  const [notas, setNotas] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleResolve(resolution: "reembolsar" | "liberar") {
    if (!notas.trim()) {
      setError("Las notas de resolución son requeridas");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await resolveDisputeAction(disputeId, resolution, notas);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? "Error desconocido");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notas-resolucion" className="text-sm">
          Notas de resolución <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="notas-resolucion"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Describe la decisión de resolución y los fundamentos…"
          rows={4}
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:opacity-50 dark:bg-input/30 dark:border-input resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={() => handleResolve("reembolsar")}
          disabled={isPending}
          variant="destructive"
          className="flex-1"
        >
          {isPending ? "Procesando…" : "Reembolsar al comprador"}
        </Button>
        <Button
          type="button"
          onClick={() => handleResolve("liberar")}
          disabled={isPending}
          className="flex-1 bg-green-700 hover:bg-green-600 text-white"
        >
          {isPending ? "Procesando…" : "Liberar al vendedor"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Esta acción actualizará el estado del pedido, el escrow y registrará la decisión en el audit log. Esta acción no se puede deshacer.
      </p>
    </div>
  );
}
