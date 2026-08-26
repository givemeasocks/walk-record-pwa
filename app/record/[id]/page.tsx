import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WalkRecord } from "@/lib/types";
import RecordDetailClient from "@/components/RecordDetailClient";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: record } = await supabase
    .from("walk_records")
    .select("*")
    .eq("id", id)
    .single();

  if (!record) notFound();

  return <RecordDetailClient record={record as WalkRecord} />;
}
