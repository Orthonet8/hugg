import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBasicInfo = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <InputField
        label={t("auth.fullName")}
        value={form.fullName}
        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        placeholder={t("reg.fullNamePlaceholder")}
        required
      />
      <InputField
        label={t("auth.christianName")}
        value={form.christianName}
        onChange={(e) => setForm((f) => ({ ...f, christianName: e.target.value }))}
        placeholder={t("reg.christianNamePlaceholder")}
        required
      />
      <OptionPills
        label={t("reg.gender")}
        value={form.gender}
        options={[t("reg.male"), t("reg.female")]}
        onChange={(v) => setForm((f) => ({
          ...f,
          gender: v === t("reg.male") ? "ወንድ" : v === t("reg.female") ? "ሴት" : "",
        }))}
      />
      <InputField
        label={t("reg.age")}
        type="number"
        value={form.age}
        onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
        placeholder={t("reg.agePlaceholder")}
        min="16"
        max="100"
        required
      />
    </div>
  );
};
