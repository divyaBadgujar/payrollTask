import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Controller, Control, FieldValues, PathValue, Path } from "react-hook-form";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options?: Option[];
  defaultValue?: PathValue<T, Path<T>>;
}

const CustomSelect = <T extends FieldValues>({
  name,
  label,
  control,
  options = [],
  defaultValue,
}: CustomSelectProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" size="small">
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as PathValue<T, Path<T>>}
        render={({ field }) => (
          <Select
            {...field}
            variant="standard"
            onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};


export default CustomSelect;
