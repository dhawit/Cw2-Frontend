import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import "../styles/userProfile.css";

import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    TextField,
    Typography,
    useTheme
} from "@mui/material";

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const theme = useTheme();

    const handleOpenSnackbar = (severity, message) => {
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            const decodedToken = jwtDecode(token);
            const userId = decodedToken._id;
            if (!userId) throw new Error("Unable to decode token or retrieve user ID.");

            const response = await axios.get(`https://cw2-backend-pees.onrender.com/api/user/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUserData(response.data.userProfile);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        if (userData) {
            setEditMode(true);
            setEditedData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                username: userData.username,
                phone: userData.phone,
                address: userData.address,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditedData({ ...editedData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            if (!decodedToken || !decodedToken.id) {
                throw new Error("Unable to decode token or retrieve user ID.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.put(
                `https://cw2-backend-pees.onrender.com/api/user/edit/${userId}`,
                editedData,
                config
            );

            fetchUserProfile();
            setEditMode(false);
            handleOpenSnackbar("success", "User profile updated successfully");
        } catch (error) {
            console.error("Error updating user profile:", error);
            handleOpenSnackbar("error", "Error updating user profile");
        }
    };

    if (!user) {
        return (
            <div className="error-message">Please log in to view your profile</div>
        );
    }

    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    return (
        <>
            <div className="user-profile-container" style={{
                backgroundColor: theme.palette.background.default,
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}>
                {loading ? (
                    <Loading />
                ) : userData ? (
                    <div className="user-profile" style={{
                        maxWidth: "600px",
                        margin: "auto",
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "12px",
                        padding: "2rem",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
                    }}>
                        <Typography variant="h4" className="profile-title" gutterBottom style={{
                            fontWeight: 700,
                            color: theme.palette.text.primary
                        }}>
                            User Profile
                        </Typography>
                        <Divider style={{ marginBottom: "2rem" }} />
                        <div className="profile-details" style={{ display: "flex", alignItems: "center" }}>
                            <div className="profile-picture" style={{ marginRight: "1rem" }}>
                                {imagePreview ? (
                                    <Avatar
                                        alt="Profile Picture"
                                        src={imagePreview}
                                        sx={{ width: 120, height: 120, border: "2px solid #fbc02d" }}
                                    />
                                ) : (
                                    <Avatar sx={{
                                        width: 120,
                                        height: 120,
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.getContrastText(theme.palette.primary.main),
                                        fontSize: "2rem"
                                    }}>
                                        {getInitials(userData.firstName, userData.lastName)}
                                    </Avatar>
                                )}
                            </div>
                            <div className="profile-info" style={{ flexGrow: 1 }}>
                                <Typography variant="h6" style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                                    {userData.firstName} {userData.lastName}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: "0.5rem", color: theme.palette.text.secondary }}>
                                    <strong>Email:</strong> {userData.email}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: "0.5rem", color: theme.palette.text.secondary }}>
                                    <strong>Username:</strong> {userData.username}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: "0.5rem", color: theme.palette.text.secondary }}>
                                    <strong>Phone Number:</strong> {userData.phone}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: "0.5rem", color: theme.palette.text.secondary }}>
                                    <strong>Address:</strong> {userData.address}
                                </Typography>
                            </div>
                        </div>
                        <Divider style={{ marginTop: "2rem", marginBottom: "1rem" }} />
                        <Link
                            to="#"
                            className="edit-profile-link"
                            onClick={handleEditProfile}
                            style={{
                                textDecoration: "none",
                                color: theme.palette.primary.main,
                                fontWeight: 500
                            }}
                        >
                            Edit Profile
                        </Link>
                    </div>
                ) : (
                    <div className="error-message">Error fetching user profile</div>
                )}
            </div>
            <Modal
                open={editMode}
                onClose={() => setEditMode(false)}
                aria-labelledby="edit-profile-modal"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Edit Profile
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1rem",
                        }}
                    >
                        <Avatar
                            alt="Profile Picture"
                            src={imagePreview}
                            sx={{ width: 100, height: 100, marginRight: "1rem", border: "2px solid #fbc02d" }}
                        />
                        <label htmlFor="upload-photo">
                            <input
                                style={{ display: "none" }}
                                id="upload-photo"
                                name="upload-photo"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                color="primary"
                                sx={{ textTransform: "none" }}
                            >
                                Upload New Picture
                            </Button>
                        </label>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={editedData.firstName || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, firstName: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={editedData.lastName || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, lastName: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={editedData.email || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, email: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={editedData.username || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, username: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={editedData.phone || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, phone: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={editedData.address || ""}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, address: e.target.value })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ textTransform: "none", backgroundColor: "#fbc02d", color: "#fff", fontWeight: "bold" }}
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setEditMode(false)}
                            sx={{ textTransform: "none" }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserProfile;
