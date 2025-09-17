# Firebase Database Тохируулах - Дэлгэрэнгүй заавар

## 🔥 АЛХАМ 1: Firebase Төсөл Үүсгэх

### 1.1 Firebase Console руу орох
1. **Browser дээр https://console.firebase.google.com орох**
2. **Google account ашиглан нэвтрэх** (Gmail эсвэл Google account хэрэгтэй)
3. Хэрэв анхны удаа орж байвал "Get started" товчийг дарах

### 1.2 Төсөл үүсгэх эсвэл сонгох
**Хэрэв шинэ төсөл үүсгэх бол:**
1. **"Create a project"** эсвэл **"+ Add project"** товч дарах
2. **Project нэр оруулах**: `burger-fb-studio` (эсвэл таны дуртай нэр)
3. **Continue** дарах
4. **Google Analytics сонгох** (хэрэгтэй бол "Enable", эсвэл "Not now")
5. **"Create project"** дарах
6. Хүлээх (2-3 минут)

**Хэрэв одоо байгаа төсөл ашиглах бол:**
- Жагсаалтаас дуртай төслөө сонгох

## 🏪 АЛХАМ 2: Firestore Database Тохируулах

### 2.1 Firestore Database үүсгэх
1. **Firebase Console дотор зүүн талын menu-ээс "Firestore Database" сонгох**
2. **"Create database" товч дарах**
3. **Security rules сонгох:**
   - **"Start in production mode"** сонгох (аюулгүй)
   - **"Next" дарах**
4. **Cloud Firestore location сонгох:**
   - **Хамгийн ойр газар сонгох** (жишээ: `asia-northeast1` - Япон)
   - **"Done" дарах**
5. Хүлээх (1-2 минут database үүсэх)

### 2.2 Security Rules тохируулах
1. **"Rules" табыг дарах**
2. **Дараах кодыг хуулж оруулах:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if a user is an admin
    function isAdmin(userId) {
      return exists(/databases/$(database)/documents/users/$(userId)) &&
             get(/databases/$(database)/documents/users/$(userId)).data.role == 'admin';
    }

    // Rules for the 'orders' collection
    match /orders/{orderId} {
      // CREATE: Logged-in users can create their own orders.
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // READ: A user can read their own order. An admin can read any order.
      allow get: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin(request.auth.uid));
      allow list: if request.auth != null && isAdmin(request.auth.uid);

      // UPDATE: Only admins can update the status of an order.
      allow update: if request.auth != null && isAdmin(request.auth.uid) && request.resource.data.keys().hasOnly(['status']);
      
      // DELETE: Nobody can delete orders.
      allow delete: if false;
    }

    // Rules for the 'users' collection
    match /users/{userId} {
      // READ: A user can read their own document. Admins can read any user document.
      allow get: if request.auth != null && (request.auth.uid == userId || isAdmin(request.auth.uid));
      
      // LIST: Only admins can list all users.
      allow list: if request.auth != null && isAdmin(request.auth.uid);

      // CREATE: Allow user creation
      allow create: if request.auth != null;
      
      // UPDATE, DELETE: Allow users to update their own points
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    // Rules for the 'burgers' collection  
    match /burgers/{burgerId} {
      // READ: Anyone can read burgers
      allow read: if true;
      
      // WRITE: Only admins can modify burgers
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
    
    // Rules for point transactions
    match /pointTransactions/{transactionId} {
      // READ: Users can read their own transactions, admins can read all
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || isAdmin(request.auth.uid));
      
      // CREATE: Only server can create transactions
      allow create: if false;
    }
    
    // Rules for settings
    match /settings/{settingId} {
      // READ: Anyone can read settings
      allow read: if true;
      
      // WRITE: Only admins can modify settings
      allow write: if request.auth != null && isAdmin(request.auth.uid);
    }
  }
}
```
3. **"Publish" товч дарах**

## 🔑 АЛХАМ 3: Authentication тохируулах

### 3.1 Authentication (Хэрэглэгч бүртгэл, нэвтрэлт)
1. **Firebase Console** > **Authentication** руу орно
2. **"Get started"** дарна
3. **Sign-in method** таб дээр:
  - **Email/Password**-г "Enable" болгоно
  - "Save" дарна

### 3.2 Service Account Key (Админ эрх)
1. **Settings > Project settings > Service accounts** руу орно
2. **"Generate new private key"** дарж JSON файл татаж авна
3. Энэ JSON-оос client_email, private_key-г .env.local-д оруулна

### 3.3 Web App Configuration
1. **Settings > Project settings > General** руу орно
2. "Your apps" хэсэгт Web App (<\/>) нэмнэ
3. App нэр: `burger-app`
4. "Register app" дарж config object-г авна
5. .env.local-д NEXT_PUBLIC_FIREBASE_* хувьсагчид оруулна

## 📝 АЛХАМ 4: Environment Variables Тохируулах

### 4.1 JSON файлаас мэдээлэл авах
**Татасан JSON файлыг нээгээд дараах мэдээллийг олох:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id-here",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...очень длинный ключ...\n-----END PRIVATE KEY-----\n"
}
```

### 4.2 .env.local файл үүсгэх/засах
**Төслийн үндсэн хавтас дотор `.env.local` файлыг засах:**

```bash
# Genkit AI API Key (for burger recommendations) 
GEMINI_API_KEY=AIzaSyD3SblZOdexzLoJryLBWvsFYwRvQTJVaa0
GOOGLE_GENAI_API_KEY=AIzaSyD3SblZOdexzLoJryLBWvsFYwRvQTJVaa0

# Firebase Client Configuration (Public) - Web app config-оос
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=906350461244
NEXT_PUBLIC_FIREBASE_APP_ID=1:906350461244:web:xxxxxxxxxxxxx

# Firebase Admin Configuration (for server-side operations) - JSON файлаас
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSk...
...бүх private key-г энд хуулах...
-----END PRIVATE KEY-----"
```

### 4.3 Анхаарах зүйлс:
⚠️ **FIREBASE_PRIVATE_KEY тохируулах:**
- Quotation marks ("") дотор бичих ёстой
- Бүх key-г нэг мөрөнд бичих (\\n-ууд хадгалах)
- Copy-paste хийхдээ анхны болон сүүлийн quotes-г мартуузай

⚠️ **Файлын аюулгүй байдал:**
- .env.local файлыг Git-д орохгүй (.gitignore дотор байгаа)
- Private key-г хэн нэгэнд битгий өгнө үү!

## 🏗️ АЛХАМ 5: Анхны өгөгдөл нэмэх

### 5.1 Burgers collection үүсгэх
1. **Firestore Database дотор "Start collection" дарах**
2. **Collection ID:** `burgers`  
3. **"Next" дарах**
4. **Анхны document нэмэх:**
   - **Document ID:** `classic-cheeseburger`
   - **Fields нэмэх:**
   ```
   name (string): "Classic Cheeseburger"
   price (number): 15000
   description (string): "Сонгодог амттан чизбургер"
   category (string): "classic"
   available (boolean): true
   imageUrl (string): "https://picsum.photos/seed/burger1/400/300"
   ```
5. **"Save" дарах**

### 5.2 Бусад burger нэмэх
**Дараах бургерууд нэмэж болно:**
```
Document ID: bacon-deluxe
- name: "Bacon Deluxe"
- price: 18000
- description: "Гахайн махтай делюкс бургер"
- category: "premium"
- available: true
- imageUrl: "https://picsum.photos/seed/burger2/400/300"

Document ID: veggie-burger
- name: "Veggie Burger"  
- description: "Ногооны эрүүл бургер"
- price: 12000
- category: "healthy"
- available: true
- imageUrl: "https://picsum.photos/seed/burger3/400/300"
```

### 5.3 Admin хэрэглэгч үүсгэх
1. **"Authentication" > "Users" табруу орох**
2. **"Add user" дарах**
3. **Email:** `admin@burger.com`
4. **Password:** `admin123`
5. **"Add user" дарах**

6. **User ID-г хуулж авах**
7. **Firestore Database-д `users` collection үүсгэх:**
   - **Document ID:** (хуулсан User ID)
   - **Fields:**
   ```
   email (string): "admin@burger.com"
   role (string): "admin" 
   points (number): 0
   createdAt (timestamp): (одоогийн огноо)
   ```

## 🧪 АЛХАМ 6: Тест хийх

### 6.1 Development server эхлүүлэх
```powershell
cd C:\Apps\burger-fb-studio\burger-butee
npm run dev
```

### 6.2 Firebase холбогдолт шалгах
1. **Browser дээр http://localhost:9002 орох**
2. **Console (F12) нээж алдаа байгаа эсэхийг шалгах**
3. **Хэрэв "Firebase client initialized successfully" харагдвал - амжилттай!**

### 6.3 Тест хийх алхмууд
1. **Homepage дээр бургер харагдаж байгаа эсэхийг шалгах**
2. **Login хуудас руу орж admin@burger.com / admin123-ээр нэвтрэх**
3. **Admin панел /admin/orders руу орж харах**
4. **Захиалга хийж database-д хадгалагдаж байгаа эсэхийг шалгах**

## � АЛХАМ 7: Амжилттай тохируулсны дараа

### Юу ажиллах болох:
- ✅ Веб сайт Firebase database ашиглан ажиллана
- ✅ Захиалгууд Firestore дотор хадгалагдана  
- ✅ AI зөвлөмжүүд Gemini API ашиглан ажиллана
- ✅ Хэрэглэгчийн мэдээлэл (оноо, түвшин) хадгалагдана
- ✅ Admin функцүүд ажиллана
- ✅ Points system ажиллана

### Дараа нь хийх зүйлс:
1. **Production deployment** - Vercel дээр deploy хийх
2. **Email notifications** - Захиалгын мэдээлэл имэйлээр илгээх
3. **Image uploads** - Firebase Storage ашиглах
4. **Analytics** - Google Analytics нэмэх

## � АЛДАА ЗАСАХ - Troubleshooting

### ❌ Firebase Project ID алдаа
**Шинж тэмдэг:** "Project not found" алдаа
**Засах арга:**
1. Firebase Console дээр project ID-г дахин шалгах
2. .env.local дотор `FIREBASE_PROJECT_ID` зөв бичсэн эсэхийг шалгах
3. `NEXT_PUBLIC_FIREBASE_PROJECT_ID` мөн адил эсэхийг баталгаажуулах

### ❌ Service Account Key алдаа  
**Шинж тэмдэг:** "Invalid credentials" эсвэл "INTERNAL" алдаа
**Засах арга:**
1. JSON файл дотрох `client_email`, `private_key` зөв хуулсан эсэхийг шалгах
2. `FIREBASE_PRIVATE_KEY`-г quotes ("") дотор бичсэн эсэхийг шалгах
3. Private key дотор \\n тэмдэгтүүд байгаа эсэхийг шалгах
4. Шинэ Service Account Key үүсгэж дахин оролдох

### ❌ API Key алдаа
**Шинж тэмдэг:** "auth/invalid-api-key" алдаа  
**Засах арга:**
1. Firebase Console > Project Settings > General дээр Web API key шалгах
2. .env.local дотор `NEXT_PUBLIC_FIREBASE_API_KEY` зөв эсэхийг шалгах
3. API key restrictions байгаа эсэхийг шалгах

### ❌ Database rules алдаа
**Шинж тэмдэг:** "Permission denied" алдаа
**Засах арга:**
1. Firestore Database > Rules табыг шалгах  
2. Security rules syntax зөв эсэхийг "Simulate" товчоор тест хийх
3. Authentication хэрэглэгч үүссэн эсэхийг шалгах

### ❌ Network алдаа
**Шинж тэмдэг:** Connection timeout
**Засах арга:**
1. Интернет холбогдолт шалгах
2. Firewall/VPN асуудал шалгах  
3. Firebase status шалгах: https://status.firebase.google.com/

### 🔄 Бүгдийг дахин эхлүүлэх
```powershell
# Dependencies дахин суулгах
npm install

# Cache цэвэрлэх
npm run clean
# эсвэл
rm -rf .next

# Dev server дахин эхлүүлэх
npm run dev
```

## 📞 ТУСЛАМЖ АВАХ

### Алдааны мэдээлэл авах
1. **Firebase Console** > **Project Overview** > **Usage and billing** дээр quota шалгах
2. **Browser Developer Tools** (F12) > **Console** табад алдааны мэдээлэл шалгах  
3. **Terminal дээрх алдааны log** анхааралтай унших
4. **Firebase Console** > **Firestore** > **Usage** дээр requests-ын тоо шалгах

### Нийтлэг алдаанууд
- **503 Service Unavailable** - Gemini API хэт ачаалалтай
- **Permission denied** - Authentication эсвэл security rules алдаа  
- **Network error** - Интернет холбогдолт алдаа
- **Invalid API key** - Configuration алдаа

### Холбоо барих
- **GitHub Issues**: https://github.com/Anu682-max/burger-butee/issues
- **Firebase Support**: https://firebase.google.com/support
- **Next.js Docs**: https://nextjs.org/docs

---
*Энэ дэлгэрэнгүй заавар нь таны burger restaurant веб сайтыг Firebase database-тай амжилттай холбоход тусална!* 🍔🔥

**Дараагийн алхам:** Environment variables тохируулсны дараа `npm run dev` командыг ажиллуулж тест хий!
