import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// returns both Orders and OrderItems
export async function POST(req: Request, res: Request) {
	try {
		// @REMEMBER: USE THE FUCKING REQUEST BODY DUMBASS
		const { userId } = await req.json();
		console.log("GETTING ORDERS FOR", userId);
		const orders = await prisma.order.findMany({
			where: {
				userId: userId,
			},
			include: {
				orderItems: true, // include the related order items in the result
			},
		});
		console.log("\n\nORDERS", orders);
		return NextResponse.json({ orders });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
