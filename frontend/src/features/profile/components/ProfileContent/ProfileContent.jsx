import ContentContainer from "../../../../components/ui/Content/ContentContainer";
import ProfileForm from "../ProfileForm";

export default function ProfileContent() {
  return (
    <>
      <ContentContainer size={"1x3"}>
        <div>
          <h1 className="font-bold text-2xl">Mon profil</h1>
          <h2 className="text-lg">
            Gérez vos informations personnelles et préférences
          </h2>
        </div>
        <ProfileForm />
      </ContentContainer>
    </>
  );
}
