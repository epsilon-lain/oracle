import type { Message } from "@/lib/types";

type MessageLogProps = {
  messages: Message[];
};

export function MessageLog({ messages }: MessageLogProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
      {messages.map((message) => (
        <article
          key={message.id}
          className={
            message.speaker === "player"
              ? "ml-auto max-w-[86%] border border-rain/35 bg-rain/10 px-4 py-3 text-bone"
              : "max-w-[92%] border border-bone/12 bg-smoke/85 px-4 py-3 text-bone"
          }
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-bone/45">
            <span>{message.speaker === "player" ? "Player" : "Oracle GM"}</span>
            <span>Turn {message.turn}</span>
          </div>
          <p className="whitespace-pre-line text-sm leading-7 text-bone/86">{message.text}</p>
          {message.checkResult ? (
            <div className="mt-3 border-t border-bone/10 pt-3 text-xs leading-5 text-ember">
              Check: d10 + {message.checkResult.skill} = {message.checkResult.total} vs{" "}
              {message.checkResult.target} / {message.checkResult.outcome}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
