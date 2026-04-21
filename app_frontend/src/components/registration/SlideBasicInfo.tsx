import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills, SectionCard } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBasicInfo = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setForm((f) => ({ ...f, profilePhotoFile: null }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({
        ...f,
        profilePhotoFile: file,
        profilePhotoPreview: typeof reader.result === "string" ? reader.result : f.profilePhotoPreview,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Identity"
        subtitle="Basic profile information used across the app."
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-(--text-secondary)">Profile Photo</label>
          <div className="flex items-center gap-3">
            {form.profilePhotoPreview ? (
              <img
                src={form.profilePhotoPreview}
                alt="Profile preview"
                className="h-14 w-14 rounded-full border border-(--border) object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-(--border) bg-(--surface) text-sm font-semibold text-(--text-muted)">
                {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text-secondary)"
            />
          </div>
          <p className="mt-1 text-xs text-(--text-muted)">Optional. JPG/PNG up to 2MB.</p>
        </div>

        {form.fullName ? (
          <div
            className="rounded-xl border px-3.5 py-3"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {t("auth.fullName")}
            </p>
            <p className="mt-1 text-base font-semibold" style={{ color: "var(--text-primary)" }}>{form.fullName}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Captured from your signup account.</p>
          </div>
        ) : (
          <InputField label={t("auth.fullName")} value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder={t("reg.fullNamePlaceholder")} required />
        )}

        <InputField label={`${t("auth.christianName")} (Optional)`} value={form.christianName}
          onChange={(e) => setForm((f) => ({ ...f, christianName: e.target.value }))}
          placeholder={t("reg.christianNamePlaceholder")} />
      </SectionCard>

      <SectionCard
        title="Demographics"
        subtitle="This helps group and personalize ministry activities."
      >
        <InputField label={t("reg.age")} type="number" value={form.age}
          onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
          placeholder={t("reg.agePlaceholder")} min="16" max="100" required />
        <OptionPills label={t("reg.gender")} value={form.gender}
          options={[t("reg.male"), t("reg.female")]}
          onChange={(v) => setForm((f) => ({ ...f, gender: v === t("reg.male") ? "ወንድ" : "ሴት" }))} />
      </SectionCard>
    </div>
  );
};
