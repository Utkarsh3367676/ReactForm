import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { Business, AccountTree } from '@mui/icons-material';

interface Department {
  department: string;
  sub_departments: string[];
}

interface DepartmentSelectionProps {
  data: Department[];
}

const DepartmentSelection: React.FC<DepartmentSelectionProps> = ({ data }) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const handleToggle = (name: string, isDepartment: boolean) => {
    setSelected((prevSelected) => {
      const updatedSelection = { ...prevSelected, [name]: !prevSelected[name] };

      if (isDepartment && updatedSelection[name]) {
        // Select all sub-departments
        data
          .find((department) => department.department === name)
          ?.sub_departments.forEach((subDepartment) => {
            updatedSelection[subDepartment] = true;
          });
      }

      if (!isDepartment) {
        // Check if all sub-departments are selected
        const department = data.find((dep) => dep.sub_departments.includes(name));
        const allSubDepartmentsSelected =
          department &&
          department.sub_departments.every((subDepartment) => updatedSelection[subDepartment]);

        // If all sub-departments are selected, select the parent department as well
        if (allSubDepartmentsSelected) {
          updatedSelection[department!.department] = true;
        }
      }

      return updatedSelection;
    });
  };

  return (
    <List>
      {data.map((departmentData) => (
        <div key={departmentData.department}>
          <ListItem
            button
            onClick={() => handleToggle(departmentData.department, true)}
            dense
            disabled={selected[departmentData.department]}
          >
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary={departmentData.department} />
            <Checkbox checked={selected[departmentData.department]} />
          </ListItem>
          {departmentData.sub_departments.map((subDepartment) => (
            <ListItem
              key={subDepartment}
              button
              onClick={() => handleToggle(subDepartment, false)}
              dense
            >
              <ListItemIcon>
                <AccountTree />
              </ListItemIcon>
              <ListItemText primary={subDepartment} />
              <Checkbox checked={selected[subDepartment]} />
            </ListItem>
          ))}
        </div>
      ))}
    </List>
  );
};

export default DepartmentSelection;
