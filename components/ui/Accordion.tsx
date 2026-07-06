"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="divide-y divide-cardline border-y border-cardline">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-copperlight"
            >
              <span className="font-display text-xl text-bone md:text-2xl">{item.title}</span>
              <span
                aria-hidden
                className={`flex-shrink-0 text-copper transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div id={`accordion-panel-${item.id}`} hidden={!isOpen} className="pb-6">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
