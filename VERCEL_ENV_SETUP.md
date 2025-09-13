# Vercel Environment Variables Setup

## Required Environment Variables

Vercel Dashboard → Your Project → Settings → Environment Variables дээр дараах variables нэмэх хэрэгтэй:

### Client-side Firebase Configuration (NEXT_PUBLIC_*)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCcL5XzgomW1w7VyiE7VarxolJAtqvCDcA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-8825636989-becf3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-8825636989-becf3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-8825636989-becf3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=906350461244
NEXT_PUBLIC_FIREBASE_APP_ID=1:906350461244:web:540d5e3497cd210ad51e39
```

### Server-side Firebase Admin Configuration
```bash
FIREBASE_PROJECT_ID=studio-8825636989-becf3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studio-8825636989-becf3.iam.gserviceaccount.com
```

### Firebase Private Key (Special formatting required)
```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCx9V5Ch+N5SPjE
RQLkp20tPn98R+FeGawxkiGoW9DXTlcQozjm8+8wQ/ulRYiVruu9r801H7+uaV+C
7KgBqxEqA/H0Hwcyp0cZrAULDLf6kyWKxZZNu6HIyD118o231B1X1AwK9pXp3Hdg
REo0s8VV+P7Vb9pfLvijax2RIblUM1F8P1tixDwwht0aw1JclRTWoqo1nWM6x+JC
e9m7yzaFaKZyMeqsJCGaQc1drLzy7b5yLNbRPkrj/8/HufBn3VrfZhJsaqIFogNC
P2NUk2cPY/BMAsZNnrNdNu78C//IrK6TYeoOXhuOdD16P7OIz7hsHAT3J/U9ksoP
Ic6OpQybAgMBAAECggEABUigPQB04A0rGa9k3RjIKeTmUHB/6qp/eCn7EYPHCRrR
2fQcBJDEjsh4ncPD65HPJ7QjDHXosTXUDfqXKGmFr8YrNmYqHAu8atuL0MlWuGa1
ts+UCAh5+WX8m9ZmSnQj+joZBhr5K4GOEnp5645U3cRv/d1S0gBT2zebH/aCM/4/
VbdSdTLZIiW2i91BN5qTlmhhjB526s7TypGhzmpyCBO/KE/xHArx5dHBPfSnTuqS
UMKp6W3r8FvaDp/fyZNhHZ8dWDogM8miBKn8M4vXjh53mz3n6n2qnXYw32GNGCGF
nPvuK4tIrupMQTHKrE+11ILLyVahTVjlOQ0msS36oQKBgQDr3CA4r8zfUh/xzW28
bywz+OU5fpGPibT1WOtWcN2qdxEdQ8lvXyYEyb6NL9W/pEEsoUwYzeQIWhA0CmiT
sHJYLIo8uvraJbnRRAvzo3HbRaU83C1fLoQfGI8GrUkTalgPnSeQ1xPDfc8Ec+I/
NfOoeYymtSSW0qaxaoSWXlnSIQKBgQDBJ4X5H1WEsGtB1qsoInTvYlDieSqFLa0J
5E/jTjpMmIMvGLsiseqVUEMr3mOu+WSjy+GYvx15H2AbHiKrOPEizMpMJIlQNRgL
Rjs3W1idIzoT2FviKycmxNLtsTl8pbttZ9O1fS2tW4d9MpBuPHy/gul+Yqx5i2oP
C8EarMu/OwKBgQCE2kogBA4/YG/z8MW2FVztrW3Yk82D74pJhJuS5iJF6alvNYaa
QBsXKVg3CNG6j9fSPsyxUA/5EFn+Jjq/rezKc9Qt3xh7ljJziIO+6bqxSyqG/HJm
Ibp0FY5CsYru78DIkrn9oNhWDmB0Xp37AvXLWSP7px8EAYW5e4lRdbXcYQKBgCBb
oasJX8c50s4Vy1iO5S4RN2GpUME81Kc6k1OOEGAykI98QiVezuCysH4R5Hs0lnKG
PkXbhnF7GxuP4djzUho1WpKE8Gf6bQu+eT8d02uHsjwO2924wvdQs9FUBkBmd06t
vR7DWLqZAcqshNui0Hc41CrzFtfJzju1CWWRmxRvAoGBAKfC3RrZec+2J9FuKU/H
QlPoLDY75FSzEJZ1uAfVzPJtEJGCrAxdgUcefdMqbKRQBrf5UCnoccLVESS/YLUz
4vfYKaW6MISWjUGmoS8IZjOAZyMKKTywcLPvnuVgXAyaMRqhv6oGopkWKgr2ND8m
srCYsfi1RI4dC1yj3f6gzQTD
-----END PRIVATE KEY-----"
```

### AI Configuration
```bash
GEMINI_API_KEY=AIzaSyD3SblZOdexzLoJryLBWvsFYwRvQTJVaa0
GOOGLE_GENAI_API_KEY=AIzaSyD3SblZOdexzLoJryLBWvsFYwRvQTJVaa0
```

## Important Notes

1. **Private Key Formatting**: FIREBASE_PRIVATE_KEY нь quotes доторх бүх мөртэй, шинэ мөр (newlines) хадгалагдсан байх ёстой

2. **Environment Types**: Production, Preview, Development бүр дээр тохируулж болно

3. **Deployment**: Environment variables нэмсэний дараа дахин deploy хий:
   ```bash
   git add .
   git commit -m "Update environment variables"
   git push origin main
   ```

## Verification

Deploy амжилттай болсоны дараа:
- Firebase services хэвийн ажиллаж байгаа эсэхийг шалгах
- AI recommendations ажиллаж байгаа эсэхийг тест хийх
- Admin functions хандалттай байгаа эсэхийг баталгаажуулах