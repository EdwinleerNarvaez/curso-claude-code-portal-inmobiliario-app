import { NextResponse, type NextRequest } from "next/server";

import {
  handleRouteError,
  parseInput,
  searchParamsToObject,
} from "@/lib/api-response";
import { publicPropertyListQuerySchema } from "@/schemas/property-schemas";
import { getPropertyService } from "@/services/property-service";

/** GET /api/properties — catálogo público paginado (solo propiedades publicadas). */
export async function GET(request: NextRequest) {
  try {
    const query = parseInput(
      publicPropertyListQuerySchema,
      searchParamsToObject(request.nextUrl.searchParams),
    );
    const result = await getPropertyService().listPublishedProperties(query);

    return NextResponse.json(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
