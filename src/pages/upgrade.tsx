import { useNavigate } from 'react-router';

export default function UpgradePage() {
  const navigate = useNavigate();

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

      {/* Content container */}
      <div className="relative z-10 max-w-[480px] mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Top section */}
        <div className="text-center mb-8">
          <div className="font-sans text-[13px] text-[#5A5A5A] uppercase tracking-[0.12em] mb-4">
            Free Plan
          </div>
          <h1 className="font-serif text-[28px] text-[#1F1F1F] leading-tight mb-4">
            You've created your story for today ✨
          </h1>
          <p className="font-sans text-[17px] text-[#1F1F1F] leading-[1.6]">
            On the Free plan, you can generate one magical story per day. Come back tomorrow for another adventure — or unlock unlimited storytelling with Premium.
          </p>
        </div>

        {/* Feature Comparison Card */}
        <div className="w-full bg-white rounded-[14px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] grid grid-cols-2 gap-4 mb-8">
          
          {/* Left column — Free */}
          <div className="flex flex-col">
            <div className="font-serif text-[16px] text-[#1F1F1F] font-bold mb-1">
              Free
            </div>
            <div className="font-sans text-[22px] text-[#1F1F1F] font-bold mb-4">
              $0
            </div>
            <ul className="space-y-2">
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                1 story per day
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Standard generation
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Limited age customization
              </li>
            </ul>
          </div>

          {/* Right column — Premium */}
          <div className="flex flex-col bg-[#FFF4DF] rounded-[10px] p-3">
            <div className="font-serif text-[16px] text-[#1F1F1F] font-bold mb-1">
              Premium
            </div>
            <div className="font-sans text-[22px] text-[#E8A020] font-bold mb-4">
              $7.99 / month
            </div>
            <ul className="space-y-2">
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Unlimited stories
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Any age (3 to 12+)
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Any language
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Custom themes and settings
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Priority generation
              </li>
              <li className="flex items-start text-[#5A5A5A] text-[14px] font-sans">
                <span className="mr-2">•</span>
                Support independent artists
              </li>
            </ul>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={() => navigate('/subscribe')}
          className="w-full bg-[#E8A020] text-white font-sans font-semibold text-base py-4 rounded-[50px] hover:opacity-90 transition-opacity tracking-[0.4px] mb-4"
        >
          Upgrade to Premium — $7.99/month
        </button>

        {/* Secondary Button */}
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="w-full bg-transparent border-2 border-[#1F3A2E] text-[#1F3A2E] font-sans font-semibold text-base py-3.5 rounded-[50px] hover:bg-[#1F3A2E]/5 transition-colors mb-8"
        >
          Maybe tomorrow
        </button>

        {/* Trust line */}
        <p className="text-center font-sans text-[13px] text-[#5A5A5A] italic">
          Cancel anytime. No long-term commitment. Premium helps support independent artists and keeps Lil Lanterns growing.
        </p>

      </div>
    </div>
  );
}
