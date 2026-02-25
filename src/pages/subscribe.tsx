import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SubscribePage() {
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const handleSubscribe = () => {
    setPaying(true);
    setTimeout(() => {
      // Simulate successful payment
      try {
        sessionStorage.setItem('lil_lanterns_premium_unlocked', 'true');
        
        // Clear pending builder state as we're redirecting to success page
        sessionStorage.removeItem('lil_lanterns_pending_step');
        sessionStorage.removeItem('lil_lanterns_pending_selections');
      } catch {}

      navigate('/subscribe/success');
    }, 800);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5EFE6] relative overflow-hidden font-sans">
      {/* Background lantern watermark */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center"
      >
        <img 
          src="/lantern-hero.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.06]"
        />
      </div>

      {/* Back Navigation */}
      <button 
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 p-2 text-[#1F1F1F] hover:opacity-70 transition-opacity"
        aria-label="Go back"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M19 12H5M5 12L12 19M5 12L12 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Content container */}
      <div className="relative z-10 max-w-[480px] mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Top section */}
        <div className="text-center mb-8">
          <div className="font-sans text-[13px] text-[#5A5A5A] uppercase tracking-[0.12em] mb-2">
            Free Plan
          </div>
          <h1 className="font-serif text-[28px] text-[#1F1F1F] font-bold leading-tight mb-4 mt-2">
            Unlock unlimited storytelling
          </h1>
          <p className="font-sans text-[17px] text-[#1F1F1F] leading-[1.6] mt-4">
            You are on the Free plan, which includes one story per day. Upgrade to Premium for unlimited stories, every language, every age, and the ability to support independent artists directly.
          </p>
        </div>

        {/* Price display */}
        <div className="text-center mt-8 mb-8">
          <div className="font-serif text-[42px] text-[#1F1F1F] font-bold leading-none">
            $7.99
          </div>
          <div className="font-sans text-[15px] text-[#5A5A5A] mt-1">
            per month
          </div>
        </div>

        {/* Feature list card */}
        <div className="w-full bg-[#F5EFE6] border border-[#E8E0D4] rounded-[14px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] mb-8 mt-8">
          <div className="font-sans text-[13px] text-[#5A5A5A] uppercase tracking-[0.12em] mb-4">
            Everything in Premium
          </div>
          <ul className="space-y-3">
            {[
              "Unlimited stories, every day",
              "Any age from 0 to 12 and beyond",
              "Any language",
              "Custom themes, settings, and characters",
              "Priority story generation",
              "Support independent artists directly"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start text-[#1F1F1F] text-[16px] font-sans">
                <span className="mr-3 text-[#E8A020] mt-[2px]">●</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Primary CTA button */}
        <button
          onClick={handleSubscribe}
          disabled={paying}
          className="w-full bg-[#E8A020] text-white font-sans font-semibold text-base py-4 rounded-[50px] hover:opacity-90 transition-opacity tracking-[0.4px] mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {paying ? 'Processing...' : 'Subscribe for $7.99 / month'}
        </button>

        {/* Secondary button */}
        <button
          onClick={handleBack}
          className="w-full bg-transparent border border-[#1F3A2E] text-[#1F3A2E] font-sans font-semibold text-base py-3.5 rounded-[50px] hover:bg-[#1F3A2E]/5 transition-colors mt-3"
        >
          Maybe later
        </button>

        {/* Trust line */}
        <p className="text-center font-sans text-[13px] text-[#5A5A5A] italic mt-6">
          Cancel anytime. No long-term commitment. Every Premium subscription supports independent artists and helps Lil Lanterns grow.
        </p>

      </div>
    </div>
  );
}
