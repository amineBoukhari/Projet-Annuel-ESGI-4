import ProfileForm from "../ProfileForm";
import SecurityForm from "../SecurityForm";

export default function ProfileContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <ProfileForm />
      </div>
      <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <SecurityForm />
      </div>
    </div>
  );
}
