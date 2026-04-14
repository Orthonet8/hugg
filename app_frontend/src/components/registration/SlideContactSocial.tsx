import type { RegistrationForm } from "../../pages/RegistrationPage";
import { useI18n } from "../../i18n/I18nProvider";
import { InputField } from "./FormControls";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
        onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))}
        placeholder={t("reg.emailOrUsernamePlaceholder")}
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[color:var(--border)] bg-gradient-to-r from-[color:var(--surface-soft)] to-[color:var(--surface)] p-4"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--primary)]">
            <CheckCircle2 size={16} className="text-[color:var(--on-primary)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
              Almost done!
            </p>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Click Submit to complete your registration
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
