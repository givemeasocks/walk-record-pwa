import { createClient } from "@/lib/supabase/server";
import RecordCard from "@/components/RecordCard";
import type { WalkRecord } from "@/lib/types";
import EmptyFeed from "@/components/EmptyFeed";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: records } = await supabase
    .from("walk_records")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (records ?? []) as WalkRecord[];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 px-5 pt-[58px] pb-3.5">
        <div className="font-serif text-[25px] font-semibold text-foreground">피드</div>
      </div>
      <div className="flex-1 overflow-auto px-5 pb-6">
        {list.length > 0 ? (
          list.map((rec) => <RecordCard key={rec.id} record={rec} />)
        ) : (
          <EmptyFeed />
        )}
      </div>
    </div>
  );
}
