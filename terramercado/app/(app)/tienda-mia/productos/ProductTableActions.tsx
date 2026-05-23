"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toggleProductActiveAction, deleteProductAction } from "../actions";

interface ProductTableActionsProps {
  id: string;
  activo: boolean;
  nombre: string;
  compact?: boolean;
  showDelete?: boolean;
}

export function ProductTableActions({
  id,
  activo,
  nombre,
  compact,
  showDelete,
}: ProductTableActionsProps) {
  const [active, setActive] = useState(activo);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handleToggle() {
    setLoadingToggle(true);
    const result = await toggleProductActiveAction(id, !active);
    if (!result.error) setActive((v) => !v);
    setLoadingToggle(false);
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setLoadingDelete(true);
    const result = await deleteProductAction(id);
    if (result.error) {
      alert(result.error);
    }
    setLoadingDelete(false);
  }

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={loadingToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
          active ? "bg-[#1e4d8c]" : "bg-[#dbeafe] dark:bg-[#1e4d8c]/40"
        }`}
        aria-label={active ? "Desactivar producto" : "Activar producto"}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    );
  }

  if (showDelete) {
    return (
      <button
        onClick={handleDelete}
        disabled={loadingDelete}
        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 font-medium flex items-center gap-1"
        aria-label={`Eliminar ${nombre}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {loadingDelete ? "..." : "Eliminar"}
      </button>
    );
  }

  return null;
}
