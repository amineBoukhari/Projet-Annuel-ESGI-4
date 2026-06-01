import { useState } from "react";
import { useNavigate, Link } from "react-router";
import userService from "../services/userService";
import ContentContainer from "../components/ui/Content/ContentContainer";

const ROLE_OPTIONS = ["Owner", "Manager", "Employee"];

export default function CreateUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !email || !password) {
      setError("Tous les champs sont requis.");
      setLoading(false);
      return;
    }

    const result = await userService.createUser({ username, email, password, role });
    setLoading(false);

    if (result?.status === "error" || result?.error) {
      setError(result.error || result.message || "Impossible de créer l'utilisateur.");
      return;
    }

    navigate("/users");
  };

  return (
    <>
      <ContentContainer x={3}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Créer un utilisateur</h1>
              <p className="text-sm text-slate-500 mt-2">Ajoutez un nouvel utilisateur en choisissant son rôle.</p>
            </div>
            <Link
              to="/users"
              className="rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Retour à la liste
            </Link>
          </div>

          {error && <p className="text-red-600 bg-red-50 rounded-2xl p-3">{error}</p>}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="username">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="role">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-slate-500">
                  Les rôles Owner et Manager sont créés via des routes backend dédiées. Employee est le rôle par défaut.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Création..." : "Créer l'utilisateur"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </ContentContainer>
    </>
  );
}
