import React, { useEffect, useMemo, useState } from "react";
import { createLead } from "../api";
import productsData from "../data/all_funnel_products.json"; // uses your JSON

const DIVISIONS = [
  "Crash Barrier",
  "STP",
  "Solar",
  "High Mast and Poles",
  "Rolling Mill",
  "Railway",
  "Beam (GI)",
  "Transmission Line Tower",
];

// Small toast component
function Toast({ open, type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  const icon =
    type === "success" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm4.3-12.7-5 5a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4l1.3 1.3 4.3-4.3a1 1 0 1 1 1.4 1.4Z"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm1 13v2h-2v-2h2Zm0-8v6h-2V7h2Z"
        />
      </svg>
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50"
    >
      <div
        className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${styles}`}
      >
        <div className="mt-0.5">{icon}</div>
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

export default function LeadForm({ onCreated }) {
  const [form, setForm] = useState({
    division: "",
    productCategory: "",
    product: "",
    customerName: "",
    customerPhone: "",
    email: "",
    location: "",
    productDescription: "",
    areaofInterest: "",
    firmName: "",
    feedback: "",
    remark: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  // NEW: accordion open state for additional details
  const [showAdditional, setShowAdditional] = useState(false);

  // ✅ Now only basic info is required; product/division/description are "additional"
  const isValid = useMemo(() => {
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneOK = /^[0-9+\-()\s]{7,20}$/.test(form.customerPhone);
    return (
      form.customerName.trim() && phoneOK && emailOK && form.location.trim()
    );
  }, [form]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onCategoryChange(e) {
    const category = e.target.value;
    setForm((prev) => ({ ...prev, productCategory: category, product: "" }));
  }

  function resetForm() {
    setForm({
      division: "",
      productCategory: "",
      product: "",
      customerName: "",
      customerPhone: "",
      email: "",
      location: "",
      productDescription: "",
      areaofInterest: "",
      firmName: "",
      feedback: "",
      remark: "",
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      setToast({
        open: true,
        type: "error",
        message: "Please fill all required fields correctly.",
      });
      return;
    }
    setLoading(true);

    try {
      const resp = await createLead(form);
      const wa = resp?.whatsapp;
      const waMsg = wa?.ok ? "Mail message sent." : "Mail send failed.";
      setToast({
        open: true,
        type: wa?.ok ? "success" : "error",
        message: `Saved! ${waMsg}`,
      });
      resetForm(); // ✅ clear form right after success
      onCreated?.(); // optional: refresh list in parent
    } catch (err) {
      setToast({
        open: true,
        type: "error",
        message: err.message || "Failed to save.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Derived options
  const categories = Object.keys(productsData || {});
  const currentProducts = form.productCategory
    ? (productsData[form.productCategory] || [])
      .map((p) => (typeof p === "string" ? p : p?.name || ""))
      .filter(Boolean)
    : [];

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-7">
        {/* Section: Basic Info */}
        <div>
          <h3 className="text-base font-semibold text-slate-900">Basic Info</h3>
          <p className="text-sm text-slate-500">
            Customer contact and lead details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer name <span className="text-rose-500">*</span>
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={onChange}
              required
              placeholder="John Doe"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Customer phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer phone <span className="text-rose-500">*</span>
            </label>
            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={onChange}
              required
              placeholder="+91 98765 43210"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="john@example.com"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              required
              placeholder="City, State"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Area of Interest */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Area of Interest
            </label>
            <input
              name="areaofInterest"
              value={form.areaofInterest}
              onChange={onChange}
              placeholder="Products"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Firm Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Firm Name
            </label>
            <input
              name="firmName"
              value={form.firmName}
              onChange={onChange}
              placeholder="Company Name"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* ACCORDION: Additional details (Division, Category, Product, Description) */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setShowAdditional((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>
                Additional details (Division & Product){" "}
                <span className="text-xs text-slate-500">(optional)</span>
              </span>
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center">
                <svg
                  className={`h-4 w-4 transform transition-transform ${showAdditional ? "rotate-180" : "rotate-0"
                    }`}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {showAdditional && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Division (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Division{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <select
                    name="division"
                    value={form.division}
                    onChange={onChange}
                    className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select division</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Category (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Category{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <select
                    name="productCategory"
                    value={form.productCategory}
                    onChange={onCategoryChange}
                    className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Select a category to load products.
                  </p>
                </div>

                {/* Product (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={onChange}
                    disabled={!form.productCategory}
                    className="block w-full rounded-lg border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select product</option>
                    {currentProducts.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product description (optional) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product description{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    name="productDescription"
                    value={form.productDescription}
                    onChange={onChange}
                    rows={3}
                    placeholder="Describe the product or requirement..."
                    className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* ✅ Feedback (optional) */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Feedback{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    name="feedback"
                    value={form.feedback}
                    onChange={onChange}
                    rows={3}
                    placeholder="Customer feedback or comments..."
                    className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* ✅ Remark (optional) */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Remark{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={onChange}
                    rows={3}
                    placeholder="Internal remark / follow-up note..."
                    className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                />
              </svg>
            )}
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        duration={3000} // auto-dismiss after 3s
      />
    </>
  );
}
