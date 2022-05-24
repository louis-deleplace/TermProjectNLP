

import { useLocation, useNavigate } from 'react-router-dom';
import React from "react";
import { useEffect, useState } from "react";
import {
    Autocomplete, CircularProgress, ToggleButton, ToggleButtonGroup, Slider, Typography,
    Accordion, AccordionSummary, AccordionDetails, Grid, Input, Button, TextField, Stack, Item,
    ListItem, List, ListItemButton, ListItemText, ListItemIcon, Paper
} from "@mui/material";

function SongDetailPage() {
    const { state } = useLocation();
    const data = state[0];
    // TODO: FRONT PAGE DETAIL
    return (
        <Stack>
            <Typography>
                {data.title}
            </Typography>
            <Typography>
                {data.artist}
            </Typography>
            <Typography>
                {data.lyrics}
            </Typography>
            <Typography>
                {data.genre}
            </Typography>
            <Typography>
                {data.year}
            </Typography>
        </Stack>
    )
}

export default SongDetailPage;