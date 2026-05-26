import { useState, type FormEvent } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="container-x pb-24 pt-8">
      <div className="grid gap-10 rounded-3xl border border-navy/10 bg-white p-8 md:grid-cols-12 md:p-12">
        <div className="md:col-span-5">
          <div className="chip">Get in touch</div>
          <h2 className="mt-4 text-3xl font-extrabold text-navy md:text-4xl">
            Let's talk about your dealership.
          </h2>
          <p className="mt-4 text-navy/65">
            Share a few details and our team will reach out within one
            working day. Prefer a quick chat? Call us toll-free.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <a
              href="tel:18003456512"
              className="flex items-center gap-3 text-navy"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.87.7 2.76a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.32-1.27a2 2 0 0 1 2.11-.45c.89.34 1.82.57 2.76.7A2 2 0 0 1 22 16.92Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-navy/50">
                  Toll free
                </div>
                <div className="font-semibold">1800-345-6512</div>
              </div>
            </a>
            <a
              href="https://www.mdgservices.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-navy"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy/5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-navy/50">
                  Website
                </div>
                <div className="font-semibold">www.mdgservices.in</div>
              </div>
            </a>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 grid gap-4 rounded-2xl bg-navy-50/60 p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" name="name" placeholder="Ramesh Kumar" />
            <Field
              label="Pump / Outlet name"
              name="outlet"
              placeholder="Sai Petroleums"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+91 9XXXXXXXXX"
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-navy/60">
              How can we help?
            </span>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us about your dealership and what you're struggling with."
              className="rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none ring-coral/30 focus:ring-2"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-navy/55">
              We respect your privacy. No spam, ever.
            </p>
            <button type="submit" className="btn-primary">
              {sent ? "Thanks — we'll be in touch" : "Send enquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-navy/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none ring-coral/30 focus:ring-2"
      />
    </label>
  );
}
