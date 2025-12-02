import React, { useEffect, useRef } from "react";

export default function LeadDetailsModal({ open, onClose, lead }) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      // focus close button for accessibility
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      // prevent background scroll
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !lead) return null;

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-3 gap-3 py-2">
      <div className="col-span-1 text-sm font-medium text-slate-600">{label}</div>
      <div className="col-span-2 text-sm text-slate-800">{children}</div>
    </div>
  );

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        // close when clicking outside the panel
        if (e.target === overlayRef.current) onClose?.();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div className="mx-4 w-full max-w-2xl rounded-xl bg-white shadow-2xl border">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <h3 id="lead-modal-title" className="text-lg font-semibold text-slate-900">
              {lead.customerName}
            </h3>
            <p className="text-xs text-slate-500">
              Created {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Close details"
          >
            Close
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="divide-y">
            <Row label="Division">{lead.division}</Row>
            <Row label="Product Category">{lead.productCategory || "-"}</Row>
            <Row label="Product">{lead.product || "-"}</Row>
            <Row label="Phone">{lead.customerPhone}</Row>
            <Row label="Email">
              <a className="text-primary hover:underline" href={`mailto:${lead.email}`}>
                {lead.email}
              </a>
            </Row>
            <Row label="Location">{lead.location}</Row>
            <Row label="Description">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-800">
                {lead.productDescription}
              </div>
            </Row>
            <Row label="Remark 1">{lead.remark1 || "-"}</Row>
            <Row label="Remark 2">{lead.remark2 || "-"}</Row>
          </div>
        </div>
      </div>
    </div>
  );
}
