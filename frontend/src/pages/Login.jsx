import LoginForm from "../features/auth/components/LoginForm";

export default function Login() {
  return (
    <section className="flex justify-center items-center min-h-screen bg-surface p-6">
      <div className="w-full max-w-[420px]">
        <LoginForm />
      </div>
    </section>
  );
}
