import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills, SectionCard, SelectField } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

const SERVICE_DEPARTMENTS = ["ትምህርት", "መዝሙር", "ልማት", "አባላት ጉዳይ", "ፋይናንስ"];

const TALENTS = ["መዝሙር", "ድርሰት", "የሚዲያ ስራ", "ማስተማር", "ጸሎት", "ሌላ"];

export const SlideSkillsService = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <div className="rounded-[1.4rem] border border-(--border) bg-(--surface) px-4 py-4 shadow-[0_16px_36px_rgba(95,1,19,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--primary)">Service and gifts</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          Pick the ministries you are drawn to and share the abilities you can bring into community life.
        </p>
      </div>

      <SectionCard
        title="Service Areas"
        subtitle="Choose where you would like to contribute."
      >
        <OptionPills
          label={t("reg.serviceDepartments")}
          value={form.serviceDepartments}
          options={SERVICE_DEPARTMENTS}
          onChange={(v) => setForm((f) => ({ ...f, serviceDepartments: v as string[] }))}
          multi
        />
        <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">Selected departments</p>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {form.serviceDepartments.length > 0 ? form.serviceDepartments.join(", ") : "No service departments selected yet."}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Church Role"
        subtitle="Share ordination details if applicable."
      >
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
      </SectionCard>

      <SectionCard
        title="Talents"
        subtitle="Select gifts and describe how you can serve."
      >
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

        <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">Talent snapshot</p>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {form.talents.length > 0 ? form.talents.join(", ") : "Choose at least one talent or a service area to continue."}
          </p>
        </div>
      </SectionCard>
    </div>
  );
};
