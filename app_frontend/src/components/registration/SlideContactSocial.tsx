import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideContactSocial = ({ form, setForm }: SlideProps) => (
  <div className="space-y-4">
    <InputField
      label="ስልክ ቁጥር / Mobile"
      type="tel"
      value={form.mobile}
      onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
      placeholder="+251912345678"
      required
    />
    <InputField
      label="ኢሜይል / Email"
      type="email"
      value={form.email}
      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      placeholder="example@gmail.com"
      required
    />
    <InputField
      label="ፌስቡክ / Facebook"
      value={form.facebook}
      onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))}
      placeholder="Facebook profile URL or username"
    />
    <InputField
      label="ቴሌግራም / Telegram"
      value={form.telegram}
      onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value }))}
      placeholder="@username"
    />
  </div>
);
