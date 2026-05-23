import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/catalog";
import { FinancingOfferCard } from "./FinancingOfferCard";
import { TransactionList } from "./TransactionList";

export const metadata: Metadata = {
  title: "Billetera",
};

interface FinancingOffer {
  id: string;
  created_at: string;
  financiera_id: string;
  nombre: string;
  descripcion?: string | null;
  tasa_interes: number;
  plazo_dias: number;
  monto_min: number;
  monto_max: number;
  terra_score_min: number;
  activa: boolean;
  financiera: { nombre: string } | null;
}

interface WalletTransaction {
  id: string;
  created_at: string;
  wallet_id: string;
  tipo: string;
  monto: number;
  moneda: "USD" | "VES";
  referencia?: string | null;
  descripcion?: string | null;
}

interface Wallet {
  id: string;
  user_id: string;
  saldo_usd: number;
  saldo_ves: number;
}

function DepositarButton() {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={undefined}
      className="text-xs"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({
        onClick:
          "alert('Próximamente — integración bancaria completa en Sprint 6 de producción')",
      } as unknown as object)}
    >
      Depositar
    </Button>
  );
}

export default async function BilleteraPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single<Wallet>();

  const { data: transactionsRaw } = wallet
    ? await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: null };

  const transactions: WalletTransaction[] = (transactionsRaw as WalletTransaction[] | null) ?? [];

  const { data: offersRaw } = await supabase
    .from("financing_offers")
    .select("*, financiera:profiles(nombre)")
    .eq("activa", true)
    .limit(6);

  const offers: FinancingOffer[] = (offersRaw as FinancingOffer[] | null) ?? [];

  const saldoUsd = wallet?.saldo_usd ?? 0;
  const saldoVes = wallet?.saldo_ves ?? 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col gap-10">
      {/* ── Saldo ── */}
      <section>
        <h1 className="font-heading text-2xl font-semibold text-[#0d2240] dark:text-white mb-4">
          Mi Billetera
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* USD */}
          <Card className="bg-[#0d2240] text-white ring-0 border-0">
            <CardHeader>
              <CardTitle className="text-xs font-normal tracking-widest uppercase text-white/60">
                Saldo USD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-bold text-white">
                {formatPrice(saldoUsd, "USD")}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Próximamente — integración bancaria completa en Sprint 6 de producción"
                    )
                  }
                  className="rounded-lg bg-[#1e4d8c] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1e4d8c]/80 transition-colors"
                >
                  Depositar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Próximamente — integración bancaria completa en Sprint 6 de producción"
                    )
                  }
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Retirar
                </button>
              </div>
            </CardContent>
          </Card>

          {/* VES */}
          <Card className="bg-[#f59e0b]/10 dark:bg-[#f59e0b]/5 border-[#f59e0b]/20">
            <CardHeader>
              <CardTitle className="text-xs font-normal tracking-widest uppercase text-[#f59e0b]">
                Saldo VES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-bold text-[#0d2240] dark:text-white">
                {formatPrice(saldoVes, "VES")}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Próximamente — integración bancaria completa en Sprint 6 de producción"
                    )
                  }
                  className="rounded-lg bg-[#f59e0b] px-3 py-1.5 text-xs font-medium text-[#0d2240] hover:bg-[#f59e0b]/80 transition-colors"
                >
                  Depositar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Próximamente — integración bancaria completa en Sprint 6 de producción"
                    )
                  }
                  className="rounded-lg border border-[#f59e0b]/40 px-3 py-1.5 text-xs font-medium text-[#0d2240] dark:text-white hover:bg-[#f59e0b]/10 transition-colors"
                >
                  Retirar
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── TerraBanca ── */}
      {offers.length > 0 && (
        <section>
          <h2 className="font-heading text-xl font-semibold text-[#0d2240] dark:text-white mb-1">
            TerraBanca
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Ofertas de crédito agropecuario</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <FinancingOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* ── Historial ── */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-[#0d2240] dark:text-white mb-4">
          Historial de transacciones
        </h2>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
}
