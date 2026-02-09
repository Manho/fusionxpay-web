"use client";

const logos = [
  "PayPal",
  "Stripe",
  "Visa",
  "Mastercard",
  "Apple Pay",
  "Google Pay",
  "Alipay",
  "WeChat Pay",
  "UnionPay",
  "Klarna",
  "Afterpay",
  "Revolut",
];

export default function LogoMarquee() {
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm text-muted-foreground">
          Trusted by teams processing millions in payments worldwide
        </p>
      </div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <span className="text-muted-foreground/50 font-semibold text-lg whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
