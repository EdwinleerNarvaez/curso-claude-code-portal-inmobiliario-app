import { NextResponse, type NextRequest } from "next/server";

import { handleRouteError, parseInput } from "@/lib/api-response";
import { propertyIdSchema } from "@portal/shared/schemas/property-schemas";
import { getPropertyService } from "@/services/property-service";

/** GET /api/properties/{id} — detalle público de una propiedad publicada. */
export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/properties/[id]">,
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInput(propertyIdSchema, id);
    const property =
      await getPropertyService().getPublishedPropertyById(propertyId);

    return NextResponse.json({ data: property });
  } catch (error) {
    return handleRouteError(error);
  }
}
