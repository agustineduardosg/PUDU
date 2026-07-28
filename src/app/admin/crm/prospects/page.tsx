import { DatabaseZap, Plus, ShieldCheck } from "lucide-react";
import { ProspectImporter } from "@/components/admin/crm/ProspectImporter";
import { createLeadManually } from "../prospecting-actions";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm disabled:opacity-40";

export default function ProspectsPage() {
  const isDemo = process.env.CRM_DEMO_MODE === "true";

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-emerald">
          <DatabaseZap className="h-4 w-4" />
          Captación ordenada
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Incorporar <span className="text-brand-emerald">prospectos</span>
        </h1>
        <p className="mt-2 max-w-3xl text-white/50">
          Carga oportunidades encontradas en Instagram, referidos o campañas sin
          perder el control de calidad de los datos.
        </p>
      </header>

      {isDemo && (
        <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          Puedes probar la lectura y vista previa del CSV. El guardado se habilita
          al conectar PostgreSQL.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <ProspectImporter isDemo={isDemo} />

        <form
          action={createLeadManually}
          className="rounded-[2rem] border border-white/10 bg-[#0f172a]/80 p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black">Ingreso manual</h2>
              <p className="text-xs text-white/40">
                Para oportunidades individuales o referidos.
              </p>
            </div>
          </div>

          <fieldset disabled={isDemo} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Nombre *
              </span>
              <input name="name" required className={inputClass} />
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Empresa
              </span>
              <input name="company" className={inputClass} />
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Email
              </span>
              <input type="email" name="email" className={inputClass} />
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Teléfono
              </span>
              <input name="phone" className={inputClass} />
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Instagram
              </span>
              <input name="instagram" placeholder="@empresa" className={inputClass} />
            </label>
            <label>
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Ciudad
              </span>
              <input name="city" className={inputClass} />
            </label>
            <label className="sm:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Necesidad o interés
              </span>
              <input
                name="interest"
                placeholder="Landing page, CRM, agenda online..."
                className={inputClass}
              />
            </label>
            <label className="sm:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                Contexto observado
              </span>
              <textarea
                name="message"
                rows={4}
                placeholder="Señal detectada, problema posible y oportunidad..."
                className={`${inputClass} resize-y`}
              />
            </label>
            <p className="sm:col-span-2 flex items-center gap-2 text-xs text-white/35">
              <ShieldCheck className="h-4 w-4 text-brand-emerald" />
              Se requiere al menos email, teléfono o Instagram. Si ya existe, se
              abrirá su ficha.
            </p>
            <button
              type="submit"
              className="sm:col-span-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-black disabled:opacity-40"
            >
              {isDemo ? "Disponible con base real" : "Crear prospecto"}
            </button>
          </fieldset>
        </form>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-black">Columnas reconocidas en el CSV</h2>
        <p className="mt-2 text-xs leading-relaxed text-white/40">
          nombre, empresa, email/correo, teléfono, instagram, ciudad, interés,
          mensaje y origen. Los encabezados pueden estar en español o inglés.
        </p>
      </section>
    </div>
  );
}
