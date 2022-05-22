import axios from "axios";

export default class Service {
    static hostUri = "http://localhost:5000/";
    static async getAll() {
        let data = await axios.get(this.hostUri + "all");
        return data;
    }
}