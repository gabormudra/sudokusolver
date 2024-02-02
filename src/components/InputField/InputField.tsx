import React from "react";

type InputFieldProperties = {
    id: string,
    value?: number,
    valueChanged: Function
}

const InputField: React.FC<InputFieldProperties> = ({
    id,
    value,
    valueChanged
}) => {
    const handleChange = (event: any) => {
        valueChanged(id, event.target.value);
    }

    return (
        <input
            type="number"
            value={value === -1 ? '' : value}
            onChange={handleChange}
        />
    );
};

export default InputField;
