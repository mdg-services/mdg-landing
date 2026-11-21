import type { docs as EN } from "../en/docs";

/* The words every company page shares. The company name, the CIN and the
   address stay in Latin script: that is how they are on the company's papers. */
export const docs: typeof EN = {
  backToHome: "ହୋମକୁ ଫେରନ୍ତୁ",
  updatedLabel: "ଶେଷ ବଦଳ",
  legalLine: "MDG Services, **{legalName}** ର ଏକ ବ୍ରାଣ୍ଡ · CIN\u00a0{cin}",
  onThisPage: "ଏହି ପେଜରେ",
  questions:
    "ଏହି ପେଜ ବିଷୟରେ କୌଣସି ପ୍ରଶ୍ନ? [{email}](mailto:{email}) ରେ ଲେଖନ୍ତୁ କିମ୍ବା [{tollFree}]({tollFreeHref}) ରେ କଲ କରନ୍ତୁ, {hours}।",
  bindingNotice: "ଏହି ଓଡ଼ିଆ ଅନୁବାଦ କେବଳ ଆପଣଙ୍କ ସୁବିଧା ପାଇଁ। ଆଇନଗତ ଭାବେ ଇଂରାଜୀ ପାଠ ହିଁ ମାନ୍ୟ ହେବ।",
  readEnglish: "ଇଂରାଜୀ ମୂଳ ପଢ଼ନ୍ତୁ",
};
