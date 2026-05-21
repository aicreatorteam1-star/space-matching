// =====================================================================
//  <LocationSelector />
//  ส่วนที่ 1: เลือกสาขา (สุขุมวิท / บางนา / พระราม 3)
//  -----------------------------------------------------------------
//  UI/UX rules ที่ apply:
//   • สี: ใช้ token จาก brand.config.ts (deepSpace / electricPurple / neonCyan)
//   • ปุ่ม "card" : min-height 144px, radius 16px, hover ยก -2px + glow purple
//   • Active state : border 2px electricPurple + bg gradient (galaxy)
//   • Icon : Lucide React (`MapPin`)
// =====================================================================
import React from "react";
import { MapPin, Building2, CheckCircle2 } from "lucide-react";
import { BRANCHES } from "../utils/matchRoom";
import type { BranchId } from "../types";

interface Props {
  value: BranchId | null;
  onChange: (id: BranchId) => void;
}

export const LocationSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <section aria-labelledby="loc-heading" className="sm-section">
      <header className="sm-section__head">
        <span className="sm-step-pill">ขั้นตอนที่ 1</span>
        <h2 id="loc-heading" className="sm-section__title">
          <MapPin size={22} strokeWidth={2.25} aria-hidden />
          เลือกทำเล / สาขา
        </h2>
        <p className="sm-section__sub">
          เลือกสาขาที่สะดวกในการขนย้ายของฝาก เจ้าหน้าที่จะติดต่อกลับเพื่อนัดเวลา
        </p>
      </header>

      <div className="sm-branch-grid" role="radiogroup" aria-label="เลือกสาขา">
        {BRANCHES.map((b) => {
          const selected = value === b.id;
          return (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(b.id)}
              className={
                "sm-branch-card" + (selected ? " sm-branch-card--active" : "")
              }
            >
              <span className="sm-branch-card__icon" aria-hidden>
                <Building2 size={28} strokeWidth={2} />
              </span>
              <span className="sm-branch-card__name">{b.name}</span>
              <span className="sm-branch-card__addr">{b.address}</span>
              <span className="sm-branch-card__rooms">
                เหลือ {b.availableRooms} ห้องว่าง
              </span>
              {selected && (
                <span className="sm-branch-card__check" aria-hidden>
                  <CheckCircle2 size={22} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
