import React from "react";
import { useEffect, useState } from "react";

import Service from "../Service.js";
import {
    Autocomplete, CircularProgress, ToggleButton, ToggleButtonGroup, Slider, Typography,
    Accordion, AccordionSummary, AccordionDetails, Grid, Input, Button, TextField, Stack, Item,
    ListItem, List, ListItemButton, ListItemText, ListItemIcon, Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search'
import MusicIcon from '@mui/icons-material/MusicNote';
import { useLocation, useNavigate } from 'react-router-dom';


function ResultPage() {
    const { state } = useLocation();
    const data = state.data;
    console.log(state);
    const [isLoaded, setIsLoaded] = useState(false);
    const [songs, setSongs] = useState([]);
    const [isTitleSearch, setIsTitleSearch] = useState(state.isTitleSearch);
    const [lyricsSearch, setLyricsSearch] = useState(state.lyrics);
    const navigate = useNavigate();



    useEffect(() => {
        if (songs.length === 0) {
            getAllSongs()
        }
        setIsLoaded(true);
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
    }, []);

    const getSong = async (title, artist) => {
        let songData = (await Service.getSong(title, artist)).data;
        navigate("/result-detail", { state: songData })
    }

    const getAllSongs = async () => {
        let res = (await Service.getAll()).data.map((option) => {
            const firstLetter = option.title[0].toUpperCase();
            return {
                firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                ...option,
            };
        }).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));
        setSongs(res);
    }

    let logo = require("../images/searzic_logo_trans.png");

    if (!isLoaded) {
        return (<CircularProgress />)
    }
    return (
        <div>
            <div className="topBar">
                <Stack direction="row" >
                    <img src={logo} className="App-logo-small" alt="logo" width="200" height="200" onClick={() => navigate(-1)} />
                    <div id="typeSearchTopBar">
                        <ToggleButtonGroup
                            color="primary"
                            value={isTitleSearch}
                            disabled
                            exclusive
                            fullWidth
                            onChange={(event, newValue) => setIsTitleSearch(newValue)}>
                            <ToggleButton className="toggleButton" value={true}>Title</ToggleButton>
                            <ToggleButton className="toggleButton" value={false}>Lyrics</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <div id="contentSearchTopBar">
                        {isTitleSearch ?
                            <Autocomplete
                                disabled
                                disablePortal
                                disableListWrap
                                groupBy={(option) => option.firstLetter}
                                getOptionLabel={(option) => option.title + " - [" + option.artist + "]"}
                                options={songs}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            :
                            <TextField
                                disabled
                                className="textSearchTopBar"
                                onChange={(event, value) => setLyricsSearch(value)}
                                value={lyricsSearch}
                            />
                        }
                    </div>
                </Stack>
            </div>
            <div className="resultBox">
                <List>
                    {
                        data.map((data, index) => {
                            return (
                                <ListItem secondaryAction={
                                    <Stack direction="row">
                                        <Stack className="statsStack">
                                            <Paper elevation={0} className="statsPaper" >
                                                <Typography fontSize={10} className="statsLabel">Ranking</Typography>
                                                #{index + 1}
                                            </Paper>
                                        </Stack>
                                        <Stack className="statsStack">
                                            <Paper elevation={0} className="statsPaper">
                                                <Typography fontSize={10} className="statsLabel">Similarity</Typography>
                                                {data.similarity}
                                            </Paper>
                                        </Stack>
                                    </Stack>
                                }>
                                    <ListItemButton onClick={async () => await getSong(data.title, data.artist)}>
                                        <ListItemIcon>
                                            <MusicIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={data.title} secondary={data.artist}>
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>);
                        })
                    }
                </List>
            </div>
        </div >
    );

}

export default ResultPage;