import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, SectionCard } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";
import { motion } from "framer-motion";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideContactSocial = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <SectionCard
        title="Contact"
        subtitle="How people can reach you for fellowship and service."
      >
        <InputField label="Mobile Phone" type="tel" value={form.mobile}
          onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          placeholder={t("reg.mobilePlaceholder")} />
        <InputField label="Telegram Username" value={form.telegram}
          onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
          placeholder={t("reg.telegramPlaceholder")} />

        {form.emailOrUsername ? (
          <div className="rounded-xl border border-(--border) bg-(--surface) px-3.5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">Email / Username</p>
            <p className="mt-1 text-base font-semibold text-(--text-primary)">{form.emailOrUsername}</p>
            <p className="mt-1 text-xs text-(--text-muted)">Captured from your signup account.</p>
          </div>
        ) : (
          <InputField label="Email Address" type="email" value={form.emailOrUsername}
            onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))}
            placeholder={t("reg.emailOrUsernamePlaceholder")} />
        )}
      </SectionCard>

      {/* Stitch golden celebration banner */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-(--border) bg-(--surface-soft) p-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--primary) text-lg text-(--on-primary)">✓</span>
        <div>
          <p className="text-sm font-bold text-(--text-primary)">Almost done</p>
          <p className="text-xs text-(--text-muted)">Review your details and tap Complete Registration.</p>
        </div>
      </motion.div>
    </div>
  );
};
