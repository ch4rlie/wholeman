import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";
import { formatCallDate, nextCall } from "@/lib/call-schedule";

export function BrotherhoodCall() {
  const { brotherhoodCall, callSchedule } = siteConfig;
  const session = nextCall();
  const nextDate = formatCallDate(session);
  return (
    <section className="bg-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>○</span>}>Step one</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{brotherhoodCall.header}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{brotherhoodCall.body}</p>
          <dl className="mt-6 space-y-1 font-sans text-sm text-faint">
            <div><dt className="inline text-copper">Cost: </dt><dd className="inline">{brotherhoodCall.cost}</dd></div>
            <div><dt className="inline text-copper">Who: </dt><dd className="inline">{brotherhoodCall.who}</dd></div>
            <div><dt className="inline text-copper">Where: </dt><dd className="inline">{brotherhoodCall.where}</dd></div>
            <div><dt className="inline text-copper">When: </dt><dd className="inline">{callSchedule.cadence} · {callSchedule.time}</dd></div>
            <div><dt className="inline text-copper">Next call: </dt><dd className="inline">{nextDate}</dd></div>
          </dl>
          <a
            href={session.url}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-block rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            Save my seat — free
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
