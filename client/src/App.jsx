import React, { useEffect, useState, useCallback } from "react";
import LeadForm from "./components/LeadForm.jsx";
import CataloguePage from "./components/CataloguePage.jsx";
import AdminLoginModal from "./components/AdminLoginModal.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";

/* --- Simple Toast --- */
function Toast({ open, type = "success", message, onClose, duration = 3000 }) {
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50"
    >
      <div
        className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${styles}`}
      >
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="text-sm">{message}</div>
        <button
          onClick={onClose}
          className="ml-2 rounded-md px-2 py-1 text-xs hover:bg-white/40"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // "form" | "catalogue"
  const [page, setPage] = useState("form");

  // 🔑 Admin auth & login modal state
  const [isAuthed, setIsAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("rr_admin_authed") === "1";
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const showToast = (type, message) =>
    setToast({ open: true, type, message });

  /* -------------------- API: fetch leads (admin only) -------------------- */
  const fetchLeads = useCallback(
    async (notify = false) => {
      if (!isAuthed) return; // safety guard

      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/leads`
        );
        const data = await res.json();
        if (!res.ok || !data.ok)
          throw new Error(data.message || "Failed to fetch leads");
        setLeads(data.data);
        if (notify) showToast("success", "Leads refreshed.");
      } catch (err) {
        console.error("Failed to load leads:", err);
        showToast("error", err.message || "Failed to load leads.");
      } finally {
        setLoading(false);
      }
    },
    [isAuthed]
  );

  // When admin logs in (or page reloads with auth in localStorage), load leads
  useEffect(() => {
    if (isAuthed) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [isAuthed, fetchLeads]);

  /** 🧾 Export all leads to Excel (admin only) */
  const handleExportExcel = () => {
    if (!isAuthed) {
      showToast("error", "Admin login required.");
      return;
    }

    try {
      if (!leads.length) {
        showToast("error", "No leads to export.");
        return;
      }

      const exportData = leads.map((lead, index) => ({
        "S.No": index + 1,
        "Customer Name": lead.customerName,
        Phone: lead.customerPhone,
        Email: lead.email,
        Division: lead.division,
        "Product Category": lead.productCategory,
        Product: lead.product,
        Location: lead.location,
        "Product Description": lead.productDescription,
        "Area of Interest": lead.areaofInterest || "",
        "Firm Name": lead.firmName || "",
        Feedback: lead.feedback || "",
        Remark: lead.remark || "",
        "Created On": new Date(lead.createdAt).toLocaleString(),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      const headerKeys = Object.keys(exportData[0]);
      headerKeys.forEach((_, i) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "0EA5E9" } },
          };
        }
      });

      ws["!cols"] = [
        { wch: 5 },   // S.No
        { wch: 25 },  // Customer Name
        { wch: 15 },  // Phone
        { wch: 30 },  // Email
        { wch: 20 },  // Division
        { wch: 25 },  // Product Category
        { wch: 25 },  // Product
        { wch: 20 },  // Location
        { wch: 40 },  // Product Description
        { wch: 20 },  // Area of Interest
        { wch: 20 },  // Firm Name
        { wch: 30 },  // Feedback
        { wch: 30 },  // Remark
        { wch: 22 },  // Created On
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/octet-stream",
      });
      const filename = `RR_ISPAT_Leads_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      saveAs(blob, filename);

      showToast("success", `Exported ${leads.length} leads to Excel.`);
    } catch (err) {
      console.error("Export failed:", err);
      showToast("error", err.message || "Export failed.");
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthed(true);
    setUserMenuOpen(false);
    showToast("success", "Logged in as admin.");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("rr_admin_authed");
    }
    setIsAuthed(false);
    setUserMenuOpen(false);
    showToast("success", "Logged out.");
  };

  const handleUserIconClick = () => {
    if (!isAuthed) {
      setLoginOpen(true);
    } else {
      setUserMenuOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/HnkzKHZR/Hira-RRispatlogo.png"
              alt="Company Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() =>
                setPage((prev) => (prev === "form" ? "catalogue" : "form"))
              }
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-sky-600 text-white font-medium hover:bg-sky-700 shadow-sm transition"
            >
              {page === "form" ? "View Catalogue" : "Back to Lead Form"}
            </button>

            {/* 🔑 User icon button – login or menu */}
            <button
              type="button"
              onClick={handleUserIconClick}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
              title={isAuthed ? "Admin logged in" : "Admin login"}
            >
              <UserIcon className="h-4 w-4" />
              {isAuthed && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
              )}
            </button>

            {/* Small dropdown menu for logout when authed */}
            {isAuthed && userMenuOpen && (
              <div className="absolute right-0 top-11 w-40 rounded-lg border bg-white shadow-lg z-20">
                <div className="px-3 py-2 text-[11px] text-slate-500 border-b">
                  Logged in as Admin
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Lead form OR catalogue */}
        {page === "form" ? (
          <div className="bg-white rounded-xl border shadow-card">
            <div className="px-6 py-5 border-b">
              <h2 className="text-lg font-semibold text-slate-800">
                New Lead
              </h2>
              <p className="text-sm text-slate-500">
                Fill in the details below.
              </p>
            </div>
            <div className="p-6">
              {/* anyone can submit leads; admin gets list + export */}
              <LeadForm onCreated={() => fetchLeads(true)} />
            </div>
          </div>
        ) : (
          <CataloguePage />
        )}

        {/* ✅ Admin-only leads list + Export button beside Refresh */}
        {isAuthed && (
          <div className="bg-white rounded-xl border shadow-card">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                All Leads
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchLeads(true)}
                  className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600"
                >
                  Refresh
                </button>
                <button
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 shadow-sm transition"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export to Excel
                </button>
              </div>
            </div>

            <div className="p-2">
              <div className="max-h-[520px] overflow-y-auto">
                {loading ? (
                  <p className="text-slate-500 text-sm text-center py-10">
                    Loading leads...
                  </p>
                ) : leads.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-10">
                    No leads found.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {leads.map((lead) => (
                      <li key={lead._id}>
                        <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {lead.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lead.email} • {lead.customerPhone}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(
                              lead.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        duration={3000}
      />

      {/* 🔐 Admin login modal */}
      <AdminLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
