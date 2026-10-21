"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  ExternalLink,
  BookOpen,
  Bug,
  Lightbulb,
  ArrowRight,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  QrCode,
  DollarSign,
  ShieldAlert,
  Send,
  X,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { mockSupportTickets, SupportTicketData } from "@/lib/mock-data";
import { useInstituteStore } from "@/stores/institute-store";

interface TicketMessage {
  id: string;
  sender: string;
  role: "super_admin" | "institute_admin" | "teacher";
  text: string;
  timestamp: string;
}

export default function SupportPage() {
  const { t } = useI18n();
  const { selectedInstituteId } = useInstituteStore();
  const isAll = !selectedInstituteId || selectedInstituteId === "all";
  const [tickets, setTickets] = useState<SupportTicketData[]>(mockSupportTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // Form state for new ticket
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<SupportTicketData["category"]>("qr_hardware");
  const [newPriority, setNewPriority] = useState<SupportTicketData["priority"]>("high");
  const [newDescription, setNewDescription] = useState("");
  const [newSenderName, setNewSenderName] = useState("Nimal Rajapakse");
  const [newSenderRole, setNewSenderRole] = useState("Branch Director");

  // Thread reply state
  const [replyText, setReplyText] = useState("");
  const [ticketMessages, setTicketMessages] = useState<Record<string, TicketMessage[]>>({
    "tkt-1": [
      {
        id: "msg-1",
        sender: "Sanjeewa Perera (Counter Supervisor)",
        role: "institute_admin",
        text: "The main entrance USB QR laser scanner experienced 3-4 second pauses when reading laminated student barcode cards during this morning's 8:30 AM surge for Combined Maths. Around 40 students had to be checked manually.",
        timestamp: "2026-10-16 08:45 AM",
      },
      {
        id: "msg-2",
        sender: "Ceyora Super Admin Ops",
        role: "super_admin",
        text: "Investigating camera buffer and offline index cache. Please ensure workstation browser has Hardware Acceleration enabled in Chrome/Edge settings. We are pushing a hotfix to local IndexedDB gate cache.",
        timestamp: "2026-10-16 09:10 AM",
      },
      {
        id: "msg-3",
        sender: "Sanjeewa Perera",
        role: "institute_admin",
        text: "Thank you. Testing gate station #2 with the latest update now.",
        timestamp: "2026-10-16 09:35 AM",
      },
    ],
    "tkt-2": [
      {
        id: "msg-4",
        sender: "Eng. Dilantha Fernando (Teacher)",
        role: "teacher",
        text: "Could we configure a combined sibling discount of 15% specifically when two brothers enroll concurrently in both AL-MATHS-2026 and AL-PHY-2026 batches?",
        timestamp: "2026-10-15 04:20 PM",
      },
    ],
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesInstitute = isAll || !ticket.instituteId || ticket.instituteId === selectedInstituteId;
    const matchesCat = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesStat = statusFilter === "all" || ticket.status === statusFilter;
    const matchesQuery =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInstitute && matchesCat && matchesStat && matchesQuery;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newTicketId = `tkt-${Date.now()}`;
    const newNumber = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const createdTicket: SupportTicketData = {
      id: newTicketId,
      ticketNumber: newNumber,
      instituteId: selectedInstituteId && selectedInstituteId !== "all" ? selectedInstituteId : "inst-1",
      senderName: newSenderName,
      senderRole: newSenderRole,
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      status: "open",
      createdAt: "Just now",
      messagesCount: 1,
    };

    setTickets([createdTicket, ...tickets]);
    setTicketMessages({
      ...ticketMessages,
      [newTicketId]: [
        {
          id: `msg-${Date.now()}`,
          sender: newSenderName,
          role: "institute_admin",
          text: newDescription || "Ticket initiated. Super admin engineering team notified.",
          timestamp: "Just now",
        },
      ],
    });

    setNewSubject("");
    setNewDescription("");
    setIsNewTicketOpen(false);
    setSelectedTicket(createdTicket);
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    const currentMsgs = ticketMessages[selectedTicket.id] || [];
    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: "Ceyora Operations Desk",
      role: "super_admin",
      text: replyText,
      timestamp: "Just now",
    };

    setTicketMessages({
      ...ticketMessages,
      [selectedTicket.id]: [...currentMsgs, newMsg],
    });

    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id ? { ...t, messagesCount: t.messagesCount + 1, status: "in_progress" } : t
      )
    );

    setReplyText("");
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: "resolved" } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: "resolved" });
    }
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <LifeBuoy className="h-3.5 w-3.5" /> 24/7 Operations Desk
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <Clock className="h-3 w-3" /> Avg SLA Response: 12 Mins
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("support.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("support.subtitle")}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsNewTicketOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4" /> Open Support Ticket
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* SLA Telemetry Cards */}
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Resolution Success Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">98.4%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">32 resolved this billing cycle</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Active Open Incidents</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {tickets.filter((t) => t.status !== "resolved").length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Assigned to Super Admin engineering</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Hardware & Scanner Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-base font-bold text-foreground">Gates Operational</p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Colombo & Kandy terminals sync OK</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Direct Sri Lanka Concierge</p>
            <p className="text-base font-bold text-foreground mt-1">+94 11 234 5678</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Priority WhatsApp Live</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Search & Filter Toolbar */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-border/40">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ticket #, subject, or sender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-background/50 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex rounded-xl bg-muted/40 p-1">
              {(["all", "open", "in_progress", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                    statusFilter === st ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-muted-foreground">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-border/50 bg-background/50 px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="qr_hardware">QR Gate Hardware</option>
              <option value="billing">Fee Ledger & Billing</option>
              <option value="payhere">PayHere Gateway</option>
              <option value="academic">Academic / PDPA</option>
            </select>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Grid: Ticket List + Live Conversation Panel */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Tickets Roster (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground border border-border/40">
              <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm font-semibold">No tickets match your query</p>
              <p className="text-xs text-muted-foreground/80 mt-1">Try resetting the filter criteria or search keyword.</p>
            </div>
          ) : (
            filteredTickets.map((tkt) => {
              const isSelected = selectedTicket?.id === tkt.id;
              return (
                <motion.div
                  key={tkt.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`glass-card rounded-2xl p-4 shadow-sm border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/40 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-lg bg-primary/10">
                        {tkt.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          tkt.priority === "urgent"
                            ? "bg-red-500/15 text-red-600 dark:text-red-400"
                            : tkt.priority === "high"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {tkt.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          tkt.status === "resolved"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : tkt.status === "in_progress"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {tkt.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-foreground mt-2 line-clamp-1">{tkt.subject}</h3>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground/80">{tkt.senderName}</span>
                      <span className="text-muted-foreground/60">• {tkt.senderRole}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="h-3 w-3" /> {ticketMessages[tkt.id]?.length || tkt.messagesCount}
                      </span>
                      <span className="text-[11px]">{tkt.createdAt}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Live Ticket Thread & Resolution Console (Right 5 Cols) */}
        <div className="lg:col-span-5">
          {selectedTicket ? (
            <div className="glass-card rounded-2xl p-5 shadow-sm border border-border/40 sticky top-20 flex flex-col h-[560px]">
              {/* Thread Header */}
              <div className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{selectedTicket.ticketNumber}</span>
                  <div className="flex items-center gap-2">
                    {selectedTicket.status !== "resolved" ? (
                      <button
                        onClick={() => handleResolveTicket(selectedTicket.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 transition-all"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-foreground mt-1.5">{selectedTicket.subject}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Raised by {selectedTicket.senderName} ({selectedTicket.senderRole}) • Apex Institute Nugegoda
                </p>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {(ticketMessages[selectedTicket.id] || []).map((msg) => {
                  const isOps = msg.role === "super_admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOps ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-muted-foreground">
                        <span className="font-semibold">{msg.sender}</span>
                        <span>• {msg.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-2xl p-3.5 max-w-[90%] shadow-sm leading-relaxed ${
                          isOps
                            ? "bg-gradient-to-br from-primary to-violet-600 text-white rounded-tr-none"
                            : "bg-muted/50 border border-border/40 text-foreground rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <div className="border-t border-border/40 pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Type engineering response or dispatch update..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  className="flex-1 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="rounded-xl bg-gradient-to-r from-primary to-violet-500 p-2.5 text-white shadow-md disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground border border-border/40 h-full flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-semibold">Select a Ticket to View Thread</p>
              <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs">
                View real-time correspondence between branch managers, teachers, and Super Admin engineering.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Concierge & Help Cards */}
      <AnimatedSection>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-5 shadow-sm border border-border/40 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">WhatsApp Live Desk</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Instant escalation for gate closures</p>
              <p className="text-xs font-bold text-emerald-600 mt-1">+94 77 123 4567</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-sm border border-border/40 flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Direct Voice Hotline</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Available Mon-Sun 6:00 AM - 10:00 PM</p>
              <p className="text-xs font-bold text-primary mt-1">+94 11 234 5678</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 shadow-sm border border-border/40 flex items-center gap-4">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Knowledge Base & API</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Hardware manuals & setup guides</p>
              <a
                href="#docs"
                className="text-xs font-bold text-violet-600 mt-1 inline-flex items-center gap-1 hover:underline"
              >
                Open Documentation <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-6 shadow-2xl border border-border/50 max-w-lg w-full bg-background"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <LifeBuoy className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-base">Open Technical Support Ticket</h3>
                </div>
                <button
                  onClick={() => setIsNewTicketOpen(false)}
                  className="rounded-lg p-1 hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Subject / Problem Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sibling discount calculation error in Grade 12 batch"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as SupportTicketData["category"])}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="qr_hardware">QR Gate Hardware</option>
                      <option value="billing">Fee Billing & Ledger</option>
                      <option value="payhere">PayHere Gateway</option>
                      <option value="academic">Academic & PDPA Ranking</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="urgent">Urgent (Gate Closure)</option>
                      <option value="high">High (Billing Discrepancy)</option>
                      <option value="normal">Normal (General Inquiry)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Reporter Name</label>
                    <input
                      type="text"
                      value={newSenderName}
                      onChange={(e) => setNewSenderName(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={newSenderRole}
                      onChange={(e) => setNewSenderRole(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Detailed Description & Steps to Reproduce</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details regarding affected student IDs, batches, or terminal device models..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2 font-semibold hover:bg-muted/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2 font-bold text-white shadow-lg shadow-primary/20"
                  >
                    Dispatch Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
