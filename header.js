// header.js - BD Marketing Top Header
const headerHTML = `
<header class="top-header fixed top-0 left-0 w-full z-[1000]">
    <div class="header-content flex justify-between items-center px-6 py-4">
        <div class="logo-area flex items-center gap-2">
            <div class="logo-icon"></div>
            <h1 class="brand-name">BD MARKETING</h1>
        </div>
        <div class="status-indicator">
            <span class="online-dot"></span>
            <span class="status-text">LIVE</span>
        </div>
    </div>
</header>

<style>
    .top-header {
        background: rgba(8, 12, 20, 0.8);
        backdrop-filter: blur(15px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .brand-name {
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 3px;
        background: linear-gradient(to right, #3b82f6, #60a5fa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-transform: uppercase;
    }

    .logo-icon {
        width: 8px;
        height: 8px;
        background: #3b82f6;
        border-radius: 2px;
        transform: rotate(45deg);
    }

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.03);
        padding: 4px 10px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .online-dot {
        width: 5px;
        height: 5px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 10px #10b981;
        animation: blink 1.5s infinite;
    }

    .status-text {
        font-size: 8px;
        font-weight: 800;
        color: #10b981;
        letter-spacing: 1px;
    }

    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
    }
</style>
`;

// বডির শুরুতে ইনজেক্ট করা
document.body.insertAdjacentHTML('afterbegin', headerHTML);
