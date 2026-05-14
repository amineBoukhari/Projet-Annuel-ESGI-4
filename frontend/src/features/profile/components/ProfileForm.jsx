import Input from "../../../components/form/Input/Input";
import Avatar from "../../../components/ui/Temp/Avatar";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ProfileForm() {
    const { user } = useAuth();
   
    return (
      <>
        <form className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar attributes={"rounded-full size-24"} seed={user.username} />
            <div className="flex flex-col">
              <p className="font-semibold">{user.username}</p>
              <p className="">{user.role.name}</p>
            </div>
          </div>
          <hr className="mx-12" />
          <div className="grid grid-cols-2 gap-3">
            <Input label={"Username"} value={user.username} />
            <Input label={"Email"}  />
          </div>
        </form>
      </>
    );
}