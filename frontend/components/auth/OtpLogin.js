// frontend/components/auth/OtpLogin.js
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 text-right" style={{ direction: 'rtl' }}>
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
              className="w-full p-3 border border-gray-300 rounded-lg text-left"
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
              className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest text-xl"
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
