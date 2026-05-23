import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "TerraComunidad",
};

export default function ComunidadPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] dark:bg-[#1a3a6a]">
          <Users className="h-5 w-5 text-[#1e4d8c] dark:text-[#60a5f5]" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1e293b] dark:text-[#eff6ff]">
            TerraComunidad
          </h1>
          <p className="text-sm text-[#94a3b8]">Foros y preguntas entre agricultores</p>
        </div>
      </div>

      <Card className="border border-[#dbeafe] dark:border-[rgba(96,165,245,0.15)] rounded-xl">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Users className="h-16 w-16 text-[#93c5fd]" />
          <div className="space-y-2 max-w-sm">
            <p className="font-semibold text-[#1e293b] dark:text-[#eff6ff]">Próximamente</p>
            <p className="text-sm text-[#94a3b8]">
              Conecta con otros agricultores, comparte experiencias, pregunta y responde dudas sobre
              cultivos, plagas, insumos y más.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
