export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center text-white">
            <img
              src="/logo.svg"
              alt="MDG Services"
              className="h-12 w-auto invert brightness-0 contrast-200"
              style={{ filter: "invert(1) brightness(2)" }}
            />
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/65">
            Dealer's कवच — your trusted partner for petrol pump excellence
            across India. Fueling Success, every single day.
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-coral" href="#about">About</a></li>
            <li><a className="hover:text-coral" href="#services">Services</a></li>
            <li><a className="hover:text-coral" href="#why-us">Why us</a></li>
            <li><a className="hover:text-coral" href="#membership">Membership</a></li>
            <li><a className="hover:text-coral" href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Reach us
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:text-coral" href="tel:18003456512">
                Toll free · 1800-345-6512
              </a>
            </li>
            <li>
              <a
                className="hover:text-coral"
                href="https://www.mdgservices.in"
                target="_blank"
                rel="noreferrer"
              >
                www.mdgservices.in
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} MDG Services. All rights reserved.</p>
          <p>Made with care for India's fuel station dealers.</p>
        </div>
      </div>
    </footer>
  );
}
