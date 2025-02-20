Harika bir seçim! 🚀 **Node.js (Express) + MongoDB** kullanarak **kişiye özel antrenman programı oluşturan bir controller** yazacağız. İşleyiş şu şekilde olacak:

1. **Kullanıcının girdiği verileri al** (cinsiyet, yaş, hedef, deneyim, spor süresi vb.).
2. **Egzersiz veritabanından uygun egzersizleri çek**.
3. **Antrenman programını oluştur** (set/tekrar, günlere bölme vb.).
4. **Kullanıcıya geri döndür**.

---

## **1️⃣ MongoDB Koleksiyon Yapısı**

### **1.1. Kullanıcı Modeli (`User.js`)**
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ["male", "female"] },
  height: Number,
  weight: Number,
  experience: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  goal: { type: String, enum: ["muscle_gain", "fat_loss", "endurance", "fitness"] },
  workoutDays: Number, // Haftada kaç gün çalışacak
  availableTime: Number, // Günlük kaç dakika ayırabilir
  gymAccess: Boolean, // Spor salonu var mı?
  equipment: [String], // Kullanılabilir ekipmanlar (örneğin: ["dumbbell", "barbell", "bodyweight"])
  injuries: [String], // Kullanıcının sakatlıkları
});

module.exports = mongoose.model("User", userSchema);
```

---

### **1.2. Egzersiz Modeli (`Exercise.js`)**
```javascript
const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: String,
  muscleGroup: { type: String, enum: ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"] },
  equipment: [String], // Örn: ["barbell", "dumbbell", "machine", "bodyweight"]
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  type: { type: String, enum: ["strength", "cardio", "mobility"] },
  duration: Number, // Ortalama süre (dk)
  caloriesBurned: Number, // Kalori yakımı
  sets: Number,
  reps: String, // Örn: "8-12"
  videoUrl: String, // Egzersiz videosu
});

module.exports = mongoose.model("Exercise", exerciseSchema);
```

---

## **2️⃣ Backend Controller (`workoutController.js`)**

Bu controller:
- Kullanıcının **hedefine, deneyimine, ekipmanına** göre uygun egzersizleri MongoDB'den çeker.
- **Günlere bölerek bir antrenman programı oluşturur**.
- **Set ve tekrar sayılarını kişiselleştirir**.

```javascript
const User = require("../models/User");
const Exercise = require("../models/Exercise");

// 📌 Kişiye özel antrenman programı oluştur
const generateWorkoutPlan = async (req, res) => {
  try {
    // Kullanıcı bilgilerini al
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Egzersiz filtreleme kriterleri
    const filters = {
      difficulty: { $in: getDifficultyLevels(user.experience) }, // Deneyim seviyesine uygun
      equipment: { $in: user.equipment.length ? user.equipment : ["bodyweight"] }, // Kullanılabilir ekipman
    };

    // Kullanıcının hedefine göre egzersizleri al
    let workoutExercises = await Exercise.find(filters);

    // Kas gruplarına göre egzersizleri ayır
    const muscleGroups = {
      chest: [],
      back: [],
      legs: [],
      shoulders: [],
      arms: [],
      core: [],
      cardio: [],
    };

    workoutExercises.forEach((exercise) => {
      muscleGroups[exercise.muscleGroup].push(exercise);
    });

    // **Antrenman Programı Oluşturma**
    const workoutPlan = createWorkoutSchedule(user, muscleGroups);

    return res.json({
      message: "Kişiye özel antrenman programı oluşturuldu.",
      workoutPlan,
    });
  } catch (error) {
    console.error("Workout plan error:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

// 📌 Kullanıcının deneyim seviyesine uygun egzersiz seviyelerini belirle
const getDifficultyLevels = (experience) => {
  switch (experience) {
    case "beginner":
      return ["beginner"];
    case "intermediate":
      return ["beginner", "intermediate"];
    case "advanced":
      return ["intermediate", "advanced"];
    default:
      return ["beginner"];
  }
};

// 📌 Haftalık antrenman planı oluştur (örneğin: 4 günlük split)
const createWorkoutSchedule = (user, muscleGroups) => {
  const workoutDays = user.workoutDays;
  const plan = [];

  for (let i = 0; i < workoutDays; i++) {
    let workoutDay = [];

    // **Örnek split (4 gün için)**
    if (workoutDays === 4) {
      if (i % 2 === 0) {
        // Üst vücut
        workoutDay.push(getRandomExercise(muscleGroups.chest));
        workoutDay.push(getRandomExercise(muscleGroups.back));
        workoutDay.push(getRandomExercise(muscleGroups.shoulders));
        workoutDay.push(getRandomExercise(muscleGroups.arms));
      } else {
        // Alt vücut
        workoutDay.push(getRandomExercise(muscleGroups.legs));
        workoutDay.push(getRandomExercise(muscleGroups.core));
        workoutDay.push(getRandomExercise(muscleGroups.cardio));
      }
    }

    // Set ve tekrar sayılarını kişiselleştir
    workoutDay = workoutDay.map((exercise) => ({
      name: exercise.name,
      sets: user.experience === "beginner" ? 3 : 4,
      reps: user.goal === "muscle_gain" ? "8-12" : "12-15",
      videoUrl: exercise.videoUrl,
    }));

    plan.push({ day: i + 1, exercises: workoutDay });
  }

  return plan;
};

// 📌 Rastgele bir egzersiz seç
const getRandomExercise = (exercises) => {
  if (!exercises || exercises.length === 0) return null;
  return exercises[Math.floor(Math.random() * exercises.length)];
};

module.exports = { generateWorkoutPlan };
```

---

## **3️⃣ API Route (`routes/workoutRoutes.js`)**
Bu route, kullanıcının antrenman programını çağırmak için kullanılacak.

```javascript
const express = require("express");
const router = express.Router();
const { generateWorkoutPlan } = require("../controllers/workoutController");

router.get("/generate-workout/:userId", generateWorkoutPlan);

module.exports = router;
```

---

## **4️⃣ Express Sunucu (`server.js`)**
```javascript
const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();
app.use(express.json());

// MongoDB Bağlantısı
mongoose
  .connect("mongodb://localhost:27017/workoutApp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB'ye bağlandı"))
  .catch((err) => console.log("MongoDB bağlantı hatası:", err));

// Route Bağlantısı
app.use("/api/workouts", workoutRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
```

---

## **📌 Kullanım Senaryosu**
1. Kullanıcı `POST /users` ile kaydolur.
2. `GET /api/workouts/generate-workout/:userId` çağrılır.
3. Kişiye özel **4 günlük antrenman programı** döndürülür.

✅ **MongoDB ile esnek, scalable ve kişiselleştirilebilir bir sistem kurduk!** 🎯 

Bu yapıyı daha da **akıllı, ölçeklenebilir ve kişiselleştirilmiş** hale getirmek için aşağıdaki geliştirmeleri yapabiliriz:

---

## **🚀 Geliştirmeler**
1. **📌 AI Destekli Egzersiz Öneri Sistemi** (Kullanıcının geçmiş verilerine göre öneri)
2. **📌 Kullanıcının ilerlemesine göre programı dinamik güncelleme**
3. **📌 Egzersizlerin süresini ve dinlenme aralıklarını kişiye özel optimize etme**
4. **📌 Kullanıcıların programlarını kaydedip ilerlemelerini takip etmesi**
5. **📌 Next.js ile ön tarafa veri sağlamak için GraphQL API entegrasyonu**
6. **📌 Gerçek zamanlı antrenman takibi (Socket.io ile canlı süre sayacı)**
7. **📌 Kullanıcılar arasında sosyal etkileşim (Antrenman paylaşımı, yorumlar, beğeniler)**

---

# **1️⃣ Kullanıcının Antrenman Geçmişini Takip Etme**
Kullanıcının antrenman verilerini saklayarak **kişiselleştirilmiş öneriler sunabiliriz**.

### **📌 Kullanıcı Antrenman Modeli (`WorkoutHistory.js`)**
```javascript
const mongoose = require("mongoose");

const workoutHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  completedExercises: [
    {
      exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
      setsCompleted: Number,
      repsCompleted: Number,
      duration: Number, // Kaç dakika sürdü?
    },
  ],
});

module.exports = mongoose.model("WorkoutHistory", workoutHistorySchema);
```
**Faydası:**  
- Kullanıcı **hangi hareketleri yaptı**, **kaç tekrar yaptı**, **set sayısı**, **zaman bilgisi** gibi verileri kayıt altına alabiliriz.
- Son antrenmandan kaç gün geçtiğini hesaplayarak **kullanıcıya öneriler** sunabiliriz.
- Egzersizleri **kolay mı/zor mu geldi?** Kullanıcının performansına göre egzersiz seviyesini **dinamik olarak değiştirebiliriz**.

---

# **2️⃣ Kullanıcının Gelişimine Göre Program Güncelleme**
- Eğer kullanıcı **bir egzersizde çok iyiyse**, egzersiz seviyesi **ileri seviye** egzersizlerle değiştirilebilir.
- Eğer bir hareketi tam yapamıyorsa, sistem daha kolay bir varyasyon önerebilir.
- **Sakatlık veya yorgunluk algılama**: Kullanıcı **fazla zorlanıyorsa**, sistem dinlenme günü önerir.

### **📌 Kullanıcının Performansına Göre Güncelleme (`updateWorkoutProgress.js`)**
```javascript
const WorkoutHistory = require("../models/WorkoutHistory");
const User = require("../models/User");

const updateWorkoutProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const userHistory = await WorkoutHistory.find({ userId }).sort({ date: -1 }).limit(5);

    if (!userHistory.length) {
      return res.status(400).json({ message: "Yeterli veri bulunamadı." });
    }

    let totalReps = 0;
    let totalSets = 0;

    userHistory.forEach((workout) => {
      workout.completedExercises.forEach((exercise) => {
        totalReps += exercise.repsCompleted;
        totalSets += exercise.setsCompleted;
      });
    });

    const avgRepsPerSet = totalReps / totalSets;

    // Eğer kullanıcı ortalama 12+ tekrar yapıyorsa, egzersiz seviyesini artır
    if (avgRepsPerSet > 12) {
      await User.findByIdAndUpdate(userId, { experience: "advanced" });
    } else if (avgRepsPerSet < 8) {
      await User.findByIdAndUpdate(userId, { experience: "beginner" });
    }

    return res.json({ message: "Antrenman seviyesi güncellendi." });
  } catch (error) {
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = { updateWorkoutProgress };
```

---

# **3️⃣ Next.js ve GraphQL ile Veri Yönetimi**
REST API yerine **GraphQL** kullanırsak, **isteğe bağlı veriler çekebilir**, fazla yükü önleyebiliriz.

### **📌 GraphQL Şeması (`graphql/schema.js`)**
```javascript
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    gender: String!
    height: Int!
    weight: Int!
    experience: String!
    goal: String!
    workoutDays: Int!
  }

  type Exercise {
    id: ID!
    name: String!
    muscleGroup: String!
    equipment: [String]!
    difficulty: String!
    sets: Int!
    reps: String!
  }

  type WorkoutPlan {
    day: Int!
    exercises: [Exercise]!
  }

  type Query {
    getUser(userId: ID!): User
    getWorkoutPlan(userId: ID!): [WorkoutPlan]
  }
`;

module.exports = typeDefs;
```
**Faydası:**  
✔️ Next.js frontend'i **GraphQL istekleriyle** yalnızca **gerekli verileri** çekebilir.  
✔️ **Daha az veri transferi**, daha **hızlı** uygulama.  

---

# **4️⃣ Gerçek Zamanlı Antrenman Takibi (Socket.io ile)**
- Kullanıcı antrenmana başladığında **gerçek zamanlı geri sayım başlatılabilir**.
- Kullanıcılar **birbirlerinin ilerlemesini canlı olarak görebilir**.

### **📌 Socket.io ile Antrenman Süreç Takibi (`workoutTimer.js`)**
```javascript
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı");

  socket.on("startWorkout", ({ userId, duration }) => {
    console.log(`Kullanıcı ${userId} antrenmana başladı: ${duration} dk`);

    let timeLeft = duration * 60;

    const interval = setInterval(() => {
      timeLeft -= 1;
      socket.emit("updateTimer", { timeLeft });

      if (timeLeft <= 0) {
        clearInterval(interval);
        socket.emit("workoutComplete", { message: "Antrenman tamamlandı!" });
      }
    }, 1000);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});
```
**Faydası:**  
✔️ Kullanıcı **setler ve dinlenme sürelerini takip edebilir**.  
✔️ **Gerçek zamanlı geri sayım ve bildirimler** eklenebilir.  

---

# **5️⃣ Kullanıcılar Arasında Sosyal Etkileşim**
- Kullanıcılar **antrenmanlarını paylaşabilir**.
- Diğer kullanıcıların antrenmanlarını **beğenebilir ve yorum yapabilir**.

### **📌 Antrenman Paylaşım Modeli (`WorkoutPost.js`)**
```javascript
const mongoose = require("mongoose");

const workoutPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workoutPlan: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ userId: String, text: String, date: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkoutPost", workoutPostSchema);
```

---

# **🔥 SONUÇ**
✅ **Gerçek zamanlı geri sayım & antrenman takibi**  
✅ **Kullanıcının gelişimine göre dinamik program güncelleme**  
✅ **GraphQL ile hızlı ve esnek veri çekme**  
✅ **Sosyal etkileşim (Beğenme, yorum yapma)**  

Bunları eklersek **profesyonel bir workout uygulaması** yapabiliriz! 🚀 Daha fazla geliştirme ister misin? 😊