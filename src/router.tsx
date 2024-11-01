import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

export default function AppRouter() {
	return (
		<Router>
			<Route path="/" component={lazy(() => import("./routes/_index"))} />
			<Route
				component={lazy(() => import("./routes/folder.$id"))}
				path="/folder/:id"
			/>
		</Router>
	);
}
