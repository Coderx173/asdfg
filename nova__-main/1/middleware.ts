// add middleware to everything
export { default } from "next-auth/middleware";

// MUST authenticate to access the tableComponent etc.
export const config = {
	matcher: [
		"/dashboard",
		// add all the paths under specifically the app directory
		"/app/:path*",
		// "/", // removed the home-page path from here that way i can setup homepage information...
	],
};
