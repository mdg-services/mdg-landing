"""
The density register and the daily stock register as Excel files, in English and Hindi, for
mdgservices.in/tools/density-and-stock-register-format/ (Hindi at /hi/tools/...):

    python3 scripts/mdg-registers.py

Writes four files into public/mdg/downloads/:
  mdg-density-register.xlsx, mdg-density-register-hindi.xlsx
  mdg-stock-register.xlsx,   mdg-stock-register-hindi.xlsx
(the printable A4 PDFs come from scripts/mdg-registers.mjs).

Density register: one line for every reading (morning, each tanker compartment, after
decanting). The sheet checks the morning time against the 10 AM latest time and the tanker gap
against the 3.0 kg/m3 limit; the density at 15 C is typed (it comes from the printed ASTM
table), never worked out by the sheet.

Daily stock register: one sheet for petrol (MS), one for diesel (HSD), and a Tankers sheet.
Each product sheet has one row for every day: the morning dip of up to 3 tanks, the morning
meter reading of up to 8 nozzles, and the stock check by the method of MDG Annexure 9, worked out
by formulas: sales as per meter, book stock, closing stock by dip, the variation and 4% of the
closing stock.

Yellow cells are typed, grey cells are formulas. Plain Excel-2007 functions only (IF, AND, OR,
ISNUMBER, COUNT, SUM, SUMIFS, COUNTIF, ROUND, ABS, TIME, N), so it opens the same in Excel,
Google Sheets, LibreOffice and phone apps. No example rows: the files start empty.
"""
from pathlib import Path
from math import ceil
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.formatting.rule import FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.workbook.properties import CalcProperties
from openpyxl.utils import get_column_letter as L

OUT = Path(__file__).resolve().parent.parent / "public" / "mdg" / "downloads"

NAVY = "2C2E80"
INPUT = PatternFill("solid", fgColor="FFF6D5")  # yellow: you type
CALC = PatternFill("solid", fgColor="ECEFEC")   # grey: works out by itself
HEAD = PatternFill("solid", fgColor=NAVY)
BAND = PatternFill("solid", fgColor="E4E6F1")
RED = PatternFill("solid", fgColor="FFC7CE")
thin = Side(style="thin", color="C9D2CE")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
F = "Arial"
RED_FONT = Font(name=F, bold=True, color="9C0006")
OK_FONT = Font(name=F, color="1E6B3A")
WARN_FONT = Font(name=F, bold=True, color="7F3F00")

DEN_ROWS = 1500   # density lines, rows 4..1503
STK_DAYS = 400    # days on each product sheet, rows 7..406
TNK_ROWS = 2000   # tanker lines, rows 4..2003
SITE = "mdgservices.in/tools/density-and-stock-register-format/"

T = {
    "en": {
        "suffix": "",
        "site": "https://" + SITE,
        "by": "MDG Services, a brand of VRUOOM Private Limited · " + SITE,
        "note": "General information. Not an oil company form and not the official text. Check your own figures.",
        "legend": "Yellow cells: you type. Grey cells: worked out by the sheet, do not type in them.",
        "swatch_in": "Yellow cells: you type",
        "swatch_calc": "Grey cells: worked out by the sheet. Do not type in them.",
        "how": "How to use",
        # ── density ──
        "d_file": "mdg-density-register.xlsx",
        "d_sheet": "Density register",
        "d_title": "Density register: a working format from MDG Services",
        "d_sub": "One line for every reading: the morning reading, each tanker compartment, and the density after decanting.",
        "d_steps": [
            "If Excel shows a yellow 'Protected View' bar at the top, press Enable Editing. The grey columns fill in after that.",
            "1. First, the rule. MDG 2024 says the dealer keeps density records in the format it attaches as Annexure 1 (clause 1.2(xiv)). This sheet records the same readings in a different layout. If your oil company has given you its own density register, fill that one first, and ask whether it accepts this layout as well.",
            "2. One line for every reading. In column E pick what was measured: Morning reading, Tanker compartment or After decanting.",
            "3. Morning: before the first sale, take a sample at a pump nozzle and write its density at 15°C, by 10 AM at the latest (clauses 1.4.1(c) and 5.1.9). Write the time. The check column says OK or LATE.",
            "4. Tanker: before decanting, take a sample from each compartment and write each one on its own line: tanker number, compartment number, hydrometer reading, temperature, the density at 15°C, and the 15°C density printed on the invoice. The gap should be within 3.0 kg/m³ either way (clauses 1.2(iv) and 1.2(viii)).",
            "5. After decanting: run at least 50 litres through the pump, take a nozzle sample and write its density at 15°C (clause 1.2(xiv)).",
            "6. The density at 15°C comes from the printed ASTM Table 53B, which every dealer must hold (clause 1.5(vi)). The sheet does not convert it for you. The density calculator at mdgservices.in/tools/density-at-15/ is a helper only; the printed table decides.",
            "7. Never type over an old line. Add a new line with the right figure and say why in Note. MDG has no correction rule for the dealer's register: this is good practice, not an MDG rule.",
            "8. Column C holds the tank number, so one sheet can hold every tank: filter by tank to see one tank's lines. The sheet holds 1,500 lines. Keep the register for this financial year and the one before (clause 5.1.12).",
        ],
        "d_cols": ["Date", "Time", "Tank no.", "Product", "What was measured", "Tanker no.", "Compartment no.", "Hydrometer reading (kg/m³)", "Temperature (°C)", "Density at 15°C (kg/m³)", "Invoice density at 15°C (kg/m³)", "Gap from invoice (kg/m³)", "Check", "Checked by", "Note"],
        "d_kinds": ["Morning reading", "Tanker compartment", "After decanting"],
        "d_products": ["MS", "HSD"],
        "d_ok_morning": "OK, before 10 AM", "d_late": "LATE: after 10 AM", "d_need_time": "Write the time", "d_need_density": "Write the density at 15°C",
        "d_ok_gap": "OK, within 3.0", "d_out": "OUT: more than 3.0",
        "num_err": "Type a number only.",
        "kind_err": "Pick one from the list.",
        # ── stock ──
        "s_file": "mdg-stock-register.xlsx",
        "s_tankers": "Tankers",
        "s_prod": ["Petrol (MS)", "Diesel (HSD)"],
        "s_title": "Daily stock register: a working format from MDG Services",
        "s_steps": [
            "If Excel shows a yellow 'Protected View' bar at the top, press Enable Editing. The grey columns fill in after that.",
            "1. First, the rule. MDG 2024 says the oil company supplies the daily stock register (clause 1.3(ii)) and prints no form for it. If you have the company's register, fill that one first. Use this workbook for the sums, or as a spare.",
            "2. Open the sheet for the product. Type your outlet name and the first date in column A. Later dates fill in by themselves.",
            "3. Every morning, before the first sale, write for each tank: the product dip (cm), the litres that dip gives in that tank's own calibration chart, and the water dip (cm) (clauses 1.3 and 1.4.1(b)). Use each tank's own chart. A water dip above 0 turns red: report water to the controlling company office at once (clause 1.4.1(b)).",
            "4. Write each nozzle's meter reading, and the litres used to test the nozzles that day (clause 1.4.2(d)).",
            "5. Tankers sheet: one line for each tanker received, with the product and the quantity. The product sheet picks up the day's total by itself (clause 1.2(xiii)).",
            "6. The next morning, the grey columns for yesterday fill in, by the method of MDG Annexure 9: sales as per meter (today's meter total minus yesterday's), book stock (opening stock + received - shrinkage or TVA - sales), closing stock by dip (the next morning's dip stock), the variation and 4% of the closing stock. Only if you also take an evening dip, type it in the yellow column for the closing dip.",
            "7. The variation is the closing stock by dip minus the book stock. A plus means more fuel in the tank than in the books, a minus means less. The status says Inside 4% or Over 4%.",
            "8. This sheet judges the 4% of closing stock only. MDG also counts the handling loss on sales, and shrinkage or TVA where they apply (clause 5.1.11), so Over 4% is not yet a finding. Use the stock variation calculator at mdgservices.in/tools/stock-variation/ or ask your oil company how it counts. An irregularity must be established before any action (clause 8.5.2).",
            "9. Shrinkage or TVA: type the percentage only if your oil company gives one, for example 0.52. Leave it empty if none applies.",
            "10. Nozzle test litres: MDG asks you to record them (clause 1.4.2(d)) and does not say whether to take them off the meter sales. The default is No, the plain reading of Annexure 9. If your oil company takes them off because the fuel goes back into the tank, pick Yes in the box at the top of the sheet.",
            "11. If a dispensing unit's meter is changed or set back to zero, that day's sales will look wrong. Write what happened in Note and work that day out by hand.",
            "12. Each product sheet holds 400 days and the Tankers sheet 2,000 lines. Start a fresh copy when they run out. Clause 5.1.12 asks for the daily sales register for this financial year and the one before: ask your oil company whether that covers the stock register.",
        ],
        "s_outlet": "Outlet", "s_product": "Product",
        "s_sh": "Shrinkage or TVA, % of receipts (only if your oil company gives one; for example 0.52):",
        "s_tst": "Take the nozzle test litres off the meter sales? (default No)",
        "s_yes": "Yes", "s_no": "No",
        "s_over_n": "Days over 4%:",
        "s_band1": "Morning tank record (before the first sale)", "s_band2": "Morning pump meter readings", "s_band3": "Stock check, by the method of MDG Annexure 9",
        "s_tank": "Tank",
        "s_cols": [
            "Date",
            "Product dip (cm)", "Litres by chart", "Water dip (cm)",
            "Product dip (cm)", "Litres by chart", "Water dip (cm)",
            "Product dip (cm)", "Litres by chart", "Water dip (cm)",
            "A. Opening stock by dip, all tanks (L)",
        ],
        "s_nozzle": "Nozzle",
        "s_cols2": ["Total of all meter readings", "Litres used to test nozzles", "B. Received today (L)", "C. Shrinkage or TVA (L)", "E. Sales as per meter (L)", "F. Book stock at the end (L)", "Closing dip stock, only if you take an evening dip (L)", "G. Closing stock by dip (L)", "Variation, G - F (L)", "4% of closing stock (L)", "Variation as % of closing stock", "Status", "Note"],
        "s_inside": "Inside 4%", "s_over": "Over 4%", "s_check_meters": "Check the meters",
        "s_tcols": ["Date", "Time decanting finished", "Invoice no.", "Product", "Tank no.", "Tanker no.", "Quantity received (L)", "Water found with paste?", "Done by", "Note"],
        "s_title_t": "Tankers received: one line for each tanker",
    },
    "hi": {
        "suffix": "-hindi",
        "site": "https://mdgservices.in/hi/tools/density-and-stock-register-format/",
        "by": "MDG Services, VRUOOM Private Limited का ब्रांड · mdgservices.in/hi/tools/density-and-stock-register-format/",
        "note": "यह सामान्य जानकारी है। यह तेल कंपनी का फ़ॉर्म नहीं है, और आधिकारिक पाठ भी नहीं। अपने आँकड़े ख़ुद जाँचें।",
        "legend": "पीले खाने: आप भरें। स्लेटी खाने: शीट ख़ुद भरती है, इनमें कुछ न लिखें।",
        "swatch_in": "पीले खाने: आप भरें",
        "swatch_calc": "स्लेटी खाने: शीट ख़ुद भरती है। इनमें कुछ न लिखें।",
        "how": "कैसे भरें",
        "d_file": "mdg-density-register-hindi.xlsx",
        "d_sheet": "डेंसिटी रजिस्टर",
        "d_title": "डेंसिटी रजिस्टर: MDG Services का काम चलाऊ फ़ॉर्मेट",
        "d_sub": "हर रीडिंग की एक लाइन: सुबह की रीडिंग, टैंकर का हर कंपार्टमेंट, और माल उतारने के बाद की डेंसिटी।",
        "d_steps": [
            "अगर Excel ऊपर पीली पट्टी में 'Protected View' दिखाए, तो 'Enable Editing' दबाएँ। उसके बाद स्लेटी कॉलम भरते हैं।",
            "1. पहले नियम। MDG 2024 कहता है कि डीलर डेंसिटी के रिकॉर्ड उस फ़ॉर्मेट में रखे जो उसने Annexure 1 में लगाया है (क्लॉज़ 1.2(xiv))। यह शीट वही रीडिंग दूसरे लेआउट में लिखवाती है। तेल कंपनी ने अपना डेंसिटी रजिस्टर दिया हो, तो पहले वही भरिए, और उससे पूछ लीजिए कि यह लेआउट भी चलता है या नहीं।",
            "2. हर रीडिंग की एक लाइन। कॉलम E में चुनिए कि क्या नापा: सुबह की रीडिंग, टैंकर का कंपार्टमेंट, या उतारने के बाद।",
            "3. सुबह: पहली बिक्री से पहले पंप के नोज़ल से सैंपल लेकर उसकी 15°C की डेंसिटी लिखिए, देर से देर 10 AM तक (क्लॉज़ 1.4.1(c) और 5.1.9)। समय भी लिखिए। जाँच वाला कॉलम बताएगा: ठीक या देर।",
            "4. टैंकर: माल उतारने से पहले हर कंपार्टमेंट का सैंपल लेकर हर एक की अलग लाइन लिखिए: टैंकर नंबर, कंपार्टमेंट नंबर, हाइड्रोमीटर रीडिंग, तापमान, 15°C की डेंसिटी, और इनवॉइस पर छपी 15°C की डेंसिटी। अंतर किसी भी तरफ़ 3.0 kg/m³ के अंदर होना चाहिए (क्लॉज़ 1.2(iv) और 1.2(viii))।",
            "5. उतारने के बाद: पंप से कम से कम 50 लीटर निकालिए, फिर नोज़ल का सैंपल लेकर उसकी 15°C की डेंसिटी लिखिए (क्लॉज़ 1.2(xiv))।",
            "6. 15°C की डेंसिटी छपी ASTM टेबल 53B से आती है, जो हर डीलर के पास होनी चाहिए (क्लॉज़ 1.5(vi))। शीट उसे बदलकर नहीं देती। mdgservices.in/hi/tools/density-at-15/ का कैलकुलेटर सिर्फ़ मददगार है; फ़ैसला छपी टेबल का ही माना जाता है।",
            "7. पुरानी लाइन पर कभी दोबारा न लिखें। सही आँकड़े के साथ नई लाइन जोड़ें और 'नोट' में वजह लिखें। डीलर के रजिस्टर में सुधार का MDG में कोई नियम नहीं है: यह आम चलन है, MDG का नियम नहीं।",
            "8. कॉलम C में टैंक नंबर है, इसलिए एक शीट में सारे टैंक आ सकते हैं: एक टैंक की लाइनें देखने के लिए टैंक से फ़िल्टर करें। शीट में 1,500 लाइनें आती हैं। रजिस्टर इस और पिछले वित्त वर्ष का रखिए (क्लॉज़ 5.1.12)।",
        ],
        "d_cols": ["तारीख़", "समय", "टैंक नंबर", "प्रोडक्ट", "क्या नापा", "टैंकर नंबर", "कंपार्टमेंट नंबर", "हाइड्रोमीटर रीडिंग (kg/m³)", "तापमान (°C)", "15°C पर डेंसिटी (kg/m³)", "इनवॉइस की 15°C डेंसिटी (kg/m³)", "इनवॉइस से अंतर (kg/m³)", "जाँच", "किसने जाँचा", "नोट"],
        "d_kinds": ["सुबह की रीडिंग", "टैंकर का कंपार्टमेंट", "उतारने के बाद"],
        "d_products": ["MS", "HSD"],
        "d_ok_morning": "ठीक, 10 AM से पहले", "d_late": "देर: 10 AM के बाद", "d_need_time": "समय लिखें", "d_need_density": "15°C की डेंसिटी लिखें",
        "d_ok_gap": "ठीक, 3.0 के अंदर", "d_out": "बाहर: 3.0 से ज़्यादा",
        "num_err": "सिर्फ़ अंक भरें।",
        "kind_err": "लिस्ट से चुनें।",
        "s_file": "mdg-stock-register-hindi.xlsx",
        "s_tankers": "टैंकर",
        "s_prod": ["पेट्रोल (MS)", "डीज़ल (HSD)"],
        "s_title": "डेली स्टॉक रजिस्टर: MDG Services का काम चलाऊ फ़ॉर्मेट",
        "s_steps": [
            "अगर Excel ऊपर पीली पट्टी में 'Protected View' दिखाए, तो 'Enable Editing' दबाएँ। उसके बाद स्लेटी कॉलम भरते हैं।",
            "1. पहले नियम। MDG 2024 कहता है कि डेली स्टॉक रजिस्टर तेल कंपनी देती है (क्लॉज़ 1.3(ii)) और उसका कोई फ़ॉर्म नहीं छापता। कंपनी का रजिस्टर आपके पास हो, तो पहले वही भरिए। इस वर्कबुक को हिसाब के लिए, या अतिरिक्त कॉपी की तरह रखिए।",
            "2. प्रोडक्ट की शीट खोलिए। कॉलम A में अपने आउटलेट का नाम और पहली तारीख़ लिखिए। आगे की तारीख़ें अपने आप भर जाती हैं।",
            "3. हर सुबह, पहली बिक्री से पहले, हर टैंक के लिए लिखिए: प्रोडक्ट डिप (cm), उस डिप के उस टैंक के अपने कैलिब्रेशन चार्ट से निकले लीटर, और पानी का डिप (cm) (क्लॉज़ 1.3 और 1.4.1(b))। हर टैंक का अपना चार्ट इस्तेमाल करें। पानी का डिप 0 से ऊपर हो तो वह लाल हो जाता है: पानी की ख़बर तुरंत कंट्रोलिंग कंपनी ऑफ़िस को दीजिए (क्लॉज़ 1.4.1(b))।",
            "4. हर नोज़ल की मीटर रीडिंग लिखिए, और उस दिन नोज़ल टेस्टिंग में लगे लीटर भी (क्लॉज़ 1.4.2(d))।",
            "5. टैंकर शीट: हर आए टैंकर की एक लाइन, प्रोडक्ट और मात्रा के साथ। प्रोडक्ट की शीट उस दिन का जोड़ अपने आप ले लेती है (क्लॉज़ 1.2(xiii))।",
            "6. अगली सुबह कल के स्लेटी कॉलम भर जाते हैं, MDG Annexure 9 के तरीके से: मीटर के हिसाब से बिक्री (आज का मीटर जोड़ घटाकर कल का), बुक स्टॉक (ओपनिंग स्टॉक + आया माल - श्रिंकेज या TVA - बिक्री), डिप से क्लोज़िंग स्टॉक (अगली सुबह का डिप स्टॉक), वेरिएशन और क्लोज़िंग स्टॉक का 4%। शाम का डिप भी लेते हों, तभी उसे क्लोज़िंग डिप के पीले कॉलम में लिखिए।",
            "7. वेरिएशन = डिप से क्लोज़िंग स्टॉक घटा बुक स्टॉक। प्लस का मतलब टैंक में बही से ज़्यादा तेल, माइनस का मतलब कम। स्थिति में '4% के अंदर' या '4% से ऊपर' दिखता है।",
            "8. यह शीट सिर्फ़ क्लोज़िंग स्टॉक का 4% देखती है। MDG बिक्री पर हैंडलिंग लॉस, और जहाँ लागू हो वहाँ श्रिंकेज या TVA भी गिनता है (क्लॉज़ 5.1.11), इसलिए '4% से ऊपर' अभी कोई निष्कर्ष नहीं है। mdgservices.in/hi/tools/stock-variation/ का स्टॉक वेरिएशन कैलकुलेटर इस्तेमाल करें, या तेल कंपनी से पूछें कि वह कैसे गिनती है। कोई भी कार्रवाई से पहले अनियमितता साबित होनी चाहिए (क्लॉज़ 8.5.2)।",
            "9. श्रिंकेज या TVA: प्रतिशत तभी भरें जब तेल कंपनी बताए, जैसे 0.52। लागू न हो तो खाली छोड़ें।",
            "10. नोज़ल टेस्ट के लीटर: MDG उन्हें दर्ज करने को कहता है (क्लॉज़ 1.4.2(d)) और यह नहीं बताता कि उन्हें मीटर की बिक्री से घटाना है या नहीं। शुरुआती सेटिंग 'नहीं' है, यानी Annexure 9 का सीधा पाठ। आपकी तेल कंपनी उन्हें घटाती हो, क्योंकि तेल वापस टैंक में जाता है, तो शीट के ऊपर वाले खाने में 'हाँ' चुनिए।",
            "11. किसी डिस्पेंसिंग यूनिट का मीटर बदला जाए या शून्य पर लौट जाए, तो उस दिन की बिक्री ग़लत दिखेगी। 'नोट' में लिखिए क्या हुआ और उस दिन का हिसाब हाथ से कीजिए।",
            "12. हर प्रोडक्ट की शीट में 400 दिन और टैंकर शीट में 2,000 लाइनें आती हैं। भर जाएँ तो नई कॉपी शुरू करें। क्लॉज़ 5.1.12 इस और पिछले वित्त वर्ष का डेली सेल्स रजिस्टर माँगता है: तेल कंपनी से पूछिए कि इसमें स्टॉक रजिस्टर आता है या नहीं।",
        ],
        "s_outlet": "आउटलेट", "s_product": "प्रोडक्ट",
        "s_sh": "श्रिंकेज या TVA, आए माल का % (सिर्फ़ तब जब तेल कंपनी बताए; जैसे 0.52):",
        "s_tst": "नोज़ल टेस्ट के लीटर मीटर की बिक्री से घटाएँ? (शुरुआती: नहीं)",
        "s_yes": "हाँ", "s_no": "नहीं",
        "s_over_n": "4% से ऊपर वाले दिन:",
        "s_band1": "सुबह का टैंक रिकॉर्ड (पहली बिक्री से पहले)", "s_band2": "सुबह की पंप मीटर रीडिंग", "s_band3": "स्टॉक जाँच, MDG Annexure 9 के तरीके से",
        "s_tank": "टैंक",
        "s_cols": [
            "तारीख़",
            "प्रोडक्ट डिप (cm)", "चार्ट से लीटर", "पानी का डिप (cm)",
            "प्रोडक्ट डिप (cm)", "चार्ट से लीटर", "पानी का डिप (cm)",
            "प्रोडक्ट डिप (cm)", "चार्ट से लीटर", "पानी का डिप (cm)",
            "A. डिप से ओपनिंग स्टॉक, सभी टैंक (L)",
        ],
        "s_nozzle": "नोज़ल",
        "s_cols2": ["सभी मीटर रीडिंग का जोड़", "नोज़ल टेस्ट में लगे लीटर", "B. आज आया माल (L)", "C. श्रिंकेज या TVA (L)", "E. मीटर के हिसाब से बिक्री (L)", "F. अंत का बुक स्टॉक (L)", "क्लोज़िंग डिप, सिर्फ़ शाम का डिप लेते हों तो (L)", "G. डिप से क्लोज़िंग स्टॉक (L)", "वेरिएशन, G - F (L)", "क्लोज़िंग स्टॉक का 4% (L)", "क्लोज़िंग स्टॉक का वेरिएशन %", "स्थिति", "नोट"],
        "s_inside": "4% के अंदर", "s_over": "4% से ऊपर", "s_check_meters": "मीटर देखें",
        "s_tcols": ["तारीख़", "माल उतरना पूरा होने का समय", "इनवॉइस नंबर", "प्रोडक्ट", "टैंक नंबर", "टैंकर नंबर", "आया माल (L)", "पेस्ट से पानी मिला?", "किसने भरा", "नोट"],
        "s_title_t": "आए टैंकर: हर टैंकर की एक लाइन",
    },
}


def howto(wb, t, title, steps) -> None:
    how = wb.active
    how.title = t["how"]
    per_line = 84 if t is T["en"] else 66  # characters a line holds at width 76
    how["A1"] = title
    how["A1"].font = Font(name=F, size=15, bold=True, color=NAVY)
    how.row_dimensions[1].height = 26
    r = 3
    for i, s in enumerate(steps):
        c = how.cell(row=r, column=1, value=s)
        c.font = Font(name=F, size=11, bold=(i == 0))
        c.alignment = Alignment(wrap_text=True, vertical="top")
        how.row_dimensions[r].height = 16 * ceil(len(s) / per_line) + 6
        r += 1
    r += 1
    for text, fill in ((t["swatch_in"], INPUT), (t["swatch_calc"], CALC)):
        c = how.cell(row=r, column=1, value=text)
        c.font = Font(name=F, size=11, bold=True)
        c.fill = fill
        c.border = BOX
        r += 1
    r += 1
    for key in ("note", "by"):
        c = how.cell(row=r, column=1, value=t[key])
        c.font = Font(name=F, size=9 if key == "by" else 10, color="43524D")
        c.alignment = Alignment(wrap_text=True, vertical="top")
        how.row_dimensions[r].height = 15 * ceil(len(t[key]) / per_line) + 6
        r += 1
    how.column_dimensions["A"].width = 76


def head(ws, row, col, text, width=None) -> None:
    c = ws.cell(row=row, column=col, value=text)
    c.font = Font(name=F, size=10, bold=True, color="FFFFFF")
    c.fill = HEAD
    c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    c.border = BOX
    if width:
        ws.column_dimensions[L(col)].width = width


def cell(ws, row, col, fill, fmt=None, align=None):
    c = ws.cell(row=row, column=col)
    c.border = BOX
    c.font = Font(name=F, size=10)
    c.fill = fill
    if fmt:
        c.number_format = fmt
    if align:
        c.alignment = Alignment(horizontal=align)
    return c


def page(ws, landscape=True) -> None:
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True


def lit(s: str) -> str:
    """A text value as a formula literal."""
    return '"' + s.replace('"', '""') + '"'


# ───────────────────────── density register ─────────────────────────


def build_density(lang: str) -> Path:
    t = T[lang]
    wb = Workbook()
    wb.calculation = CalcProperties(fullCalcOnLoad=True)
    howto(wb, t, t["d_title"], t["d_steps"])

    ws = wb.create_sheet(t["d_sheet"])
    ws["A1"] = t["d_title"].split(":")[0]
    ws["A1"].font = Font(name=F, size=14, bold=True, color=NAVY)
    ws["A2"] = t["d_sub"] + "  " + t["legend"]
    ws["A2"].font = Font(name=F, size=10, color="43524D")
    ws.row_dimensions[1].height = 24
    ws.row_dimensions[3].height = 46
    widths = [12, 8, 8, 9, 22, 13, 13, 15, 12, 15, 17, 13, 26, 11, 28]
    for i, (name, w) in enumerate(zip(t["d_cols"], widths), start=1):
        head(ws, 3, i, name, w)

    k1, k2, k3 = t["d_kinds"]
    first, last = 4, 3 + DEN_ROWS
    for r in range(first, last + 1):
        for col in range(1, 16):
            fill = CALC if col in (12, 13) else INPUT
            fmt = {1: "dd-mm-yyyy", 2: "hh:mm", 8: "0.0", 9: "0.0", 10: "0.0", 11: "0.0", 12: "+0.0;-0.0;0.0"}.get(col)
            cell(ws, r, col, fill, fmt, "left" if col == 13 else None)
        # gap from the invoice: only on a tanker compartment line, rounded to one decimal like the table
        ws.cell(row=r, column=12, value=f'=IF(AND(E{r}={lit(k2)},ISNUMBER(J{r}),ISNUMBER(K{r})),ROUND(J{r}-K{r},1),"")')
        ws.cell(row=r, column=13, value=(
            f'=IF(E{r}={lit(k1)},'
            f'IF(NOT(ISNUMBER(J{r})),{lit(t["d_need_density"])},'
            f'IF(NOT(ISNUMBER(B{r})),{lit(t["d_need_time"])},'
            f'IF(ROUND(B{r}*1440,0)<=600,{lit(t["d_ok_morning"])},{lit(t["d_late"])}))),'
            f'IF(E{r}={lit(k2)},'
            f'IF(ISNUMBER(L{r}),IF(ABS(L{r})<=3,{lit(t["d_ok_gap"])},{lit(t["d_out"])}),""),'
            f'IF(E{r}={lit(k3)},IF(ISNUMBER(J{r}),"",{lit(t["d_need_density"])}),"")))'
        ))
    rng = f"M{first}:M{last}"
    ws.conditional_formatting.add(rng, FormulaRule(formula=[f'OR(LEFT($M{first},{len(t["d_late"].split(":")[0])})={lit(t["d_late"].split(":")[0])},LEFT($M{first},{len(t["d_out"].split(":")[0])})={lit(t["d_out"].split(":")[0])})'], fill=RED, font=RED_FONT, stopIfTrue=True))
    ws.conditional_formatting.add(rng, FormulaRule(formula=[f'LEFT($M{first},{len(t["d_ok_gap"].split(",")[0])})={lit(t["d_ok_gap"].split(",")[0])}'], font=OK_FONT, stopIfTrue=True))
    ws.conditional_formatting.add(rng, FormulaRule(formula=[f'AND($M{first}<>"",LEFT($M{first},{len(t["d_ok_gap"].split(",")[0])})<>{lit(t["d_ok_gap"].split(",")[0])})'], font=WARN_FONT))
    dv_k = DataValidation(type="list", formula1='"' + ",".join(t["d_kinds"]) + '"', allow_blank=True, showErrorMessage=True, error=t["kind_err"])
    dv_p = DataValidation(type="list", formula1='"' + ",".join(t["d_products"]) + '"', allow_blank=True)
    dv_d = DataValidation(type="decimal", operator="between", formula1="600", formula2="1100", allow_blank=True, showErrorMessage=True, error=t["num_err"])
    dv_t = DataValidation(type="decimal", operator="between", formula1="-30", formula2="90", allow_blank=True, showErrorMessage=True, error=t["num_err"])
    for dv, cols in ((dv_k, "E"), (dv_p, "D"), (dv_d, "HJK"), (dv_t, "I")):
        ws.add_data_validation(dv)
        for col in cols:
            dv.add(f"{col}{first}:{col}{last}")
    ws.freeze_panes = f"B{first}"
    ws.auto_filter.ref = f"A3:O{last}"
    page(ws)
    ws.print_title_rows = "3:3"

    wb.active = 0
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / t["d_file"]
    wb.save(out)
    return out


# ───────────────────────── daily stock register ─────────────────────────

# column map of a product sheet
C_DATE = 1
C_TANK = [(2, 3, 4), (5, 6, 7), (8, 9, 10)]  # product dip, litres, water dip
C_OPEN = 11                                  # A
C_NOZ = list(range(12, 20))                  # 8 nozzles
C_TOT, C_TEST, C_RECV, C_SHR, C_SALES, C_BOOK, C_EVE, C_CLOSE, C_VAR, C_LIM, C_PCT, C_STAT, C_NOTE = range(20, 33)
S_FIRST = 7
S_LAST = S_FIRST + STK_DAYS - 1


def build_product_sheet(wb, t, name: str) -> None:
    ws = wb.create_sheet(name)
    ws["A1"] = t["s_title"].split(":")[0] + ": " + name
    ws["A1"].font = Font(name=F, size=14, bold=True, color=NAVY)
    ws["A2"] = t["legend"]
    ws["A2"].font = Font(name=F, size=10, color="43524D")
    ws.row_dimensions[1].height = 24

    def label(ref, text, merge_to=None, align="left"):
        ws[ref] = text
        ws[ref].font = Font(name=F, size=10, bold=True, color="43524D")
        ws[ref].alignment = Alignment(horizontal=align, vertical="center", wrap_text=True)
        if merge_to:
            ws.merge_cells(f"{ref}:{merge_to}")

    def box(ref, fill, merge_to=None, fmt=None, value=None):
        ws[ref] = value
        ws[ref].font = Font(name=F, size=10, bold=True)
        ws[ref].fill = fill
        ws[ref].border = BOX
        ws[ref].alignment = Alignment(horizontal="left", vertical="center")
        if fmt:
            ws[ref].number_format = fmt
        if merge_to:
            ws.merge_cells(f"{ref}:{merge_to}")
            for row in ws[f"{ref}:{merge_to}"]:
                for c in row:
                    c.border = BOX
                    c.fill = fill

    # row 3: outlet, product, shrinkage or TVA percentage
    label("A3", t["s_outlet"])
    box("B3", INPUT, "F3")
    label("H3", t["s_product"])
    box("I3", CALC, "K3", value=name)
    label("L3", t["s_sh"], "S3", "right")
    box("T3", INPUT, fmt="0.00")
    # row 4: the test-litres switch, and a count of days over 4%
    label("A4", t["s_tst"], "K4", "left")
    box("L4", INPUT, "M4", value=None)
    label("O4", t["s_over_n"], "S4", "right")
    over_rng = f"{L(C_STAT)}{S_FIRST}:{L(C_STAT)}{S_LAST}"
    box("T4", CALC, value=f'=COUNTIF({over_rng},{lit(t["s_over"] + "*")})')
    ws.row_dimensions[3].height = 30
    ws.row_dimensions[4].height = 20
    dv_sw = DataValidation(type="list", formula1='"' + t["s_yes"] + "," + t["s_no"] + '"', allow_blank=True)
    ws.add_data_validation(dv_sw)
    dv_sw.add("L4")
    dv_pct = DataValidation(type="decimal", operator="between", formula1="0", formula2="100", allow_blank=True, showErrorMessage=True, error=t["num_err"])
    ws.add_data_validation(dv_pct)
    dv_pct.add("T3")

    # row 5: group bands. row 6: column headers
    def band(c1, c2, text):
        ws.cell(row=5, column=c1, value=text)
        for c in range(c1, c2 + 1):
            x = ws.cell(row=5, column=c)
            x.fill = BAND
            x.border = BOX
            x.font = Font(name=F, size=10, bold=True, color=NAVY)
            x.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        ws.merge_cells(start_row=5, start_column=c1, end_row=5, end_column=c2)

    band(2, C_OPEN, t["s_band1"])
    band(C_NOZ[0], C_TEST, t["s_band2"])
    band(C_RECV, C_STAT, t["s_band3"])
    ws.row_dimensions[5].height = 22
    ws.row_dimensions[6].height = 74

    head(ws, 6, C_DATE, t["s_cols"][0], 12)
    for k, trio in enumerate(C_TANK):
        for j, col in enumerate(trio):
            head(ws, 6, col, f'{t["s_tank"]} {k + 1}: {t["s_cols"][1 + 3 * k + j]}', 11)
    head(ws, 6, C_OPEN, t["s_cols"][10], 16)
    for n, col in enumerate(C_NOZ, start=1):
        head(ws, 6, col, f'{t["s_nozzle"]} {n}', 12)
    for col, text, w in zip(range(C_TOT, C_NOTE + 1), t["s_cols2"], [14, 13, 13, 13, 14, 14, 16, 14, 13, 13, 13, 17, 28]):
        head(ws, 6, col, text, w)

    pct, yes = "$T$3", "$L$4"
    pr = "$I$3"
    tk = t["s_tankers"]
    tq = f"{ref_q(tk)}!$G$4:$G${3 + TNK_ROWS}"
    td = f"{ref_q(tk)}!$A$4:$A${3 + TNK_ROWS}"
    tp = f"{ref_q(tk)}!$D$4:$D${3 + TNK_ROWS}"
    for r in range(S_FIRST, S_LAST + 1):
        n = r + 1  # the next day's row
        for col in range(1, C_NOTE + 1):
            grey = col in (C_OPEN, C_TOT, C_RECV, C_SHR, C_SALES, C_BOOK, C_CLOSE, C_VAR, C_LIM, C_PCT, C_STAT) or (col == C_DATE and r > S_FIRST)
            fmt = None
            if col == C_DATE:
                fmt = "dd-mm-yyyy"
            elif col in (C_RECV, C_SHR):
                fmt = "#,##0.##;-#,##0.##;"  # a day with no tanker shows an empty cell, not 0
            elif col in (C_OPEN, C_TOT, C_TEST, C_SALES, C_BOOK, C_EVE, C_CLOSE, C_LIM) or col in [c[1] for c in C_TANK]:
                fmt = "#,##0.##"
            elif col in C_NOZ:
                fmt = "0.00"
            elif col == C_VAR:
                fmt = "+#,##0.##;-#,##0.##;0"
            elif col == C_PCT:
                fmt = "+0.0%;-0.0%;0.0%"
            cell(ws, r, col, CALC if grey else INPUT, fmt, "left" if col == C_STAT else None)
        if r > S_FIRST:
            ws.cell(row=r, column=C_DATE, value=f'=IF(A{r - 1}="","",A{r - 1}+1)')
        litres = ",".join(f"{L(c[1])}{r}" for c in C_TANK)
        noz = f"{L(C_NOZ[0])}{r}:{L(C_NOZ[-1])}{r}"
        noz_n = f"{L(C_NOZ[0])}{n}:{L(C_NOZ[-1])}{n}"
        o, tot, test, recv, shr, sal, book, eve, clo, var, lim, pc, st = (f"{L(c)}{r}" for c in (C_OPEN, C_TOT, C_TEST, C_RECV, C_SHR, C_SALES, C_BOOK, C_EVE, C_CLOSE, C_VAR, C_LIM, C_PCT, C_STAT))
        tot_n = f"{L(C_TOT)}{n}"
        open_n = f"{L(C_OPEN)}{n}"
        ws[o] = f'=IF(COUNT({litres})=0,"",SUM({litres}))'
        ws[tot] = f'=IF(COUNT({noz})=0,"",SUM({noz}))'
        ws[recv] = f'=IF(A{r}="","",SUMIFS({tq},{td},A{r},{tp},{pr}))'
        ws[shr] = f'=IF({recv}="","",IF({pct}="",0,{recv}*{pct}/100))'
        # sales for the day = the next morning's meter total minus this morning's, less the test litres if the box says Yes
        ws[sal] = (
            f'=IF(OR(NOT(ISNUMBER({tot})),NOT(ISNUMBER({tot_n}))),"",'
            f'IF(COUNT({noz})<>COUNT({noz_n}),{lit(t["s_check_meters"])},'
            f'{tot_n}-{tot}-IF({yes}={lit(t["s_yes"])},N({test}),0)))'
        )
        ws[book] = f'=IF(AND(ISNUMBER({o}),ISNUMBER({recv}),ISNUMBER({shr}),ISNUMBER({sal})),{o}+{recv}-{shr}-{sal},"")'
        ws[clo] = f'=IF(ISNUMBER({eve}),{eve},IF(ISNUMBER({open_n}),{open_n},""))'
        ws[var] = f'=IF(AND(ISNUMBER({book}),ISNUMBER({clo})),{clo}-{book},"")'
        ws[lim] = f'=IF(ISNUMBER({clo}),0.04*{clo},"")'
        ws[pc] = f'=IF(AND(ISNUMBER({var}),ISNUMBER({clo})),IF({clo}=0,"",{var}/{clo}),"")'
        ws[st] = f'=IF(ISNUMBER({var}),IF(ROUND(ABS({var}),3)<=ROUND({lim},3),{lit(t["s_inside"])},{lit(t["s_over"])}),"")'
    # water dip above 0: red. over 4%: red
    for trio in C_TANK:
        w = L(trio[2])
        ws.conditional_formatting.add(f"{w}{S_FIRST}:{w}{S_LAST}", FormulaRule(formula=[f"AND(ISNUMBER({w}{S_FIRST}),{w}{S_FIRST}>0)"], fill=RED, font=RED_FONT))
    s = L(C_STAT)
    ws.conditional_formatting.add(f"{s}{S_FIRST}:{s}{S_LAST}", FormulaRule(formula=[f'LEFT({s}{S_FIRST},{len(t["s_over"])})={lit(t["s_over"])}'], fill=RED, font=RED_FONT))
    sa = L(C_SALES)
    ws.conditional_formatting.add(f"{sa}{S_FIRST}:{sa}{S_LAST}", FormulaRule(formula=[f'AND({sa}{S_FIRST}<>"",NOT(ISNUMBER({sa}{S_FIRST})))'], fill=RED, font=RED_FONT))
    # numbers only where numbers go
    dv_n = DataValidation(type="decimal", operator="between", formula1="0", formula2="100000000", allow_blank=True, showErrorMessage=True, error=t["num_err"])
    ws.add_data_validation(dv_n)
    num_cols = [c for trio in C_TANK for c in trio] + C_NOZ + [C_TEST, C_EVE]
    for col in num_cols:
        dv_n.add(f"{L(col)}{S_FIRST}:{L(col)}{S_LAST}")
    ws.freeze_panes = f"B{S_FIRST}"
    page(ws)
    ws.print_title_rows = "5:6"


def ref_q(sheet: str) -> str:
    return "'" + sheet.replace("'", "''") + "'"


def build_tankers(wb, t) -> None:
    ws = wb.create_sheet(t["s_tankers"])
    ws["A1"] = t["s_title_t"]
    ws["A1"].font = Font(name=F, size=14, bold=True, color=NAVY)
    ws["A2"] = t["legend"]
    ws["A2"].font = Font(name=F, size=10, color="43524D")
    ws.row_dimensions[1].height = 24
    ws.row_dimensions[3].height = 46
    for i, (name, w) in enumerate(zip(t["s_tcols"], [12, 14, 16, 16, 10, 16, 15, 14, 12, 30]), start=1):
        head(ws, 3, i, name, w)
    first, last = 4, 3 + TNK_ROWS
    for r in range(first, last + 1):
        for col in range(1, 11):
            cell(ws, r, col, INPUT, {1: "dd-mm-yyyy", 2: "hh:mm", 7: "#,##0.##"}.get(col))
    dv_p = DataValidation(type="list", formula1='"' + ",".join(t["s_prod"]) + '"', allow_blank=True, showErrorMessage=True, error=t["kind_err"])
    dv_w = DataValidation(type="list", formula1='"' + t["s_yes"] + "," + t["s_no"] + '"', allow_blank=True)
    dv_q = DataValidation(type="decimal", operator="between", formula1="0", formula2="100000000", allow_blank=True, showErrorMessage=True, error=t["num_err"])
    for dv, col in ((dv_p, "D"), (dv_w, "H"), (dv_q, "G")):
        ws.add_data_validation(dv)
        dv.add(f"{col}{first}:{col}{last}")
    ws.conditional_formatting.add(f"H{first}:H{last}", FormulaRule(formula=[f'H{first}={lit(t["s_yes"])}'], fill=RED, font=RED_FONT))
    ws.freeze_panes = f"B{first}"
    ws.auto_filter.ref = f"A3:J{last}"
    page(ws)
    ws.print_title_rows = "3:3"


def build_stock(lang: str) -> Path:
    t = T[lang]
    wb = Workbook()
    wb.calculation = CalcProperties(fullCalcOnLoad=True)
    howto(wb, t, t["s_title"], t["s_steps"])
    for name in t["s_prod"]:
        build_product_sheet(wb, t, name)
    build_tankers(wb, t)
    wb.active = 0
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / t["s_file"]
    wb.save(out)
    return out


if __name__ == "__main__":
    for lang in ("en", "hi"):
        print("wrote", build_density(lang))
        print("wrote", build_stock(lang))
