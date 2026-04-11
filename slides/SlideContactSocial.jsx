import React from "react";
import { InputField } from "../components/FormControls";

export default function SlideContactSocial({ form, setForm }) {
  return (
    <div className="space-y-4">
      <p className="rounded-2xl bg-primary/5 p-4 text-sm leading-relaxed text-slate-700">
        እግዚአብሔር አገልግሎታችሁን ይባርክ። የቀረቡትን መረጃዎች መሠረት በማድረግ በቅርቡ እናገኛችኋለን።
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="ሞባይል"
          value={form.mobile}
          onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))}
          placeholder="+251 9xx xxx xxx"
        />
        <InputField
          label="ኢሜይል"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="info@huggb.org"
        />
        <InputField
          label="ፌስቡክ"
          value={form.facebook}
          onChange={(e) => setForm((prev) => ({ ...prev, facebook: e.target.value }))}
          placeholder="HUGGB Official"
        />
        <InputField
          label="ቴሌግራም"
          value={form.telegram}
          onChange={(e) => setForm((prev) => ({ ...prev, telegram: e.target.value }))}
          placeholder="@HU_GGB"
        />
      </div>
    </div>
  );
}
