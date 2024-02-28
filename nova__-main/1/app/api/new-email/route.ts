import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		// Extract email details from the request body
		const { emailChainId, vendorId, userId, subject, textBody, htmlBody } =
			await req.json();

		// Check if an email with the exact same information already exists
		const existingEmail = await prisma.email.findFirst({
			where: {
				emailChainId,
				vendorId,
				userId,
				subject,
				textBody,
				htmlBody,
			},
		});

		// If no matching email is found, create a new one
		if (!existingEmail) {
			await prisma.email.create({
				data: {
					emailChainId,
					vendorId,
					userId,
					subject,
					textBody,
					htmlBody,
				},
			});
			return NextResponse.json({ Done: "done" });
		} else {
			return NextResponse.json({
				Message: "Email with the same information already exists.",
			});
		}
	} catch (error) {
		return NextResponse.json({ Error: (error as any)?.message });
	}
}
