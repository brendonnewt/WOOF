import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Grid, Paper, Avatar, Typography, TextField, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import eventService from "@/utils/services/eventService";


export default function CreateEventPage() {
    const router = useRouter();
    const { createEvent } = eventService();
    const currentUserId = useSelector((state) => state.currentUser.currentUserId);
    const currentUserType = useSelector((state) => state.currentUser.currentUserType);

    const currDate = new Date().toISOString();

    const paperStyle = { padding: '30px 20px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: 0 }

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const [formData, setFormData] = useState({
        datePosted: currDate,
        name: "",
        description: "",
        dateStart: null,
        dateEnd: null,
    });

    React.useEffect(() => {
        if (currentUserType && currentUserType !== "Center") {
            router.push("/events");
        }
    }, [currentUserType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (date, fieldName) => {
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: date ? dayjs(date).toISOString() : null
        }));
    };

    const handleThumbnailUpload = (e) => {
        setThumbnailFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(formData).filter(key => !formData[key]);

        if (emptyFields.length > 0) {
            const emptyFieldNames = emptyFields.map(field => {
                switch (field) {
                    case 'name': return 'Name';
                    case 'description': return 'Description';
                    case 'dateStart': return 'Start Date';
                    case 'dateEnd': return 'End Date';
                    default: return field;
                }
            });
            alert(`Please fill in the following fields: ${emptyFieldNames.join(', ')}`);
            return;
        }

        try {
            setIsUploading(true);
            await createEvent(formData, thumbnailFile, currentUserId)
                .then(async (result) => {
                    if (result !== null) {
                        setIsUploading(false);
                        router.push(`/events/${result.eventID}`)
                    }
                });

        } catch (error) {
            console.error("Error: ", error);
            alert("An error occured during event creation.");
        }
    };


    return (
        <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>

                    <h2 style={headerStyle}>New Event</h2>
                    <Typography variant="caption">Please fill this form to create a new event!</Typography>
                </Grid>
                <form onSubmit={handleSubmit}>
                    <TextField required fullWidth label='Event Name' name="name" size="small" margin="dense" value={formData.name} onChange={handleChange} />
                    <TextField required multiline fullWidth label='Description' name="description" size="small" margin="dense" value={formData.description} onChange={handleChange} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ marginBottom: '8px', marginTop: '6px' }}>
                            <DatePicker
                                required
                                label="Start Date"
                                value={formData.dateStart ? dayjs(formData.dateStart) : null}
                                onChange={(date) => handleDateChange(date, 'dateStart')}
                                TextField={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <DatePicker
                                required
                                label="End Date"
                                value={formData.dateEnd ? dayjs(formData.dateEnd) : null}
                                onChange={(date) => handleDateChange(date, 'dateEnd')}
                                TextField={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </div>
                    </LocalizationProvider>
                    <TextField
                        type="file"
                        label='Thumbnail Picture'
                        name="thumbnailPath"
                        size="small" margin="dense"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                        onChange={handleThumbnailUpload} />

                    {isUploading ?
                        <Typography> Creating Event...</Typography>
                        :
                        <Button type='submit' variant='contained' color='primary'>Post</Button>

                    }
                    <Button variant='contained' onClick={() => router.push("/events")}>Back</Button>


                </form>
            </Paper>
        </Grid>
    )
}