import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import userService from "../services/userService";
import ContentContainer from "../components/ui/Content/ContentContainer";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      const result = await userService.getUserById(id);
      if (result?.status === "error" || result?.error) {
        setError(result.error || result.message || "Impossible de charger l'utilisateur.");
      } else {
        setUsername(result.username || "");
        setEmail(result.email || "");
      }
      setLoading(false);
    };

    loadUser();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    if (!username || !email) {
      setError("Le nom et l'email sont requis.");
      setSaving(false);
      return;
    }

    const result = await userService.updateUser(id, { username, email });
    setSaving(false);

    if (result?.status === "error" || result?.error) {
      setError(result.error || result.message || "Impossible de mettre à jour l'utilisateur.");
      return;
    }

    navigate(`/users/${id}`);
  };

  return (
    <>
      <ContentContainer x={3}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Modifier l'utilisateur</h1>
              <p className="text-sm text-slate-500 mt-2">Modifiez le nom et l'adresse email de l'utilisateur.</p>
            </div>
            <Link
              to={`/users/${id}`}
              className="rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Retour au profil
            </Link>
          </div>

          {error && <p className="text-red-600 bg-red-50 rounded-2xl p-3">{error}</p>}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl bg-slate-50 p-6 shadow-sm">
              {loading ? (
                <p className="text-slate-600">Chargement du profil...</p>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Enregistrez les modifications pour mettre à jour les informations de l'utilisateur.
                </p>
                <button
                  type="submit"
                  disabled={loading || saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </ContentContainer>
    </>
  );
}
