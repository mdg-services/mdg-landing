import type { docs as EN } from "../en/docs";

/* The words every company page shares. The company name, the CIN and the
   address stay in Latin script: that is how they are on the company's
   papers. */
export const docs: typeof EN = {
  backToHome: "होम पर वापस",
  updatedLabel: "आख़िरी बदलाव",
  legalLine: "MDG Services, **{legalName}** का एक ब्रांड है · CIN\u00a0{cin}",
  onThisPage: "इस पेज पर",
  questions:
    "इस पेज के बारे में कोई सवाल? [{email}](mailto:{email}) पर लिखिए या [{tollFree}]({tollFreeHref}) पर कॉल कीजिए, {hours}।",
  /* The same notice the enrolment page puts on its agreement. */
  bindingNotice: "यह हिंदी अनुवाद सिर्फ़ आपकी सुविधा के लिए है। क़ानूनी तौर पर अंग्रेज़ी वाला पाठ ही मान्य होगा।",
  readEnglish: "अंग्रेज़ी मूल पढ़िए",
};
