import { getPageDictionary } from "@/lib/page-helpers";

export default async function LoginPage() {
  const { dictionary } = await getPageDictionary();

  return (
    <section className="card mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-white">{dictionary["login.title"]}</h1>
      <p className="text-sm text-slate-400">
        Используйте Supabase Auth. Настройте провайдеры в Supabase Dashboard и добавьте ключи
        в .env.
      </p>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Эл. почта"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <button className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
          Войти
        </button>
      </form>
    </section>
  );
}
