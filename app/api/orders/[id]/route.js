import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Check karo — yeh order is user ka hai?
  const orderResult = await pool.query(
    "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
    [id, user.id],
  );

  if (orderResult.rows.length === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = orderResult.rows[0];

  // Already cancelled?
  if (order.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Order already cancelled" },
      { status: 400 },
    );
  }

  // Status update karo
  await pool.query("UPDATE orders SET status = 'CANCELLED' WHERE id = $1", [
    id,
  ]);

  return NextResponse.json({ message: "Order cancelled!" });
}
