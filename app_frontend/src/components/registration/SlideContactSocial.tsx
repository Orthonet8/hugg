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
    <div className="space-y-5">
      <div className="rounded-[1.4rem] border border-(--border) bg-(--surface) px-4 py-4 shadow-[0_16px_36px_rgba(95,1,19,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--primary)">Contact and finish</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          Add the best ways to reach you, then complete registration to enter the app with a fully prepared member profile.
        </p>
      </div>

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
          <div className="rounded-[1.1rem] border border-(--border) bg-(--surface) px-3.5 py-3">
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
        className="rounded-[1.4rem] border border-(--border) bg-(--surface-soft) p-4 flex items-center gap-3 shadow-[0_16px_32px_rgba(95,1,19,0.06)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-(--primary) text-lg text-(--on-primary)">✓</span>
        <div>
          <p className="text-sm font-bold text-(--text-primary)">Almost done</p>
          <p className="text-xs leading-relaxed text-(--text-muted)">Review your details and tap Complete Registration. You can update most profile details later.</p>
        </div>
      </motion.div>
    </div>
  );
};
