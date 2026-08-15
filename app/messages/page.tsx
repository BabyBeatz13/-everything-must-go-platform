import Link from "next/link";
import { supportConversations } from "@/lib/support";

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Messaging</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace conversations</h1>
        </div>

        <div className="mt-6 space-y-3">
          {supportConversations.map((conversation) => (
            <Link key={conversation.id} href={`/messages/${conversation.id}`} className="block rounded-[28px] border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{conversation.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">{conversation.type} • {conversation.status}</p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">Live</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
