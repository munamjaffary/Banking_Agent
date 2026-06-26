export const customSelectStyles = {
  container: (base) => ({
    ...base,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }),
  control: (base) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    padding: "0px",
    minHeight: "auto",
    backgroundColor: "transparent",
    display: "flex",
    flexWrap: "nowrap",
    width: "100%",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0px",
    flex: "1",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    padding: "0px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--text)",
    fontSize: "15px",
    fontWeight: "400",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--text)",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    transform: "scale(1.0)",
    paddingLeft: "12px",
    color: "var(--text)",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "var(--card)",
  }),

  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "var(--text)",
  }),

  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "var(--hover)"
      : isFocused
        ? "var(--hover)"
        : "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
  }),
};
