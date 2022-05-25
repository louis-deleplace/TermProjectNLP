import axios from "axios";

export default class Service {
    static hostUri = "http://localhost:5000/";
    static async getAll() {
        let data = await axios.get(this.hostUri + "all");
        return data;
    }

    static async research(bpm, danceability, energy, isTitleSearch, lyrics, title, artistName) {
        let response = await axios.post(this.hostUri + "research", {
            UI_BPM: bpm,
            UI_DANCE: danceability,
            UI_ENERGY: energy,
            lyrics: lyrics,
            title: title,
            isTitleSearch: isTitleSearch,
            artistName: artistName
        })
        return response.data
    }

    static async getSong(title, artist) {
        let data = await axios.get(this.hostUri + "song?artist=\"" + artist + "\"&title=\"" + title + "\"");
        return data;
    }
}