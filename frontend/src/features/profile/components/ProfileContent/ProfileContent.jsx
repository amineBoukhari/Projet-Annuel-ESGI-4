import ContentContainer from "../../../../components/ui/Content/ContentContainer";
import ProfileForm from "../ProfileForm";
import SecurityForm from "../SecurityForm";

export default function ProfileContent() {
  return (
    <>
      <ContentContainer x={3}>
        <ProfileForm />
      </ContentContainer>
      <ContentContainer x={1}>
        <SecurityForm />
      </ContentContainer>
    </>
  );
}
