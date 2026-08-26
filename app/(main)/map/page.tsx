import { createClient } from "@/lib/supabase/server";
import type { WalkRecord } from "@/lib/types";
import MapView from "@/components/MapViewClient";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: records } = await supabase
    .from("walk_records")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-5 pt-[58px] pb-3.5">
        <div className="font-serif text-[25px] font-semibold text-foreground">지도</div>
      </div>
      <MapView records={(records ?? []) as WalkRecord[]} />
    </div>
  );
}
