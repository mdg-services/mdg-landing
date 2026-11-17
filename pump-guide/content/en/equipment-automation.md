---json
{
  "title": "Outlet automation at a petrol pump: what it is and what it records",
  "metaTitle": "Petrol pump automation: what it records",
  "description": "What retail outlet automation is, what it links and records, and what a dealer must do if it fails, per MDG 2024 and BPCL, as on 17 November 2026.",
  "answer": "Retail outlet automation links the dispensers and the tank gauges to a site controller that records each sale and the tank stock. In the public sector oil companies' dealer guideline, automated outlets are designed for \"No automation, No Operation\", so the dealer must keep it working and report any fault at once {{OMC dealer guidelines 2024, 1.5(viii)}}. What exactly is recorded depends on the company; BPCL's published specification is the example here {{BPCL retail automation spec 2019}}.",
  "faq": [
    { "q": "What is automation at a petrol pump?", "a": "In BPCL's published specification, a site controller is connected to the dispensing units, the automatic tank gauge, attendant tags and payment machines {{BPCL retail automation spec 2019}}. Other companies may set it up differently; ask your oil company." },
    { "q": "What is NANO at a petrol pump?", "a": "It means \"No automation, No Operation\". Automated outlets are designed for it, and the dealer must report any malfunction to the company at once {{OMC dealer guidelines 2024, 1.5(viii)}}." },
    { "q": "What is an ATG at a petrol pump?", "a": "BPCL's specification defines it as an automatic tank gauging system of tank probes and a console {{BPCL retail automation spec 2019}}. It reads the tank level, which is how the controller knows the stock." },
    { "q": "Does a petrol pump need power backup for automation?", "a": "The public sector guideline says there must be a generator or UPS for power failure, which matters for automated outlets and the electronic totaliser {{OMC dealer guidelines 2024, 1.5(ix)}}." },
    { "q": "Can a dealer run an automated outlet in manual mode?", "a": "Only with written authorisation. Running a dispenser in manual mode without authorisation is an irregularity, and only an email or signed letter from a company official counts {{OMC dealer guidelines 2024, 5.1.16}}." }
  ],
  "related": ["equipment-dispenser", "equipment-tanks", "equipment-metrology", "equipment-nozzles", "running"],
  "updated": "2026-11-17"
}
---
This page covers only what the oil companies' own published documents say, as on 17 November 2026. The detailed recording list comes from BPCL's published 2019 specification for its automation vendors; other companies may differ.

## What does automation link together?

A site controller, a computer at the outlet, is connected to the dispensing units, the automatic tank gauge (ATG), attendant tags and payment machines {{BPCL retail automation spec 2019}}. The ATG is a set of tank probes and a console {{BPCL retail automation spec 2019}}.

## What does it record?

In BPCL's specification the controller:

- captures each sale's volume, amount and preset value, and takes the dispenser's electronic totaliser reading after every sale {{BPCL retail automation spec 2019}};
- keeps an audit trail of each transaction and of each price change, plus shift reconciliation and hourly tank stock reports {{BPCL retail automation spec 2019}};
- logs dispenser events such as a change in the calibration factor and a switch between automatic and manual mode, if the dispenser reports them {{BPCL retail automation spec 2019}};
- makes exception reports from the tank gauge: high or low product, power on and off, high water, density change {{BPCL retail automation spec 2019}}.

It can also be set to stop the nozzles of a tank during a delivery from the tanker, or when the tank gauge fails, stock is low or water is high {{BPCL retail automation spec 2019}}.

## What must the dealer do?

- Keep the automation working and report any malfunction to the company's official at once {{OMC dealer guidelines 2024, 1.5(viii)}}.
- Keep a generator or UPS for power failures {{OMC dealer guidelines 2024, 1.5(ix)}}.
- Do not run a dispenser in manual mode, switch off the tank gauge or disable any part of the system without written authorisation; keep that email or letter on record {{OMC dealer guidelines 2024, 5.1.16}}.

The penalties for these are in the [MDG guide on automation](/guides/automation/). See also [what is inside a dispenser](@equipment-dispenser).

## Where this comes from

- [BPCL technical specifications for retail automation (30 May 2019)](https://www.bharatpetroleum.in/pdf/technical-specifications30052019-48d265.pdf): functions, records and reports.
- [Marketing Discipline Guidelines 2024](https://www.bharatpetroleum.in/images/files/MDG-2024-Effective-24-10-2024.pdf): clauses 1.5 and 5.1.16, public sector oil companies.
