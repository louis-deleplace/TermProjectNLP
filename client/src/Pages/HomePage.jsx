import React from "react";
import Service from "../Service.js";
import {
    Autocomplete, CircularProgress, ToggleButton, ToggleButtonGroup, Slider, Typography,
    Accordion, AccordionSummary, AccordionDetails, Grid, Input, Button, TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search'
import ResultPage from './ResultPage';
import { withRouter } from "react-router"
import PropTypes from "prop-types"


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            songs: null,
            bpm: 10,
            energy: 1,
            danceability: 1,
            isTitleSearch: true,
            lyricsSearch: "",
            titleSearch: "",
            artistName: ""
        }
        this.logo = require("../images/searzic_logo_trans.png");
        this.energyMarks = [{ value: 1, label: 'Low', }, { value: 50, label: 'Medium', }, { value: 100, label: 'High', }];
        this.danceabilityMarks = [{ value: 1, label: 'Low', }, { value: 50, label: 'Medium', }, { value: 100, label: 'High', }];
    }

    // static propTypes = {
    //     location: PropTypes.object.isRequired,
    //     history: PropTypes.object.isRequired
    // }

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

    async sendData() {
        let data = await Service.research(this.state.bpm, this.state.danceability, this.state.energy, this.state.isTitleSearch, this.state.lyricsSearch, this.state.titleSearch, this.state.artistName);
        this.props.navigate("/result", { state: { data: data, lyrics: this.state.lyricsSearch, isTitleSearch: this.state.isTitleSearch, artistName: this.state.artistName, title: this.state.titleSearch } });
    }

    render() {
        const { isLoaded, songs, isTitleSearch, bpm, danceability, energy } = this.state;
        if (!isLoaded) {
            return (<CircularProgress />
            )
        }
        const handleBlur = () => {
            if (this.bpm < 0) {
                this.setState({
                    bpm: 0
                })
            } else if (this.bpm > 100) {
                this.setState({
                    bpm: 0
                })
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
                        onChange={(event, value) => {
                            this.setState({
                                titleSearch: value.title, artistName: value.artist, bpm: value.bpm,
                                energy: value.energy, danceability: value.danceability
                            })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                        :
                        <div>
                            <TextField
                                className="contentSearch"
                                onChange={(event) => this.setState({ lyricsSearch: event.target.value })}
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
                                    value={energy}
                                    label="energy"
                                    min={1}
                                    step={1}
                                    marks={this.energyMarks}
                                    valueLabelDisplay="auto"
                                    onChange={(event, value) => this.setState({
                                        energy: value
                                    })}
                                />
                            </div>
                            <div className="statBox statBoxRight">
                                <Typography gutterBottom>Danceability</Typography>
                                <Slider
                                    aria-label="Always visible"
                                    value={danceability}
                                    label="danceability"
                                    step={1}
                                    min={1}
                                    valueLabelDisplay="auto"
                                    marks={this.danceabilityMarks}
                                    onChange={(event, value) => this.setState({
                                        danceability: value
                                    })}
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
                    <Button id="searchButton" variant="contained" endIcon={<SearchIcon />} onClick={async () => await this.sendData()}>
                        Search
                    </Button>
                </div>
            </div >
        );
    }
}

export default HomePage