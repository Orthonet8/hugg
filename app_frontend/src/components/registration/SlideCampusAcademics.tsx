import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, SelectField } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideCampusAcademics = ({ form, setForm }: SlideProps) => (
  <div className="space-y-4">
    <SelectField
      label="ካምፓስ"
      value={form.campus}
      onChange={(e) => setForm((f) => ({ ...f, campus: e.target.value }))}
      required
    >
      <option value="">Select campus</option>
      <option value="ዋና ግቢ">ዋና ግቢ (Main Campus)</option>
      <option value="ስቴሽን">ስቴሽን ካምፓስ</option>
      <option value="ገንደጄ">ገንደጄ ካምፓስ</option>
    </SelectField>

    <InputField
      label="የትምህርት ዘርፍ / Field of Study"
      value={form.fieldOfStudy}
      onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
      placeholder="e.g., Computer Science, Accounting"
      required
    />

    <InputField
      label="ዶርም / Dormitory"
      value={form.dorm}
      onChange={(e) => setForm((f) => ({ ...f, dorm: e.target.value }))}
      placeholder="Block & room number"
    />
  </div>
);
