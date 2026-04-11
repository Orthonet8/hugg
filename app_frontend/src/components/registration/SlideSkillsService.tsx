import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills, SelectField } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideSkillsService = ({ form, setForm }: SlideProps) => (
  <div className="space-y-4">
    <SelectField
      label="ቅድስት ሥርዓት / Ordination"
      value={form.ordination}
      onChange={(e) => setForm((f) => ({ ...f, ordination: e.target.value }))}
    >
      <option value="">Select if applicable</option>
      <option value="ዲቁና">ዲቁና (Deacon)</option>
      <option value="ክህነት">ክህነት (Priest)</option>
      <option value="ሌላ">ሌላ (Other)</option>
    </SelectField>

    {form.ordination && (
      <InputField
        label="የትምህርት ዓመት / Year of Ordination"
        value={form.ordinationYear}
        onChange={(e) => setForm((f) => ({ ...f, ordinationYear: e.target.value }))}
        placeholder="e.g., 2018"
      />
    )}

    {form.ordination && (
      <>
        <InputField
          label="ዲሲፕሊን / Diocese"
          value={form.diocese}
          onChange={(e) => setForm((f) => ({ ...f, diocese: e.target.value }))}
          placeholder="Your diocese"
        />
        <InputField
          label="ጳጳስ / Bishop"
          value={form.bishop}
          onChange={(e) => setForm((f) => ({ ...f, bishop: e.target.value }))}
          placeholder="Your bishop's name"
        />
      </>
    )}

    <OptionPills
      label="የአገልግሎት ክፍሎች / Service Departments"
      value={form.serviceDepartments}
      options={["ትምህርት", "መዝሙር", "ልማት", "አባላት ጉዳይ", "ፋይናንስ"]}
      onChange={(v) => setForm((f) => ({ ...f, serviceDepartments: v as string[] }))}
      multi
    />

    <OptionPills
      label="ተሰጥኦዎች / Talents"
      value={form.talents}
      options={["መዝሙር", "ድርሰት", "የሚዲያ ስራ", "ማስተማር", "ጸሎት", "ሌላ"]}
      onChange={(v) => setForm((f) => ({ ...f, talents: v as string[] }))}
      multi
    />

    {form.talents.length > 0 && (
      <InputField
        label="ተሰጥኦ ማብራሪያ"
        value={form.talentDescription}
        onChange={(e) => setForm((f) => ({ ...f, talentDescription: e.target.value }))}
        placeholder="Describe your talents and how you'd serve..."
      />
    )}
  </div>
);
