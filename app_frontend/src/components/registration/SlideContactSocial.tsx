import type { RegistrationForm } from "../../pages/RegistrationPage";
import { useI18n } from "../../i18n/I18nProvider";
import { InputField } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideContactSocial = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <InputField
        label={t("reg.emailOrUsername")}
        value={form.emailOrUsername}
        disabled
      />
      <InputField
        label={t("auth.phone")}
        type="tel"
        value={form.mobile}
        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
        placeholder={t("reg.mobilePlaceholder")}
      />
      <InputField
        label={t("profile.telegram")}
        value={form.telegram}
        onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
        placeholder={t("reg.telegramPlaceholder")}
      />
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
        <p className="text-sm text-[color:var(--text-muted)]">
          {t("common.submit")}
        </p>
      </div>
    </div>
  );
};
