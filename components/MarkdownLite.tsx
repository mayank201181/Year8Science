import React from "react";

// A tiny, safe markdown renderer. Supports:
//   **bold**, *italic*, `code`
//   paragraphs separated by blank lines
//   "- " bullet lists
// It never uses dangerouslySetInnerHTML, so authored content can't inject HTML.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Tokenise on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={key} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-pink-700">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      nodes.push(<em key={key} className="italic">{part.slice(1, -1)}</em>);
    } else {
      nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
    }
  });
  return nodes;
}

export function MarkdownLite({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className={`space-y-3 leading-relaxed text-slate-700 ${className}`}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={bi} className="ml-1 space-y-1.5">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  <span>{renderInline(l.trim().slice(2), `${bi}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>{renderInline(block, `p-${bi}`)}</p>
        );
      })}
    </div>
  );
}
