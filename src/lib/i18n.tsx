import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "tr", name: "Türkçe" },
  { code: "pl", name: "Polski" },
  { code: "sv", name: "Svenska" },
  { code: "no", name: "Norsk" },
  { code: "da", name: "Dansk" },
  { code: "fi", name: "Suomi" },
  { code: "cs", name: "Čeština" },
  { code: "el", name: "Ελληνικά" },
  { code: "he", name: "עברית" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "uk", name: "Українська" },
  { code: "ro", name: "Română" },
  { code: "hu", name: "Magyar" },
  { code: "bg", name: "Български" },
  { code: "ca", name: "Català" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const T: Record<LangCode, Dict> = {
  es: { training: "Entrenamiento", health: "Salud", logout: "Salir", age: "Edad", height: "Altura (cm)", weight: "Peso (kg)", save: "Guardar", bmi: "IMC", bmiChartTitle: "Tu IMC vs. rango ideal", ideal: "Ideal", you: "Tú", underweight: "Bajo peso", normal: "Normal", overweight: "Sobrepeso", obese: "Obesidad", healthIntro: "Completa tus datos para calcular tu IMC.", language: "Idioma" },
  en: { training: "Training", health: "Health", logout: "Sign out", age: "Age", height: "Height (cm)", weight: "Weight (kg)", save: "Save", bmi: "BMI", bmiChartTitle: "Your BMI vs. ideal range", ideal: "Ideal", you: "You", underweight: "Underweight", normal: "Normal", overweight: "Overweight", obese: "Obese", healthIntro: "Fill in your data to calculate your BMI.", language: "Language" },
  fr: { training: "Entraînement", health: "Santé", logout: "Déconnexion", age: "Âge", height: "Taille (cm)", weight: "Poids (kg)", save: "Enregistrer", bmi: "IMC", bmiChartTitle: "Votre IMC vs. plage idéale", ideal: "Idéal", you: "Vous", underweight: "Maigreur", normal: "Normal", overweight: "Surpoids", obese: "Obésité", healthIntro: "Remplissez vos données pour calculer votre IMC.", language: "Langue" },
  de: { training: "Training", health: "Gesundheit", logout: "Abmelden", age: "Alter", height: "Größe (cm)", weight: "Gewicht (kg)", save: "Speichern", bmi: "BMI", bmiChartTitle: "Dein BMI vs. Idealbereich", ideal: "Ideal", you: "Du", underweight: "Untergewicht", normal: "Normal", overweight: "Übergewicht", obese: "Adipositas", healthIntro: "Gib deine Daten ein, um deinen BMI zu berechnen.", language: "Sprache" },
  it: { training: "Allenamento", health: "Salute", logout: "Esci", age: "Età", height: "Altezza (cm)", weight: "Peso (kg)", save: "Salva", bmi: "IMC", bmiChartTitle: "Il tuo IMC vs. intervallo ideale", ideal: "Ideale", you: "Tu", underweight: "Sottopeso", normal: "Normale", overweight: "Sovrappeso", obese: "Obesità", healthIntro: "Inserisci i tuoi dati per calcolare l'IMC.", language: "Lingua" },
  pt: { training: "Treino", health: "Saúde", logout: "Sair", age: "Idade", height: "Altura (cm)", weight: "Peso (kg)", save: "Guardar", bmi: "IMC", bmiChartTitle: "O teu IMC vs. faixa ideal", ideal: "Ideal", you: "Você", underweight: "Abaixo do peso", normal: "Normal", overweight: "Sobrepeso", obese: "Obesidade", healthIntro: "Preencha os seus dados para calcular o IMC.", language: "Idioma" },
  nl: { training: "Training", health: "Gezondheid", logout: "Uitloggen", age: "Leeftijd", height: "Lengte (cm)", weight: "Gewicht (kg)", save: "Opslaan", bmi: "BMI", bmiChartTitle: "Jouw BMI vs. ideaal bereik", ideal: "Ideaal", you: "Jij", underweight: "Ondergewicht", normal: "Normaal", overweight: "Overgewicht", obese: "Obesitas", healthIntro: "Vul je gegevens in om je BMI te berekenen.", language: "Taal" },
  ru: { training: "Тренировка", health: "Здоровье", logout: "Выйти", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)", save: "Сохранить", bmi: "ИМТ", bmiChartTitle: "Ваш ИМТ vs. идеальный диапазон", ideal: "Идеальный", you: "Вы", underweight: "Недостаток", normal: "Норма", overweight: "Избыток", obese: "Ожирение", healthIntro: "Заполните данные для расчёта ИМТ.", language: "Язык" },
  zh: { training: "训练", health: "健康", logout: "退出", age: "年龄", height: "身高 (厘米)", weight: "体重 (公斤)", save: "保存", bmi: "BMI", bmiChartTitle: "你的 BMI 与理想范围", ideal: "理想", you: "你", underweight: "偏瘦", normal: "正常", overweight: "超重", obese: "肥胖", healthIntro: "填写数据以计算你的 BMI。", language: "语言" },
  ja: { training: "トレーニング", health: "健康", logout: "ログアウト", age: "年齢", height: "身長 (cm)", weight: "体重 (kg)", save: "保存", bmi: "BMI", bmiChartTitle: "あなたの BMI と理想範囲", ideal: "理想", you: "あなた", underweight: "低体重", normal: "標準", overweight: "過体重", obese: "肥満", healthIntro: "データを入力して BMI を計算しましょう。", language: "言語" },
  ko: { training: "운동", health: "건강", logout: "로그아웃", age: "나이", height: "키 (cm)", weight: "몸무게 (kg)", save: "저장", bmi: "BMI", bmiChartTitle: "당신의 BMI 대 이상 범위", ideal: "이상", you: "당신", underweight: "저체중", normal: "정상", overweight: "과체중", obese: "비만", healthIntro: "데이터를 입력하여 BMI를 계산하세요.", language: "언어" },
  ar: { training: "تدريب", health: "صحة", logout: "خروج", age: "العمر", height: "الطول (سم)", weight: "الوزن (كجم)", save: "حفظ", bmi: "مؤشر الكتلة", bmiChartTitle: "مؤشرك مقابل النطاق المثالي", ideal: "مثالي", you: "أنت", underweight: "نقص الوزن", normal: "طبيعي", overweight: "زيادة الوزن", obese: "سمنة", healthIntro: "أدخل بياناتك لحساب مؤشر كتلة جسمك.", language: "اللغة" },
  hi: { training: "प्रशिक्षण", health: "स्वास्थ्य", logout: "लॉग आउट", age: "उम्र", height: "ऊँचाई (सेमी)", weight: "वज़न (किग्रा)", save: "सहेजें", bmi: "BMI", bmiChartTitle: "आपका BMI बनाम आदर्श", ideal: "आदर्श", you: "आप", underweight: "कम वज़न", normal: "सामान्य", overweight: "अधिक वज़न", obese: "मोटापा", healthIntro: "अपना BMI जानने के लिए डेटा भरें।", language: "भाषा" },
  tr: { training: "Antrenman", health: "Sağlık", logout: "Çıkış", age: "Yaş", height: "Boy (cm)", weight: "Kilo (kg)", save: "Kaydet", bmi: "VKİ", bmiChartTitle: "VKİ'niz vs. ideal aralık", ideal: "İdeal", you: "Sen", underweight: "Zayıf", normal: "Normal", overweight: "Fazla kilolu", obese: "Obez", healthIntro: "VKİ'nizi hesaplamak için verilerinizi girin.", language: "Dil" },
  pl: { training: "Trening", health: "Zdrowie", logout: "Wyloguj", age: "Wiek", height: "Wzrost (cm)", weight: "Waga (kg)", save: "Zapisz", bmi: "BMI", bmiChartTitle: "Twoje BMI vs. zakres idealny", ideal: "Idealne", you: "Ty", underweight: "Niedowaga", normal: "Norma", overweight: "Nadwaga", obese: "Otyłość", healthIntro: "Wypełnij dane, aby obliczyć BMI.", language: "Język" },
  sv: { training: "Träning", health: "Hälsa", logout: "Logga ut", age: "Ålder", height: "Längd (cm)", weight: "Vikt (kg)", save: "Spara", bmi: "BMI", bmiChartTitle: "Ditt BMI vs. idealområde", ideal: "Ideal", you: "Du", underweight: "Undervikt", normal: "Normal", overweight: "Övervikt", obese: "Fetma", healthIntro: "Fyll i dina uppgifter för att beräkna BMI.", language: "Språk" },
  no: { training: "Trening", health: "Helse", logout: "Logg ut", age: "Alder", height: "Høyde (cm)", weight: "Vekt (kg)", save: "Lagre", bmi: "BMI", bmiChartTitle: "Din BMI vs. idealområde", ideal: "Ideell", you: "Du", underweight: "Undervekt", normal: "Normal", overweight: "Overvekt", obese: "Fedme", healthIntro: "Fyll inn data for å beregne BMI.", language: "Språk" },
  da: { training: "Træning", health: "Sundhed", logout: "Log ud", age: "Alder", height: "Højde (cm)", weight: "Vægt (kg)", save: "Gem", bmi: "BMI", bmiChartTitle: "Din BMI vs. idealområde", ideal: "Ideel", you: "Du", underweight: "Undervægt", normal: "Normal", overweight: "Overvægt", obese: "Fedme", healthIntro: "Udfyld dine data for at beregne BMI.", language: "Sprog" },
  fi: { training: "Treeni", health: "Terveys", logout: "Kirjaudu ulos", age: "Ikä", height: "Pituus (cm)", weight: "Paino (kg)", save: "Tallenna", bmi: "BMI", bmiChartTitle: "BMI vs. ihannealue", ideal: "Ihanne", you: "Sinä", underweight: "Alipaino", normal: "Normaali", overweight: "Ylipaino", obese: "Lihavuus", healthIntro: "Täytä tiedot laskeaksesi BMI:n.", language: "Kieli" },
  cs: { training: "Trénink", health: "Zdraví", logout: "Odhlásit", age: "Věk", height: "Výška (cm)", weight: "Váha (kg)", save: "Uložit", bmi: "BMI", bmiChartTitle: "Vaše BMI vs. ideální rozsah", ideal: "Ideální", you: "Vy", underweight: "Podváha", normal: "Normální", overweight: "Nadváha", obese: "Obezita", healthIntro: "Vyplňte údaje pro výpočet BMI.", language: "Jazyk" },
  el: { training: "Προπόνηση", health: "Υγεία", logout: "Έξοδος", age: "Ηλικία", height: "Ύψος (εκ)", weight: "Βάρος (κιλά)", save: "Αποθήκευση", bmi: "ΔΜΣ", bmiChartTitle: "ΔΜΣ σας vs. ιδανικό εύρος", ideal: "Ιδανικό", you: "Εσείς", underweight: "Λιποβαρής", normal: "Φυσιολογικό", overweight: "Υπέρβαρος", obese: "Παχύσαρκος", healthIntro: "Συμπληρώστε δεδομένα για ΔΜΣ.", language: "Γλώσσα" },
  he: { training: "אימון", health: "בריאות", logout: "התנתק", age: "גיל", height: "גובה (ס\"מ)", weight: "משקל (ק\"ג)", save: "שמור", bmi: "BMI", bmiChartTitle: "ה-BMI שלך מול הטווח האידיאלי", ideal: "אידיאלי", you: "אתה", underweight: "תת משקל", normal: "תקין", overweight: "עודף משקל", obese: "השמנה", healthIntro: "מלא נתונים לחישוב BMI.", language: "שפה" },
  id: { training: "Latihan", health: "Kesehatan", logout: "Keluar", age: "Usia", height: "Tinggi (cm)", weight: "Berat (kg)", save: "Simpan", bmi: "IMT", bmiChartTitle: "IMT Anda vs. rentang ideal", ideal: "Ideal", you: "Anda", underweight: "Kurus", normal: "Normal", overweight: "Berlebih", obese: "Obesitas", healthIntro: "Isi data untuk menghitung IMT.", language: "Bahasa" },
  th: { training: "การฝึก", health: "สุขภาพ", logout: "ออกจากระบบ", age: "อายุ", height: "ส่วนสูง (ซม.)", weight: "น้ำหนัก (กก.)", save: "บันทึก", bmi: "BMI", bmiChartTitle: "BMI ของคุณ vs. ช่วงที่เหมาะสม", ideal: "เหมาะสม", you: "คุณ", underweight: "น้ำหนักน้อย", normal: "ปกติ", overweight: "น้ำหนักเกิน", obese: "อ้วน", healthIntro: "กรอกข้อมูลเพื่อคำนวณ BMI", language: "ภาษา" },
  vi: { training: "Tập luyện", health: "Sức khỏe", logout: "Đăng xuất", age: "Tuổi", height: "Chiều cao (cm)", weight: "Cân nặng (kg)", save: "Lưu", bmi: "BMI", bmiChartTitle: "BMI của bạn vs. lý tưởng", ideal: "Lý tưởng", you: "Bạn", underweight: "Thiếu cân", normal: "Bình thường", overweight: "Thừa cân", obese: "Béo phì", healthIntro: "Nhập dữ liệu để tính BMI.", language: "Ngôn ngữ" },
  uk: { training: "Тренування", health: "Здоров'я", logout: "Вийти", age: "Вік", height: "Зріст (см)", weight: "Вага (кг)", save: "Зберегти", bmi: "ІМТ", bmiChartTitle: "Ваш ІМТ vs. ідеал", ideal: "Ідеал", you: "Ви", underweight: "Недовага", normal: "Норма", overweight: "Надмірна вага", obese: "Ожиріння", healthIntro: "Заповніть дані для розрахунку ІМТ.", language: "Мова" },
  ro: { training: "Antrenament", health: "Sănătate", logout: "Ieșire", age: "Vârstă", height: "Înălțime (cm)", weight: "Greutate (kg)", save: "Salvează", bmi: "IMC", bmiChartTitle: "IMC-ul tău vs. intervalul ideal", ideal: "Ideal", you: "Tu", underweight: "Subponderal", normal: "Normal", overweight: "Supraponderal", obese: "Obez", healthIntro: "Completează datele pentru a calcula IMC.", language: "Limbă" },
  hu: { training: "Edzés", health: "Egészség", logout: "Kijelentkezés", age: "Kor", height: "Magasság (cm)", weight: "Súly (kg)", save: "Mentés", bmi: "BMI", bmiChartTitle: "BMI vs. ideális tartomány", ideal: "Ideális", you: "Te", underweight: "Sovány", normal: "Normál", overweight: "Túlsúly", obese: "Elhízás", healthIntro: "Töltsd ki az adatokat a BMI-hez.", language: "Nyelv" },
  bg: { training: "Тренировка", health: "Здраве", logout: "Изход", age: "Възраст", height: "Височина (см)", weight: "Тегло (кг)", save: "Запази", bmi: "ИТМ", bmiChartTitle: "Вашият ИТМ vs. идеален диапазон", ideal: "Идеален", you: "Вие", underweight: "Поднормено", normal: "Норма", overweight: "Наднормено", obese: "Затлъстяване", healthIntro: "Попълнете данните за ИТМ.", language: "Език" },
  ca: { training: "Entrenament", health: "Salut", logout: "Sortir", age: "Edat", height: "Alçada (cm)", weight: "Pes (kg)", save: "Desar", bmi: "IMC", bmiChartTitle: "El teu IMC vs. rang ideal", ideal: "Ideal", you: "Tu", underweight: "Pes baix", normal: "Normal", overweight: "Sobrepès", obese: "Obesitat", healthIntro: "Omple les dades per calcular l'IMC.", language: "Idioma" },
};

type Ctx = { lang: LangCode; setLang: (l: LangCode) => void; t: (k: keyof typeof T["es"]) => string };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("es");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lang") as LangCode | null;
    if (saved && T[saved]) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: keyof typeof T["es"]) => T[lang]?.[k] ?? T.es[k] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
