import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SelectChangeEvent } from '@mui/material';
import { fetchUserData } from './api';
import { UserData } from './model';
import DepartmentDropdown from './DepartmentDropdown';

const columns: GridColDef[] = [
  { field: 'userId', headerName: 'UserID', width: 70 },
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'body', headerName: 'Body', width: 300 },
];

const departmentData = [
  {
    department: 'customer_service',
    sub_departments: ['support', 'customer_success'],
  },
  {
    department: 'design',
    sub_departments: ['graphic_design', 'product_design', 'web_design'],
  },
  // Add more department data as needed
];

function SecondPage() {
  const [data, setData] = React.useState<UserData[]>([]);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [selectedSubDepartments, setSelectedSubDepartments] = React.useState<string[]>([]);

  const handleDepartmentSelectionChange = (
    _: SelectChangeEvent<string[]>,
    selected: string[]
  ) => {
    setSelectedDepartments(selected);
  };

  const handleSubDepartmentSelectionChange = (
    _: SelectChangeEvent<string[]>,
    selected: string[]
  ) => {
    setSelectedSubDepartments(selected);

    const selectedSubsSet = new Set(selected);

    departmentData.forEach((dep) => {
      if (dep.sub_departments.every((subDep) => selectedSubsSet.has(subDep))) {
        setSelectedDepartments((prevSelected) => {
          if (!prevSelected.includes(dep.department)) {
            return [...prevSelected, dep.department];
          }
          return prevSelected;
        });
      }
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserData();
        setData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <h1>User Data</h1>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection />
      </div>

      <div style={{ marginTop: 20 }}>
        <h1>Department Selection</h1>
        <DepartmentDropdown
          label="Select Departments"
          options={departmentData.map((dep) => ({
            value: dep.department,
            label: dep.department,
          }))}
          selectedValues={selectedDepartments}
          onChange={handleDepartmentSelectionChange} />
        <DepartmentDropdown
          label="Select Sub-Departments"
          options={departmentData
            .flatMap((dep) => dep.sub_departments.map((subDep) => ({
              value: subDep,
              label: subDep,
              parentId: dep.department,
            }))
            )}
          selectedValues={selectedSubDepartments}
          onChange={handleSubDepartmentSelectionChange} />
        {selectedDepartments.length > 0 && (
          <p>Selected Departments: {selectedDepartments.join(', ')}</p>
        )}
        {selectedSubDepartments.length > 0 && (
          <p>Selected Sub-Departments: {selectedSubDepartments.join(', ')}</p>
        )}
      </div>
    </div>
  );
}

export default SecondPage;
