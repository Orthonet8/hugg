import type { RegistrationForm } from "../../pages/RegistrationPage";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideContactSocial = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  void form;
  void setForm;

  return (
    <div className="space-y-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
        {t("common.submit")}
      </p>
      <p className="text-sm text-[color:var(--text-muted)]">
        Contact details were already captured during signup. Review and submit to finish registration.
      </p>
    </div>
  );
};
