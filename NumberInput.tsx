import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { InputNumber } from "primereact/inputnumber";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
import { useMemo } from "react";

export const NumberInput = (props: IFormProps) => {
  const { attribute, form, fieldType, handleChange } = props;
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

  const { labelClassName, fieldClassName, divClassName } = useMemo(() => {
    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
      case IFormFieldType.TOP_LABEL:
        return {
          labelClassName: "",
          fieldClassName: "field p-fluid",
          divClassName: "",
        };
      default:
        return {
          labelClassName: "col-12 mb-3 md:col-3 md:mb-0",
          fieldClassName: "field grid",
          divClassName: "col-12 md:col-9 relative",
        };
    }
  }, [fieldType]);

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      <span className="capitalize-first">
        {label} {required && "*"}
      </span>
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
      event.preventDefault();
      if (input.value.includes(".")) {
        return;
      }
      const cursorPosition = input.selectionStart;
      let newValue: string;
      if (input.value === "") {
        input.value = "0."; // Set initial value to '0.' if input is empty
        input.setSelectionRange(2, 2);
      } else {
        newValue =
          input.value.slice(0, cursorPosition!) +
          "." +
          input.value.slice(cursorPosition!);
        input.value = newValue;
        input.setSelectionRange(cursorPosition! + 1, cursorPosition! + 1);
      }
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
                    handleChange && handleChange(e);
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
