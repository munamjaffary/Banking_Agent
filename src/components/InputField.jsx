import { useState } from "react";
import eyeClose from "../assets/icons/login-close-eye.png";
import eyeOpen from "../assets/icons/login-open-eye.png";

function InputField({
  name,
  heading,
  placeholder,
  rightIcon,
  type = "text",
  alt,
  required,
  onChange,
  disabled,
  value,
  passwordIcon,
  showIcon,
  error,
  multiple,
  onKeyDown,
  className
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className={`custom-input-container ${className}`}>
        <p>{heading}</p>
        <input
          name={name}
          type={passwordIcon ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          disabled={disabled}
          className={rightIcon ? "" : "input-without-icon"}
          value={value}
          multiple={multiple}
          onKeyDown={onKeyDown}
        />
        {showIcon && (
          <button
            type="button"
            disabled={passwordIcon ? false : true}
            onClick={handleShowPassword}
          >
            <img
              src={
                passwordIcon ? (showPassword ? eyeOpen : eyeClose) : rightIcon
              }
              alt={alt}
            />
          </button>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default InputField;
