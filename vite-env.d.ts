// =====================================================================
//  <SpaceMatchingPage />
//  หน้าเดียวรวม 3 ส่วน:
//   1. LocationSelector   — เลือกสาขา
//   2. ItemCounter        — ระบุจำนวนสิ่งของ
//   3. MatchingResult     — คำนวณ S/M/L + ฟอร์มชื่อ/เบอร์
//
//  หมายเหตุ: ใน round นี้ submit จะแค่ console.log + alert เพื่อทดสอบ
//  Logic การจัดเก็บจริงจะทำใน round ถัดไปก่อน deploy
// =====================================================================
import React, { useState } from "react";
import { Warehouse, Phone } from "lucide-react";
import { LocationSelector } from "./components/LocationSelector";
import { ItemCounter } from "./components/ItemCounter";
import { MatchingResult } from "./components/MatchingResult";
import { EMPTY_ITEM_COUNTS, matchRoom, BRANCHES } from "./utils/matchRoom";
import type { BranchId, ContactInfo, ItemCounts } from "./types";
import "./space-matching.css";

const EMPTY_CONTACT: ContactInfo = {
  fullName: "",
  phone: "",
  preferredContactTime: "",
};

export const SpaceMatchingPage: React.FC = () => {
  const [branch, setBranch] = useState<BranchId | null>(null);
  const [items, setItems] = useState<ItemCounts>(EMPTY_ITEM_COUNTS);
  const [contact, setContact] = useState<ContactInfo>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    const payload = {
      branch,
      branchName: BRANCHES.find((b) => b.id === branch)?.name,
      items,
      matched: matchRoom(items),
      contact,
      submittedAt: new Date().toISOString(),
    };
    // eslint-disable-next-line no-console
    console.log("[SpaceMatching] payload →", payload);
    // จำลอง network call สำหรับ frontend testing
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const reset = () => {
    setBranch(null);
    setItems(EMPTY_ITEM_COUNTS);
    setContact(EMPTY_CONTACT);
    setSubmitted(false);
  };

  return (
    <div className="sm-page">
      {/* -------------- Hero / Header -------------- */}
      <header className="sm-hero">
        <div className="sm-hero__inner">
          <span className="sm-hero__eyebrow">
            <Warehouse size={16} strokeWidth={2.25} />
            Space Matching Platform
          </span>
          <h1 className="sm-hero__title">
            ฝากเก็บของง่าย ๆ <br />
            <span className="sm-hero__title-grad">เลือกสาขา · จับคู่ห้อง · จบในหน้าเดียว</span>
          </h1>
          <p className="sm-hero__sub">
            ระบุสิ่งของที่ต้องการฝาก ระบบจะคำนวณขนาดห้องที่เหมาะสมพร้อมราคาให้ทันที
            จากนั้นเจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันรายละเอียด
          </p>
        </div>
      </header>

      <main className="sm-main">
        {submitted ? (
          <div className="sm-success" role="status">
            <div className="sm-success__check">✓</div>
            <h2>ส่งข้อมูลเรียบร้อย</h2>
            <p>
              ขอบคุณคุณ <strong>{contact.fullName}</strong> เจ้าหน้าที่จะติดต่อกลับ
              ทางเบอร์ <strong>{contact.phone}</strong> ภายใน 24 ชั่วโมง
            </p>
            <button className="sm-btn sm-btn--ghost" onClick={reset}>
              ทำรายการใหม่
            </button>
          </div>
        ) : (
          <>
            <LocationSelector value={branch} onChange={setBranch} />
            <ItemCounter value={items} onChange={setItems} />
            <MatchingResult
              branch={branch}
              items={items}
              contact={contact}
              onChangeContact={setContact}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </>
        )}
      </main>

      <footer className="sm-footer">
        <span>
          ติดต่อสอบถาม
          <Phone size={14} strokeWidth={2.25} /> 02-XXX-XXXX
        </span>
        <span>© {new Date().getFullYear()} InnOlistic · Space Matching</span>
      </footer>
    </div>
  );
};

export default SpaceMatchingPage;
