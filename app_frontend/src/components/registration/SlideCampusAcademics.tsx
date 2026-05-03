import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, SectionCard, SelectField } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideCampusAcademics = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <div className="rounded-[1.4rem] border border-(--border) bg-(--surface) px-4 py-4 shadow-[0_16px_36px_rgba(95,1,19,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--primary)">Campus identity</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          These details help place you correctly within campus activities, section coordination, and dorm-based communication.
        </p>
      </div>

      <SectionCard
        title="Campus Details"
        subtitle="Where you study and stay within the university."
      >
        <SelectField
          label={t("profile.campus")}
          value={form.campus}
          onChange={(e) => setForm((f) => ({ ...f, campus: e.target.value }))}
          required
        >
          <option value="">{t("reg.selectCampus")}</option>
          <option value="ዋና ግቢ">{t("reg.mainCampus")}</option>
          <option value="ስቴሽን">{t("reg.stationCampus")}</option>
          <option value="ገንደጄ">{t("reg.gendejCampus")}</option>
        </SelectField>

        <InputField
          label={t("reg.fieldOfStudy")}
          value={form.fieldOfStudy}
          onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
          placeholder={t("reg.fieldOfStudyPlaceholder")}
          required
        />

        <InputField
          label={t("profile.dorm")}
          value={form.dorm}
          onChange={(e) => setForm((f) => ({ ...f, dorm: e.target.value }))}
          placeholder={t("reg.blockRoom")}
        />

        <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">Current summary</p>
          <p className="mt-1 text-sm font-semibold text-(--text-primary)">
            {[form.campus, form.fieldOfStudy].filter(Boolean).join(" · ") || "Campus and field of study will appear here"}
          </p>
          <p className="mt-1 text-xs text-(--text-muted)">
            {form.dorm ? `Dorm: ${form.dorm}` : "Dorm information is optional but useful for nearby fellowship coordination."}
          </p>
        </div>
      </SectionCard>
    </div>
  );
};
