Bir workout uygulaması için otomatik spor programı oluşturmak istiyorsan, algoritmanın kişiye özel programları optimize edebilmesi için aşağıdaki verilere ihtiyacın olacak. 

---

## **1. Kullanıcıdan Alınması Gereken Veriler**
Bunlar, algoritmanın kişiye uygun bir program oluşturabilmesi için gerekli olan temel bilgiler:

### **Demografik ve Fiziksel Bilgiler**  
✅ **Cinsiyet** (Erkek/Kadın)  
✅ **Yaş**  
✅ **Boy (cm)**  
✅ **Kilo (kg)**  
✅ **Vücut Yağ Oranı (isteğe bağlı, hesaplanabilir)**  

### **Hedef**  
✅ **Kas kazanma (bulk)**  
✅ **Yağ yakma (cut)**  
✅ **Dayanıklılık artırma**  
✅ **Genel fitness (fit ve sağlıklı kalma)**  

### **Deneyim Seviyesi**  
✅ **Başlangıç (Hiç yapmamış veya 6 aydan az süredir spor yapan)**  
✅ **Orta seviye (6 ay - 2 yıl spor geçmişi olan)**  
✅ **İleri seviye (2 yıl ve üzeri düzenli spor yapan)**  

### **Antrenman Tercihleri**  
✅ **Antrenman Yeri** (Ev/Spor Salonu)  
✅ **Günlük ayırabileceği süre (dk)**  
✅ **Haftalık kaç gün spor yapabilir?**  

---

## **2. Veri Tabanı ve Egzersiz Havuzu**  
Uygulama kişiye özel program üreteceği için geniş bir **egzersiz havuzu** oluşturmalısın.

- **Hareket Veritabanı**  
  📌 Her egzersizin aşağıdaki detayları içermesi lazım:  
  ✅ Egzersiz adı  
  ✅ Hedef kas grubu (Göğüs, bacak, sırt, omuz, kol, core vb.)  
  ✅ Egzersiz tipi (Ağırlık, vücut ağırlığı, kardiyo, mobilite)  
  ✅ Antrenman yeri (Ev, spor salonu)  
  ✅ Zorluk seviyesi (Başlangıç, Orta, İleri)  
  ✅ Ortalama süresi  
  ✅ Kalori yakımı (tahmini)  
  ✅ Video/gif desteği  

Örnek:  
| Egzersiz Adı  | Kas Grubu | Antrenman Yeri | Seviye  | Süre (dk) | Kalori Yakımı |
|--------------|----------|---------|---------|-----------|---------------|
| Push-up      | Göğüs    | Ev      | Başlangıç | 1-2 dk    | 5 kcal       |
| Bench Press  | Göğüs    | Gym     | Orta     | 2-3 dk    | 7 kcal       |
| Jump Rope    | Kardiyo  | Her yer  | Başlangıç | 3-5 dk    | 10 kcal      |

- **Antrenman Türleri**  
  Kullanıcının **hedefine ve deneyimine** göre programın yapısını belirlemelisin.  
  🔹 **Kas kazanma (Strength & Hypertrophy)** → Düşük tekrar, yüksek ağırlık, uzun dinlenme süresi.  
  🔹 **Yağ yakma (Fat Burn & HIIT)** → Kısa dinlenme, yüksek yoğunluklu egzersizler.  
  🔹 **Dayanıklılık & Kardiyo** → Uzun süreli aktiviteler (koşu, bisiklet, HIIT).  
  🔹 **Genel Fitness** → Orta yoğunlukta, karışık egzersizler.  

- **Hazır Program Şablonları**  
  Başlangıç için birkaç hazır şablon oluşturup, algoritmanın bunları kişiselleştirmesini sağlayabilirsin.  
  - **Push-Pull-Legs (PPL)**  
  - **Full Body Workout**  
  - **Upper-Lower Split**  
  - **HIIT Programı**  
  - **Ev Programı**  
  - **Spor Salonu Programı**  

---

## **3. Algoritma ile Kişiye Özel Program Nasıl Oluşturulur?**
### **1️⃣ Kullanıcıdan alınan verilerle kategorize et**
Örneğin:  
✅ Erkek, 25 yaşında, 175 cm, 75 kg, **kas kazanmak istiyor**, **haftada 4 gün çalışabilir**, **spor salonunda antrenman yapacak**, **orta seviyede**.  
🡆 **Bu kişiye uygun bir hipertrofi odaklı program oluştur.**  

### **2️⃣ Egzersiz seçimi**
- Kullanıcının deneyim seviyesi ve antrenman yerine göre uygun egzersizleri veritabanından çek.  
- **Split seçimi:** Haftada 4 gün antrenman yapabildiği için **Upper-Lower Split** iyi olabilir.  
- **Egzersiz sıralaması:** Büyük kaslardan küçüklere doğru olmalı.  

### **3️⃣ Set ve tekrar belirleme**
- Kas kazanma hedefi olduğundan **6-12 tekrar** aralığında çalışılmalı.  
- **Orta seviyede olduğu için 3-4 set** idealdir.  

📌 **Örnek Otomatik Antrenman Çıktısı**  
💪 **Gün 1: Üst Vücut (Upper Body Strength Day)**  
✅ Bench Press (4 set, 8 tekrar)  
✅ Barbell Row (4 set, 8 tekrar)  
✅ Shoulder Press (3 set, 10 tekrar)  
✅ Bicep Curl (3 set, 12 tekrar)  
✅ Triceps Dips (3 set, 12 tekrar)  

🔥 **Gün 2: Alt Vücut (Lower Body Strength Day)**  
✅ Squat (4 set, 8 tekrar)  
✅ Deadlift (3 set, 8 tekrar)  
✅ Leg Press (3 set, 10 tekrar)  
✅ Calf Raise (3 set, 12 tekrar)  

---

## **4. Uygulama İçin Teknik Gereksinimler**
✅ **Backend:**  Node.js  
✅ **Veritabanı:** MongoDB  
✅ **AI / Machine Learning:** Kullanıcı verisine göre öneriler yapabilmek için **sklearn, TensorFlow, PyTorch gibi ML kütüphaneleri** ile dinamik programlar oluşturabilirsin.  

---

## **5. Uygulamada Kullanıcı Deneyimi (UX) İçin Ekstra Fikirler**
✅ **Antrenman esnasında süre tutma özelliği** (Özellikle HIIT ve set aralarında dinlenme için)  
✅ **Egzersiz GIF/Video desteği** (Hareketleri göstermek için)  
✅ **Kişisel gelişimi takip etme (PB, ölçüm istatistikleri, kilo değişimi)**  
✅ **Hazır antrenman programları + kişiye özel öneriler**  
✅ **Kullanıcıların birbirleriyle antrenman paylaşımı (Sosyal özellikler)**  

