import * as React from "react";

// ====================== //
//                        //
//   TYPES                //
//                        //
// ====================== //

type Email = {
  id: string;
  subject: string;
  from: string;
  content: string;
};

type PlayState = "idle" | "playing" | "paused";

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

// ====================== //
//                        //
//   SAMPLE DATA          //
//                        //
// ====================== //

const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    subject: "Weekly Team Meeting",
    from: "sarah@company.com",
    content:
      "Hi team, just a reminder about our weekly sync meeting tomorrow at 10 AM. Please review the agenda beforehand.",
  },
  {
    id: "2",
    subject: "Project Update",
    from: "mike@company.com",
    content:
      "Great progress on the project this week! The new features are looking solid and we're on track for the deadline.",
  },
  {
    id: "3",
    subject: "Budget Approval",
    from: "finance@company.com",
    content:
      "Your budget request has been approved. Please proceed with the purchase and send us the receipt for reimbursement.",
  },
  {
    id: "4",
    subject: "Client Feedback",
    from: "client@external.com",
    content:
      "We're very happy with the latest iteration. Just a few minor tweaks needed on the dashboard layout.",
  },
  {
    id: "5",
    subject: "Holiday Schedule",
    from: "hr@company.com",
    content:
      "Reminder that the office will be closed next Monday for the holiday. Enjoy your long weekend!",
  },
];

// ====================== //
//                        //
//   MAIN COMPONENT       //
//                        //
// ====================== //

export default function VoiceEmailReader() {
  // ====================== //
  //                        //
  //   STATE VARIABLES      //
  //                        //
  // ====================== //

  const [emails] = React.useState<Email[]>(SAMPLE_EMAILS);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [playState, setPlayState] = React.useState<PlayState>("idle");
  const [archivedIds, setArchivedIds] = React.useState<Set<string>>(new Set());
  const [flaggedIds, setFlaggedIds] = React.useState<Set<string>>(new Set());
  const [isVoiceReady, setIsVoiceReady] = React.useState<boolean>(false);

  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  // ====================== //
  //                        //
  //   OBSERVE STATE        //
  //                        //
  // ====================== //

  console.log("currentIndex", currentIndex);
  console.log("playState", playState);
  console.log("archivedIds", archivedIds);
  console.log("flaggedIds", flaggedIds);

  // ====================== //
  //                        //
  //   SIDE EFFECTS         //
  //                        //
  // ====================== //

  React.useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  React.useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("SpeechRecognition API not available in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (!lastResult || !lastResult[0]) {
        return;
      }
      const transcript = lastResult[0].transcript.trim().toLowerCase();
      handleEventVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Voice control error", event.error);
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    recognition.start();
    setIsVoiceReady(true);

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [currentIndex, emails.length]);

  // ====================== //
  //                        //
  //   UI EVENT HANDLERS    //
  //                        //
  // ====================== //

  // ------------------------------------------------------ Playback
  const handleEventPlay = () => {
    const currentEmail = emails[currentIndex];
    const textToSpeak = `From ${currentEmail.from}. Subject: ${currentEmail.subject}. ${currentEmail.content}`;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setPlayState("playing");
    };

    utterance.onend = () => {
      setPlayState("idle");
    };

    utterance.onerror = () => {
      setPlayState("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleEventPause = () => {
    window.speechSynthesis.pause();
    setPlayState("paused");
  };

  const handleEventResume = () => {
    window.speechSynthesis.resume();
    setPlayState("playing");
  };

  // ------------------------------------------------------ Navigation
  const handleEventBack = () => {
    window.speechSynthesis.cancel();
    setPlayState("idle");
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleEventSkip = () => {
    window.speechSynthesis.cancel();
    setPlayState("idle");
    setCurrentIndex((prev) => Math.min(emails.length - 1, prev + 1));
  };

  // ------------------------------------------------------ Email Actions
  const handleEventArchive = () => {
    const currentEmail = emails[currentIndex];
    setArchivedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentEmail.id)) {
        next.delete(currentEmail.id);
      } else {
        next.add(currentEmail.id);
      }
      return next;
    });
  };

  const handleEventFlag = () => {
    const currentEmail = emails[currentIndex];
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentEmail.id)) {
        next.delete(currentEmail.id);
      } else {
        next.add(currentEmail.id);
      }
      return next;
    });
  };

  // ====================== //
  //                        //
  //   UTILS METHODS        //
  //                        //
  // ====================== //

  const getCurrentEmail = () => emails[currentIndex];
  const isArchived = () => archivedIds.has(getCurrentEmail().id);
  const isFlagged = () => flaggedIds.has(getCurrentEmail().id);
  const canGoBack = () => currentIndex > 0;
  const canSkip = () => currentIndex < emails.length - 1;

  const handleEventVoiceCommand = (command: string) => {
    console.log("voice command", command);
    const keyword = command.split(" ")[0];
    switch (keyword) {
      case "back":
        if (canGoBack()) handleEventBack();
        break;
      case "skip":
        if (canSkip()) handleEventSkip();
        break;
      case "flag":
        handleEventFlag();
        break;
      case "archive":
        handleEventArchive();
        break;
      case "play":
        if (playState === "playing") {
          handleEventPause();
        } else if (playState === "paused") {
          handleEventResume();
        } else {
          handleEventPlay();
        }
        break;
      default:
        break;
    }
  };

  // ====================== //
  //                        //
  //   UI COMPONENTS        //
  //                        //
  // ====================== //

  const currentEmail = getCurrentEmail();

  return (
    <div className="h-[80vh] bg-white flex flex-col items-center justify-center p-8">
      {/* Email Info */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {currentEmail.subject}
        </h2>
        <p className="text-sm text-slate-600 mb-4">From: {currentEmail.from}</p>
        <p className="text-xs text-slate-500">
          Email {currentIndex + 1} of {emails.length}
        </p>
      </div>

      {/* Pulsing Circle */}
      <div className="mb-16">
        <div
          className={`w-48 h-48 rounded-full bg-sky-300 flex items-center justify-center ${
            playState === "playing" ? "animate-pulse" : ""
          }`}
        >
          <div className="w-32 h-32 rounded-full bg-sky-200"></div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        {/* Back Button */}
        <button
          title="back"
          type="button"
          onClick={handleEventBack}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg
            className="w-6 h-6 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Archive Button */}
        <button
          title="archive"
          type="button"
          onClick={handleEventArchive}
          className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center hover:bg-slate-50 transition-all ${
            isArchived() ? "border-sky-400 bg-sky-50" : "border-slate-200"
          }`}
        >
          <svg
            className="w-6 h-6 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </button>

        {/* Play/Pause/Replay Button */}
        <button
          title="play"
          type="button"
          onClick={() => {
            if (playState === "idle") {
              handleEventPlay();
            } else if (playState === "playing") {
              handleEventPause();
            } else {
              handleEventResume();
            }
          }}
          className="w-20 h-20 rounded-full bg-sky-400 flex items-center justify-center hover:bg-sky-500 transition-all shadow-lg"
        >
          {playState === "idle" && (
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {playState === "playing" && (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
          {playState === "paused" && (
            <svg
              className="w-8 h-8 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Flag Button */}
        <button
          title="flag"
          type="button"
          onClick={handleEventFlag}
          className={`w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center hover:bg-slate-50 transition-all ${
            isFlagged() ? "border-sky-400 bg-sky-50" : "border-slate-200"
          }`}
        >
          <svg
            className="w-6 h-6 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
        </button>

        {/* Skip Button */}
        <button
          title="skip"
          type="button"
          onClick={handleEventSkip}
          disabled={currentIndex === emails.length - 1}
          className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg
            className="w-6 h-6 text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Voice Command Status */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500">
          Voice control {isVoiceReady ? "listening" : "unavailable"} (say: back, skip, flag, archive, play)
        </p>
      </div>
    </div>
  );
}
