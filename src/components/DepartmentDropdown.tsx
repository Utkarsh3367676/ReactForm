import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText as ListItemTextMui,
} from '@mui/material';
import { Business } from '@mui/icons-material';

interface Department {
  value: string;
  label: string;
  parentId?: string;
  children?: Department[];
}

interface DepartmentDropdownProps {
  label: string;
  options: Department[];
  selectedValues: string[];
  onChange: (
    event: SelectChangeEvent<string[]>,
    selected: string[]
  ) => void;
}

const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedValues);

  useEffect(() => {
    setSelected(selectedValues);
  }, [selectedValues]);

  const handleToggle = (
    name: string,
    isDepartment: boolean,
    parentId?: string
  ) => {
    setSelected((prevSelected) => {
      let updatedSelection: string[] = [...prevSelected];

      if (isDepartment) {
        // Toggle selection for the department
        if (prevSelected.includes(name)) {
          updatedSelection = prevSelected.filter(
            (item) => item !== name
          );
        } else {
          updatedSelection = [...prevSelected, name];
        }

        // Deselect sub-departments
        updatedSelection = updatedSelection.filter(
          (item) =>
            !options
              .filter((option) => option.parentId === name)
              .some((subDepartment) =>
                updatedSelection.includes(subDepartment.value)
              )
        );
      } else {
        // Toggle selection for the sub-department
        if (prevSelected.includes(name)) {
          updatedSelection = prevSelected.filter(
            (item) => item !== name
          );
        } else {
          updatedSelection = [...prevSelected, name];
        }

        // If all sub-departments are selected, select the parent department
        const parentDepartment = options.find(
          (option) => option.value === parentId
        );
        const allSubDepartmentsSelected =
          parentDepartment &&
          options
            .filter((option) => option.parentId === parentId)
            .every((subDepartment) =>
              updatedSelection.includes(subDepartment.value)
            );

        if (allSubDepartmentsSelected) {
          updatedSelection = [
            ...updatedSelection,
            parentDepartment!.value,
          ];
        }
      }

      return updatedSelection;
    });
  };

  const renderOptions = (options: Department[]) =>
    options.map((option) => (
      <div key={option.value}>
        <ListItem
          onClick={() =>
            handleToggle(option.value, true, option.parentId)
          }
          button
          disabled={selected.includes(option.value)}
          style={{ paddingLeft: 16 }}
        >
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemTextMui primary={option.label} />
          <Checkbox checked={selected.includes(option.value)} />
        </ListItem>
        {option.children && (
          <List dense>{renderOptions(option.children)}</List>
        )}
      </div>
    ));

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={(event) => {
          const name = event.target.value as string;
          const isDepartment = options.some(
            (option) =>
              option.value === name && !option.parentId
          );
          const parentId = isDepartment
            ? undefined
            : options.find(
                (option) => option.value === name
              )?.parentId;

          handleToggle(name, isDepartment, parentId);
          onChange(
            event as SelectChangeEvent<string[]>,
            selected
          );
        }}
        renderValue={(selected) => (selected as string[]).join(', ')}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={selected.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>

      {/* Display selected departments and sub-departments */}
      <List dense>{renderOptions(options)}</List>
    </FormControl>
  );
};

export default DepartmentDropdown;
