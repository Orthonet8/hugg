import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBackgroundParticipation = ({ form, setForm }: SlideProps) => (
  <div className="space-y-4">
    <InputField
      label="ክልል / Region"
      value={form.region}
      onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
      placeholder="e.g., Oromia, Amhara"
      required
    />
    <InputField
      label="ዞን / Zone"
      value={form.zone}
      onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
      placeholder="Zone"
    />
    <InputField
      label="ወረዳ / Woreda"
      value={form.woreda}
      onChange={(e) => setForm((f) => ({ ...f, woreda: e.target.value }))}
      placeholder="Woreda"
    />
    <InputField
      label="መገናኛ ቋንቋ / Native Language"
      value={form.nativeLanguage}
      onChange={(e) => setForm((f) => ({ ...f, nativeLanguage: e.target.value }))}
      placeholder="Your native language"
    />
    <InputField
      label="ተጨማሪ ቋንቋዎች"
      value={form.extraLanguages}
      onChange={(e) => setForm((f) => ({ ...f, extraLanguages: e.target.value }))}
      placeholder="Other languages you speak (comma separated)"
    />
    <OptionPills
      label="ቀድሞ የጉባኤ ተሳትፎ?"
      value={form.previousParticipation}
      options={["አዎ", "አይ"]}
      onChange={(v) => setForm((f) => ({ ...f, previousParticipation: v as string }))}
    />
    <InputField
      label="አካባቢ ቤተክርስቲያን"
      value={form.localChurch}
      onChange={(e) => setForm((f) => ({ ...f, localChurch: e.target.value }))}
      placeholder="Your local church name"
    />
  </div>
);
