// header.js - BD Marketing Top Header (PRECISE 1:1 CLONE)
const headerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.tailwindcss.com"></script>

<style>
    /* ✅ হুবহু সেই নির্দিষ্ট ব্লু গ্রেডিয়েন্ট */
    .top-header-bg {
        background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #2563eb 100%);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    /* ✅ Owner বাটন স্টাইল - স্ক্রিনশট অনুযায়ী হুবহু বর্ডার ও ব্যাকগ্রাউন্ড */
    .precise-owner-btn {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 9999px;
        padding: 6px 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
    }

    /* ✅ টেক্সট শ্যাডো এবং ফন্ট নিখুঁত করার জন্য */
    .brand-text {
        font-family: 'Inter', sans-serif;
        font-weight: 900; /* Extra Bold */
        letter-spacing: -0.5px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }
</style>

<header class="top-header-bg fixed top-0 left-0 w-full z-[9999] px-4 py-3 flex justify-between items-center">
    <div class="flex items-center gap-2">
        <div style="transform: rotate(-10deg);">
            <i class="fas fa-rocket text-[#fbdf07] text-2xl"></i>
        </div>
        <h1 class="brand-text text-white text-2xl uppercase italic">
            BD MARKETING
        </h1>
    </div>
    
    <div onclick="window.location.href='owner_details.html'" class="precise-owner-btn">
        <span class="text-[10px] font-bold text-white/80 uppercase tracking-wide">Owner:</span>
        <span class="text-[10px] font-black text-white uppercase">Saddam</span>
    </div>
</header>
`;

document.body.insertAdjacentHTML('afterbegin', headerHTML);
