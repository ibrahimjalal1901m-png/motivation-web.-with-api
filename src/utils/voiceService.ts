/**
 * ASPIRE WORK — Executive Voice & Speech Assistant Service
 *
 * Manages Gemini Neural Audio (WAV 24kHz), Web Speech synthesis fallback,
 * and Browser Speech Recognition with state notifications.
 */

export interface VoiceSettings {
  autoSpeak: boolean;
  voiceName: 'Charon' | 'Fenrir' | 'Puck' | 'browser';
  speed: number; // 0.8, 1.0, 1.2
  volume: number; // 0 to 1
  language: 'en' | 'ur';
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  autoSpeak: true,
  voiceName: 'Charon', // Deep Masculine Baritone
  speed: 1.0,
  volume: 0.95,
  language: 'en',
};

const VOICE_SETTINGS_KEY = 'aspire_voice_settings_v2';

export class VoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private currentMessageId: string | null = null;
  private recognition: any = null;
  private isListening = false;
  private onStateChange: ((state: { isSpeaking: boolean; isPaused: boolean; currentMessageId: string | null }) => void) | null = null;
  private onRecognitionStateChange: ((listening: boolean, interim: string, error?: string) => void) | null = null;

  private settings: VoiceSettings = DEFAULT_VOICE_SETTINGS;

  constructor() {
    this.loadSettings();
  }

  public loadSettings(): VoiceSettings {
    try {
      const stored = localStorage.getItem(VOICE_SETTINGS_KEY);
      if (stored) {
        this.settings = { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      this.settings = DEFAULT_VOICE_SETTINGS;
    }
    return this.settings;
  }

  public saveSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    if (this.currentAudio) {
      this.currentAudio.volume = this.settings.volume;
      this.currentAudio.playbackRate = this.settings.speed;
    }
    return this.settings;
  }

  public getSettings(): VoiceSettings {
    return this.settings;
  }

  public registerStateListener(cb: (state: { isSpeaking: boolean; isPaused: boolean; currentMessageId: string | null }) => void) {
    this.onStateChange = cb;
  }

  public registerRecognitionListener(cb: (listening: boolean, interim: string, error?: string) => void) {
    this.onRecognitionStateChange = cb;
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange({
        isSpeaking: this.isSpeaking,
        isPaused: this.isPaused,
        currentMessageId: this.currentMessageId,
      });
    }
  }

  /**
   * Stop any playing audio immediately
   */
  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentMessageId = null;
    this.notify();
  }

  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPaused = true;
      this.notify();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.isPaused = false;
      this.notify();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  /**
   * Speak a message using Neural Audio URI or browser SpeechSynthesis fallback.
   * Supports English ('en') and Urdu ('ur') speech synthesis.
   */
  public async speakMessage(
    messageId: string,
    text: string,
    audioDataUri?: string | null,
    language?: 'en' | 'ur'
  ): Promise<boolean> {
    // Stop any previous audio first
    this.stop();

    if (!text || text.trim().length === 0) return false;

    this.currentMessageId = messageId;
    this.isSpeaking = true;
    this.isPaused = false;
    this.notify();

    // 1. Try playing neural audio (WAV data URI)
    if (audioDataUri && audioDataUri.startsWith('data:audio/')) {
      try {
        const audio = new Audio(audioDataUri);
        this.currentAudio = audio;
        audio.volume = this.settings.volume;
        audio.playbackRate = this.settings.speed;

        audio.onended = () => {
          this.isSpeaking = false;
          this.isPaused = false;
          this.currentMessageId = null;
          this.currentAudio = null;
          this.notify();
        };

        audio.onerror = () => {
          console.warn('Audio element error, falling back to browser speech synthesis');
          this.speakWithBrowserFallback(text, language);
        };

        await audio.play();
        return true;
      } catch (err: any) {
        console.warn('Autoplay blocked or audio failed:', err?.message);
        // Autoplay policy or format error -> try browser fallback
        return this.speakWithBrowserFallback(text, language);
      }
    }

    // 2. Browser SpeechSynthesis fallback
    return this.speakWithBrowserFallback(text, language);
  }

  private speakWithBrowserFallback(rawText: string, language?: 'en' | 'ur'): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeaking = false;
      this.notify();
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text of markdown characters
      const cleanText = rawText
        .replace(/(\*\*|\*|`|#|>|\[.*?\]\(.*?\))/g, '')
        .replace(/•|\-/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = this.settings.speed;
      utterance.volume = this.settings.volume;

      const isUrdu =
        language === 'ur' ||
        /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(cleanText);

      const voices = window.speechSynthesis.getVoices();

      if (isUrdu) {
        utterance.lang = 'ur-PK';
        utterance.pitch = 0.95; // Clear natural Urdu pitch
        // Find Urdu voice or compatible regional voice
        const urduVoice =
          voices.find((v) => v.lang.startsWith('ur') || v.lang.includes('ur')) ||
          voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('hi'));
        if (urduVoice) {
          utterance.voice = urduVoice;
        }
      } else {
        utterance.lang = 'en-US';
        utterance.pitch = 0.84; // Deep masculine pitch
        // Select deep English voice if available
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('david') ||
              v.name.toLowerCase().includes('george') ||
              v.name.toLowerCase().includes('guy'))
        );
        if (preferred) {
          utterance.voice = preferred;
        }
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentMessageId = null;
        this.notify();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentMessageId = null;
        this.notify();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      this.isSpeaking = false;
      this.notify();
      return false;
    }
  }

  /**
   * Start Speech-to-Text Speech Recognition.
   * Supports 'en-US' and 'ur-PK' (Urdu).
   */
  public startSpeechRecognition(
    onResult: (finalText: string) => void,
    onInterim: (interimText: string) => void,
    lang: string = 'en-US'
  ) {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (this.onRecognitionStateChange) {
        this.onRecognitionStateChange(
          false,
          '',
          'Speech recognition is not supported in this browser. Please type your message.'
        );
      }
      return;
    }

    // Stop current recognition if active
    this.stopSpeechRecognition();

    try {
      const recognition = new SpeechRecognition();
      this.recognition = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang.startsWith('ur') ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        this.isListening = true;
        if (this.onRecognitionStateChange) {
          this.onRecognitionStateChange(true, '');
        }
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          onInterim(interim);
          if (this.onRecognitionStateChange) {
            this.onRecognitionStateChange(true, interim);
          }
        }

        if (final) {
          onResult(final.trim());
          if (this.onRecognitionStateChange) {
            this.onRecognitionStateChange(false, final.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        let errorMessage = 'Microphone error.';
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly.';
        }
        if (this.onRecognitionStateChange) {
          this.onRecognitionStateChange(false, '', errorMessage);
        }
      };

      recognition.onend = () => {
        this.isListening = false;
        if (this.onRecognitionStateChange) {
          this.onRecognitionStateChange(false, '');
        }
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      if (this.onRecognitionStateChange) {
        this.onRecognitionStateChange(false, '', err?.message || 'Could not start microphone.');
      }
    }
  }

  public stopSpeechRecognition() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
    if (this.onRecognitionStateChange) {
      this.onRecognitionStateChange(false, '');
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceService();
