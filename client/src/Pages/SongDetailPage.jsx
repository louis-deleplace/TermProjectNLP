

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
    console.log(data.lyrics)
    return (
        <div>
            <div className='title'>
                <Typography fontSize={30} fontWeight={"bold"}>
                    {data.title}
                </Typography>
            </div>
            <div className='artist'>
                <Typography fontSize={15}>
                    {data.artist}
                </Typography>
            </div>
            <div className='genre'>
                <Typography fontSize={15}>
                    [{data.genre}]
                </Typography>
                <Typography>
                    {data.year}
                </Typography>
            </div>
            <div className='lyrics'>
                <Typography align={"center"} style={{ whiteSpace: 'pre-line' }}>
                    {data.lyrics}
                </Typography>
            </div>
        </div>

    )
}

export default SongDetailPage;