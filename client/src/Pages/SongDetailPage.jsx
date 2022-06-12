

import { useLocation } from 'react-router-dom';
import React from "react";
import {
    Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VictoryPie, VictoryLabel } from 'victory';

function SongDetailPage() {
    const { state } = useLocation();
    const data = state[0];
    const maxBpm = 205;
    const maxEnergy = 100;
    const maxDanceability = 100;

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

    return (
        <div>
            <div className='title'>
                <Typography fontSize={50} fontWeight={"bold"}>
                    {data.title}
                </Typography>
            </div>
            <br />
            <div style={{ width: "50em", margin: "auto" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Artist</StyledTableCell>
                                <StyledTableCell align="lrft">Genre</StyledTableCell>
                                <StyledTableCell align="left">Year</StyledTableCell>
                                <StyledTableCell align="left">Length</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableCell>
                                {data.artist}
                            </StyledTableCell>
                            <StyledTableCell align="left">{data.genre.split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}</StyledTableCell>
                            <StyledTableCell align="left">{data.year}</StyledTableCell>
                            <StyledTableCell align="left">{fmtMSS(data.song_length)}</StyledTableCell>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <br />
            <Typography fontSize={35}>
                Stats
            </Typography>
            <Grid container spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="center">
                <div style={{ width: "15em" }}>
                    <svg viewBox="0 0 400 400">
                        <VictoryPie
                            standalone={false}
                            width={400} height={400}
                            data={[{
                                x: data.energy,
                                y: data.energy
                            }, {
                                x: "",
                                y: maxEnergy - data.energy
                            }]}
                            innerRadius={70} labelRadius={100}
                            colorScale={["orange", "white"]}
                            style={{ labels: { fontSize: 20, fill: "white" } }}
                        />
                        <circle cx="200" cy="200" r="65" fill="none" stroke="black" strokeWidth={3} />
                        <circle cx="200" cy="200" r="155" fill="none" stroke="black" strokeWidth={3} />
                        <VictoryLabel
                            textAnchor="middle" verticalAnchor="middle"
                            x={200} y={200}
                            style={{ fontSize: 20 }}
                            text="Energy"
                        />
                    </svg>
                </div>
                <div style={{ width: "15em" }}>
                    <svg viewBox="0 0 400 400" >
                        <VictoryPie
                            standalone={false}
                            width={400} height={400}
                            data={[{
                                x: data.danceability,
                                y: data.danceability
                            }, {
                                x: "",
                                y: maxDanceability - data.danceability
                            }]}
                            innerRadius={70} labelRadius={100}
                            colorScale={["orange", "white"]}
                            style={{ labels: { fontSize: 20, fill: "white" } }}
                        />
                        <circle cx="200" cy="200" r="65" fill="none" stroke="black" strokeWidth={3} />
                        <circle cx="200" cy="200" r="155" fill="none" stroke="black" strokeWidth={3} />
                        <VictoryLabel
                            textAnchor="middle" verticalAnchor="middle"
                            x={200} y={200}
                            style={{ fontSize: 20 }}
                            text="Danceability"
                        />
                    </svg>
                </div>
                <div style={{ width: "15em" }}>
                    <svg viewBox="0 0 400 400" >
                        <VictoryPie
                            standalone={false}
                            width={400} height={400}
                            data={[{
                                x: data.bpm,
                                y: data.bpm
                            }, {
                                x: "",
                                y: maxBpm - data.bpm
                            }]}
                            innerRadius={70} labelRadius={100}
                            colorScale={["orange", "white"]}
                            style={{ labels: { fontSize: 20, fill: "white" } }}
                        />
                        <circle cx="200" cy="200" r="65" fill="none" stroke="black" strokeWidth={3} />
                        <circle cx="200" cy="200" r="155" fill="none" stroke="black" strokeWidth={3} />
                        <VictoryLabel
                            textAnchor="middle" verticalAnchor="middle"
                            x={200} y={200}
                            style={{ fontSize: 20 }}
                            text="Bpm"
                        />
                    </svg>
                </div>
                <div style={{ width: "15em" }}>
                    <svg viewBox="0 0 400 400" >
                        <VictoryPie
                            standalone={false}
                            width={400} height={400}
                            data={[{
                                x: data.popularity,
                                y: data.popularity
                            }, {
                                x: "",
                                y: 100 - data.popularity
                            }]}
                            innerRadius={70} labelRadius={100}
                            colorScale={["orange", "white"]}
                            style={{ labels: { fontSize: 20, fill: "white" } }}
                        />
                        <circle cx="200" cy="200" r="65" fill="none" stroke="black" strokeWidth={3} />
                        <circle cx="200" cy="200" r="155" fill="none" stroke="black" strokeWidth={3} />
                        <VictoryLabel
                            textAnchor="middle" verticalAnchor="middle"
                            x={200} y={200}
                            style={{ fontSize: 20 }}
                            text="Popularity"
                        />
                    </svg>
                </div>
            </Grid >
            <Typography fontSize={35}>
                Lyrics
            </Typography>
            <div className='lyrics'>
                <Typography align={"center"} style={{ whiteSpace: 'pre-line' }}>
                    {data.lyrics}
                </Typography>
            </div>
        </div >

    )
}

export default SongDetailPage;