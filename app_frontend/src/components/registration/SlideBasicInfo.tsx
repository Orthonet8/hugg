import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, OptionPills } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideBasicInfo = ({ form, setForm }: SlideProps) => (
  <div className="space-y-4">
    <InputField
      label="ሙሉ ስም"
      value={form.fullName}
      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
      placeholder="Enter your full name"
      required
    />
    <InputField
      label="የክርስትና ስም"
      value={form.christianName}
      onChange={(e) => setForm((f) => ({ ...f, christianName: e.target.value }))}
      placeholder="Enter your Christian name"
      required
    />
    <OptionPills
      label="ጾታ"
      value={form.gender}
      options={["ወንድ", "ሴት"]}
      onChange={(v) => setForm((f) => ({ ...f, gender: v as string }))}
    />
    <InputField
      label="ዕድሜ"
      type="number"
      value={form.age}
      onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
      placeholder="Your age"
      min="16"
      max="100"
      required
    />
  </div>
);
