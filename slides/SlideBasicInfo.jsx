import React from "react";
import { InputField, OptionPills } from "../components/FormControls";

export default function SlideBasicInfo({ form, setForm }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InputField
        label="ሙሉ ስም (Full Name)"
        value={form.fullName}
        onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
        placeholder="ሙሉ ስም ያስገቡ"
      />
      <InputField
        label="የክርስትና ስም (Christian Name)"
        value={form.christianName}
        onChange={(e) => setForm((prev) => ({ ...prev, christianName: e.target.value }))}
        placeholder="የክርስትና ስም"
      />
      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium text-slate-700">ጾታ (Gender)</p>
        <OptionPills
          value={form.gender}
          onChange={(gender) => setForm((prev) => ({ ...prev, gender }))}
          options={["ወንድ", "ሴት"]}
        />
      </div>
      <InputField
        label="እድሜ (Age)"
        type="number"
        value={form.age}
        onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
        placeholder="18"
      />
    </div>
  );
}
