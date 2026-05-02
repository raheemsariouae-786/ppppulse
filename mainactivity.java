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
