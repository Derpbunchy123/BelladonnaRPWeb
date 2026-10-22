import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: number;
  applicant_discord: string;
  applicant_name: string;
  applicant_email: string | null;
  type: string;
  answers: Record<string, string>;
  status: string;
  submitted_at: string;
  created_at: string;
  assigned_reviewer: string | null;
  staff_notes: string | null;
}

interface StaffMember {
  id: number;
  username: string;
  role: string;
}

interface Stats {
  total: number;
  pending: number;
  under_review: number;
  accepted: number;
  denied: number;
  more_info: number;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  Pending: {
    bg: "hsl(38 60% 16% / 0.3)",
    text: "hsl(38 60% 60%)",
    border: "hsl(38 60% 28% / 0.4)",
    icon: <Clock className="h-3 w-3" />,
  },
  "Under Review": {
    bg: "hsl(220 50% 16% / 0.3)",
    text: "hsl(220 50% 65%)",
    border: "hsl(220 50% 30% / 0.4)",
    icon: <Eye className="h-3 w-3" />,
  },
  Accepted: {
    bg: "hsl(140 40% 14% / 0.3)",
    text: "hsl(140 40% 55%)",
    border: "hsl(140 40% 26% / 0.4)",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Denied: {
    bg: "hsl(0 60% 14% / 0.3)",
    text: "hsl(0 60% 58%)",
    border: "hsl(0 60% 26% / 0.4)",
    icon: <XCircle className="h-3 w-3" />,
  },
  "More Information Required": {
    bg: "hsl(280 40% 16% / 0.3)",
    text: "hsl(280 40% 62%)",
    border: "hsl(280 40% 28% / 0.4)",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

const TYPE_LABELS: Record<string, string> = {
  whitelist: "Server Whitelist",
  staff: "Staff",
  beta: "Beta Testing",
  business: "Business Owner",
  gang: "Gang / Org",
};

const PAGE_SIZE = 10;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("bella_admin_token") ?? "";
  const adminRole = sessionStorage.getItem("bella_admin_role") ?? "";
  const adminUsername = sessionStorage.getItem("bella_admin_username") ?? "";

  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [newReviewer, setNewReviewer] = useState("");
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showCreateStaff, setShowCreateStaff] = useState(false);
  const [newStaffUsername, setNewStaffUsername] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("reviewer");
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [createStaffError, setCreateStaffError] = useState<string | null>(null);

  const [expandedAnswers, setExpandedAnswers] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (search) params.set("search", search);
      if (filterType !== "all") params.set("type", filterType);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/admin/applications?${params}`, { headers: authHeaders });
      if (res.status === 401) { navigate("/admin/login", { replace: true }); return; }
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(Array.isArray(data.applications) ? data.applications : []);
      setTotalCount(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, filterStatus, token]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { headers: authHeaders });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
  }, [token]);

  const fetchStaff = useCallback(async () => {
    if (adminRole !== "super_admin" && adminRole !== "admin") return;
    try {
      const res = await fetch("/api/admin/staff", { headers: authHeaders });
      if (!res.ok) return;
      const data = await res.json();
      setStaffMembers(Array.isArray(data) ? data : []);
    } catch {}
  }, [token, adminRole]);

  useEffect(() => {
    if (!token) { navigate("/admin/login", { replace: true }); return; }
    fetchApplications();
    fetchStats();
    fetchStaff();
  }, [token, fetchApplications, fetchStats, fetchStaff]);

  const handleLogout = () => {
    sessionStorage.removeItem("bella_admin_token");
    sessionStorage.removeItem("bella_admin_role");
    sessionStorage.removeItem("bella_admin_username");
    navigate("/admin/login", { replace: true });
  };

  const openDetail = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNewReviewer(app.assigned_reviewer ?? "");
    setNoteText(app.staff_notes ?? "");
    setUpdateError(null);
    setUpdateSuccess(false);
    setExpandedAnswers(false);
    setDetailOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          status: newStatus,
          assigned_reviewer: newReviewer || null,
          staff_notes: noteText || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUpdateSuccess(true);
      fetchApplications();
      fetchStats();
    } catch (e) {
      setUpdateError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);
    setCreateStaffError(null);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ username: newStaffUsername, password: newStaffPassword, role: newStaffRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create staff account");
      setShowCreateStaff(false);
      setNewStaffUsername("");
      setNewStaffPassword("");
      setNewStaffRole("reviewer");
      fetchStaff();
    } catch (e) {
      setCreateStaffError(e instanceof Error ? e.message : "Failed to create account");
    } finally {
      setCreatingStaff(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const formatDate = (ts: string) => {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ts; }
  };

  const StatusPill = ({ status }: { status: string }) => {
    const s = STATUS_STYLES[status] ?? STATUS_STYLES["Pending"];
    return (
      <span
        className="inline-flex items-center gap-1 font-body text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm"
        style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
      >
        {s.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-1">
              Staff Portal
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="font-body text-xs px-3 py-1.5 rounded-sm"
              style={{ background: "hsl(344 47% 22% / 0.2)", color: "hsl(340 30% 60%)", border: "1px solid hsl(344 47% 30% / 0.3)" }}
            >
              <Shield className="h-3 w-3 inline mr-1" />
              {adminUsername} · {adminRole.replace("_", " ")}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="font-body text-xs tracking-widest uppercase bg-transparent"
              style={{ borderColor: "hsl(312 18% 22%)", color: "hsl(345 40% 70%)" }}
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: "Total", value: stats.total, color: "hsl(345 40% 93%)" },
              { label: "Pending", value: stats.pending, color: "hsl(38 60% 60%)" },
              { label: "Under Review", value: stats.under_review, color: "hsl(220 50% 65%)" },
              { label: "Accepted", value: stats.accepted, color: "hsl(140 40% 55%)" },
              { label: "Denied", value: stats.denied, color: "hsl(0 60% 58%)" },
              { label: "More Info", value: stats.more_info, color: "hsl(280 40% 62%)" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-sm p-4 text-center"
                style={{ background: "hsl(312 18% 10% / 0.5)", border: "1px solid hsl(312 18% 18%)" }}
              >
                <p className="font-display text-2xl font-light mb-0.5" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Super Admin: Staff management */}
        {adminRole === "super_admin" && (
          <div className="stat-card-glow rounded-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-medium text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-bella-rose" />
                Staff Accounts
              </h2>
              <Button
                size="sm"
                className="western-gradient font-body text-[10px] tracking-widest uppercase border-0 text-foreground hover:opacity-90"
                onClick={() => setShowCreateStaff(true)}
              >
                + Add Staff
              </Button>
            </div>

            {showCreateStaff && (
              <form onSubmit={handleCreateStaff} className="mb-4 p-5 rounded-sm space-y-4"
                style={{ background: "hsl(312 18% 9% / 0.5)", border: "1px solid hsl(312 18% 20%)" }}>
                <p className="font-display text-base font-medium text-foreground">Create Staff Account</p>
                {createStaffError && (
                  <p className="font-body text-xs" style={{ color: "hsl(0 84% 65%)" }}>{createStaffError}</p>
                )}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Username</Label>
                    <Input value={newStaffUsername} onChange={e => setNewStaffUsername(e.target.value)} required
                      className="font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Password</Label>
                    <Input type="password" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} required
                      className="font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Role</Label>
                    <Select value={newStaffRole} onValueChange={setNewStaffRole}>
                      <SelectTrigger className="font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={creatingStaff} size="sm"
                    className="western-gradient font-body text-[10px] tracking-widest uppercase border-0 text-foreground hover:opacity-90">
                    {creatingStaff ? "Creating..." : "Create Account"}
                  </Button>
                  <Button type="button" size="sm" variant="outline"
                    className="font-body text-[10px] tracking-widest uppercase bg-transparent"
                    style={{ borderColor: "hsl(312 18% 22%)", color: "hsl(345 40% 70%)" }}
                    onClick={() => { setShowCreateStaff(false); setCreateStaffError(null); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {staffMembers.map(s => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-sm"
                  style={{ background: "hsl(312 18% 9% / 0.4)", border: "1px solid hsl(312 18% 18%)" }}>
                  <span className="font-body text-sm text-foreground">{s.username}</span>
                  <span className="font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                    style={{ background: "hsl(344 47% 22% / 0.2)", color: "hsl(340 30% 58%)", border: "1px solid hsl(344 47% 28% / 0.3)" }}>
                    {s.role.replace("_", " ")}
                  </span>
                </div>
              ))}
              {staffMembers.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-4">No staff accounts yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="stat-card-glow rounded-sm p-6 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name or Discord ID…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 font-body text-sm bg-transparent"
                style={{ borderColor: "hsl(312 18% 22%)" }}
              />
            </div>
            <Select value={filterType} onValueChange={v => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }}>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whitelist">Server Whitelist</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="beta">Beta Testing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-52 font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
                <SelectItem value="More Information Required">More Info Required</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="outline"
              className="bg-transparent flex-shrink-0"
              style={{ borderColor: "hsl(312 18% 22%)" }}
              onClick={() => { fetchApplications(); fetchStats(); }}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Applications list */}
        <div className="stat-card-glow rounded-sm overflow-hidden mb-4">
          {loading ? (
            <div className="p-12 text-center">
              <p className="font-body text-sm text-muted-foreground">Loading applications…</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="font-body text-sm" style={{ color: "hsl(0 84% 65%)" }}>{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="font-display text-lg font-medium text-foreground mb-1">No Applications Found</p>
              <p className="font-body text-sm text-muted-foreground">
                {search || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search filters."
                  : "No applications have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid hsl(312 18% 18%)" }}>
                    {["ID", "Applicant", "Discord ID", "Type", "Status", "Submitted", "Reviewer", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr
                      key={app.id}
                      className="transition-colors hover:bg-white/[0.015] cursor-pointer"
                      style={{ borderBottom: i < applications.length - 1 ? "1px solid hsl(312 18% 14%)" : "none" }}
                      onClick={() => openDetail(app)}
                    >
                      <td className="px-4 py-3 font-body text-xs tabular-nums text-muted-foreground">#{app.id}</td>
                      <td className="px-4 py-3 font-body text-sm text-foreground">{app.applicant_name || "—"}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">{app.applicant_discord}</td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                        {TYPE_LABELS[app.type] ?? app.type}
                      </td>
                      <td className="px-4 py-3"><StatusPill status={app.status} /></td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(app.submitted_at)}
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                        {app.assigned_reviewer || <span className="opacity-40">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-body text-[10px] tracking-widest uppercase bg-transparent"
                          style={{ borderColor: "hsl(344 47% 30% / 0.45)", color: "hsl(345 40% 75%)" }}
                          onClick={e => { e.stopPropagation(); openDetail(app); }}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-muted-foreground">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1}
                className="bg-transparent font-body text-xs"
                style={{ borderColor: "hsl(312 18% 22%)" }}
                onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="font-body text-xs text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={page >= totalPages}
                className="bg-transparent font-body text-xs"
                style={{ borderColor: "hsl(312 18% 22%)" }}
                onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Detail dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent
            className="max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: "hsl(312 20% 10%)", border: "1px solid hsl(312 18% 22%)" }}
          >
            {selectedApp && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-medium text-foreground">
                    Application #{selectedApp.id} — {TYPE_LABELS[selectedApp.type] ?? selectedApp.type}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Applicant info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Applicant Name", value: selectedApp.applicant_name },
                      { label: "Discord ID", value: selectedApp.applicant_discord },
                      { label: "Submitted", value: formatDate(selectedApp.submitted_at) },
                      { label: "Current Status", value: <StatusPill status={selectedApp.status} /> },
                    ].map(field => (
                      <div key={String(field.label)} className="space-y-1">
                        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                          {field.label}
                        </p>
                        <div className="font-body text-sm text-foreground">{field.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Answers */}
                  <div>
                    <button
                      className="flex items-center gap-2 font-display text-base font-medium text-foreground mb-3 hover:opacity-80 transition-opacity"
                      onClick={() => setExpandedAnswers(v => !v)}
                    >
                      Submitted Answers
                      {expandedAnswers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {expandedAnswers && (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {Object.entries(selectedApp.answers || {}).map(([q, a]) => (
                          <div key={q} className="p-3 rounded-sm"
                            style={{ background: "hsl(312 18% 8% / 0.6)", border: "1px solid hsl(312 18% 18%)" }}>
                            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{q}</p>
                            <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{a || <span className="opacity-40">No answer</span>}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review controls */}
                  <div
                    className="rounded-sm p-5 space-y-4"
                    style={{ background: "hsl(312 18% 8% / 0.5)", border: "1px solid hsl(344 47% 24% / 0.3)" }}
                  >
                    <p className="font-display text-base font-medium text-foreground">Review Actions</p>

                    {updateSuccess && (
                      <div className="p-3 rounded-sm" style={{ background: "hsl(140 40% 12% / 0.3)", border: "1px solid hsl(140 40% 26% / 0.4)" }}>
                        <p className="font-body text-sm" style={{ color: "hsl(140 40% 55%)" }}>Updated successfully.</p>
                      </div>
                    )}
                    {updateError && (
                      <p className="font-body text-sm" style={{ color: "hsl(0 84% 65%)" }}>{updateError}</p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger className="font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Denied">Denied</SelectItem>
                            <SelectItem value="More Information Required">More Information Required</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Assigned Reviewer</Label>
                        <Input value={newReviewer} onChange={e => setNewReviewer(e.target.value)}
                          placeholder="Reviewer username"
                          className="font-body text-sm bg-transparent" style={{ borderColor: "hsl(312 18% 22%)" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
                        Private Staff Notes (not visible to applicant)
                      </Label>
                      <Textarea
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add internal notes visible only to staff…"
                        rows={3}
                        className="font-body text-sm bg-transparent resize-none"
                        style={{ borderColor: "hsl(312 18% 22%)" }}
                      />
                    </div>

                    <Button
                      className="western-gradient font-body text-xs tracking-widest uppercase border-0 text-foreground hover:opacity-90 transition-all"
                      disabled={updating}
                      onClick={handleUpdate}
                    >
                      {updating ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm"
                      className="font-body text-xs tracking-widest uppercase bg-transparent"
                      style={{ borderColor: "hsl(312 18% 22%)", color: "hsl(345 40% 70%)" }}>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;