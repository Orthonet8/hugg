import React from "react";
import { InputField, OptionPills, SelectField } from "../components/FormControls";

const serviceOptions = [
  "ትምህርት ክፍል",
  "መዝሙር ክፍል",
  "ልማት ክፍል",
  "መረጃ ክፍል",
  "አባላት ክፍል",
  "ሌሎች",
];

const talentOptions = ["ዋሽንት", "በገና", "ድርሰት", "ስዕል", "ቴክኖሎጂ"];

export default function SlideSkillsService({ form, setForm }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField
        label="የክህነት መዓርግ / Title"
        value={form.ordination}
        onChange={(e) => setForm((prev) => ({ ...prev, ordination: e.target.value }))}
      >
        <option value="">ምንም (None)</option>
        <option>ዲያቆን (Deacon)</option>
        <option>ቄስ (Priest)</option>
        <option>መርጌታ (Mergeta)</option>
      </SelectField>
      <InputField
        label="የተቀበሉበት ዘመን"
        value={form.ordinationYear}
        onChange={(e) => setForm((prev) => ({ ...prev, ordinationYear: e.target.value }))}
      />
      <InputField
        label="ሀገረ ስብከት"
        value={form.diocese}
        onChange={(e) => setForm((prev) => ({ ...prev, diocese: e.target.value }))}
      />
      <InputField
        label="የሾሙት ጳጳስ"
        value={form.bishop}
        onChange={(e) => setForm((prev) => ({ ...prev, bishop: e.target.value }))}
      />

      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium text-slate-700">ማገልገል የሚፈልጉበት ክፍል</p>
        <OptionPills
          value={form.serviceDepartments}
          multi
          options={serviceOptions}
          onChange={(serviceDepartments) => setForm((prev) => ({ ...prev, serviceDepartments }))}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <p className="text-sm font-medium text-slate-700">ልዩ ተሰጥኦ (Special Talents)</p>
        <OptionPills
          value={form.talents}
          multi
          options={talentOptions}
          onChange={(talents) => setForm((prev) => ({ ...prev, talents }))}
        />
      </div>

      <div className="md:col-span-2">
        <InputField
          label="ተሰጥኦዎን ይግለጹ"
          value={form.talentDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, talentDescription: e.target.value }))}
          placeholder="ተጨማሪ ማብራሪያ"
        />
      </div>
    </div>
  );
}
