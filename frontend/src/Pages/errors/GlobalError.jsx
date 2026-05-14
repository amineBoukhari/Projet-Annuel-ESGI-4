import { isRouteErrorResponse, NavLink, useRouteError } from "react-router"
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";

export default function GlobalError() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 404:
                return (<NotFound />);
            case 403:
                return (<Forbidden />);
        }
    }

    return (<p>{error}</p>)
}