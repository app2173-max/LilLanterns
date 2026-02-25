import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SubscribeSuccessPage() {
  const navigate = useNavigate();

  // Auto-redirect to home after 5000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#F5EFE6] relative overflow-hidden font-sans">
      {/* Background lantern watermark */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
        <img 
          src="/lantern-hero.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.06]"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-[480px] mx-auto px-6 py-16 flex flex-col items-center text-center">
        
        {/* Visual success indicator */}
        <div className="w-[72px] h-[72px] bg-[#1F3A2E] rounded-full flex items-center justify-center">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M20 6L9 17L4 12" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Text block */}
        <div className="mt-8">
          <div className="font-sans text-[13px] text-[#5A5A5A] uppercase tracking-[0.12em]">
            Premium activated
          </div>
          <h1 className="font-serif text-[28px] text-[#1F1F1F] font-bold leading-tight mt-3">
            Welcome to Premium.
          </h1>
          <p className="font-sans text-[17px] text-[#1F1F1F] leading-[1.6] mt-4">
            Your subscription is active. You now have unlimited stories, every language, every age, and the ability to support independent artists with every tale you tell.
          </p>
        </div>

        {/* CTA button */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#1F3A2E] text-white font-sans font-semibold text-base py-4 rounded-[50px] tracking-[0.4px] mt-10 hover:opacity-90 transition-opacity"
        >
          Start creating stories
        </button>

        {/* Trust line */}
        <p className="font-sans italic text-[13px] text-[#5A5A5A] mt-6">
          Cancel anytime from your account settings. Every story you generate supports our artist community.
        </p>

      </div>
    </div>
  );
}
