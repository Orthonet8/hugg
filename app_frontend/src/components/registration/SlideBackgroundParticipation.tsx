import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills, SectionCard } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBackgroundParticipation = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <div className="rounded-[1.4rem] border border-(--border) bg-(--surface) px-4 py-4 shadow-[0_16px_36px_rgba(95,1,19,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--primary)">Background and participation</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          This part gives context for language support, church background, and how familiar you already are with the ministry.
        </p>
      </div>

      <SectionCard
        title="Origin"
        subtitle="Your home background and language profile."
      >
        <InputField
          label={t("reg.region")}
          value={form.region}
          onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
          placeholder={t("reg.regionPlaceholder")}
          required
        />
        <InputField
          label={t("reg.zone")}
          value={form.zone}
          onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
          placeholder={t("reg.zonePlaceholder")}
        />
        <InputField
          label={t("reg.woreda")}
          value={form.woreda}
          onChange={(e) => setForm((f) => ({ ...f, woreda: e.target.value }))}
          placeholder={t("reg.woredaPlaceholder")}
        />
        <InputField
          label={t("reg.nativeLanguage")}
          value={form.nativeLanguage}
          onChange={(e) => setForm((f) => ({ ...f, nativeLanguage: e.target.value }))}
          placeholder={t("reg.nativeLanguagePlaceholder")}
        />
        <InputField
          label={t("reg.extraLanguages")}
          helperText="Separate with commas"
          value={form.extraLanguages}
          onChange={(e) => setForm((f) => ({ ...f, extraLanguages: e.target.value }))}
          placeholder={t("reg.extraLanguagesPlaceholder")}
        />

        <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">Language profile</p>
          <p className="mt-1 text-sm font-semibold text-(--text-primary)">
            {form.nativeLanguage || "Native language not added yet"}
          </p>
          <p className="mt-1 text-xs text-(--text-muted)">
            {form.extraLanguages || "Additional languages can help connect you with broader ministry teams."}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Church Participation"
        subtitle="Tell us about your past involvement."
      >
        <OptionPills
          label={t("reg.churchParticipation")}
          value={form.previousParticipation}
          options={[t("reg.yes"), t("reg.no")]}
          onChange={(v) => setForm((f) => ({
            ...f,
            previousParticipation: v === t("reg.yes") ? "አዎ" : v === t("reg.no") ? "አይ" : "",
          }))}
        />
        <InputField
          label={t("reg.localChurch")}
          value={form.localChurch}
          onChange={(e) => setForm((f) => ({ ...f, localChurch: e.target.value }))}
          placeholder={t("reg.localChurchPlaceholder")}
        />

        <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">Participation note</p>
          <p className="mt-1 text-sm text-(--text-secondary)">
            {form.previousParticipation
              ? `Previous participation: ${form.previousParticipation}`
              : "Tell us whether you have participated before so onboarding can be adjusted."}
          </p>
        </div>
      </SectionCard>
    </div>
  );
};
