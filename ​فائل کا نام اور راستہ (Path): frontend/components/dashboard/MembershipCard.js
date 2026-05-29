// frontend/components/dashboard/MembershipCard.js
import { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function MembershipCard({ workerData }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element, { useCORS: true });
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `${workerData.fullName}-PPP-Card.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-right" style={{ direction: 'rtl' }}>
      
      {/* کارڈ کا خوبصورت ڈیزائن */}
      <div 
        ref={cardRef} 
        className="relative w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white flex flex-col justify-between"
      >
        {/* پارٹی کے تین رنگ (سیاہ، سرخ، ہرا) */}
        <div className="flex h-4 w-full">
          <div className="bg-black w-1/3 h-full"></div>
          <div className="bg-red-600 w-1/3 h-full"></div>
          <div className="bg-green-600 w-1/3 h-full"></div>
        </div>

        {/* ہیڈر */}
        <div className="px-4 pt-3 text-center">
          <h2 className="text-xl font-bold text-red-600">پاکستان پیپلز پارٹی</h2>
          <p className="text-xs text-gray-600">ڈیجیٹل ممبرشپ نیٹ ورک — سندھ</p>
        </div>

        {/* ورکر کی تصویر اور عہدہ */}
        <div className="flex flex-col items-center px-4">
          <div className="w-24 h-24 rounded-full border-4 border-red-500 overflow-hidden shadow-md mb-3">
            <img 
              src={workerData.photoURL || "/default-avatar.png"} 
              alt={workerData.fullName} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{workerData.fullName}</h3>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mt-1 border border-green-300">
            {workerData.role}
          </span>
        </div>

        {/* ورکر کا تنظیمی بائیو ڈیٹا */}
        <div className="px-6 py-2 space-y-1.5 text-sm text-gray-700 bg-gray-50 border-y border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">ممبر آئی ڈی:</span>
            <span className="font-bold text-black">{workerData.qrMembershipId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">شناختی کارڈ:</span>
            <span className="font-semibold">{workerData.cnic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ضلع / ٹاؤن:</span>
            <span className="font-semibold">{workerData.geoScope?.district} / {workerData.geoScope?.town}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">یو سی (UC):</span>
            <span className="font-semibold">{workerData.geoScope?.uc}</span>
          </div>
        </div>

        {/* QR Code اور ویریفیکیشن اسٹیٹس */}
        <div className="flex items-center justify-between px-6 pb-4 pt-2 bg-white">
          <div className="text-right">
            <div className="text-[10px] text-gray-400">اسکین کر کے تصدیق کریں</div>
            <div className="text-xs font-bold text-green-600 mt-0.5">✓ تصدیق شدہ ورکر</div>
            <div className="text-[10px] text-gray-400 mt-1">میعاد: {workerData.cardExpiry || "2030-12-31"}</div>
          </div>
          
          <div className="w-16 h-16 border border-gray-300 p-1 rounded bg-white">
            <img 
              src={workerData.qrCodeUrl || "/default-qr.png"} 
              alt="QR Verification" 
              className="w-full h-full"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* کارڈ ڈاؤن لوڈ کرنے کا بٹن */}
      <button 
        onClick={downloadCard} 
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center"
      >
        <span>📥 ڈیجیٹل کارڈ ڈاؤن لوڈ کریں</span>
      </button>

    </div>
  );
}
