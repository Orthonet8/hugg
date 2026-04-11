import type { RegistrationForm } from "../../pages/RegistrationPage";
import { InputField, SelectField } from "./FormControls";
import { useI18n } from "../../i18n/I18nProvider";

interface SlideProps {
  form: RegistrationForm;
  setForm: React.Dispatch<React.SetStateAction<RegistrationForm>>;
}

export const SlideCampusAcademics = ({ form, setForm }: SlideProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <SelectField
        label={t("profile.campus")}
        value={form.campus}
        onChange={(e) => setForm((f) => ({ ...f, campus: e.target.value }))}
        required
      >
        <option value="">{t("reg.selectCampus")}</option>
        <option value="ዋና ግቢ">{t("reg.mainCampus")}</option>
        <option value="ስቴሽን">{t("reg.stationCampus")}</option>
        <option value="ገንደጄ">{t("reg.gendejCampus")}</option>
      </SelectField>

      <InputField
        label={t("reg.fieldOfStudy")}
        value={form.fieldOfStudy}
        onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
        placeholder={t("reg.fieldOfStudyPlaceholder")}
        required
      />

      <InputField
        label={t("profile.dorm")}
        value={form.dorm}
        onChange={(e) => setForm((f) => ({ ...f, dorm: e.target.value }))}
        placeholder={t("reg.blockRoom")}
      />
    </div>
  );
};
