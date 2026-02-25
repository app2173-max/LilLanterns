import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAction, useConvexAuth } from 'convex/react';
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from '../../convex/_generated/api';

const storyParagraphs = [
  "Mei Tsūka is a young programmer who, trying to face her own demons, will end up challenging the demons of a corrupt system with an invention that will forever change the way we relate to each other.",
  "On October 31st, 2008, Bitcoin was born as the alternative to transform finance into a decentralized and more transparent system. \"The Fountain of Bitcoin\" is a fictional journey full of mystery, magic, terror and love that leads Mei Tsūka, a programmer with problems to socialize, to become Satoshi Nakamoto.",
  "Chapter 1.",
  "Mei Tsūka clutches her sword, while looking at the demons that, like shadows eating away at the light, surround her on every flank. Her arms feel heavy. It is the weariness of a battle that seems to have no end.",
  "* * *",
  "\"Hello!\"",
  "Their gazes met for a second, snapping Mei out of the trance she was in. She immediately looked down at her keyboard.",
  "\"My name is Taro, I'm new in the office and everyone told me to come with you if I have questions...\"",
  "A few feet away, a group of idiots laugh at the joke. Mei Tsūka could never get over her muteness and social phobia enough to answer him.",
  "\"Kind of shy, huh... You know what? Never mind, I think we're going to be friends. Between you and me, I don't like them either.\"",
  "Mei blushes like a tomato, her big plastic-framed glasses fogging up until her eyes are out of sight. Someday, could she stop being the way she is? Someday, could she stop being so her?",
  "Mei walks alone to the exit. She prefers to wait minutes, even hours, after working hours so that she does not have to say goodbye or greet anyone. As she passes the fountain at the main entrance of the building, the glow catches her eye.",
  "They are the coins that Tokyoites throw to make a wish. She hurries to search in the large pockets of her coat and finds a small one-yen coin. With her small hands, almost praying, she asks quietly, \"I wish I wasn't so me,\" and tosses it.",
  "Mei does not know it, but with that small gesture she is about to change her life and the world as we know it.",
  "In a few days her routine begins to change. When passing by the fountain, Mei does not forget to throw her coin and always makes the same wish. At the same time, her friendship with Taro grows stronger and funnier.",
  "Taro does not expect any answer from her, but he always tries to surprise her and talk about everything Mei cannot because of her phobias and shyness."
];

export default function CaitoStoryPage() {
  // State
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [customize, setCustomize] = useState(false);
  
  // Auth State
  const [authFlow, setAuthFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Hooks
  const generateAudio = useAction(api.actions.processFlow_node_1771990793802_1d2zb6v);
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.onended = null;
        audioRef.current.ontimeupdate = null;
        audioRef.current.onloadedmetadata = null;
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const handleNarrate = async () => {
    setAudioState('loading');
    try {
      // Take first 3 non-empty paragraphs
      const textToNarrate = storyParagraphs
        .filter(p => p.trim().length > 0)
        .slice(0, 3)
        .join('\n\n');

      const result: any = await generateAudio({
        input: {
          storyText: textToNarrate
        }
      });

      if (result && result.__result) {
        const audioData = result.__result;
        let finalBase64 = typeof audioData === 'string' ? audioData : (audioData.audioBase64 || '');
        
        if (!finalBase64 && typeof result.__result === 'string') {
           finalBase64 = result.__result;
        }

        const mimeType = (typeof audioData === 'object' && audioData.mimeType) ? audioData.mimeType : 'audio/mpeg';
        
        // Convert base64 to blob
        const byteCharacters = atob(finalBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        audioUrlRef.current = url;
        
        if (!audioRef.current) {
          audioRef.current = new Audio(url);
        } else {
          audioRef.current.src = url;
        }

        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.ontimeupdate = () => {
           if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        };
        audioRef.current.onloadedmetadata = () => {
           if (audioRef.current) setDuration(audioRef.current.duration);
        };

        setAudioState('ready');
      } else {
        throw new Error('Invalid audio response');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setAudioState('error');
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", authEmail);
      formData.append("password", authPassword);
      formData.append("flow", authFlow);
      await signIn("password", formData);
      
      navigate('/builder');
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      if (errorMsg.includes('InvalidAccountId')) {
        setAuthError('No account found. Please sign up instead.');
        setAuthFlow('signUp');
      } else if (errorMsg.includes('AccountAlreadyExists')) {
        setAuthError('This email is already registered. Please sign in.');
        setAuthFlow('signIn');
      } else {
        setAuthError('Could not ' + (authFlow === 'signIn' ? 'sign in' : 'sign up') + '. Please try again.');
      }
      setAuthLoading(false);
    }
  };

  // If customizing, show premium auth view
  if (customize) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center relative overflow-hidden">
        <img 
          src="/lantern-hero.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none z-0"
        />
        
        <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
          {/* Badge + Message */}
          <div className="mb-8">
            <span className="inline-block bg-[#E8A020] text-white font-sans font-semibold text-[12px] px-3 py-1 rounded-full mr-3 align-middle">
              Premium
            </span>
            <span className="font-serif italic text-[22px] text-[#1F1F1F] align-middle leading-tight">
              Subscribe to premium to generate a personalized version of this story for any age, language, or setting.
            </span>
          </div>

          {/* Auth Form */}
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[20px] shadow-sm border border-[#EADCA6]">
            <div className="flex bg-white rounded-full p-1 mb-6 border border-[#EADCA6]">
              <button
                onClick={() => { setAuthFlow('signIn'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  authFlow === 'signIn' 
                    ? 'bg-[#1F3A2E] text-white' 
                    : 'text-[#5A5A5A] hover:bg-[#F5EFE6]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthFlow('signUp'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                  authFlow === 'signUp' 
                    ? 'bg-[#1F3A2E] text-white' 
                    : 'text-[#5A5A5A] hover:bg-[#F5EFE6]'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white border border-[#EADCA6] rounded-[10px] px-5 py-[14px] font-sans text-base text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D97757] transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white border border-[#EADCA6] rounded-[10px] px-5 py-[14px] font-sans text-base text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D97757] transition-colors"
                  required
                />
              </div>

              {authError && (
                <p className="text-[#D97757] text-sm text-center">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#162921] transition-colors disabled:opacity-70"
              >
                {authLoading ? 'Please wait...' : (authFlow === 'signIn' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setCustomize(false)}
              className="font-sans text-[#5A5A5A] hover:underline"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Story View
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#1F3A2E] w-full px-6 py-3">
        <div className="max-w-[480px] mx-auto flex items-start justify-between gap-4">
          <p className="font-sans text-[13px] text-white">
            This is a featured story by Caito. It is written for ages 9 to 12. To generate a version for a different age, subscribe to our monthly premium plan.
          </p>
          <Link 
            to="/subscribe" 
            className="bg-[#E8A020] text-white rounded-full px-3 py-1 text-[12px] font-sans font-semibold whitespace-nowrap flex-shrink-0"
          >
            Go premium
          </Link>
        </div>
      </div>

      {/* Page Body */}
      <div className="bg-[#F5EFE6] relative overflow-hidden flex-grow">
        <img 
          src="/lantern-hero.jpg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none z-0"
        />

        <div className="relative z-10 max-w-[480px] mx-auto px-6 py-10">
          
          {/* Artist Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-[72px] h-[72px] rounded-full bg-[#1F1F1F] flex items-center justify-center mx-auto mb-3 ring-2 ring-[#E8A020]">
              <span className="font-serif font-bold text-[28px] text-white">C</span>
            </div>
            <h3 className="font-serif font-bold text-[18px] text-[#1F1F1F] text-center">Caito</h3>
            <p className="font-sans italic text-[13px] text-[#5A5A5A] text-center mt-1">Featured artist</p>
          </div>

          {/* Story Title */}
          <h1 className="font-serif text-[26px] font-bold text-[#1F1F1F] mb-6">
            The Fountain of Bitcoin
          </h1>

          {/* Story Body */}
          <div className="font-sans text-[17px] text-[#1F1F1F] leading-[1.8]">
            {storyParagraphs.map((para, idx) => {
              // Special styling for separators or chapter headers
              if (para === "* * *" || para === "Chapter 1.") {
                return (
                  <p key={idx} className="mb-[20px] text-center italic text-[#5A5A5A]">
                    {para}
                  </p>
                );
              }
              // Dialogue styling (simple heuristic: starts with quote)
              if (para.trim().startsWith('"')) {
                return (
                  <p key={idx} className="mb-[20px] italic">
                    {para}
                  </p>
                );
              }
              // Normal paragraph
              return (
                <p key={idx} className="mb-[20px]">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Artist Credit Card */}
          <div className="bg-[#F2D6C9] rounded-[10px] p-5 mt-8 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <p className="font-sans italic text-[13px] text-[#5A5A5A]">
              This story was written and contributed by Caito, an Argentine independent artist and creator on the Lil Lanterns platform. Caito earns a royalty every time this story is read or inspires a personalized generation.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            {/* Button 1: Customize */}
            <button
              onClick={() => navigate('/subscribe')}
              className="w-full bg-[#E8A020] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#D48F18] transition-colors tracking-[0.4px]"
            >
              Customize this story for my child.
            </button>

            {/* Button 2: Narrate */}
            {audioState === 'idle' && (
              <button
                onClick={handleNarrate}
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#162921] transition-colors tracking-[0.4px]"
              >
                Narrate this story.
              </button>
            )}

            {audioState === 'loading' && (
              <button
                disabled
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full opacity-80 cursor-wait tracking-[0.4px]"
              >
                Preparing your story...
              </button>
            )}

            {audioState === 'ready' && (
              <div className="w-full bg-[#1F3A2E] rounded-full flex items-center justify-between px-6 py-3 shadow-sm">
                <button 
                   onClick={togglePlayback}
                   className="text-white hover:text-gray-200 focus:outline-none"
                 >
                   {isPlaying ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                       <rect x="6" y="4" width="4" height="16" rx="1" />
                       <rect x="14" y="4" width="4" height="16" rx="1" />
                     </svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                       <path d="M5 3l14 9-14 9V3z" />
                     </svg>
                   )}
                 </button>
                 <span className="font-sans text-white text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                 </span>
              </div>
            )}

            {audioState === 'error' && (
              <div className="text-center">
                <p className="font-sans text-[#5A5A5A] text-sm mb-2 italic">
                  Narration is unavailable right now. Please try again.
                </p>
                <button 
                  onClick={() => setAudioState('idle')}
                  className="text-[#1F3A2E] underline text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Button 3: Back */}
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-transparent border-2 border-[#1F3A2E] text-[#1F3A2E] font-sans font-semibold py-4 rounded-full hover:bg-[#1F3A2E] hover:text-white transition-colors tracking-[0.4px]"
            >
              Back to story builder.
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
