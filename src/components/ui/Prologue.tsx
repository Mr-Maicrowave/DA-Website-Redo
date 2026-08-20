import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Prologue = () => (
  <section
    id="prologue"
    className="relative isolate min-h-[82svh] overflow-hidden bg-[#f5ead6] px-6 py-28 text-center sm:px-8 lg:min-h-screen"
  >
    <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_18%,rgba(255,244,204,0.92),rgba(245,234,214,0.75)_36%,rgba(232,211,176,0.62)_62%,rgba(10,27,52,0.16)_100%)]" />
    <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-[#fff8e8] via-[#fff0ce]/58 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#f5ead6] to-transparent" />
    <div className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[52vw] max-h-[520px] min-h-[280px] w-[52vw] min-w-[280px] max-w-[520px] -translate-x-1/2 rounded-full bg-[#f0c86a]/12 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex min-h-[58svh] max-w-3xl flex-col items-center justify-center"
    >
      <div className="mb-8 h-px w-24 bg-gradient-to-r from-transparent via-[#b98b28] to-transparent" />
      <h1
        className="text-balance text-[clamp(3.25rem,9vw,6rem)] font-medium leading-none text-[#0a1b34]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.03em' }}
      >
        Prologue
      </h1>
      <p
        className="mt-7 max-w-xl text-pretty text-[clamp(1.25rem,2.5vw,1.8rem)] leading-[1.55] text-[#1d2f4a]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Every child begins with a story.
        <br />
        Let&apos;s write yours.
      </p>
      <Link
        to="/book-interview"
        className="mt-11 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0a1b34] px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#f5ead6] shadow-[0_8px_24px_rgba(10,27,52,0.18)] transition hover:bg-[#13294d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b98b28]"
        style={{ fontFamily: "'DM Sans', Inter, sans-serif" }}
      >
        Begin the Journey
      </Link>
    </motion.div>
  </section>
);

export default Prologue;
