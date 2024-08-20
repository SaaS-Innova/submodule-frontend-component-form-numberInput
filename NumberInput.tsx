import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { InputNumber } from "primereact/inputnumber";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";

export const NumberInput = (props: IFormProps) => {
  const { attribute, form, fieldType } = props;
  const { label, placeholder } = form[attribute];
  const {
    required,
    showButtons,
    disabled,
    decimals = true,
  } = form[attribute].rules;
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";

    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 md:col-9 relative";
        break;
    }

    return { labelClassName, fieldClassName, divClassName };
  };
  const { labelClassName, fieldClassName, divClassName } = getClassNames();

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      {label} {required && "*"}
    </label>
  );

  /*
     - Allow only numbers and one dot
     - Comma is replaced with dot
     */
  const convertCommaToDecimal = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === ",") {
      const input = event.target as HTMLInputElement;
      if (input.value.includes(".")) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const newValue = input.value + ".";
      input.value = newValue;
    }
  };

  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        <div className="p-inputgroup">
          <Controller
            control={control}
            name={attribute}
            rules={inputValidator(form[attribute].rules, label)}
            render={({ field }) => {
              return (
                <InputNumber
                  id={field.name}
                  inputId={attribute}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  showButtons={showButtons}
                  maxFractionDigits={decimals ? 2 : 0}
                  className={errors[attribute] ? "p-invalid" : ""}
                  mode="decimal"
                  placeholder={placeholder}
                  min={0}
                  disabled={disabled}
                  useGrouping={false}
                  onKeyDown={convertCommaToDecimal}
                />
              );
            }}
          />
        </div>
        <FormFieldError data={{ errors, name: attribute }} />
      </div>
    </div>
  );
};
