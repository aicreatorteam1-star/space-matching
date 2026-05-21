// =====================================================================
//  <MatchingResult />
//  ส่วนที่ 3: แสดงผลห้องที่เหมาะสม (S / M / L / XL) + ฟอร์มกรอกข้อมูล
//  -----------------------------------------------------------------
//  UI/UX rules:
//   • Card ผลลัพธ์ : ใช้ aurora gradient (purple→cyan) สำหรับ recommend
//   • CTA "ส่งข้อมูล" : ปุ่ม large (h=48), radius 12, gradient bg, hover lift
//   • Form input  : h=44, border 1px deepSpace/20, focus → electricPurple
// =====================================================================
import React, { useMemo, useState } from "react";
import { Sparkles, Send, User, Phone, Clock3 } from "lucide-react";
import {
  ROOMS,
  BRANCHES,
  calcTotalItems,
  calcTotalUnits,
  formatTHB,
  matchRoom,
} from "../utils/matchRoom";
import type { BranchId, ContactInfo, ItemCounts } from "../types";

interface Props {
  branch: BranchId | null;
  items: ItemCounts;
  contact: ContactInfo;
  onChangeContact: (next: ContactInfo) => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const PHONE_RE = /^0\d{8,9}$/;

export const MatchingResult: React.FC<Props> = ({
  branch,
  items,
  contact,
  onChangeContact,
  onSubmit,
  submitting,
}) => {
  const totalItems = calcTotalItems(items);
  const totalUnits = calcTotalUnits(items);
  const matched = useMemo(() => matchRoom(items), [items]);
  const branchObj = BRANCHES.find((b) => b.id === branch) ?? null;

  const [touched, setTouched] = useState<{ name: boolean; phone: boolean }>({
    name: false,
    phone: false,
  });

  const errors = {
    branch: branch == null ? "กรุณาเลือกสาขา" : "",
    items: totalItems <= 0 ? "กรุณาระบุจำนวนสิ่งของอย่างน้อย 1 รายการ" : "",
    name: contact.fullName.trim().length < 2 ? "กรุณากรอกชื่อ-นามสกุล" : "",
    phone: !PHONE_RE.test(contact.phone.trim())
      ? "กรุณากรอกเบอร์โทร 9-10 หลัก (เริ่มต้นด้วย 0)"
      : "",
  };
  const isValid = Object.values(errors).every((e) => !e);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (!isValid) return;
    onSubmit();
  };

  return (
    <section aria-labelledby="match-heading" className="sm-section">
      <header className="sm-section__head">
        <span className="sm-step-pill">ขั้นตอนที่ 3</span>
        <h2 id="match-heading" className="sm-section__title">
          <Sparkles size={22} strokeWidth={2.25} aria-hidden />
          ผลการจับคู่ห้องที่เหมาะสม
        </h2>
        <p className="sm-section__sub">
          ระบบคำนวณจากจำนวนสิ่งของของคุณ เป็นข้อเสนอเบื้องต้น
          เจ้าหน้าที่จะตรวจสอบและยืนยันอีกครั้ง
        </p>
      </header>

      {/* -------------------- Result block -------------------- */}
      <div className="sm-result">
        {matched ? (
          <div className="sm-result__hero">
            <div className="sm-result__badge">เหมาะสมที่สุด</div>
            <div className="sm-result__size">{matched.size}</div>
            <div className="sm-result__meta">
              <div>
                <span className="sm-result__label">ขนาดห้อง</span>
                <span className="sm-result__val">{matched.area}</span>
              </div>
              <div>
                <span className="sm-result__label">ราคา</span>
                <span className="sm-result__val sm-result__val--price">
                  {formatTHB(matched.pricePerMonth)}
                  <small> / เดือน</small>
                </span>
              </div>
            </div>
            <p className="sm-result__desc">{matched.description}</p>
          </div>
        ) : (
          <div className="sm-result__empty">
            ยังไม่มีรายการ — เพิ่มจำนวนสิ่งของในขั้นตอนที่ 2 เพื่อดูผลลัพธ์
          </div>
        )}

        <div className="sm-result__compare">
          <div className="sm-result__compare-title">ตัวเลือกห้องอื่น</div>
          <ul className="sm-result__compare-list">
            {ROOMS.map((r) => {
              const active = matched?.size === r.size;
              return (
                <li
                  key={r.size}
                  className={
                    "sm-result__compare-item" +
                    (active ? " sm-result__compare-item--active" : "")
                  }
                >
                  <span className="sm-result__compare-size">{r.size}</span>
                  <span className="sm-result__compare-area">{r.area}</span>
                  <span className="sm-result__compare-price">
                    {formatTHB(r.pricePerMonth)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* -------------------- Summary strip -------------------- */}
      <div className="sm-summary">
        <div>
          <span className="sm-summary__label">สาขาที่เลือก</span>
          <span className="sm-summary__val">
            {branchObj ? branchObj.name : "— ยังไม่ได้เลือก —"}
          </span>
        </div>
        <div>
          <span className="sm-summary__label">จำนวนสิ่งของ</span>
          <span className="sm-summary__val">{totalItems} รายการ</span>
        </div>
        <div>
          <span className="sm-summary__label">หน่วยพื้นที่</span>
          <span className="sm-summary__val">{totalUnits} units</span>
        </div>
      </div>

      {/* -------------------- Contact form -------------------- */}
      <form className="sm-form" onSubmit={handleSubmit} noValidate>
        <div className="sm-form__row">
          <label className="sm-field">
            <span className="sm-field__label">
              <User size={16} strokeWidth={2} /> ชื่อ - นามสกุล
            </span>
            <input
              type="text"
              className={
                "sm-input" +
                (touched.name && errors.name ? " sm-input--err" : "")
              }
              placeholder="เช่น สมชาย ใจดี"
              value={contact.fullName}
              onChange={(e) =>
                onChangeContact({ ...contact, fullName: e.target.value })
              }
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              required
            />
            {touched.name && errors.name && (
              <span className="sm-field__err">{errors.name}</span>
            )}
          </label>

          <label className="sm-field">
            <span className="sm-field__label">
              <Phone size={16} strokeWidth={2} /> เบอร์โทรศัพท์
            </span>
            <input
              type="tel"
              inputMode="numeric"
              className={
                "sm-input" +
                (touched.phone && errors.phone ? " sm-input--err" : "")
              }
              placeholder="0XXXXXXXXX"
              value={contact.phone}
              onChange={(e) =>
                onChangeContact({
                  ...contact,
                  phone: e.target.value.replace(/[^\d]/g, ""),
                })
              }
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              maxLength={10}
              required
            />
            {touched.phone && errors.phone && (
              <span className="sm-field__err">{errors.phone}</span>
            )}
          </label>
        </div>

        <label className="sm-field">
          <span className="sm-field__label">
            <Clock3 size={16} strokeWidth={2} /> ช่วงเวลาที่สะดวกให้ติดต่อกลับ
            <span className="sm-field__optional">(ไม่บังคับ)</span>
          </span>
          <input
            type="text"
            className="sm-input"
            placeholder="เช่น จันทร์–ศุกร์ 10:00–18:00"
            value={contact.preferredContactTime ?? ""}
            onChange={(e) =>
              onChangeContact({
                ...contact,
                preferredContactTime: e.target.value,
              })
            }
          />
        </label>

        <button
          type="submit"
          className="sm-btn sm-btn--primary sm-btn--large"
          disabled={!isValid || submitting}
        >
          <Send size={18} strokeWidth={2.25} />
          {submitting ? "กำลังส่งข้อมูล..." : "ส่งข้อมูลให้เจ้าหน้าที่ติดต่อกลับ"}
        </button>

        {!isValid && (touched.name || touched.phone) && (
          <p className="sm-form__hint">
            {errors.branch || errors.items || "กรุณาตรวจสอบข้อมูลให้ครบถ้วน"}
          </p>
        )}
      </form>
    </section>
  );
};
