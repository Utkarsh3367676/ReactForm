import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const UserForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    // Save user details in local storage
    localStorage.setItem('userDetails', JSON.stringify({ name, phoneNumber, email }));

    // Route the user to the second page
    navigate('/second-page');
  };

  return (
    <div>
      <h1>User Information Form</h1>
      {location.state && location.state.errorMessage && (
        <div style={{ color: 'red' }}>{location.state.errorMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <TextField
          label="Phone Number"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <br />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UserForm;
