import { cards, facts, p } from "../doc";
import type { contactUs as EN } from "../en/contactUs";

/* /or/contact. ଫୋନ ନମ୍ବର, ସମୟ ଓ ଇମେଲ ହୋମ ପେଜର ସହ ସମାନ। */
export const contactUs: typeof EN = {
  pageTitle: "ଆମ ସହ ଯୋଗାଯୋଗ · MDG Services",
  metaDescription:
    "ଟୋଲ-ଫ୍ରି କଲ କରନ୍ତୁ, ଆମକୁ ଲେଖନ୍ତୁ, କିମ୍ବା ନିଜ ନମ୍ବର ଛାଡ଼ିଦିଅନ୍ତୁ, ଆମେ କଲ କରିବୁ। MDG Services, ଗୁରୁଗ୍ରାମର କମ୍ପାନୀ VRUOOM PRIVATE LIMITED ର ବ୍ରାଣ୍ଡ।",
  eyebrow: "ଆମ ସହ ଯୋଗାଯୋଗ",
  eyebrowDeva: undefined,
  heading: "ଜଣେ ମଣିଷ ସହ କଥା ହୁଅନ୍ତୁ।",
  intro:
    "ଆମକୁ କଲ କରନ୍ତୁ, ଲେଖନ୍ତୁ, କିମ୍ବା ନିଜ ନମ୍ବର ଛାଡ଼ିଦିଅନ୍ତୁ, ଆମେ କଲ କରିବୁ। ଫୋନ ଜଣେ ପ୍ରକୃତ ମଣିଷ ଉଠାନ୍ତି, ହିନ୍ଦୀ କିମ୍ବା ଇଂରାଜୀରେ।",
  updated: "23 ଅକ୍ଟୋବର 2026",
  legal: false,
  sections: [
    {
      id: "ways",
      heading: "ଆମ ପାଖରେ ପହଞ୍ଚିବାର ଉପାୟ",
      blocks: [
        cards([
          {
            kicker: "କଲ, ଟୋଲ-ଫ୍ରି",
            title: "{tollFree}",
            body: "{hours}। କଲ ମାଗଣା।",
            link: { label: "ଏବେ କଲ କରନ୍ତୁ", href: "{tollFreeHref}" },
          },
          {
            kicker: "ଆମକୁ ଲେଖନ୍ତୁ",
            title: "{email}",
            body: "ପ୍ରଶ୍ନ, ବିଲ ଓ ଦେୟ ପାଇଁ, ଏବଂ ଯେଉଁ କଥା ଆପଣ ଲିଖିତ ଭାବେ ରଖିବାକୁ ଚାହିଁବେ। ଦେୟ ବିଷୟରେ ଲେଖିଲେ ରସିଦର ରେଫରେନ୍ସ ସାଙ୍ଗରେ ପଠାନ୍ତୁ।",
            link: { label: "ଇମେଲ ପଠାନ୍ତୁ", href: "mailto:{email}" },
          },
          {
            kicker: "କଲବ୍ୟାକ ଚାହିଁଲେ?",
            title: "ନିଜ ନମ୍ବର ଛାଡ଼ନ୍ତୁ",
            body: "ନିଜ ନାମ ଓ ମୋବାଇଲ ନମ୍ବର ଦିଅନ୍ତୁ। ଏକ ଘଣ୍ଟା ଭିତରେ ଆମ ଟିମ କଲ କରେ, {hours}।",
            link: { label: "କଲବ୍ୟାକ ମାଗନ୍ତୁ", href: "home:contact" },
          },
        ]),
      ],
    },
    {
      id: "office",
      heading: "ରେଜିଷ୍ଟର୍ଡ ଅଫିସ",
      blocks: [
        facts([
          ["କମ୍ପାନୀ", "{legalName}"],
          ["CIN", "{cin}"],
          ["ବ୍ରାଣ୍ଡ", "MDG Services, {site} ରେ"],
          ["ଠିକଣା", "{office}"],
          ["ଫୋନ", "[{tollFree}]({tollFreeHref}), ଟୋଲ-ଫ୍ରି"],
          ["ସମୟ", "{hours}"],
          ["ଇମେଲ", "[{email}](mailto:{email})"],
        ]),
        p("ଆମ ସେବା ଅନଲାଇନ ଓ ଫୋନରେ ମିଳେ। ସମୟ ପରେ ଯାହା ଆସେ, ତାହାକୁ ପରଦିନ ସକାଳେ ସବୁଠୁ ଆଗରେ ଦେଖାଯାଏ।"),
      ],
    },
    {
      id: "grievance",
      heading: "କିଛି ଗଣ୍ଡଗୋଳ ହେଲା?",
      blocks: [
        p(
          "ଆମ ସେବା, ଆପ, ବିଲ, ଷ୍ଟାଫ କିମ୍ବା ଆପଣଙ୍କ ତଥ୍ୟର ବ୍ୟବହାରରେ ଆପଣ ଖୁସି ନ ଥିଲେ, [ଅଭିଯୋଗ ପେଜ](route:/grievance)ରେ ଜଣାନ୍ତୁ। ଆପଣଙ୍କୁ ସେହି ସମୟରେ ଅଭିଯୋଗ ନମ୍ବର ମିଳିଯାଏ, ଏବଂ ଆମ ଟିମର ଜଣେ ବ୍ୟକ୍ତି ତାହା ଦେଖି ଉତ୍ତର ଦିଅନ୍ତି।",
        ),
      ],
    },
  ],
};
