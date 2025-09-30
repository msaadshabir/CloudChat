import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/onboarding',
	'/api/health',
	'/api/webhooks/(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
	if (isPublicRoute(req)) return;
	const { userId, redirectToSignIn, sessionClaims } = await auth();
	if (!userId) {
		return redirectToSignIn({ returnBackUrl: req.url });
	}
});

export const config = {
	matcher: [
		// Skip static files and Next internals
		'/((?!.+\\.[\\w]+$|_next).*)',
		'/',
		'/(api|trpc)(.*)'
	],
};