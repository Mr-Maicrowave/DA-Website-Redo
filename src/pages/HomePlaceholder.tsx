import { Link } from 'react-router-dom';
import FooterNew from '@/components/FooterNew';
import NavigationNew from '@/components/NavigationNew';
import SEO from '@/components/SEO';

const HomePlaceholder = () => {
  return (
    <div className="min-h-screen bg-[#f7f0e3] text-[#0a1b34]">
      <SEO
        title="A New DA Tuition Experience Is Coming"
        description="DA Tuition is preparing a refreshed website experience. In the meantime, families can still book a consultation or explore the English sample concept."
        canonicalUrl="/"
      />
      <NavigationNew />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 pb-20 pt-32 sm:pt-36">
        <section
          className="mx-auto w-full max-w-4xl text-center"
          aria-labelledby="placeholder-heading"
        >
          <img
            src="/images/da-logo.png"
            alt="DA Tuition"
            className="mx-auto mb-8 h-20 w-20 object-contain"
          />
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#b98224]">
            DA Tuition
          </p>
          <h1
            id="placeholder-heading"
            className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-tight tracking-[-0.025em] text-[#081f3d] sm:text-5xl lg:text-6xl"
          >
            A New DA Tuition Experience Is Coming
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#38475b] sm:text-xl">
            We’re preparing a refreshed website experience for DA Tuition. You can still book a consultation while the new site is being prepared.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/book-interview"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#0a1b34] px-7 text-sm font-bold uppercase tracking-[0.12em] text-[#fff3d6] shadow-lg shadow-[#0a1b34]/15 transition hover:-translate-y-0.5 hover:bg-[#102d52] focus:outline-none focus:ring-2 focus:ring-[#c89534] focus:ring-offset-4 focus:ring-offset-[#f7f0e3]"
            >
              Book Consultation
            </Link>
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  );
};

export default HomePlaceholder;
