package com.ppp.pulse;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);  // ← XML لے آؤٹ استعمال کیا

        // WebView کو XML سے تلاش کریں
        webView = findViewById(R.id.webview);

        // WebSettings حاصل کریں
        WebSettings webSettings = webView.getSettings();

        // ========== بہترین سیٹنگز (ترتیب وار، بغیر کسی ڈپلیکیشن کے) ==========
        webSettings.setJavaScriptEnabled(true);       // JavaScript چلانے کی اجازت
        webSettings.setDomStorageEnabled(true);       // LocalStorage/SessionStorage
        webSettings.setDatabaseEnabled(true);         // ڈیٹابیس سٹوریج
        webSettings.setLoadWithOverviewMode(true);    // صفحہ کو سکرین کے مطابق ڈھالے
        webSettings.setUseWideViewPort(true);         // وائڈ ویو پورٹ سپورٹ
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);  // کیشے کا استعمال
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW); // HTTP+HTTPS
        webSettings.setLoadsImagesAutomatically(true); // تصاویر خودکار لوڈ کریں
        webSettings.setSupportZoom(true);              // زوم آن
        webSettings.setBuiltInZoomControls(true);      // زوم کنٹرولز دکھائیں
        webSettings.setDisplayZoomControls(false);     // پرانے +/- بٹن نہ دکھائیں
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " PulseApp");

        // لنکس کو براؤزر میں نہیں، اسی WebView میں کھولنے کے لیے
        webView.setWebViewClient(new WebViewClient());

        // اپنی ویب سائٹ لوڈ کریں (صحیح URL ڈالیں)
        webView.loadUrl("https://yourname.github.io/ppp-pulse/");
    }

    // بیک بٹن دبانے پر ویب سائٹ کے اندر پیچھے جائیں
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase safely for Next.js Server-Side Rendering (SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
import { useState } from 'react';
import { auth } from '../../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function OtpLogin({ onAuthSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      alert('OTP آپ کے موبائل نمبر پر بھیج دیا گیا ہے۔');
    } catch (error) {
      console.error("Error sending SMS", error);
      alert('موبائل نمبر درست فارمیٹ (+923001234567) میں درج کریں۔');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      onAuthSuccess(result.user);
    } catch (error) {
      alert('غلط OTP کوڈ۔ دوبارہ کوشش کریں۔');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 dir-rtl text-right">
      <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">PPP Pulse Ultra — لاگ ان</h2>
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">موبائل نمبر (بین الاقوامی فارمیٹ)</label>
            <input 
              type="tel" 
              placeholder="+923001234567" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-left"
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg transition">
            {loading ? 'انتظار کریں...' : 'او ٹی پی (OTP) بھیجیں'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6 ہندسوں کا OTP کوڈ درج کریں</label>
            <input 
              type="text" 
              placeholder="123456" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center tracking-widest text-xl"
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg transition">
            {loading ? 'تصدیق ہو رہی ہے...' : 'کوڈ کی تصدیق کریں'}
          </button>
        </form>
      )}
    </div>
  );
}
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK in backend
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

const checkUserRole = (allowedLevels) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'غیر مجاز رسائی: ٹوکن غائب ہے' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      // Decode the Firebase ID Token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Fetch user data from Firestore to check their level
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'صارف کا ڈیٹا موجود نہیں ہے' });
      }

      const userData = userDoc.data();

      // Check if user has the required organization level
      if (allowedLevels.includes(userData.userLevel) || userData.userLevel === "Super Admin") {
        req.user = userData; // Forward user data to next function
        return next();
      } else {
        return res.status(403).json({ error: 'ممنوعہ رسائی: آپ کے پاس اس ایکشن کے اختیارات نہیں ہیں' });
      }

    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'سیشن ختم ہو چکا ہے، دوبارہ لاگ ان کریں' });
    }
  };
};

module.exports = checkUserRole;
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users Collection Security Rules
    match /users/{userId} {
      // کوئی بھی لاگ ان صارف اپنی پروفائل پڑھ اور بنا سکتا ہے
      allow read, create: if request.auth != null;
      // صرف پروفائل کا مالک یا سلیٹڈ ایڈمنز ہی ڈیٹا اپڈیٹ کر سکتے ہیں
      allow update: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userLevel in ['District Level', 'Sindh Level', 'Super Admin']);
    }
    
    // Broadcasts Security Rules
    match /broadcasts/{broadcastId} {
      allow read: if request.auth != null; // تمام لاگ ان ورکرز اعلانات پڑھ سکتے ہیں
      // صرف مخصوص لیول کی قیادت ہی نیا براڈکاسٹ جاری کر سکتی ہے
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userLevel in ['District Level', 'Division Level', 'Sindh Level', 'Central Leadership', 'Super Admin'];
    }
  }
}
