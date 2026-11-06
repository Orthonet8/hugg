import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Phone,
  SendHorizontal,
  Paperclip,
  User,
  Plus,
  Mic,
  FileText,
  X,
  MessageSquare,
  ChevronDown,
  Square,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../context/useAuthStore";
import { supportApi } from "../utils/supportApi";
import type { Supporter, SupportTicket, SupportChatMessage } from "../types/support";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

export const SUPPORT_SECTORS: { key: string; en: string; am: string; icon: string }[] = [
  { key: "Spiritual & Prayer", en: "Spiritual & Prayer", am: "መንፈሳዊ እና ጸሎት", icon: "🙏" },
  { key: "Academic & Campus", en: "Academic & Campus", am: "ትምህርት እና ግቢ", icon: "🎓" },
  { key: "Counseling & Personal", en: "Counseling & Personal", am: "ምክር እና የግል ጉዳይ", icon: "🤝" },
  { key: "Charity & Financial", en: "Charity & Financial", am: "ልማት እና ድጋፍ", icon: "🤍" },
  { key: "Technical & Media", en: "Technical & Media", am: "ቴክኒክ እና ሚዲያ", icon: "💻" },
  { key: "General Inquiries", en: "General Inquiries", am: "አጠቃላይ ጥያቄ", icon: "💬" },
];

export const getSectorLabel = (sectorKey: string): { en: string; am: string; full: string } => {
  const match = SUPPORT_SECTORS.find(
    (s) => s.key.toLowerCase() === sectorKey.toLowerCase() || s.en.toLowerCase() === sectorKey.toLowerCase()
  );
  if (!match) return { en: sectorKey, am: "", full: sectorKey };
  return {
    en: match.en,
    am: match.am,
    full: `${match.en} (${match.am})`,
  };
};

export const SupportPage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const [activeTab, setActiveTab] = useState<"directory" | "tickets" | "chat">("directory");

  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [loadingSupporters, setLoadingSupporters] = useState(true);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Active chat state
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // In-app Audio Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // New ticket form modal state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [formSubject, setFormSubject] = useState("");
  const [formSector, setFormSector] = useState(SUPPORT_SECTORS[0].key);
  const [formMessage, setFormMessage] = useState("");
  const [formSelectedSupporterId, setFormSelectedSupporterId] = useState<number | undefined>();
  const [formAttachment, setFormAttachment] = useState<File | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch supporters
  useEffect(() => {
    let mounted = true;
    const fetchSupporters = async () => {
      setLoadingSupporters(true);
      try {
        const sectorParam = selectedSector === "All" ? undefined : selectedSector;
        const res = await supportApi.getSupporters(sectorParam);
        if (mounted) setSupporters(res.supporters);
      } catch {
        // quiet
      } finally {
        if (mounted) setLoadingSupporters(false);
      }
    };
    fetchSupporters();
    return () => {
      mounted = false;
    };
  }, [selectedSector]);

  // Fetch tickets
  const loadTickets = async () => {
    if (!token) return;
    setLoadingTickets(true);
    try {
      const res = await supportApi.getTickets(token);
      setTickets(res.tickets);
    } catch {
      // quiet
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tickets") {
      loadTickets();
    }
  }, [activeTab, token]);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up recording timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const ext = mimeType.includes("ogg") ? "ogg" : "webm";
        const file = new File([audioBlob], `voice_note_${Date.now()}.${ext}`, { type: mimeType });
        setAttachment(file);
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setRecordedAudioUrl(null);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone permission was denied or is unavailable on this device.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    setAttachment(null);
    setRecordedAudioUrl(null);
  };

  // Open ticket chat
  const handleOpenTicketChat = async (ticket: SupportTicket) => {
    setActiveTicket(ticket);
    setActiveTab("chat");
    if (!token) return;

    try {
      const res = await supportApi.getTicket(ticket.id, token);
      setMessages(res.ticket.messages || []);
    } catch {
      setMessages(ticket.messages || []);
    }
  };

  // Start chat with supporter without prefilling Subject
  const handleStartChatWithSupporter = (supporter: Supporter) => {
    setFormSelectedSupporterId(supporter.id);
    if (supporter.support_sectors && supporter.support_sectors.length > 0) {
      setFormSector(supporter.support_sectors[0]);
    }
    setFormSubject("");
    setShowNewTicketModal(true);
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !activeTicket) return;
    if (!replyText.trim() && !attachment) return;

    setSending(true);
    try {
      const res = await supportApi.sendMessage(
        activeTicket.id,
        {
          message: replyText || undefined,
          attachment: attachment || undefined,
        },
        token
      );
      setMessages((prev) => [...prev, res.chat_message]);
      setReplyText("");
      setAttachment(null);
      setRecordedAudioUrl(null);
    } catch {
      alert("Failed to send message. Please retry.");
    } finally {
      setSending(false);
    }
  };

  // Create new ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formSubject.trim() || !formMessage.trim()) {
      setErrorMsg("Subject and message are required.");
      return;
    }

    setSubmittingTicket(true);
    setErrorMsg(null);
    try {
      const res = await supportApi.createTicket(
        {
          subject: formSubject.trim(),
          sector: formSector,
          message: formMessage.trim(),
          assigned_user_id: formSelectedSupporterId,
          attachment: formAttachment || undefined,
        },
        token
      );

      setShowNewTicketModal(false);
      setFormSubject("");
      setFormMessage("");
      setFormAttachment(null);
      setFormSelectedSupporterId(undefined);

      await handleOpenTicketChat(res.ticket);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create support ticket.");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 md:py-6 space-y-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "chat") {
                cancelRecording();
                setActiveTab("tickets");
              } else {
                navigate("/profile");
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] shadow-xs transition hover:bg-[color:var(--soft-hover)] active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[color:var(--text-primary)]">
                {activeTab === "chat" ? activeTicket?.subject : "Help & Support"}
              </h1>
              {activeTab !== "chat" && (
                <span className="text-xs font-semibold text-[color:var(--text-muted)]">
                  (እርዳታና ድጋፍ)
                </span>
              )}
            </div>
            <p className="text-xs text-[color:var(--text-muted)]">
              {activeTab === "chat"
                ? `Ticket #${activeTicket?.id} · ${getSectorLabel(activeTicket?.sector || "").full}`
                : "Connect with supporters or message our help desk"}
            </p>
          </div>
        </div>

        {activeTab !== "chat" && (
          <Button
            size="sm"
            onClick={() => {
              setFormSelectedSupporterId(undefined);
              setFormSubject("");
              setShowNewTicketModal(true);
            }}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Request</span>
          </Button>
        )}
      </div>

      {/* Navigation Pills (Directory / Tickets) */}
      {activeTab !== "chat" && (
        <div className="flex rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === "directory"
                ? "bg-[color:var(--surface)] text-[color:var(--primary)] shadow-xs"
                : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            Supporters Directory (የደጋፊዎች ዝርዝር)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === "tickets"
                ? "bg-[color:var(--surface)] text-[color:var(--primary)] shadow-xs"
                : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            My Conversations {tickets.length > 0 && `(${tickets.length})`}
          </button>
        </div>
      )}

      {/* TAB 1: Supporters Directory */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Sector Filter Dropdown */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)] flex items-center gap-1.5">
              <span>Filter by Sector / ዘርፍ ይምረጡ:</span>
            </label>

            <div className="relative min-w-[260px]">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2.5 pr-10 text-xs font-bold text-[color:var(--text-primary)] shadow-xs transition hover:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
              >
                <option value="All">All Sectors (ሁሉም ዘርፎች)</option>
                {SUPPORT_SECTORS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.icon} {s.en} — {s.am}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"
              />
            </div>
          </div>

          {/* Supporters Grid */}
          {loadingSupporters ? (
            <div className="py-16 text-center text-xs text-[color:var(--text-muted)]">
              Loading supporters...
            </div>
          ) : supporters.length === 0 ? (
            <Card className="py-16 text-center text-xs text-[color:var(--text-muted)]">
              No supporter found for this sector.
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {supporters.map((supporter) => (
                <div
                  key={supporter.id}
                  className="flex flex-col justify-between rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-xs transition hover:border-[color:var(--border-strong)]"
                >
                  <div className="flex items-start gap-3">
                    {supporter.photo ? (
                      <img
                        src={`/storage/${supporter.photo}`}
                        alt={supporter.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[color:var(--border)]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-soft)] text-[color:var(--primary)]">
                        <User size={22} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[color:var(--text-primary)]">
                        {supporter.name}
                      </h3>
                      {supporter.support_bio && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--text-secondary)]">
                          {supporter.support_bio}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-1">
                        {(supporter.support_sectors || []).map((sec) => {
                          const lbl = getSectorLabel(sec);
                          return (
                            <span
                              key={sec}
                              className="rounded-lg bg-[color:var(--surface-soft)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--primary)]"
                            >
                              {lbl.en} {lbl.am && <span className="opacity-75">· {lbl.am}</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 border-t border-[color:var(--border)] pt-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[color:var(--text-secondary)]">
                      {supporter.phone ? (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Phone size={12} className="text-[color:var(--text-muted)]" />
                          <span>{supporter.phone}</span>
                        </span>
                      ) : (
                        <span className="text-[color:var(--text-muted)] italic">No phone</span>
                      )}

                      {supporter.telegram_username ? (
                        <span className="flex items-center gap-1.5 font-medium">
                          <SendHorizontal size={12} className="text-[color:var(--text-muted)]" />
                          <span>@{supporter.telegram_username.replace("@", "")}</span>
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartChatWithSupporter(supporter)}
                      className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[color:var(--primary)] py-2 text-xs font-semibold text-[color:var(--on-primary)] shadow-xs transition hover:bg-[color:var(--primary-hover)] active:scale-98"
                    >
                      <MessageSquare size={13} />
                      Start Chat with {supporter.name.split(" ")[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Tickets */}
      {activeTab === "tickets" && (
        <div className="space-y-3">
          {loadingTickets ? (
            <div className="py-16 text-center text-xs text-[color:var(--text-muted)]">
              Loading your conversations...
            </div>
          ) : tickets.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <MessageSquare size={36} className="text-[color:var(--text-muted)] opacity-40 mb-2" />
              <p className="text-sm font-bold text-[color:var(--text-primary)]">No support requests yet</p>
              <p className="text-xs text-[color:var(--text-muted)] max-w-xs mt-1">
                Reach out to our supporters or submit a request to get assistance.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => {
                  setFormSelectedSupporterId(undefined);
                  setFormSubject("");
                  setShowNewTicketModal(true);
                }}
              >
                Create Request
              </Button>
            </Card>
          ) : (
            tickets.map((ticket) => {
              const sectorInfo = getSectorLabel(ticket.sector);
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleOpenTicketChat(ticket)}
                  className="group flex cursor-pointer items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-xs transition hover:border-[color:var(--primary)] hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[color:var(--primary)]">
                        {sectorInfo.en} {sectorInfo.am && <span className="opacity-75">({sectorInfo.am})</span>}
                      </span>
                      <span className="text-[10px] text-[color:var(--text-muted)]">
                        Ticket #{ticket.id}
                      </span>
                    </div>
                    <h4 className="mt-0.5 truncate text-sm font-bold text-[color:var(--text-primary)] group-hover:text-[color:var(--primary)]">
                      {ticket.subject}
                    </h4>
                    <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                      Supporter: {ticket.supporter?.name || "Unassigned"} · {ticket.messages?.length || 0} messages
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === "open"
                          ? "bg-amber-100 text-amber-800"
                          : ticket.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-[color:var(--text-muted)]">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Beautiful Full-Page Chat View */}
      {activeTab === "chat" && activeTicket && (
        <div className="flex flex-col rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm overflow-hidden">
          {/* Supporter Bar */}
          <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {activeTicket.supporter?.photo ? (
                <img
                  src={`/storage/${activeTicket.supporter.photo}`}
                  className="h-10 w-10 rounded-2xl object-cover ring-2 ring-[color:var(--primary)]/20"
                  alt={activeTicket.supporter.name}
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-[color:var(--on-primary)] font-bold text-sm">
                  {activeTicket.supporter?.name?.charAt(0) || "S"}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-[color:var(--text-primary)]">
                  {activeTicket.supporter?.name || "Support Desk"}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[color:var(--text-secondary)]">
                  {activeTicket.supporter?.phone && (
                    <span>Phone: {activeTicket.supporter.phone}</span>
                  )}
                  {activeTicket.supporter?.telegram_username && (
                    <span>Telegram: @{activeTicket.supporter.telegram_username.replace("@", "")}</span>
                  )}
                  {!activeTicket.supporter?.phone && !activeTicket.supporter?.telegram_username && (
                    <span className="text-[color:var(--text-muted)]">Fellowship Supporter</span>
                  )}
                </div>
              </div>
            </div>

            <span className="rounded-lg bg-[color:var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--primary)] border border-[color:var(--border)]">
              {getSectorLabel(activeTicket.sector).en}
            </span>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 space-y-4 p-4 min-h-[440px] max-h-[560px] overflow-y-auto bg-[color:var(--bg)]/40">
            {messages.length === 0 ? (
              <div className="py-20 text-center text-xs text-[color:var(--text-muted)]">
                No messages yet. Send a message or record a voice note to start the conversation.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_type === "member";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <div className="max-w-[80%] space-y-1">
                      <div
                        className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                          isMe
                            ? "bg-[color:var(--primary)] text-[color:var(--on-primary)] rounded-br-xs"
                            : "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] rounded-bl-xs"
                        }`}
                      >
                        {msg.message && <p className="whitespace-pre-wrap">{msg.message}</p>}

                        {/* Attachments */}
                        {msg.attachment_url && (
                          <div className={`mt-2.5 pt-2 border-t ${isMe ? "border-white/20" : "border-[color:var(--border)]"}`}>
                            {msg.attachment_type === "image" ? (
                              <a
                                href={`/storage/${msg.attachment_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block overflow-hidden rounded-xl"
                              >
                                <img
                                  src={`/storage/${msg.attachment_url}`}
                                  alt="Attachment"
                                  className="max-h-56 w-auto rounded-lg object-cover"
                                />
                              </a>
                            ) : msg.attachment_type === "audio" || (msg.attachment_url && (msg.attachment_url.includes('voice_note') || msg.attachment_url.endsWith('.ogg') || msg.attachment_url.endsWith('.opus') || msg.attachment_url.endsWith('.webm') || msg.attachment_url.endsWith('.mp3'))) ? (
                              <div className="flex items-center gap-3 py-1">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
                                  isMe ? "bg-white/20 text-white" : "bg-[color:var(--primary)] text-white"
                                }`}>
                                  <Mic size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">
                                    Voice Note · የድምፅ መልዕክት
                                  </p>
                                  <audio
                                    controls
                                    className="h-8 w-full max-w-[240px] mt-1"
                                    style={{ filter: isMe ? "invert(1) hue-rotate(180deg)" : "none" }}
                                  >
                                    <source src={`/storage/${msg.attachment_url}`} />
                                    Your browser does not support audio.
                                  </audio>
                                </div>
                              </div>
                            ) : msg.attachment_type === "video" ? (
                              <video controls className="max-h-56 w-full rounded-xl bg-black">
                                <source src={`/storage/${msg.attachment_url}`} />
                              </video>
                            ) : (
                              <a
                                href={`/storage/${msg.attachment_url}`}
                                download
                                className="inline-flex items-center gap-1.5 underline font-medium"
                              >
                                <FileText size={14} />
                                {msg.attachment_name || "Attachment"}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-1 text-[10px] text-[color:var(--text-muted)] ${isMe ? "justify-end" : ""}`}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Bar with Live Audio Recording */}
          <div className="border-t border-[color:var(--border)] bg-[color:var(--surface)] p-3">
            {/* Ready to send Voice Note Preview */}
            {recordedAudioUrl && !isRecording && (
              <div className="mb-2 flex items-center justify-between rounded-2xl bg-[color:var(--surface-soft)] p-2.5 border border-[color:var(--primary)]/20 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)] text-[color:var(--on-primary)]">
                    <Mic size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[color:var(--text-primary)]">Voice Recording Ready</p>
                    <audio controls src={recordedAudioUrl} className="h-7 w-48 mt-0.5" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 transition"
                  title="Discard voice recording"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Standard File Attachment Preview */}
            {attachment && !recordedAudioUrl && (
              <div className="mb-2 flex items-center justify-between rounded-xl bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs text-[color:var(--text-primary)]">
                <span className="truncate font-semibold">📎 {attachment.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-rose-600 font-bold hover:underline"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* If actively recording voice */}
            {isRecording ? (
              <div className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-2.5 border border-rose-200 text-rose-700 animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                  <span className="text-xs font-bold">Recording Voice Note...</span>
                  <span className="rounded-lg bg-rose-200/80 px-2 py-0.5 text-xs font-mono font-bold">
                    {formatTimer(recordingSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="rounded-xl p-2 text-gray-500 hover:bg-rose-100 transition"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition"
                  >
                    <Square size={14} fill="currentColor" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Chat Input Row */
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <label className="cursor-pointer rounded-2xl p-2.5 text-[color:var(--text-muted)] transition hover:bg-[color:var(--soft-hover)] hover:text-[color:var(--text-primary)]">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setRecordedAudioUrl(null);
                        setAttachment(e.target.files[0]);
                      }
                    }}
                  />
                  <Paperclip size={18} />
                </label>

                {/* Direct Voice Record Button */}
                <button
                  type="button"
                  onClick={startRecording}
                  className="rounded-2xl p-2.5 text-[color:var(--primary)] transition hover:bg-[color:var(--soft-hover)] active:scale-95"
                  title="Record Voice Note"
                >
                  <Mic size={18} />
                </button>

                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message or record voice..."
                  className="flex-1 rounded-2xl border-0 bg-[color:var(--surface-soft)] px-4 py-2.5 text-sm text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] focus:bg-[color:var(--surface)] focus:ring-2 focus:ring-[color:var(--primary)]"
                />

                <button
                  type="submit"
                  disabled={sending || (!replyText.trim() && !attachment)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-xs transition hover:bg-[color:var(--primary-hover)] disabled:opacity-50 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[color:var(--border)]">
              <div>
                <h3 className="font-bold text-[color:var(--text-primary)]">New Support Request</h3>
                <span className="text-xs text-[color:var(--text-muted)]">አዲስ የእርዳታ ጥያቄ ይላኩ</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="rounded-xl p-1 text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Subject / ጉዳይ
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Prayer request or campus advice"
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--text-primary)] focus:bg-[color:var(--surface)] focus:ring-2 focus:ring-[color:var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Sector / ዘርፍ
                </label>
                <div className="relative mt-1">
                  <select
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 pr-10 text-sm text-[color:var(--text-primary)] focus:bg-[color:var(--surface)] focus:ring-2 focus:ring-[color:var(--primary)]"
                  >
                    {SUPPORT_SECTORS.map((sec) => (
                      <option key={sec.key} value={sec.key}>
                        {sec.icon} {sec.en} — {sec.am}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">
                  How can we help? / እንዴት እንርዳዎት?
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Describe your situation or question..."
                  className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--text-primary)] focus:bg-[color:var(--surface)] focus:ring-2 focus:ring-[color:var(--primary)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)]">
                  Attachment / ፋይል (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormAttachment(e.target.files[0]);
                    }
                  }}
                  className="mt-1 w-full text-xs text-[color:var(--text-muted)]"
                />
              </div>

              <div className="mt-5 flex gap-2 pt-2 border-t border-[color:var(--border)]">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewTicketModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={submittingTicket}
                >
                  {submittingTicket ? "Submitting..." : "Send Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
