import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField } from "./FormControls";
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
      <InputField label="Mobile Phone" type="tel" value={form.mobile}
        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
        placeholder={t("reg.mobilePlaceholder")} />
      <InputField label="Telegram Username" value={form.telegram}
        onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
        placeholder={t("reg.telegramPlaceholder")} />
      <InputField label="Email Address" type="email" value={form.emailOrUsername}
        onChange={(e) => setForm((f) => ({ ...f, emailOrUsername: e.target.value }))}
        placeholder={t("reg.emailOrUsernamePlaceholder")} />

      {/* Stitch golden celebration banner */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, #f3c913 0%, #f9df6a 100%)" }}>
        <span className="text-2xl">🎉</span>
        <div>
          <p className="text-sm font-bold text-[color:var(--on-accent)]">You're almost done!</p>
          <p className="text-xs text-[color:var(--on-accent)] opacity-80">Click Submit to complete your registration</p>
        </div>
      </motion.div>
    </div>
  );
};
