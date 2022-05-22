import React from "react";
import Service from "../Service.js";
import {
    Autocomplete, CircularProgress, ToggleButton, ToggleButtonGroup, Slider, Typography,
    Accordion, AccordionSummary, AccordionDetails, Grid, Input, Button, TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search'


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            songs: null,
            bpm: 10,
            energy: 0,
            danceability: 0,
            isTitleSearch: true,
            lyricsSearch: ""
        }
        this.logo = require("../images/searzic_logo_trans.png");
        this.energyMarks = [{ value: 0, label: 'Low', }, { value: 50, label: 'Medium', }, { value: 100, label: 'High', }];
        this.danceabilityMarks = [{ value: 0, label: 'Low', }, { value: 50, label: 'Medium', }, { value: 100, label: 'High', }];
    }

    async componentDidMount() {
        let data = (await Service.getAll()).data.map((option) => {
            const firstLetter = option.title[0].toUpperCase();
            return {
                firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                ...option,
            };
        }).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));
        this.setState({
            songs: data,
            isLoaded: true,
        })

    }
    render() {
        const { isLoaded, songs, isTitleSearch, bpm } = this.state;
        if (!isLoaded) {
            return (<CircularProgress />
            )
        }
        const handleBlur = () => {
            if (this.bpm < 0) {
                this.bpm = 0;
            } else if (this.bpm > 100) {
                this.bp = 100;
            }
        };
        return (
            <div>

                <header className="App-header">
                    <img src={this.logo} className="App-logo" alt="logo" />
                </header>
                <div id="typeSearch">
                    <ToggleButtonGroup
                        color="primary"
                        value={isTitleSearch}
                        exclusive
                        fullWidth
                        onChange={(event, newValue) => this.setState({ isTitleSearch: newValue })}>
                        <ToggleButton className="toggleButton" value={true}>Title</ToggleButton>
                        <ToggleButton className="toggleButton" value={false}>Lyrics</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div id="contentSearch">
                    {isTitleSearch ? <Autocomplete
                        className="contentSearch"
                        disablePortal
                        disableListWrap
                        groupBy={(option) => option.firstLetter}
                        getOptionLabel={(option) => option.title + " - [" + option.artist + "]"}
                        options={songs}
                        renderInput={(params) => <TextField {...params} />}
                    />
                        :
                        <div>
                            <TextField
                                className="contentSearch"
                                onChange={(event, value) => this.setState({ lyricsSearch: value })}
                            >
                            </TextField>
                        </div>
                    }
                </div>
                <div id="statSearch">
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography>More criteria</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="statBox statBoxLeft">
                                <Typography gutterBottom>Energetic</Typography>
                                <Slider
                                    aria-label="Always visible"
                                    label="energy"
                                    step={50}
                                    marks={this.energyMarks}
                                />
                            </div>
                            <div className="statBox statBoxRight">
                                <Typography gutterBottom>Danceability</Typography>
                                <Slider
                                    aria-label="Always visible"
                                    label="danceability"
                                    step={50}
                                    marks={this.danceabilityMarks}
                                />
                            </div>
                            <div className="bpmStatBox">
                                <Typography id="input-slider" gutterBottom>
                                    BPM
                                </Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs>
                                        <Slider
                                            value={typeof bpm === 'number' ? bpm : 0}
                                            onChange={(_, newValue) => this.setState({ bpm: newValue })}
                                            aria-labelledby="input-slider"
                                            max={205}
                                            min={30}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            value={bpm}
                                            size="small"
                                            onChange={(event) => this.setState({ bpm: event.target.value === '' ? '' : Number(event.target.value) })}
                                            onBlur={handleBlur}
                                            inputProps={{
                                                step: 10,
                                                min: 30,
                                                max: 205,
                                                type: 'number',
                                                'aria-labelledby': 'input-slider',
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div id="searchButtonLine">
                    <Button id="searchButton" variant="contained" endIcon={<SearchIcon />}>
                        Search
                    </Button>
                </div>
            </div>
        );
    }
}

