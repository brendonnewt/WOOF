import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import userService from "@/utils/services/userService";
import infoLists from "@/utils/lists";
import PasswordChecker from "@/components/PasswordChecker";

export default function RegisterCenterPage() {
  const router = useRouter();
  const { registerCenter } = userService();
  const { stateNames } = infoLists();
  const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
  const headerStyle = { margin: 0 }

  const passwordRegex = RegExp('[^ -~]');
  const usernameRegex = RegExp('[^ a-zA-Z]');

  const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');

  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [formData, setFormData] = useState({
    centerName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    password: "",
    confirmPassword: "",
  });

  const handleSelectChange = (event, fieldName) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormSuccess(null);
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // Check if passwords match
    if (name === "password" || name === "confirmPassword") {
      setPasswordError(
        name === "password"
          ? value !== formData.confirmPassword
          : formData.password !== value
      );
    }
  };

  const handleProfileImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  }

  const handleBannerImageUpload = (e) => {
    setBannerImage(e.target.files[0]);
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = Object.keys(formData).filter(key => !formData[key]);
    if (usernameRegex.test(formData.centerName)) {
      setFormError("Name contains special characters!");
      return;
    }

    if (passwordRegex.test(formData.password)) {
      setFormError("Password has invalid characters!");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setFormError("Please submit a valid email!");
      return;
    }

    if (emptyFields.length > 0) {
      const emptyFieldNames = emptyFields.map(field => {
        switch (field) {
          case 'centerName': return 'Center Name';
          case 'email': return 'Email';
          case 'address': return 'Address';
          case 'city': return 'City';
          case 'state': return 'State';
          case 'zip': return 'Zip Code';
          case 'password': return 'Password';
          case 'confirmPassword': return 'Confirm Password';
          default: return field;
        }
      });
      alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
      return;
    }

    if (!isPasswordOwaspCompliant(formData.password)) {
      alert("Password does not meet the security requirements!");
      return;
    }

    if (formData.password != formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsUploading(true);
    await registerCenter(formData, profileImage, bannerImage)
      .then(async (result) => {
        if (result !== null) {
          setIsUploading(false);
          router.push(`/centers/${result.userId}`);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
        alert("An error occured during registration.");
      });
  };

  const isPasswordOwaspCompliant = (password) => {
    const checks = [
      (pwd) => pwd.length >= 8, // At least 8 characters
      (pwd) => /[A-Z]/.test(pwd), // At least one uppercase letter
      (pwd) => /[a-z]/.test(pwd), // At least one lowercase letter
      (pwd) => /\d/.test(pwd), // At least one number
      (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), // At least one special character
      (pwd) => !/\s/.test(pwd), // No spaces
    ];

    return checks.every((check) => check(password));
  };

  return (
    <Grid>
      <Paper elevation={20} style={paperStyle} sx={{ minWidth: "50%" }}>
        <Grid align='center'>

          <h2 style={headerStyle}>Register</h2>
          <Typography variant="caption">Please fill this form to create an account!</Typography>
        </Grid>
        <form onSubmit={handleSubmit}>

          <TextField required fullWidth label='Center Name' name="centerName" size="small" margin="dense" value={formData.centerName} onChange={handleChange} />
          <TextField required fullWidth label='Email' name="email" size="small" margin="dense" value={formData.email} onChange={handleChange} />
          <TextField fullWidth label='Address' name="address" size="small" margin="dense" value={formData.address} onChange={handleChange} />
          <TextField sx={{ mt: "10px" }} label='City' name="city" size="small" margin="dense" value={formData.city} onChange={handleChange} />

          <FormControl sx={{ m: "10px" }}>
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
              required
              labelId="state-select-label"
              id="state-select"
              value={formData.state}
              size="small"
              margin="dense"
              onChange={(event) => handleSelectChange(event, 'state')}
              sx={{ width: "10em" }}
            >
              <MenuItem value={""}>Please Select</MenuItem>
              {stateNames.map((state, index) => (
                <MenuItem key={index} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField sx={{ mt: "10px" }} label='Zip Code' name="zip" size="small" margin="dense" value={formData.zip} onChange={handleChange} />

          <TextField
            required
            fullWidth
            label='Password'
            name="password"
            type={showPassword ? "text" : "password"}
            size="small"
            margin="dense"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <PasswordChecker password={formData.password} />

          <TextField
            required
            fullWidth
            label='Confirm Password'
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            size="small"
            margin="dense"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            type="file"
            label='Profile Picture'
            name="profilePicture"
            size="small" margin="dense"
            sx={{ mr: "15px" }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
            onChange={handleProfileImageUpload} />
          <TextField
            type="file"
            label='Banner Image'
            name="bannerImage"
            size="small" margin="dense"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
            onChange={handleBannerImageUpload} />
          <br></br>
          {isUploading ?
            <Typography> Creating Account...</Typography>
            :
            <Button type='submit' variant='contained' color='primary'>Register</Button>

          }
          <Button variant='contained' onClick={() => router.push("/register")}>Back</Button>
        </form>
        {formError && (
          <Typography color="error">{formError}</Typography>
        )}
        {formSuccess && (
          <Typography color="success">{formSuccess}</Typography>
        )}
      </Paper>
    </Grid>
  )
}
