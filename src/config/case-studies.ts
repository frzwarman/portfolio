import type { ProjectCaseStudy } from "./project-types";

// Reading-page content stays out of the city/client bundle. Claims are grounded
// in the project implementations listed under each study's sources.
export const caseStudies: readonly ProjectCaseStudy[] = [
  {
    slug: "meja",
    positioning: "A restaurant queue should not stop when the network does.",
    role: ["Frontend architecture", "Application implementation"],
    status: "Working implementation · local demo available",
    overview: "Meja follows a restaurant’s daily loop: open a shift, take an order, send it to the kitchen, take payment, issue a receipt, and reconcile the till. The interface reads from the device first; the server validates the money when queued operations arrive.",
    problem: "A small restaurant runs from one cashier device with an unreliable connection. A network interruption cannot turn every order into a loading screen. The harder requirement is keeping the local record and the server’s financial record consistent after reconnection.",
    constraints: [
      { title: "One primary device", description: "One phone or tablet records transactions. Other devices are read-only; transferring the till requires an explicit online handover." },
      { title: "Bounded offline access", description: "Cashier operations continue within an already-authorized shift, for at most 12 hours. Fresh login and shift opening need a connection." },
      { title: "Money must reconcile", description: "Amounts use integer rupiah. Postgres recomputes totals and checks roles, shifts, and device ownership." },
      { title: "Small operational footprint", description: "A static PWA and one Supabase write RPC keep the deployment maintainable for a single outlet." },
    ],
    architecture: [{
      title: "Local first, server validated",
      description: "The domain record and its outbox operation commit in one IndexedDB transaction. Synchronization is a separate, ordered path; the cashier reads locally.",
      steps: [
        { label: "React cashier interface", detail: "TanStack Router organizes the daily workflow. Screens read the local database rather than waiting for a server response." },
        { label: "Application commands", detail: "Domain rules validate the action and generate a stable operation ID before persisting it." },
        { label: "Dexie / IndexedDB transaction", detail: "The order, shift, or movement and its outbox operation commit together. Neither can exist alone after a partial write." },
        { label: "Transactional outbox", detail: "Operations are persisted with pending, rejected, or synced state. Web Locks prevents concurrent synchronization on the same identity and device." },
        { label: "Ordered synchronization", detail: "Replay oldest operations first, with retry backoff. Stop at the first rejection rather than replaying dependent actions out of order.", branches: [
          { label: "Offline / transport failure", detail: "Keep the pending operation locally and back off before retrying." },
          { label: "Connection available", detail: "Send the same operation ID to apply_operation; record the acknowledgement locally.", continues: true },
        ] },
        { label: "Supabase / Postgres", detail: "apply_operation is the only write path. It checks authorization and business rules, recomputes totals, and deduplicates operation IDs." },
      ],
    }],
    hardProblem: {
      title: "A retry must not become a second order.",
      problem: "A request may commit on the server while its acknowledgement never reaches the tablet. Treating the retry as a new request would duplicate a financial operation.",
      solution: "Identity belongs to the operation, not the network attempt. A replay returns the original result; reusing an ID with a changed payload is rejected.",
      steps: ["Generate a stable client operation ID.", "Commit the domain record and operation atomically in Dexie.", "Replay in order through the outbox.", "Postgres returns the first result for an identical operation ID and payload.", "Persist the receipt and mark the local entry synced; keep the acknowledged record."],
    },
    decisions: [
      { decision: "Local reads with Dexie", why: "Taking an order should not require a round trip.", tradeoff: "Synchronization, browser storage loss, and identity isolation become explicit responsibilities." },
      { decision: "One validated write RPC", why: "The server remains the authority on money even when commands originate offline.", tradeoff: "Business rules exist on both sides and need database-level verification." },
      { decision: "Stop on rejection", why: "Later operations may depend on the rejected one.", tradeoff: "An operator must reconcile the conflict before the queue can progress." },
      { decision: "Prompted PWA updates", why: "An update must not reload the till during checkout.", tradeoff: "The operator chooses when to activate a new shell." },
    ],
    failureStates: [
      { trigger: "Connection disappears", response: "Eligible cashier operations persist locally. Online-only actions remain unavailable; queued work waits for reconnection." },
      { trigger: "Server rejects an operation", response: "Mark the entry rejected and stop replay. Do not skip ahead through dependent transactions." },
      { trigger: "Refresh during synchronization", response: "Pending operations survive in IndexedDB. A retry uses the same operation ID, including when the server already committed it." },
      { trigger: "Browser storage is cleared", response: "Unsynced work can be lost. Browser storage is not a guaranteed backup; operational documentation includes a paper fallback." },
    ],
    performance: [
      { strategy: "Local reads", detail: "Cashier screens read IndexedDB; network latency is outside the normal order-entry path." },
      { strategy: "Bounded background replay", detail: "Synchronization handles ordered batches with exponential backoff and jitter instead of repeatedly flooding an unavailable server." },
      { strategy: "Cached application shell", detail: "Workbox precaches the PWA. The POS route is eager; secondary routes are lazy loaded." },
    ],
    results: ["Cashier work can continue offline within an authorized shift, then synchronize through a server-validated operation log.", "Financial retries preserve operation identity, and rejected dependencies remain visible instead of silently disappearing."],
    limitations: "One outlet and one primary cashier device. No offline QRIS/card verification, fresh login, or shift opening. Physical receipt printing and day-long Android behavior are not verified by the repository’s automated tests.",
    sources: [{ label: "Operating model and boundaries", path: "README.md" }, { label: "Atomic application commands", path: "src/lib/commands.ts" }, { label: "Ordered synchronization", path: "src/lib/sync.ts" }, { label: "Server validation and idempotency", path: "supabase/migrations/202609210002_operations.sql" }],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
