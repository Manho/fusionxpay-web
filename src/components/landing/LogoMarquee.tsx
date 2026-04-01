"use client";

const techLogos = [
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "Kafka", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Spring AI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "Picocli", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Prometheus", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" },
  { name: "Grafana", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
];

export default function LogoMarquee() {
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm text-muted-foreground/80">
          Built with industry-standard technologies
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 flex items-center gap-2.5 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.icon}
                alt={logo.name}
                width={24}
                height={24}
                className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
              <span className="text-muted-foreground/60 font-medium text-sm whitespace-nowrap transition-colors duration-300 group-hover:text-foreground">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
