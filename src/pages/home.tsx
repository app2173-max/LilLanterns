import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: 'url(/lantern-hero.jpg)' }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#0B1340] opacity-55 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-[480px]">
          <h1 className="text-white font-serif font-bold text-4xl md:text-5xl leading-tight mb-4">
            Stories that teach what matters
          </h1>
          <p className="text-white/80 font-sans text-lg md:text-xl font-normal mb-8">
            Powered by AI, rooted in real artists, with your child at the center.
          </p>
          <Link 
            to="/builder"
            className="bg-[#1F3A2E] text-white font-sans font-semibold text-base px-8 py-3 rounded-full hover:bg-[#162921] transition-colors duration-300 tracking-wide"
          >
            Create a story
          </Link>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="bg-[#F5EFE6] w-full px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-[480px] space-y-4">
          
          {/* Card 1 */}
          <div className="bg-[#EADCA6] rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <h3 className="font-serif font-semibold text-xl text-[#1F1F1F] mb-1">
              Choose your theme.
            </h3>
            <p className="font-sans text-[#5A5A5A] text-base font-normal">
              You pick what matters.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#DCE8D5] rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <h3 className="font-serif font-semibold text-xl text-[#1F1F1F] mb-1">
              Choose your culture.
            </h3>
            <p className="font-sans text-[#5A5A5A] text-base font-normal">
              Stories that reflect your family.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F2D6C9] rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <h3 className="font-serif font-semibold text-xl text-[#1F1F1F] mb-1">
              Choose your storyteller.
            </h3>
            <p className="font-sans text-[#5A5A5A] text-base font-normal">
              Real creators, credited and compensated.
            </p>
          </div>

        </div>

        {/* Featured Story Section */}
        <div className="w-[calc(100%+3rem)] bg-[#F2D6C9] mt-12 py-10 flex flex-col items-center">
          <div className="max-w-[480px] w-full px-6">
            <h4 className="font-sans text-[11px] text-[#5A5A5A] tracking-[0.12em] font-semibold uppercase">
              FEATURED STORY
            </h4>
            <h2 className="font-serif text-[22px] text-[#1F1F1F] font-bold mt-2">
              Blockchain and the lost coins
            </h2>
            <p className="font-sans text-sm text-[#5A5A5A] mt-1">
              A manga-style story for teens, by Caito.
            </p>
            
            <div className="mt-4 w-full aspect-video rounded-[10px] bg-[#EADCA6] flex items-center justify-center">
              <span className="font-sans text-xs text-[#5A5A5A]">
                Story illustration coming soon
              </span>
            </div>

            <p className="font-sans text-base text-[#1F1F1F] leading-[1.8] mt-4">
              Kai had been staring at the same screen for three hours. The coins were gone. Not stolen, not lost exactly, but gone somewhere in the chain that no one could quite explain, not even Mr. Reyes, who taught computer science and usually had an answer for everything.
            </p>

            <Link 
              to="/story/caito-blockchain"
              className="mt-5 w-full rounded-full bg-[#1F3A2E] text-white font-sans font-semibold py-3 block text-center tracking-[0.4px]"
            >
              Read this story for free
            </Link>
          </div>
        </div>

        {/* Trust Line */}
        <div className="w-full max-w-[480px] mt-12 px-2">
          <p className="font-sans italic text-[#5A5A5A] text-sm text-center leading-relaxed">
            Every story is rooted in the work of a real human artist, credited and compensated every time their style inspires a new tale.
          </p>
        </div>
      </div>
    </div>
  );
}
