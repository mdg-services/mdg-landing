import FormShell from "../components/FormShell";
import GrievanceForm from "../components/GrievanceForm";
import CallUs from "../components/CallUs";
import { getT } from "../i18n/server";
import type { Lang, SiteRoute } from "../i18n/lang";

/** /grievance and /hi/grievance (and the plural, which is what people type): the grievance form. */
export default function GrievancePage({ lang, route = "/grievance" }: { lang: Lang; route?: SiteRoute }) {
  const g = getT(lang).grievance;
  return (
    <FormShell
      lang={lang}
      route={route}
      backLabel={g.backToHome}
      eyebrow={g.eyebrow}
      eyebrowDeva={g.eyebrowDeva}
      heading={g.heading}
      intro={g.intro}
      extra={
        <>
          {g.callLead}{" "}
          <CallUs label={g.callLink} className="link-quiet whitespace-nowrap font-semibold text-gold-300 align-baseline" />
          {g.callEnd}
        </>
      }
    >
      <GrievanceForm g={g} />
    </FormShell>
  );
}
