// header.js - BD Marketing Top Header (PRECISE & EXACT DESIGN)
const headerHTML = `
<link href="https://cdn.tailwindcss.com" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<style>
    /* ✅ হুবহু সেই বিশেষ ব্লু গ্রেডিয়েন্ট */
    .precise-header {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        box-shadow: 0 4px 20px -5px rgba(59, 130, 246, 0.5);
    }
    
    /* অনার ব্যাজ ডিজাইন */
    .precise-owner-badge {
        background: rgba(255, 255, 255, 0.08); /* হালকা সাদাটে ভাব */
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .precise-owner-badge:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    /* রকেট আইকনের পজিশন */
    .precise-rocket-area {
        transform: rotate(-15deg); /* স্ক্রিনশটের মতো হালকা বাঁকানো */
    }
</style>

<header class="precise-header fixed top-0 left-0 w-full z-[2000] px-5 py-4">
    <div class="header-content flex justify-between items-center max-w-lg mx-auto">
        
        <div class="flex items-center gap-3">
            <div class="precise-rocket-area">
                <i class="fas fa-rocket text-[#fbdf07] text-2xl"></i>
            </div>
            <h1 class="text-white text-3xl font-black uppercase tracking-tight italic">
                BD MARKETING
            </h1>
        </div>
        
        <div onclick="window.location.href='owner_details.html'" class="precise-owner-badge px-6 py-2 rounded-full shadow-lg">
            <span class="text-[11px] font-bold text-white/80 uppercase">Owner:</span>
            <span class="text-[11px] font-black text-white ml-1.5">Saddam</span>
        </div>
        
    </div>
</header>
`;

// বডির শুরুতে ইনজেক্ট করা
document.body.insertAdjacentHTML('afterbegin', headerHTML);
