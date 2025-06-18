import React from "react";
import StarIcon from "@mui/icons-material/Star";
import {Form, Input} from "antd";
import '../../../App.css'

interface FormInputProps {
  className?: string;
  type?: string;
  placeholder: string;
  name: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
                                               className,
                                               type = "text",
                                               placeholder,
                                               name,
                                               required,
                                               onChange,
                                             }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (name.startsWith("player") && value && !value.includes("faceit.com")) {
      e.target.setCustomValidity("Link mora biti sa https://www.faceit.com/");
    } else if (name === "number" && value && value.length < 9) {
      e.target.setCustomValidity("Kontakt telefon mora imati minimalno 9 brojeva");
    } else {
      e.target.setCustomValidity("");
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full">
      <Form.Item
        name={name}
        rules={[{required}]}
        className="mb-0 russo"
      >
        <div className="bg-[#181818] rounded flex items-center w-full  focus-within:ring-2 focus-within:ring-[#8D151F]">
          <Input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            className="bg-[#181818] w-[512px] text-[#9CA3AF] placeholder:text-[#9CA3AF] px-4 py-3 rounded russo "
            variant="borderless"
            size="large"
          />
          {required && (
            <div className="pr-4  transition-colors">
              <StarIcon className="text-[#8D151F] h-5 w-5"/>
            </div>
          )}
        </div>
      </Form.Item>
    </div>
  );
};

export default FormInput;
