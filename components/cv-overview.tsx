const portfolio = [
  {
    name: "BUS Official Membership",
    url: "https://busofficialmembership.com/en",
    domain: "busofficialmembership.com",
    technologies: ["Next.js (SSG)"],
  },
  {
    name: "BeDee Shop",
    url: "https://shop.bedee.com/en",
    domain: "shop.bedee.com",
    technologies: ["Next.js (SSR)"],
  },
  {
    name: "Push The Traffic",
    url: "https://www.pushthetraffic.com/",
    domain: "pushthetraffic.com",
    technologies: ["HTML & CSS"],
  },
  {
    name: "Seedingpop",
    url: "https://www.seedingpop.com/",
    domain: "seedingpop.com",
    technologies: ["HTML & CSS"],
  },
];

export default function CvOverview() {
  return (
    <div>
      <section aria-labelledby="portfolio-heading">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Portfolio
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          {portfolio.map(({ name, url, domain, technologies }) => (
            <li key={url}>
              <a
                aria-label={`Visit ${name}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-solid border-black/[.08] p-4 transition-colors hover:border-transparent hover:bg-black/[.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                href={url}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-zinc-500 dark:text-zinc-400">
                      {domain}
                    </p>
                  </div>
                  <ul
                    aria-label={`${name} technologies`}
                    className="flex flex-wrap gap-2"
                  >
                    {technologies.map((technology) => (
                      <li
                        className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300"
                        key={technology}
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
