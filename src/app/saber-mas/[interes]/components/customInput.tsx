import {
    Controller,
    Control,
    FieldErrors,
    ControllerRenderProps,
    ControllerFieldState,
    UseFormStateReturn,
    FieldValues,
    Path,
} from "react-hook-form";
import { JSX } from "react";

export default function CustomInput<T extends FieldValues>({
    name,
    label,
    type,
    control,
    errors,
    ref,
    options,
    className,
    labelClassName,
    inputClassName,
    placeholder,
}: {
    name: Path<T>,
    label: string,
    type: string,
    control: Control<T>,
    errors: FieldErrors<T>,
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
    options?: string[] | Array<{ value: string; label: string }>,
    className?: string,
    labelClassName?: string,
    inputClassName?: string,
    placeholder?: string
}) {
    let render: (e: {
        field: ControllerRenderProps<T, Path<T>>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<T>;
    }) => JSX.Element;

    const defaultInputClass = "border-b-2 border-white/50 focus:border-white outline-none w-[80%] md:text-xl cursor-pointer";
    const defaultLabelClass = "md:text-2xl";
    switch (type) {
        case "select":
            render = (e) => (
                inputClassName ? (
                    <select
                        {...e.field}
                        id={name}
                        ref={ref as unknown as React.RefObject<HTMLSelectElement>}
                        className={inputClassName}
                    >
                        {options?.map((option) => {
                            const optionValue = typeof option === 'string' ? option : option.value;
                            const optionLabel = typeof option === 'string' ? option : option.label;
                            return (
                                <option
                                    key={optionValue}
                                    value={optionValue}
                                    className="text-sm md:text-lg"
                                >
                                    {optionLabel}
                                </option>
                            );
                        })}
                    </select>
                ) : (
                    <div className="rounded-2xl bg-white p-4 py-1 md:p-0 xl:pr-8 mt-5">
                        <select
                            {...e.field}
                            id={name}
                            ref={ref as unknown as React.RefObject<HTMLSelectElement>}
                            className="outline-none text-blue text-xl p-0 uppercase text-left text-raleway w-full md:p-8 md:py-3 cursor-pointer"
                        >
                            {options?.map((option) => {
                                const optionValue = typeof option === 'string' ? option : option.value;
                                const optionLabel = typeof option === 'string' ? option : option.label;
                                return (
                                    <option
                                        key={optionValue}
                                        value={optionValue}
                                        className={e.field.value === optionValue ? "text-sm md:text-lg" : "text-xs md:text-lg"}
                                    >
                                        {optionLabel}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )
            );
            break;
        case "textarea":
            render = (e) => (
                <textarea
                    {...e.field}
                    id={name}
                    placeholder={placeholder}
                    ref={ref as React.RefObject<HTMLTextAreaElement>}
                    className={inputClassName || `${defaultInputClass} h-24 md:h-auto resize-none`}
                />
            );
            break;
        default:
            render = (e) => (
                <input
                    type={type}
                    {...e.field}
                    id={name}
                    placeholder={placeholder}
                    ref={ref as React.RefObject<HTMLInputElement>}
                    className={inputClassName || `${defaultInputClass} autofill:!bg-transparent`}
                />
            );
            break;
    }

    return (
        <Controller
            name={name}
            control={control}
            render={(e) => (
                <div className={className || "flex flex-col items-center justify-center gap-2 md:gap-4 text-white font-raleway w-full text-lg md:text-xl"}>
                    <label htmlFor={name} className={labelClassName || defaultLabelClass}>{label}</label>
                    {render(e)}
                    <p className="text-red-400 text-sm mt-2 h-5 text-left w-[80%]">
                        {errors[name] && (
                            errors[name]?.message as string
                        )}
                    </p>
                </div>
            )}
        />
    );
}
