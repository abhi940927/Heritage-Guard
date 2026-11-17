import { NextRequest, NextResponse } from "next/server";
import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  DestinationFilterParams,
} from "@/services/destinationQueries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: DestinationFilterParams = {
    search: searchParams.get("search") || undefined,
    state: searchParams.get("state") || undefined,
    category: searchParams.get("category") || undefined,
    sort: (searchParams.get("sort") as DestinationFilterParams["sort"]) || undefined,
  };

  const destinations = await getDestinations(filters);
  return NextResponse.json(destinations);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await createDestination(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateDestination(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing destination id" }, { status: 400 });
  }

  const success = await deleteDestination(id);
  return NextResponse.json({ success });
}
