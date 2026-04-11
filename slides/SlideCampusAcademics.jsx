import React from "react";
import { InputField, OptionPills, SelectField } from "../components/FormControls";

export default function SlideCampusAcademics({ form, setForm }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium text-slate-700">Campus Location / ግቢ</p>
        <OptionPills
          value={form.campus}
          onChange={(campus) => setForm((prev) => ({ ...prev, campus }))}
          options={["ሀ-ዋና ግቢ", "ለ-ገንደጄ", "ሐ-ስቴሽን"]}
        />
      </div>

      <SelectField
        label="Field of Study / የትምህርት ዘርፍ"
        value={form.fieldOfStudy}
        onChange={(e) => setForm((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
      >
        <option value="">Select</option>
        <option value="Natural Science (NS)">Natural Science (NS)</option>
        <option value="Social Science (SS)">Social Science (SS)</option>
      </SelectField>

      <InputField
        label="Building & Dorm / ህንጻ እና ዶርም"
        value={form.dorm}
        onChange={(e) => setForm((prev) => ({ ...prev, dorm: e.target.value }))}
        placeholder="Building / Dorm number"
      />
    </div>
  );
}
