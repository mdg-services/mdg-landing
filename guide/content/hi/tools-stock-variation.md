---json
{
  "title": "पेट्रोल पंप स्टॉक वेरिएशन कैलकुलेटर (MDG 2024)",
  "description": "अपनी डिप, रिसीट और मीटर की बिक्री भरें और स्टॉक वेरिएशन को 4% की सीमा, हैंडलिंग लॉस और श्रिंकेज या TVA के सामने देखें। यह सिर्फ़ मददगार टूल है।",
  "answer": "शुरू और आखिर की डिप, रिसीट और मीटर की बिक्री भरें। कैलकुलेटर बुक स्टॉक और क्लोज़िंग डिप के फ़र्क को Marketing Discipline Guidelines 2024 (MDG 2024), यानी तेल कंपनियों के अपने डीलरों के नियमों, की सीमा से मिलाता है: टैंक स्टॉक का 4%, और उसके साथ बिक्री पर हैंडलिंग लॉस तथा लागू श्रिंकेज या TVA का हिसाब {{5.1.11}} {{annexure 9}}। यह सिर्फ़ मददगार टूल है। आपकी तेल कंपनी का अपना हिसाब ही माना जाता है।",
  "faq": [
    { "q": "Petrol pump stock variation kaise nikalte hain? पेट्रोल पंप पर स्टॉक वेरिएशन कैसे निकालें?", "a": "पहले वह स्टॉक निकालें जो बुक के हिसाब से टैंक में होना चाहिए, फिर उसे क्लोज़िंग डिप से मिलाएँ। दोनों का फ़र्क ही वेरिएशन है, जिसे क्लोज़िंग डिप के 4% से परखा जाता है {{annexure 9}} {{5.1.11}}।" },
    { "q": "क्या 4% ओपनिंग स्टॉक का निकलता है या क्लोज़िंग स्टॉक का?", "a": "क्लोज़िंग डिप का {{annexure 9}}। क्लॉज़ में सिर्फ़ \"टैंक स्टॉक का 4%\" लिखा है {{5.1.11}}।" },
    { "q": "कैलकुलेटर क्यों कहता है कि नतीजा निर्भर करता है?", "a": "इसका मतलब है कि कमी सीमा के अंदर तभी है, जब आपकी तेल कंपनी हैंडलिंग लॉस को 4% के साथ गिनती है। उसी से पूछें कि वह कैसे गिनती है {{5.1.11}}।" },
    { "q": "क्या यह petrol pump stock loss calculator मेरे आँकड़े सेव करता या भेजता है?", "a": "नहीं। हिसाब आपके अपने फ़ोन या कंप्यूटर पर ही होता है। आप जो भरते हैं, वह न रखा जाता है, न भेजा जाता है।" }
  ],
  "related": ["stock-variation", "stock-shrinkage-tva", "stock-positive-negative", "stock-daily-register"],
  "updated": "2026-10-15"
}
---
एक प्रोडक्ट के स्टॉक वेरिएशन को MDG की सीमा के सामने रखकर देखें {{5.1.11}}। सीमा का मतलब [अनुमेय सीमा](@stock-variation) पेज पर है।

## वेरिएशन निकालें

<div class="tool" id="sv">
<style>#sv .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 16px}#sv .g>div{display:flex;flex-direction:column;justify-content:flex-end}@media(min-width:640px){#sv .g2{grid-template-columns:repeat(2,minmax(0,1fr))}}#sv .v.top{margin:0 0 12px}#sv select{max-width:100%}#sv small{display:block;color:#5D5F86;font-weight:400}#sv .r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid #E4E6F1}#sv .r b{text-align:right;white-space:nowrap}#sv .v{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#fff;border:1px solid #C5C7ED;font-weight:600}#sv .n{margin:8px 0 0;font-size:14.5px;font-weight:400;color:#3D3F66}</style>
<p style="margin:0 0 4px"><b>यह सिर्फ़ मददगार टूल है।</b> आपकी तेल कंपनी का अपना हिसाब ही माना जाता है। एक बार में एक ही प्रोडक्ट का कुल हिसाब भरें।</p>
<div class="g">
<div><label for="sv-p">प्रोडक्ट</label><select id="sv-p"><option value="ms">पेट्रोल (MS)</option><option value="hsd">डीज़ल (HSD)</option></select></div>
<div><label for="sv-u">नीचे की मात्राएँ किसमें हैं</label><select id="sv-u"><option value="1">लीटर</option><option value="1000">किलोलीटर (KL)</option></select></div>
</div>
<div class="g g2">
<div><label for="sv-a">A. अवधि की शुरुआत की डिप</label><input id="sv-a" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-b">B. इस अवधि में आया माल</label><input id="sv-b" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-e">E. पंप मीटर पर दिखी बिक्री</label><input id="sv-e" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-g">G. अवधि के अंत की डिप</label><input id="sv-g" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<label for="sv-s">श्रिंकेज अलाउंस या TVA</label>
<select id="sv-s"><option value="">लागू नहीं</option><option value="s">श्रिंकेज अलाउंस लागू है</option><option value="t">TVA लागू है</option></select>
<div id="sv-sx" style="display:none">
<div class="g">
<div><label for="sv-sa">अलाउंस, Rs प्रति KL</label><input id="sv-sa" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sp">नेट प्राइस, Rs प्रति KL<small>कमीशन, टैक्स और अलाउंस जोड़ने से पहले का दाम</small></label><input id="sv-sp" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sc">या वह प्रतिशत जो आपकी तेल कंपनी बताती है<small>भरा हो तो अलाउंस और नेट प्राइस वाले खाने छोड़ दिए जाते हैं</small></label><input id="sv-sc" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-sq">जितनी मात्रा पर यह लगता है<small>खाली छोड़ें तो सारी रिसीट मानी जाएगी। TVA में सिर्फ़ वह मात्रा जिस पर TVA का क्रेडिट मिला।</small></label><input id="sv-sq" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
</div>
<div class="g">
<div><label for="sv-v">सालाना औसत बिक्री, KL में<small>जैसे आपकी तेल कंपनी 600 KL की हद के सामने गिनती है</small></label><input id="sv-v" type="text" inputmode="decimal" autocomplete="off"></div>
<div><label for="sv-w">सिर्फ़ 600 से ऊपर होने पर: इस अवधि की बिक्री का वह हिस्सा जो पहले 600 KL में गिना जाता है<small>ऊपर की मात्राओं वाली इकाई में</small></label><input id="sv-w" type="text" inputmode="decimal" autocomplete="off"></div>
</div>
<button type="button" id="sv-go">वेरिएशन निकालें</button>
<p class="v" id="sv-err" style="display:none" role="alert"></p>
<div class="out" id="sv-out" style="display:none" role="status" aria-live="polite">
<p class="v top" id="sv-v1" style="display:none"></p>
<p class="v top" id="sv-v2" style="display:none"></p>
<p class="v top" id="sv-v3" style="display:none"></p>
<div class="r"><span>C. श्रिंकेज या TVA, जो घटाया</span><b id="o-c"></b></div>
<div class="r"><span>D. रिसीट के बाद का बुक स्टॉक (A + B - C)</span><b id="o-d"></b></div>
<div class="r"><span>F. अंत का बुक स्टॉक (D - E)</span><b id="o-f"></b></div>
<div class="r"><span>G. अवधि के अंत की डिप</span><b id="o-g"></b></div>
<div class="r"><span>वेरिएशन (G - F) <span id="o-vd"></span></span><b id="o-v"></b></div>
<div class="r"><span>भाग 1: टैंक स्टॉक का 4% (G का 4%)</span><b id="o-4"></b></div>
<div class="r"><span>भाग 2: बिक्री पर हैंडलिंग लॉस (सिर्फ़ कमी के लिए)</span><b id="o-h"></b></div>
<p class="n" id="sv-gain" style="display:none"></p>
<p class="n" id="sv-cp" style="display:none"></p>
<p class="n" id="sv-cn" style="display:none"></p>
<p class="n" id="sv-rg" style="display:none"></p>
<p class="n">यह सिर्फ़ मददगार टूल है। आपकी तेल कंपनी का अपना हिसाब और उसका इंस्पेक्शन ही माना जाता है।</p>
</div>
<noscript><p>इस कैलकुलेटर के लिए JavaScript चाहिए।</p></noscript>
</div>

## हिसाब

- **बुक स्टॉक:** A (शुरू की डिप) + B (आया माल) - C (श्रिंकेज या TVA, अगर हो) - E (मीटर की बिक्री) = F {{annexure 9}}।
- **वेरिएशन:** G (अंत की डिप) - F।
- **सीमा:** G का 4% {{5.1.11}} {{annexure 9}}।

## सीमा में क्या गिना जाता है

बिक्री पर हैंडलिंग लॉस: पेट्रोल (MS) सालाना औसत 600 KL तक 0.75%, उसके बाद 0.60%; डीज़ल (HSD) 600 KL तक 0.25%, उसके बाद 0.20% {{5.1.11}}। श्रिंकेज या TVA C के रूप में तभी और वहीं घटता है, जहाँ वह लागू हो {{5.1.11}} {{annexure 9}}।

कैलकुलेटर दोनों तरफ़ के वेरिएशन को इस तरह पढ़ता है:

- **बढ़त (टैंक में ज़्यादा):** अकेले G के 4% से मिलाई जाती है। क्लॉज़ नहीं बताता कि बढ़त पर हैंडलिंग लॉस कैसे लगेगा, इसलिए उसे नहीं जोड़ा जाता {{5.1.11}}।
- **कमी (टैंक में कम):** पहले G के 4% से, फिर 4% और हैंडलिंग लॉस के जोड़ से मिलाई जाती है। दोनों के बीच नतीजा "निर्भर करता है" आता है।

श्रिंकेज या TVA का अलाउंस (रुपये प्रति KL) नेट प्राइस के साथ भरें, या वह प्रतिशत भरें जो आपकी तेल कंपनी देती है। देखें [श्रिंकेज और TVA](@stock-shrinkage-tva)।

> **ध्यान दें:** Annexure 8 और 10 के नमूने के प्रतिशत 1998 के दामों पर बने हैं {{annexure 8}} {{annexure 10}}। इन्हें अपने आउटलेट के लिए इस्तेमाल न करें; आँकड़े अपनी तेल कंपनी से लें।

## एक उदाहरण

काल्पनिक पेट्रोल आउटलेट, लीटर में, सालाना औसत बिक्री 600 KL से कम:

- शुरू की डिप 16,000; आया माल 20,000; श्रिंकेज 0.52% (उदाहरण का आँकड़ा), इसलिए C 104; मीटर की बिक्री 32,000; अंत की डिप 3,600।
- F = 16,000 + 20,000 - 104 - 32,000 = 3,896, इसलिए वेरिएशन = 3,600 - 3,896 = -296।
- G का 4% = 144। हैंडलिंग लॉस (32,000 का 0.75% = 240) जोड़ें, तो 384।
- 296, 144 से ऊपर और 384 से नीचे है: नतीजा "निर्भर करता है"।

## MDG किन बातों को तेल कंपनी पर छोड़ता है

- **600 KL की हद।** MDG 600 KL को सालाना औसत बताता है, यह नहीं कि वह आपकी अवधि पर कैसे लगे। 600 से ऊपर होने पर कैलकुलेटर रेंज दिखाता है; एक आँकड़े के लिए वह हिस्सा भरें जो आपकी तेल कंपनी पहले 600 KL में गिनती है।
- **कमी।** हैंडलिंग लॉस "4% तक" के साथ गिना जाए या नहीं {{5.1.11}}।
- **टैंक या प्रोडक्ट।** जाँच किसके हिसाब से होती है, MDG नहीं बताता।

कार्रवाई से पहले तेल कंपनी को अनियमितता स्थापित करनी होती है {{8.5.2}}। देखें [पेनल्टी](@penalties) और [डेली स्टॉक रजिस्टर](@stock-daily-register)।
