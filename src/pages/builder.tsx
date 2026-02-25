import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

const STORAGE_KEY_PREFIX = 'lil_lanterns_stories_';
const PREMIUM_KEY = 'lil_lanterns_premium_unlocked';
const PENDING_STEP_KEY = 'lil_lanterns_pending_step';
const PENDING_SELECTIONS_KEY = 'lil_lanterns_pending_selections';

function getTodayKey() {
  return STORAGE_KEY_PREFIX + new Date().toISOString().slice(0, 10);
}

function getStoriesTodayCount(): number {
  try {
    return parseInt(localStorage.getItem(getTodayKey()) || '0', 10);
  } catch { return 0; }
}

function incrementStoriesToday() {
  try {
    const key = getTodayKey();
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, String(current + 1));
  } catch {}
}

function isPremiumUnlocked(): boolean {
  try {
    return sessionStorage.getItem(PREMIUM_KEY) === 'true';
  } catch { return false; }
}
import { useAction, useConvexAuth } from 'convex/react';
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from '../../convex/_generated/api';

// Types
type AppState = 'building' | 'loading' | 'error' | 'story' | 'auth';
type AudioState = 'idle' | 'loading' | 'ready' | 'error';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface Selections {
  theme: string;
  world: string;
  age: string;
  childName: string;
  language: string;
  storytellerStyle: string;
  authorCredit: string;
}

interface StoryData {
  storyText: string;
  authorCredit: string;
  storyId?: string;
  [key: string]: any;
}

interface AuthScreenProps {
  onSuccess: (storyData: StoryData, selections: Selections) => void;
  onSkip: () => void;
}

function AuthScreen({ onSuccess, onSkip }: AuthScreenProps) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
      
      // On success
      const pendingStoryStr = sessionStorage.getItem('pendingStory');
      const pendingSelectionsStr = sessionStorage.getItem('pendingSelections');
      
      if (pendingStoryStr && pendingSelectionsStr) {
        onSuccess(JSON.parse(pendingStoryStr), JSON.parse(pendingSelectionsStr));
      } else {
        onSkip();
      }
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      if (errorMsg.includes('InvalidAccountId')) {
        setError('No account found. Please sign up instead.');
        setFlow('signUp');
      } else if (errorMsg.includes('AccountAlreadyExists')) {
        setError('This email is already registered. Please sign in.');
        setFlow('signIn');
      } else {
        setError('Could not ' + (flow === 'signIn' ? 'sign in' : 'sign up') + '. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: 'url(/lantern-hero.jpg)',
          backgroundSize: 'contain',
          opacity: 0.06
        }}
      />
      
      <div className="z-10 w-full max-w-[480px]">
        <h2 className="font-serif italic text-2xl text-[#1F1F1F] mb-6 text-center">
          Sign in to save this story to your collection.
        </h2>

        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[20px] shadow-sm border border-[#EADCA6]">
          <div className="flex bg-white rounded-full p-1 mb-6 border border-[#EADCA6]">
            <button
              onClick={() => { setFlow('signIn'); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                flow === 'signIn' 
                  ? 'bg-[#1F3A2E] text-white' 
                  : 'text-[#5A5A5A] hover:bg-[#F5EFE6]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setFlow('signUp'); setError(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                flow === 'signUp' 
                  ? 'bg-[#1F3A2E] text-white' 
                  : 'text-[#5A5A5A] hover:bg-[#F5EFE6]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#EADCA6] rounded-[10px] px-5 py-[14px] font-sans text-base text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D97757] transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#EADCA6] rounded-[10px] px-5 py-[14px] font-sans text-base text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D97757] transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-[#D97757] text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#162921] transition-colors disabled:opacity-70"
            >
              {loading ? 'Please wait...' : (flow === 'signIn' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={onSkip}
            className="font-sans text-[#5A5A5A] hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth State
  const { isAuthenticated } = useConvexAuth();

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [showClassicStyles, setShowClassicStyles] = useState(false);
  const [selections, setSelections] = useState<Selections>({
    theme: '',
    world: '',
    age: '',
    childName: '',
    language: '',
    storytellerStyle: '',
    authorCredit: ''
  });
  const [appState, setAppState] = useState<AppState>('building');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  // Illustration State
  const [showIllustrationPrompt, setShowIllustrationPrompt] = useState(false);
  const [showIllustrationConfirm, setShowIllustrationConfirm] = useState(false);
  
  // Audio State
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Restore pending state if returning from subscribe
  useEffect(() => {
    if (location.state && (location.state as any).pendingRestore) {
      const step = (location.state as any).step;
      const sels = (location.state as any).selections;
      if (step !== undefined) setCurrentStep(step);
      if (sels) setSelections(sels);
      setAppState('building');
      // Clear the navigation state so refresh doesn't re-apply it
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Convex Actions
  const generateStory = useAction(api.actions.processFlow_node_1771990793802_4t1vocr);
  const generateAudio = useAction(api.actions.processFlow_node_1771990793802_1d2zb6v);
  const saveStoryForUser = useAction(api.actions.processFlow_node_1772029303592_jnt2rbz);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.onended = null;
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Helpers
  const handleSelection = (field: keyof Selections, value: string, nextStep = true) => {
    setSelections(prev => ({ ...prev, [field]: value }));
    if (nextStep) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 5 && showClassicStyles) {
      setShowClassicStyles(false);
      return;
    }
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleStorytellerSelection = (style: string, credit: string) => {
    setSelections(prev => ({
      ...prev,
      storytellerStyle: style,
      authorCredit: credit
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleGenerateStory = async () => {
    // Limit check
    if (!isPremiumUnlocked() && getStoriesTodayCount() >= 1) {
      // Save builder state to restore after subscription
      try {
        sessionStorage.setItem(PENDING_STEP_KEY, String(currentStep));
        sessionStorage.setItem(PENDING_SELECTIONS_KEY, JSON.stringify(selections));
      } catch {}
      navigate('/subscribe');
      return;
    }

    setAppState('loading');
    try {
      const result: any = await generateStory({
        input: {
          theme: selections.theme,
          world: selections.world,
          age: selections.age,
          language: selections.language,
          childName: selections.childName,
          storytellerStyle: selections.storytellerStyle,
          authorCredit: selections.authorCredit
        }
      });

      if (result?.__error) {
        throw new Error(result.__error);
      }

      const doc = result.__result ?? result;
      if (doc) {
        let rawText: string = doc.storyText ?? '';

        // If the value looks like a JSON string, try to parse it and re-extract
        if (typeof rawText === 'string' && rawText.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(rawText);
            rawText = parsed.storyText ?? parsed.content ?? parsed.text ?? rawText;
          } catch {
            // Not valid JSON, continue with raw string
          }
        }

        // Strip any JSON syntax characters that may wrap the string
        // Remove leading/trailing braces, brackets, quotes
        rawText = rawText
          .replace(/^\s*[\{"\[]+/g, '')   // strip leading { " [
          .replace(/[\}"\]]+\s*$/g, '')   // strip trailing } " ]
          .replace(/^storyText\s*:\s*/i, '') // strip "storyText:" key prefix
          .replace(/^content\s*:\s*/i, '')   // strip "content:" key prefix
          .replace(/\\"/g, '"')              // unescape \" to "
          .replace(/\\\\n\\\\n/g, '\n\n')    // unescape \\n\\n to real newlines
          .replace(/\\\\n/g, '\n')           // unescape \\n to real newline
          .replace(/\\n\\n/g, '\n\n')        // unescape \n\n sequences
          .replace(/\\n/g, '\n')             // unescape \n sequences
          .trim();

        setStoryData({ ...doc, storyText: rawText });
        setAppState('story');
        incrementStoriesToday();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setAppState('error');
    }
  };

  const handleGenerateAudio = async () => {
    if (!storyData?.storyText) return;
    
    setAudioState('loading');
    try {
      const allParagraphs = storyData.storyText.split(/\n\n+/).filter(p => p.trim().length > 0);
      const truncatedText = allParagraphs.slice(0, 3).join('\n\n');

      const result: any = await generateAudio({
        input: {
          storyText: truncatedText
        }
      });

      if (result && result.__result) {
        // Assume result.__result is the base64 string
        const audioData = result.__result;
        const base64Audio = audioData.audioBase64 || audioData;
        
        // Handle case where result might be just the base64 string or an object with it
        let finalBase64 = typeof base64Audio === 'string' ? base64Audio : '';
        // If it's a raw base64 string from the backend
        if (!finalBase64 && typeof result.__result === 'string') {
           finalBase64 = result.__result;
        }

        const mimeType = audioData.mimeType ?? 'audio/mpeg';
        
        // Convert base64 to blob
        const byteCharacters = atob(finalBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        setAudioUrl(url);
        setAudioState('ready');
        
        // Initialize audio ref
        if (!audioRef.current) {
          audioRef.current = new Audio(url);
          audioRef.current.onended = () => setIsPlaying(false);
          audioRef.current.ontimeupdate = () => {
             if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          };
          audioRef.current.onloadedmetadata = () => {
             if (audioRef.current) setDuration(audioRef.current.duration);
          };
        } else {
          audioRef.current.src = url;
        }
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

  const handleReset = () => {
    // Cleanup audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    // Reset state
    setAudioState('idle');
    setIsPlaying(false);
    setStoryData(null);
    setSelections({
      theme: '',
      world: '',
      age: '',
      childName: '',
      language: '',
      storytellerStyle: '',
      authorCredit: ''
    });
    setCurrentStep(0);
    setShowClassicStyles(false);
    setAppState('building');
    setSaveStatus('idle');
    setShowIllustrationPrompt(false);
    setShowIllustrationConfirm(false);
    
    // Clear session storage
    sessionStorage.removeItem('pendingStory');
    sessionStorage.removeItem('pendingSelections');
    
    window.scrollTo(0, 0);
  };
  
  const handleSaveStory = async () => {
    if (!storyData) return;
    if (isAuthenticated) {
      setSaveStatus('saving');
      try {
        await saveStoryForUser({
          input: {
            storyId: storyData.storyId ?? '',
            theme: storyData.theme ?? '',
            world: storyData.world ?? '',
            age: storyData.age ?? '',
            language: storyData.language ?? '',
            storytellerStyle: storyData.storytellerStyle ?? '',
            authorCredit: storyData.authorCredit ?? '',
            storyText: storyData.storyText ?? ''
          }
        });
        setSaveStatus('saved');
        setShowIllustrationPrompt(true);
      } catch {
        setSaveStatus('error');
      }
    } else {
      // Store story in sessionStorage and navigate to auth screen
      sessionStorage.setItem('pendingStory', JSON.stringify(storyData));
      sessionStorage.setItem('pendingSelections', JSON.stringify(selections));
      setAppState('auth');
    }
  };

  const handleRequestIllustrations = () => {
    if (isAuthenticated) {
      setShowIllustrationConfirm(true);
    } else {
      // Store story in sessionStorage and navigate to auth screen
      if (storyData) {
        sessionStorage.setItem('pendingStory', JSON.stringify(storyData));
        sessionStorage.setItem('pendingSelections', JSON.stringify(selections));
      }
      setAppState('auth');
    }
  };

  // Format time for audio player
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Render Views
  const renderLoading = () => (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-15 animate-pulse-slow"
        style={{ 
          backgroundImage: 'url(/lantern-hero.jpg)',
          backgroundSize: 'contain',
          animation: 'pulse 2s infinite ease-in-out'
        }}
      />
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.10; }
          50% { opacity: 0.22; }
          100% { opacity: 0.10; }
        }
      `}</style>
      <div className="z-10 text-center px-6">
        <h2 className="font-serif text-2xl font-bold text-[#1F1F1F] mb-2">
          Your story is on its way...
        </h2>
        <p className="font-sans text-[#5A5A5A]">
          We are crafting something just for you.
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center px-6">
      <p className="font-sans text-[#1F1F1F] mb-6 text-center">
        Something went wrong. Please try again.
      </p>
      <button 
        onClick={handleGenerateStory}
        className="bg-[#1F3A2E] text-white font-sans font-semibold px-8 py-3 rounded-full hover:bg-[#162921] transition-colors"
      >
        Try again
      </button>
    </div>
  );

  const renderStory = () => {
    if (!storyData) return null;
    // Extract author name for credit card
    const authorName = storyData.authorCredit.replace('Inspired by ', '');
    
    // Split story text into paragraphs
    const paragraphs = storyData.storyText.split(/\n\n+/).filter(p => p.trim().length > 0);

    return (
      <div className="min-h-screen bg-[#F5EFE6] relative overflow-hidden">
        {/* Background Lantern */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
          style={{ 
            backgroundImage: 'url(/lantern-hero.jpg)',
            backgroundSize: '50%',
            backgroundPosition: 'center',
            opacity: 0.06
          }}
        />

        {/* Story Content */}
        <div className="relative z-10 max-w-[480px] mx-auto px-6 py-12 flex flex-col min-h-screen animate-in fade-in duration-[600ms] ease-in-out">
          
          {/* Title */}
          <h1 className="font-serif font-bold text-[26px] text-[#1F1F1F] mb-8 text-center leading-tight">
            A story for {selections.childName || "our little hero"}
          </h1>

          {/* Body */}
          <div className="font-sans text-[17px] text-[#1F1F1F] leading-[1.8] mb-12">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="mb-5 last:mb-0">
                {para}
              </p>
            ))}
          </div>

          {/* Artist Credit Card */}
          <div className="bg-[#F2D6C9] rounded-[10px] p-6 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
            <p className="font-sans italic text-[#5A5A5A] text-sm leading-relaxed">
              This story was inspired by {authorName}, a beloved classic author whose work is in the public domain. As Lil Lanterns grows, living artists will join our platform and earn royalties for every story their style inspires.
            </p>
          </div>

          {/* Button 1: Generate another story */}
          <button 
            onClick={handleReset}
            className="w-full bg-transparent border-2 border-[#1F3A2E] text-[#1F3A2E] font-sans font-semibold py-4 rounded-full tracking-[0.4px] hover:bg-[#1F3A2E] hover:text-white transition-colors mb-4"
          >
            Generate another story
          </button>

          {/* Button 2: Audio Section */}
          <div className="mb-4">
            {audioState === 'idle' && (
              <button 
                onClick={handleGenerateAudio}
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#162921] transition-colors"
              >
                Narrate this story
              </button>
            )}

            {audioState === 'loading' && (
              <button 
                disabled
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full opacity-80 cursor-wait"
              >
                Preparing your story...
              </button>
            )}

            {audioState === 'ready' && (
              <div className="w-full bg-[#1F3A2E] rounded-full p-2 flex items-center justify-between px-6 py-3 shadow-sm">
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
                <p className="font-sans text-[#5A5A5A] text-sm mb-2">
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
          </div>

          {/* Button 3: Save Story */}
          {saveStatus === 'idle' || saveStatus === 'error' ? (
            <div className="flex flex-col items-center">
              <button
                onClick={handleSaveStory}
                className="w-full bg-[#E8A020] text-white font-sans font-semibold py-4 rounded-full shadow-sm hover:bg-[#D48F18] transition-colors"
              >
                I love this story. Save it!
              </button>
              {saveStatus === 'error' && (
                 <p className="font-sans text-[#D97757] text-sm mt-2">
                   Something went wrong. Try again.
                 </p>
              )}
            </div>
          ) : saveStatus === 'saving' ? (
             <button
               disabled
               className="w-full bg-[#E8A020] text-white font-sans font-semibold py-4 rounded-full shadow-sm opacity-80 cursor-wait"
             >
               Saving...
             </button>
          ) : saveStatus === 'saved' ? (
             <div className="text-center py-2">
               <p className="font-sans italic text-[#5A5A5A]">
                 Story saved to your collection.
               </p>
               {showIllustrationPrompt && (
                 <div style={{ background: '#DCE8D5', borderRadius: 10, padding: '24px', marginTop: '16px' }}>
                   <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 20, color: '#1F1F1F', marginBottom: 8 }}>
                     Bring this story to life.
                   </h2>
                   <p style={{ fontFamily: 'DM Sans', color: '#5A5A5A', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                     Our artists can create original illustrations for your story, drawn by hand and inspired by the characters in this tale. Each illustration is unique and made just for you.
                   </p>
                   
                   {/* Button 1: Request illustrations */}
                   <button
                     onClick={handleRequestIllustrations}
                     className="w-full bg-[#1F3A2E] text-white font-sans font-semibold rounded-full py-3 text-[15px] tracking-[0.4px] mb-3"
                   >
                     Request illustrations
                   </button>
                   
                   {/* Button 2: Maybe later */}
                   <button
                     onClick={() => setShowIllustrationPrompt(false)}
                     className="w-full text-center font-sans text-[#5A5A5A] text-[14px] py-2 cursor-pointer"
                   >
                     Maybe later
                   </button>
                 </div>
               )}
             </div>
          ) : null}

        </div>
      </div>
    );
  };

  const renderIllustrationConfirm = () => (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: 'url(/lantern-hero.jpg)',
          backgroundSize: 'contain',
          opacity: 0.06
        }}
      />
      
      <div className="z-10 w-full max-w-[480px] mx-auto text-center">
        <h2 className="font-serif font-semibold text-[22px] text-[#1F1F1F] leading-[1.4] mb-8">
          Your illustration request has been received. Our artist will be in touch within 48 hours.
        </h2>
        
        <button
          onClick={() => setShowIllustrationConfirm(false)}
          className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-3 rounded-full text-[15px] tracking-[0.4px]"
        >
          Back to my stories
        </button>
      </div>
    </div>
  );

  const renderAuth = () => (
    <AuthScreen
      onSuccess={(pendingStory, pendingSelections) => {
        setStoryData(pendingStory);
        setSelections(pendingSelections);
        saveStoryForUser({ input: { 
          storyId: pendingStory.storyId ?? '',
          theme: pendingStory.theme ?? '',
          world: pendingStory.world ?? '',
          age: pendingStory.age ?? '',
          language: pendingStory.language ?? '',
          storytellerStyle: pendingStory.storytellerStyle ?? '',
          authorCredit: pendingStory.authorCredit ?? '',
          storyText: pendingStory.storyText ?? ''
        } })
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('error'));
        sessionStorage.removeItem('pendingStory');
        sessionStorage.removeItem('pendingSelections');
        setAppState('story');
      }}
      onSkip={() => setAppState('story')}
    />
  );

  // Builder Steps Logic
  const getStepContent = () => {
    switch (currentStep) {
      case 0: { // Theme
        const themes = [
          { title: "Environmental responsibility", desc: "Caring for our planet." },
          { title: "Blockchain and technology", desc: "How trust works in a digital world." },
          { title: "Personal finance", desc: "Saving, spending, and the value of money." },
          { title: "Emotional intelligence", desc: "Knowing and managing your own feelings." },
          { title: "Coding and problem solving", desc: "Thinking in steps to solve challenges." },
          { title: "Cultural heritage", desc: "Celebrating where we come from." },
          { title: "Empathy", desc: "Understanding how others feel." }
        ];
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <h1 className="font-serif font-bold text-3xl mb-8 text-[#1F1F1F]">What should this story teach?</h1>
            <div className="space-y-4">
              {themes.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelection('theme', item.title)}
                  className="bg-white p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-md transition-shadow"
                >
                  <h3 className="font-sans font-semibold text-lg text-[#1F1F1F] mb-1">{item.title}</h3>
                  <p className="font-sans text-[#5A5A5A] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 1: { // World
          const worlds = [
            "Outer space", "The ocean", "Ancient Mexico", "Feudal Japan", "India", 
            "The American West", "West Africa", "The Amazon rainforest", "Ancient Greece", 
            "A small town in America", "The Arctic", "The African savanna", "A magical forest"
          ];
          return (
            <div className="animate-in slide-in-from-right duration-300">
              <h1 className="font-serif font-bold text-3xl mb-8 text-[#1F1F1F]">Choose a world for your story.</h1>
              <div className="grid grid-cols-1 gap-3">
                {worlds.map((world, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelection('world', world)}
                    className="bg-white p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-md transition-shadow flex items-center"
                  >
                    <span className="font-sans font-semibold text-base text-[#1F1F1F]">{world}</span>
                  </div>
                ))}

                <div className="pointer-events-none cursor-default select-none opacity-70">
                  <div className="bg-[#EDE6DC] p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
                    <span className="font-sans font-semibold text-base text-[#5A5A5A] block">Create your own world</span>
                    <span className="font-sans italic text-sm text-[#5A5A5A] block">Coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        case 2: { // Age
          const ages = ["0 to 3 years", "3 to 6 years", "6 to 9 years", "9 to 12 years"];
          return (
            <div className="animate-in slide-in-from-right duration-300">
              <h1 className="font-serif font-bold text-3xl mb-8 text-[#1F1F1F]">How old is your child?</h1>
              <div className="space-y-4">
                {ages.map((age, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelection('age', age)}
                    className="bg-white p-6 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-md transition-shadow text-center"
                  >
                    <span className="font-sans font-semibold text-xl text-[#1F1F1F]">{age}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        case 3: // Child Name
          return (
            <div className="animate-in slide-in-from-right duration-300">
              <h1 className="font-serif font-bold text-3xl mb-8 text-[#1F1F1F]">Who is this story dedicated to?</h1>
              <input 
                type="text" 
                placeholder="Leave blank and we will call them our little hero."
                value={selections.childName}
                onChange={(e) => setSelections({...selections, childName: e.target.value})}
                className="w-full bg-white border border-[#EADCA6] rounded-[10px] px-5 py-[14px] font-sans text-base text-[#1F1F1F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#D97757] transition-colors mb-4"
              />
              
              <div className="w-full bg-[rgba(90,90,90,0.08)] rounded-full py-2 px-4 text-center opacity-70 pointer-events-none cursor-default mb-8">
                <span className="font-sans text-sm text-[#5A5A5A]">Add your child as the hero, coming soon</span>
              </div>

              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full hover:bg-[#162921] transition-colors"
              >
                Continue
              </button>
            </div>
          );

      case 4: { // Language
        const languages = [
          "English", "Spanish", "Mandarin", "Vietnamese", "Arabic", 
          "French", "Korean", "Portuguese", "Russian", "Hindi"
        ];
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <h1 className="font-serif font-bold text-3xl mb-8 text-[#1F1F1F]">In which language?</h1>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelection('language', lang)}
                  className="bg-white p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center text-center h-16"
                >
                  <span className="font-sans font-semibold text-base text-[#1F1F1F]">{lang}</span>
                </div>
              ))}

              <div className="pointer-events-none cursor-default select-none opacity-70">
                <div className="bg-[#F0EBDA] p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center text-center h-16">
                  <span className="font-sans font-semibold text-base text-[#5A5A5A] leading-none mb-1">Quechua</span>
                  <span className="font-sans italic text-sm text-[#5A5A5A] leading-none">Coming soon</span>
                </div>
              </div>

              <div className="pointer-events-none cursor-default select-none opacity-70">
                <div className="bg-[#F0EBDA] p-4 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center text-center h-16">
                  <span className="font-sans font-semibold text-base text-[#5A5A5A] leading-none mb-1">Nahuatl</span>
                  <span className="font-sans italic text-sm text-[#5A5A5A] leading-none">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 5: { // Storyteller
        const classicStorytellers = [
          {
            style: "Gentle, warm, nature-filled storytelling. Small heroes face meaningful challenges with quiet courage. The world is kind, detailed, and full of wonder.",
            credit: "Inspired by Beatrix Potter"
          },
          {
            style: "Rhythmic, culturally rich narratives with the feel of an oral tradition. Stories that pulse with energy, curiosity, and a vivid sense of place.",
            credit: "Inspired by Rudyard Kipling"
          },
          {
            style: "Poetic, emotionally resonant tales where the world holds both beauty and difficulty. Life lessons emerge naturally, never announced, always felt.",
            credit: "Inspired by Hans Christian Andersen"
          }
        ];
        return (
          <div className="animate-in slide-in-from-right duration-300">
            <h1 className="font-serif font-bold text-3xl mb-2 text-[#1F1F1F]">Choose your storyteller.</h1>
            <p className="font-sans italic text-[#5A5A5A] text-sm mb-8">
              Lil Lanterns works with real artists and authors who contribute original content to our platform. Every story inspired by their style generates a royalty paid directly to them. We are currently onboarding our first two creators.
            </p>
            
            {!showClassicStyles ? (
              <div className="space-y-4">
                {/* Card 1 — Caito */}
                <Link 
                  to="/story/caito-blockchain"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  className="bg-[#F2D6C9] rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer flex flex-col items-center w-full"
                >
                  {/* Avatar circle */}
                  <div className="w-[80px] h-[80px] bg-[#1F1F1F] rounded-full flex items-center justify-center mb-3 overflow-hidden ring-2 ring-[#E8A020]">
                    <span className="font-serif font-bold text-[32px] text-white">C</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-serif font-bold text-[20px] text-[#1F1F1F] text-center mt-2 mb-2">Caito</h3>

                  {/* Description */}
                  <p className="font-sans text-[14px] text-[#5A5A5A] text-center leading-relaxed mt-1 mb-3">
                    Bold, expressive storytelling inspired by Japanese manga. Dynamic characters and narratives that make complex ideas visual and unforgettable.
                  </p>

                  {/* Badge 1 */}
                  <div className="bg-[#E8A020] text-white font-sans font-semibold text-[12px] px-3 py-1 rounded-full mb-3">
                    Featured artist.
                  </div>

                  {/* Badge 2 */}
                  <div 
                    className="bg-[#1F3A2E] text-white font-sans font-semibold text-[12px] px-4 py-[6px] rounded-full inline-block"
                  >
                    Read a featured story.
                  </div>
                </Link>

                {/* Card 2 — Coming soon */}
                <div className="bg-[#EDE6DC] rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] pointer-events-none cursor-default select-none opacity-70 flex flex-col items-center w-full">
                  <div className="w-[72px] h-[72px] bg-[#D8D0C8] rounded-full flex items-center justify-center mb-3">
                    <span className="font-serif font-bold text-[28px] text-[#8A8A8A]">?</span>
                  </div>
                  <h3 className="font-serif font-bold text-[20px] text-[#8A8A8A] text-center mt-3 mb-2">Coming soon</h3>
                  <p className="font-sans text-[14px] text-[#8A8A8A] text-center leading-relaxed mt-2">
                    A new voice joining our platform. Stay tuned.
                  </p>
                  <div className="mt-3 bg-[#A0A0A0] text-white font-sans font-semibold text-[12px] px-3 py-1 rounded-full">
                    Coming soon
                  </div>
                </div>

                {/* Card 3 — Explore classic styles */}
                <div 
                  onClick={() => setShowClassicStyles(true)}
                  className="bg-[#F2D6C9] rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer flex flex-col items-center w-full text-center"
                >
                  <h3 className="font-serif font-bold text-[20px] text-[#1F1F1F] mb-2">Explore classic styles</h3>
                  <p className="font-sans text-[14px] text-[#5A5A5A] mt-2 leading-relaxed">
                    Stories inspired by beloved authors in the public domain, available to all users while we grow our artist community.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div 
                  onClick={() => setShowClassicStyles(false)}
                  className="font-sans text-[14px] text-[#5A5A5A] cursor-pointer mb-4 inline-block hover:underline"
                >
                  Back to all storytellers
                </div>
                
                <div className="space-y-4">
                  {classicStorytellers.map((teller, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleStorytellerSelection(teller.style, teller.credit)}
                      className="bg-[#F2D6C9] p-5 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.07)] cursor-pointer hover:shadow-md transition-shadow w-full"
                    >
                      <p className="font-sans text-[15px] text-[#1F1F1F] mb-3 leading-relaxed">
                        {teller.style}
                      </p>
                      <p className="font-sans italic text-[13px] text-[#5A5A5A]">
                        {teller.credit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 6: // Action Screen
        return (
          <div className="animate-in slide-in-from-right duration-300">
             <button 
               onClick={handleGenerateStory}
               className="w-full bg-[#1F3A2E] text-white font-sans font-semibold py-4 rounded-full shadow-lg hover:bg-[#162921] transition-colors"
             >
               Generate my story
             </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine Background Color for current step
  const getBackgroundColor = () => {
    if (appState !== 'building') return '#F5EFE6';
    // Steps: 0, 2, 4 = #EADCA6
    // Steps: 1, 3, 6 = #F5EFE6
    // Step: 5 = #F2D6C9
    if ([0, 2, 4].includes(currentStep)) return '#EADCA6';
    if ([1, 3, 6].includes(currentStep)) return '#F5EFE6';
    if (currentStep === 5) return '#F2D6C9';
    return '#F5EFE6';
  };

  const renderBuilder = () => (
    <div 
      className="min-h-screen transition-colors duration-500 ease-in-out flex flex-col items-center"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Progress Bar - Only visible when building */}
      {appState === 'building' && (
        <div className="w-full h-1 bg-[#EADCA6] fixed top-0 left-0 z-50">
          <div 
            className="h-full bg-[#1F3A2E] transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[480px] px-6 py-8 relative min-h-screen flex flex-col">
        
        {/* Back Arrow */}
        {appState === 'building' && currentStep > 0 && (
          <button 
            onClick={handleBack}
            className="absolute top-8 left-6 text-[#1F1F1F] hover:opacity-70 transition-opacity p-2 -ml-2"
            aria-label="Go back"
          >
            <span className="text-xl">←</span>
          </button>
        )}

        {/* Content Area */}
        <div className="mt-12 flex-1" key={currentStep}>
          {getStepContent()}
        </div>
        
      </div>
    </div>
  );

  return (
    <>
      {appState === 'auth' ? renderAuth() :
       appState === 'loading' ? renderLoading() :
       appState === 'error' ? renderError() :
       showIllustrationConfirm ? renderIllustrationConfirm() :
       appState === 'story' && storyData ? renderStory() :
       renderBuilder()}
    </>
  );
}
