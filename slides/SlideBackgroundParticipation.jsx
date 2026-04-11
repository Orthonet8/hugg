import React from "react";
import { InputField, OptionPills, SelectField } from "../components/FormControls";

export default function SlideBackgroundParticipation({ form, setForm }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField
        label="ክልል (Region)"
        value={form.region}
        onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
      >
        <option value="">Select Region</option>
        <option>Addis Ababa</option>
        <option>Amhara</option>
        <option>Oromia</option>
        <option>Tigray</option>
        <option>Sidama</option>
      </SelectField>
      <InputField
        label="ዞን (Zone)"
        value={form.zone}
        onChange={(e) => setForm((prev) => ({ ...prev, zone: e.target.value }))}
      />
      <InputField
        label="ወረዳ (Woreda)"
        value={form.woreda}
        onChange={(e) => setForm((prev) => ({ ...prev, woreda: e.target.value }))}
      />
      <InputField
        label="የአፍ መፍቻ ቋንቋ"
        value={form.nativeLanguage}
        onChange={(e) => setForm((prev) => ({ ...prev, nativeLanguage: e.target.value }))}
      />
      <InputField
        label="ተጨማሪ ቋንቋዎች"
        value={form.extraLanguages}
        onChange={(e) => setForm((prev) => ({ ...prev, extraLanguages: e.target.value }))}
      />

      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium text-slate-700">ከዚህ በፊት በሰ/ት/ቤት ይሳተፉ ነበር?</p>
        <OptionPills
          value={form.previousParticipation}
          onChange={(previousParticipation) =>
            setForm((prev) => ({ ...prev, previousParticipation }))
          }
          options={["አዎ (Yes)", "አልሳተፍም (No)"]}
        />
      </div>

      <InputField
        label="የአጥቢያ ቤተክርስቲያን ሙሉ ስም"
        value={form.localChurch}
        onChange={(e) => setForm((prev) => ({ ...prev, localChurch: e.target.value }))}
      />
    </div>
  );
}
