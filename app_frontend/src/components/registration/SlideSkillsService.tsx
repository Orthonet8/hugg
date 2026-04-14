import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills, SelectField } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

const DEPT_COLORS: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  "ትምህርት":     { bg: "var(--dept-edu-chip-bg)",     text: "var(--dept-edu-chip-text)",     activeBg: "var(--dept-edu-dot)",     activeText: "#fff" },
  "መዝሙር":     { bg: "var(--dept-song-chip-bg)",    text: "var(--dept-song-chip-text)",    activeBg: "var(--dept-song-dot)",    activeText: "#fff" },
  "ልማት":      { bg: "var(--dept-dev-chip-bg)",     text: "var(--dept-dev-chip-text)",     activeBg: "var(--dept-dev-dot)",     activeText: "#fff" },
  "አባላት ጉዳይ": { bg: "var(--dept-member-chip-bg)",  text: "var(--dept-member-chip-text)",  activeBg: "var(--dept-member-dot)",  activeText: "#fff" },
  "ፋይናንስ":    { bg: "var(--dept-finance-chip-bg)", text: "var(--dept-finance-chip-text)", activeBg: "var(--dept-finance-dot)", activeText: "#fff" },
};

const TALENTS = ["መዝሙር", "ድርሰት", "የሚዲያ ስራ", "ማስተማር", "ጸሎት", "ሌላ"];

export const SlideSkillsService = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  const toggleDept = (dept: string) => {
    setForm((f) => ({
      ...f,
      serviceDepartments: f.serviceDepartments.includes(dept)
        ? f.serviceDepartments.filter((d) => d !== dept)
        : [...f.serviceDepartments, dept],
    }));
  };

  return (
    <div className="space-y-5">
      {/* Colorful department chips */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[color:var(--text-secondary)]">
          {t("reg.serviceDepartments")}
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(DEPT_COLORS).map(([dept, colors]) => {
            const active = form.serviceDepartments.includes(dept);
            return (
              <button
                key={dept}
                type="button"
                onClick={() => toggleDept(dept)}
                className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: active ? `var(--dept-${deptKey(dept)}-dot)` : `var(--dept-${deptKey(dept)}-chip-bg)`,
                  color: active ? "#fff" : `var(--dept-${deptKey(dept)}-chip-text)`,
                  boxShadow: active ? `0 2px 8px ${colors.activeBg}55` : "none",
                  transform: active ? "scale(1.05)" : "scale(1)",
                }}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      <SelectField
        label={t("reg.ordination")}
        value={form.ordination}
        onChange={(e) => setForm((f) => ({ ...f, ordination: e.target.value }))}
      >
        <option value="">{t("reg.selectOrdination")}</option>
        <option value="ዲቁና">{t("reg.deacon")}</option>
        <option value="ክህነት">{t("reg.priest")}</option>
        <option value="ሌላ">{t("reg.other")}</option>
      </SelectField>

      {form.ordination && (
        <>
          <InputField label={t("reg.ordinationYear")} value={form.ordinationYear}
            onChange={(e) => setForm((f) => ({ ...f, ordinationYear: e.target.value }))}
            placeholder={t("reg.ordinationYearPlaceholder")} />
          <InputField label={t("reg.diocese")} value={form.diocese}
            onChange={(e) => setForm((f) => ({ ...f, diocese: e.target.value }))}
            placeholder={t("reg.diocesePlaceholder")} />
          <InputField label={t("reg.bishop")} value={form.bishop}
            onChange={(e) => setForm((f) => ({ ...f, bishop: e.target.value }))}
            placeholder={t("reg.bishopPlaceholder")} />
        </>
      )}

      <OptionPills
        label={t("reg.talents")}
        value={form.talents}
        options={TALENTS}
        onChange={(v) => setForm((f) => ({ ...f, talents: v as string[] }))}
        multi
      />

      {form.talents.length > 0 && (
        <InputField label={t("reg.talentDescription")} value={form.talentDescription}
          onChange={(e) => setForm((f) => ({ ...f, talentDescription: e.target.value }))}
          placeholder={t("reg.describeTalents")} />
      )}
    </div>
  );
};

function deptKey(dept: string) {
  const map: Record<string, string> = {
    "ትምህርት": "edu", "መዝሙር": "song", "ልማት": "dev", "አባላት ጉዳይ": "member", "ፋይናንስ": "finance",
  };
  return map[dept] ?? "edu";
}
