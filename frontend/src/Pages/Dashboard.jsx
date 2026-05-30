import { useLocation } from "react-router";

export default function Dashboard({ getRoute }) {
  const route = useLocation();
  return <>Contenu du Dashboard</>;
}
