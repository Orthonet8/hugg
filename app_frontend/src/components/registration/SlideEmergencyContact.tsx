import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, SectionCard } from "./FormControls";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideEmergencyContact = ({ form, setForm }: SlideProps) => (
  <div className="space-y-3">
    <SectionCard
      title="Emergency contacts"
      subtitle="Use numbers that can be reached quickly if we need to contact your family."
    >
      <InputField
        label="Parent phone number"
        type="tel"
        value={form.parentPhone}
        onChange={(e) => setForm((f) => ({ ...f, parentPhone: e.target.value }))}
        placeholder="Parent or guardian phone number"
      />
      <InputField
        label="Additional emergency contacts"
        value={form.emergencyContacts}
        onChange={(e) => setForm((f) => ({ ...f, emergencyContacts: e.target.value }))}
        placeholder="09..., 09..., +251..."
        helperText="Add multiple phone numbers separated by commas."
      />
    </SectionCard>

    <SectionCard
      title="Account details"
      subtitle="Enter the account where support or fellowship funds can be sent."
    >
      <InputField
        label="Account number"
        inputMode="numeric"
        value={form.accountNumber}
        onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
        placeholder="Account number"
      />
      <InputField
        label="Account holder name"
        value={form.accountName}
        onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))}
        placeholder="Name on the account"
      />
      <InputField
        label="Account type"
        value={form.accountType}
        onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value }))}
        placeholder="CBE or Telebirr"
        helperText="Type CBE or Telebirr."
      />
    </SectionCard>
  </div>
);
