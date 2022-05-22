import React from "react";
import Service from "../Service.js";
import {
    Autocomplete, CircularProgress, ToggleButton, ToggleButtonGroup, Slider, Typography,
    Accordion, AccordionSummary, AccordionDetails, Grid, Input, Button, TextField, Stack, Item,
    ListItem, List, ListItemButton, ListItemText, ListItemIcon, Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search'
import MusicIcon from '@mui/icons-material/MusicNote';


export default class ResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.fakeData = [{
            "artist": "Norah Jones",
            "bpm": 157,
            "danceability": 53,
            "energy": 30,
            "genre": "adult standards",
            "lyrics": "Sunrise, sunrise\nLooks like morning in your eyes\nBut the clock's held 9:15 for hours\n\nSunrise, sunrise\nCouldn't tempt us if it tried\n'Cause the afternoon's already come and gone\n\nAnd I say\n(Chorus)\nhooooo, oooooo, oooooo, oooooo\nhooooo, oooooo, oooooo, oooooo\nhooooo, oooooo, oooooo, oooooo\nTo you.\n\nSurprise, surprise\nCouldn't find it in your eyes\nBut I'm sure it's written all over my face\n\nSurprise, surprise\nNever something I could hide\nWhen I see we made it through another day\n\n(Chorus x1)\n\nAnd now the night\nWill throw its cover down\nmmmmm, on me again\nOoooh, and if I'm right\nIt's the only way to bring me back\n\n(Chorus x2)",
            "popularity": 71,
            "song_length": 201,
            "title": "Sunrise",
            "year": 2004
        },
        {
            "artist": "Deep Purple",
            "bpm": 135,
            "danceability": 50,
            "energy": 79,
            "genre": "album rock",
            "lyrics": "Black night is not right\nI don't feel so bright\nI don't care to sit tight\nMaybe I'll find on the way down the line\nThat I'm free, free to be me\nBlack night is a long way from home\n\nI don't need a dark tree\nI don't want a rough sea\nI can't feel, I can't see\nMaybe I'll find on the way down the line\nThat I'm free, free to be me\nBlack night is a long way from home\n\nBlack night, black night\nI don't need black night\nI can't see dark night\nMaybe I'll find on the way down the line\nThat I'm free, free to be me\nBlack night is a long way from home",
            "popularity": 39,
            "song_length": 207,
            "title": "Black Night",
            "year": 2000
        },
        {
            "artist": "Gorillaz",
            "bpm": 168,
            "danceability": 66,
            "energy": 69,
            "genre": "alternative hip hop",
            "lyrics": "Hoo-hoo-hoo-hoo-hoo\n\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nThe future is coming on\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nThe future is coming on\nIt's coming on, it's coming on\nIt's coming on, it's coming on\n\n[Del Tha Funky Homosapien]\nFinally, someone let me out of my cage\nNow, time for me is nothing, 'cause I'm countin' no age\nNah, I couldn't be there, now you shouldn't be scared\nI'm good at repairs, and I'm under each snare\nIntangible, bet you didn't think, so I command you to\nPanoramic view, look, I'll make it all manageable\nPick and choose, sit and lose, all you different crews\nChicks and dudes, who you think is really kickin' tunes?\nPicture you getting down in a picture tube\nLike you lit the fuse, you think it's fictional?\nMystical? Maybe, spiritual hero\nWho appears in you to clear your view when you're too crazy?\nLifeless to those, the definition for what life is\nPriceless to you, because I put you on the hype shit\nYou like it? Gun smokin', righteous with one toke\nGet psychic among those, possess you with one dose\n\n[2D + (Del Tha Funky Homosapien)]\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nThe future is coming on\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nThe future is coming on (That's right)\nIt's coming on, it's coming on\nIt's coming on, it's coming on\n\n[Del Tha Funky Homosapien]\nThe essence, the basics, without it, you make it\nAllow me to make this childlike in nature\nRhythm, you have it or you don't, that's a fallacy\nI'm in them, every sproutin' tree, every child of peace\nEvery cloud and sea, you see with your eyes\nI see destruction and demise, corruption in disguise (That's right)\nFrom this fuckin' enterprise, now I'm sucked into your lies\nThrough Russel, not his muscles\nBut percussion he provides for me as a guide, y'all can see me now\n'Cause you don't see with your eye, you perceive with your mind\nThat's the inner (Fuck 'em) so I'ma stick around with Russ and be a mentor\nBust a few rhymes so motherfuckers remember\nWhere the thought is, I brought all this\nSo you can survive when law is lawless (Right here)\nFeelings, sensations that you thought was dead\nNo squealing and remember that it's all in your head\n\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nThe future is coming on\nI ain't happy, I'm feeling glad\nI got sunshine in a bag\nI'm useless, but not for long\nMy future is coming on\nIt's coming on, it's coming on\nIt's coming on, it's coming on\n\nMy future is coming on\nIt's coming on, it's coming on\nIt's coming on, it's coming on\nMy future is coming on\nIt's coming on, it's coming on\nIt's coming on, it's coming on\nMy future is coming on\nIt's coming on, it's coming on\nMy future is coming on\nIt's coming on, it's coming on\nMy future is coming on\nIt's coming on, it's coming on\nMy future",
            "popularity": 69,
            "song_length": 341,
            "title": "Clint Eastwood",
            "year": 2001
        },];
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
        return (
            <div>
                <div className="topBar">
                    <Stack direction="row" >
                        <img src={this.logo} className="App-logo-small" alt="logo" width="200" height="200" />
                        <div id="typeSearchTopBar">
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
                        <div id="contentSearchTopBar">
                            {isTitleSearch ?
                                <Autocomplete
                                    disablePortal
                                    disableListWrap
                                    groupBy={(option) => option.firstLetter}
                                    getOptionLabel={(option) => option.title + " - [" + option.artist + "]"}
                                    options={songs}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                :
                                <TextField
                                    className="textSearchTopBar"
                                    onChange={(event, value) => this.setState({ lyricsSearch: value })}
                                />
                            }
                        </div>
                    </Stack>
                </div>
                <div class="resultBox">
                    <List>
                        {
                            this.fakeData.map((data) => {
                                return (
                                    <ListItem secondaryAction={
                                        <Stack direction="row">
                                            <Stack className="statsStack">
                                                <Paper elevation={0} className="statsPaper" >
                                                    <Typography fontSize={10} className="statsLabel">BPM</Typography>
                                                    {data.bpm}
                                                </Paper>
                                            </Stack>
                                            <Stack className="statsStack">
                                                <Paper elevation={0} className="statsPaper">
                                                    <Typography fontSize={10} className="statsLabel">Energy</Typography>
                                                    {data.energy}
                                                </Paper>
                                            </Stack>
                                            <Stack className="statsStack">
                                                <Paper elevation={0} className="statsPaper">
                                                    <Typography fontSize={10} className="statsLabel">Danceability</Typography>
                                                    {data.danceability}
                                                </Paper>
                                            </Stack>
                                        </Stack>
                                    }>
                                        <ListItemButton secondary="test">
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
}

