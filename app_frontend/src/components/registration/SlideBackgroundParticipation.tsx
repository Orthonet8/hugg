import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBackgroundParticipation = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
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
        value={form.extraLanguages}
        onChange={(e) => setForm((f) => ({ ...f, extraLanguages: e.target.value }))}
        placeholder={t("reg.extraLanguagesPlaceholder")}
      />
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
    </div>
  );
};
