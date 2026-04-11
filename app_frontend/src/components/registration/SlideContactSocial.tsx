import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideContactSocial = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <InputField
        label={t("reg.mobile")}
        type="tel"
        value={form.mobile}
        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
        placeholder={t("reg.mobilePlaceholder")}
        required
      />
      <InputField
        label={t("reg.emailOrUsername")}
        type="text"
        value={form.emailOrUsername}
        onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))}
        placeholder={t("reg.emailOrUsernamePlaceholder")}
        required
      />
      <InputField
        label={t("reg.telegram")}
        value={form.telegram}
        onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
        placeholder={t("reg.telegramPlaceholder")}
      />
    </div>
  );
};
