// header.js - BD Marketing Top Header (Accurate Design)
const headerHTML = `
<header class="top-header fixed top-0 left-0 w-full z-[1000] flex justify-between items-center px-4 py-3">
    <div class="flex items-center gap-2">
        <div class="rocket-icon">
            <i class="fas fa-rocket text-[#fbdf07] text-lg"></i>
        </div>
        <h1 class="text-white text-xl font-black italic tracking-tighter uppercase">BD MARKETING</h1>
    </div>
    
    <div class="owner-badge px-4 py-1.5 rounded-full border border-white/20">
        <span class="text-[10px] font-bold text-white/70 uppercase">Owner:</span>
        <span class="text-[10px] font-black text-white ml-1">Saddam</span>
    </div>
</header>

<style>
    .top-header {
        background: linear-gradient(to right, #1e40af, #3b82f6);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    
    .owner-badge {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
    }

    .rocket-icon {
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
`;

// বডির শুরুতে ইনজেক্ট করা
document.body.insertAdjacentHTML('afterbegin', headerHTML);
