"use client";

const notifications = [
  { title: "Seller approved", recipient: "Seller", channel: "in-app" },
  { title: "Verification removed", recipient: "Seller", channel: "email" },
  { title: "Refund decision sent", recipient: "Customer", channel: "in-app" },
  { title: "Case update posted", recipient: "Customer", channel: "email" },
];

export default function AdminNotificationsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin notifications</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace communications</h1>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.map((item) => (
            <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.recipient}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-200">{item.channel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
